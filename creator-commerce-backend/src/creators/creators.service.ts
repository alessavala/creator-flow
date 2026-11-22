import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../common/activity-log.service';
import { ReputationService } from '../common/reputation.service';
import { paginate, paginationArgs } from '../common/pagination';
import {
  CreateMarketplaceDto,
  CreatePortfolioItemDto,
  CreateSocialAccountDto,
  CreatorSearchDto,
  UpdateMarketplaceDto,
  UpdatePortfolioItemDto,
  UpdateSocialAccountDto,
  UpsertCreatorDto,
} from './creators.dto';

const PROFILE_INCLUDE = {
  socialAccounts: true,
  marketplaces: true,
  categories: { include: { category: true } },
  portfolioItems: true,
} satisfies Prisma.CreatorProfileInclude;

@Injectable()
export class CreatorsService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
    private reputation: ReputationService,
  ) {}

  async upsert(userId: string, dto: UpsertCreatorDto) {
    const profile = await this.prisma.creatorProfile.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
      include: PROFILE_INCLUDE,
    });
    await this.activityLog.log({ userId, entityType: 'CreatorProfile', entityId: profile.id, action: 'PROFILE_UPDATED' });
    return profile;
  }

  async me(userId: string) {
    const profile = await this.prisma.creatorProfile.findUnique({ where: { userId }, include: PROFILE_INCLUDE });
    if (!profile) throw new NotFoundException('Creator profile not found');
    return profile;
  }

  async findOne(id: string) {
    const profile = await this.prisma.creatorProfile.findUnique({ where: { id }, include: PROFILE_INCLUDE });
    if (!profile) throw new NotFoundException('Creator not found');
    return profile;
  }

  async passport(id: string) {
    const passport = await this.reputation.passport(id);
    if (!passport) throw new NotFoundException('Creator not found');
    return passport;
  }

  async search(q: CreatorSearchDto) {
    const { page, pageSize, skip, take } = paginationArgs(q);

    const where: Prisma.CreatorProfileWhereInput = {
      OR: q.q ? [
        { displayName: { contains: q.q, mode: 'insensitive' } },
        { bio: { contains: q.q, mode: 'insensitive' } },
        { categories: { some: { category: { name: { contains: q.q, mode: 'insensitive' } } } } },
        { portfolioItems: { some: { title: { contains: q.q, mode: 'insensitive' } } } },
      ] : undefined,
      country: q.country,
      city: q.city,
      categories: q.category ? { some: { category: { slug: q.category } } } : undefined,
      marketplaces: q.marketplace ? { some: { marketplace: q.marketplace, verified: true } } : undefined,
      verificationLevel: q.verifiedOnly ? { in: ['IDENTITY', 'VERIFIED_COMMERCE', 'PRO'] } : q.verificationLevel,
      acceptsProduct: q.acceptsProduct,
      acceptsFixedFee: q.acceptsFixedFee,
      acceptsCommission: q.acceptsCommission,
      reliabilityScore: q.minCreatorScore !== undefined ? { gte: q.minCreatorScore } : undefined,
      baseRate: q.maxBaseRate !== undefined ? { lte: q.maxBaseRate } : undefined,
      socialAccounts:
        q.platform || q.minFollowers !== undefined || q.minAverageViews !== undefined || q.minEngagementRate !== undefined
          ? {
              some: {
                platform: q.platform,
                followers: q.minFollowers !== undefined ? { gte: q.minFollowers } : undefined,
                averageViews: q.minAverageViews !== undefined ? { gte: q.minAverageViews } : undefined,
                engagementRate: q.minEngagementRate !== undefined ? { gte: q.minEngagementRate } : undefined,
              },
            }
          : undefined,
    };

    const orderBy: Prisma.CreatorProfileOrderByWithRelationInput =
      q.sortBy === 'createdAt' ? { createdAt: 'desc' } :
      q.sortBy === 'baseRateAsc' ? { baseRate: { sort: 'asc', nulls: 'last' } } :
      q.sortBy === 'baseRateDesc' ? { baseRate: { sort: 'desc', nulls: 'last' } } :
      { reliabilityScore: 'desc' };

    // A single query with `include` lets Prisma batch the relation fetches
    // (socialAccounts/marketplaces/categories) into one extra round-trip
    // per relation regardless of result size, avoiding N+1.
    const [data, total] = await Promise.all([
      this.prisma.creatorProfile.findMany({
        where,
        include: { socialAccounts: true, marketplaces: true, categories: { include: { category: true } }, portfolioItems: { take: 1, orderBy: { createdAt: 'desc' } } },
        orderBy,
        skip,
        take,
      }),
      this.prisma.creatorProfile.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  // ---- Social accounts ----

  async addSocialAccount(userId: string, dto: CreateSocialAccountDto) {
    const creator = await this.requireProfile(userId);
    return this.prisma.socialAccount.create({ data: { ...dto, creatorId: creator.id } });
  }

  async updateSocialAccount(userId: string, id: string, dto: UpdateSocialAccountDto) {
    await this.assertOwnsSocialAccount(userId, id);
    return this.prisma.socialAccount.update({ where: { id }, data: dto });
  }

  async removeSocialAccount(userId: string, id: string) {
    await this.assertOwnsSocialAccount(userId, id);
    await this.prisma.socialAccount.delete({ where: { id } });
  }

  // ---- Marketplace affiliations ----

  async addMarketplace(userId: string, dto: CreateMarketplaceDto) {
    const creator = await this.requireProfile(userId);
    // verified/evidence review is an admin action - a creator can only assert the claim.
    return this.prisma.creatorMarketplace.create({ data: { ...dto, creatorId: creator.id } });
  }

  async updateMarketplace(userId: string, id: string, dto: UpdateMarketplaceDto) {
    await this.assertOwnsMarketplace(userId, id);
    // Re-submitting profile/evidence resets verification - a brand should
    // never see a "verified" badge on a claim the creator just changed.
    return this.prisma.creatorMarketplace.update({ where: { id }, data: { ...dto, verified: false } });
  }

  async removeMarketplace(userId: string, id: string) {
    await this.assertOwnsMarketplace(userId, id);
    await this.prisma.creatorMarketplace.delete({ where: { id } });
  }

  // ---- Categories / niches ----

  async addCategory(userId: string, categoryId: string) {
    const creator = await this.requireProfile(userId);
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.creatorCategory.upsert({
      where: { creatorId_categoryId: { creatorId: creator.id, categoryId } },
      update: {},
      create: { creatorId: creator.id, categoryId },
    });
  }

  async removeCategory(userId: string, categoryId: string) {
    const creator = await this.requireProfile(userId);
    await this.prisma.creatorCategory.deleteMany({ where: { creatorId: creator.id, categoryId } });
  }

  // ---- Portfolio ----

  async addPortfolioItem(userId: string, dto: CreatePortfolioItemDto) {
    const creator = await this.requireProfile(userId);
    return this.prisma.portfolioItem.create({ data: { ...dto, creatorId: creator.id } });
  }

  async updatePortfolioItem(userId: string, id: string, dto: UpdatePortfolioItemDto) {
    await this.assertOwnsPortfolioItem(userId, id);
    return this.prisma.portfolioItem.update({ where: { id }, data: dto });
  }

  async removePortfolioItem(userId: string, id: string) {
    await this.assertOwnsPortfolioItem(userId, id);
    await this.prisma.portfolioItem.delete({ where: { id } });
  }

  // ---- ownership helpers ----

  private async requireProfile(userId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (!creator) throw new NotFoundException('Create your creator profile first');
    return creator;
  }

  private async assertOwnsSocialAccount(userId: string, id: string) {
    const account = await this.prisma.socialAccount.findUnique({ where: { id }, include: { creator: true } });
    if (!account) throw new NotFoundException('Social account not found');
    if (account.creator.userId !== userId) throw new ForbiddenException();
  }

  private async assertOwnsMarketplace(userId: string, id: string) {
    const entry = await this.prisma.creatorMarketplace.findUnique({ where: { id }, include: { creator: true } });
    if (!entry) throw new NotFoundException('Marketplace entry not found');
    if (entry.creator.userId !== userId) throw new ForbiddenException();
  }

  private async assertOwnsPortfolioItem(userId: string, id: string) {
    const item = await this.prisma.portfolioItem.findUnique({ where: { id }, include: { creator: true } });
    if (!item) throw new NotFoundException('Portfolio item not found');
    if (item.creator.userId !== userId) throw new ForbiddenException();
  }
}
