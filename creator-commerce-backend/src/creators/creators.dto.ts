import { PartialType } from '@nestjs/swagger';
import { Marketplace, SocialPlatform, VerificationLevel } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { PaginationDto } from '../common/pagination';

export class UpsertCreatorDto {
  @IsString() displayName: string;
  @IsOptional() @IsString() bio?: string;
  @IsString() country: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsInt() @Min(18) @Max(100) age?: number;
  @IsOptional() @IsIn(['PAPA', 'MAMA', 'FAMILIA']) familyRole?: string;
  @IsOptional() @IsUrl() profilePhotoUrl?: string;
  @IsOptional() @IsInt() @Min(1) turnaroundDays?: number;
  @IsOptional() @IsNumber() @Min(0) baseRate?: number;
  @IsOptional() @IsBoolean() acceptsProduct?: boolean;
  @IsOptional() @IsBoolean() acceptsFixedFee?: boolean;
  @IsOptional() @IsBoolean() acceptsCommission?: boolean;
}

export class CreatorSearchDto extends PaginationDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsEnum(Marketplace) marketplace?: Marketplace;
  @IsOptional() @IsEnum(SocialPlatform) platform?: SocialPlatform;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minFollowers?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minAverageViews?: number;
  @IsOptional() @Type(() => Number) @Min(0) @Max(1) minEngagementRate?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(100) minCreatorScore?: number;
  @IsOptional() @IsEnum(VerificationLevel) verificationLevel?: VerificationLevel;
  @IsOptional() @IsBoolean() @Type(() => Boolean) acceptsProduct?: boolean;
  @IsOptional() @IsBoolean() @Type(() => Boolean) acceptsFixedFee?: boolean;
  @IsOptional() @IsBoolean() @Type(() => Boolean) acceptsCommission?: boolean;
  @IsOptional() @IsEnum(['reliabilityScore', 'followers', 'createdAt'] as const) sortBy?: 'reliabilityScore' | 'followers' | 'createdAt';
}

export class CreateSocialAccountDto {
  @IsEnum(SocialPlatform) platform: SocialPlatform;
  @IsString() username: string;
  @IsUrl() profileUrl: string;
  @IsOptional() @IsInt() @Min(0) followers?: number;
  @IsOptional() @IsInt() @Min(0) averageViews?: number;
  @IsOptional() @Min(0) @Max(1) engagementRate?: number;
}

export class UpdateSocialAccountDto extends PartialType(CreateSocialAccountDto) {}

export class CreateMarketplaceDto {
  @IsEnum(Marketplace) marketplace: Marketplace;
  @IsOptional() @IsUrl() profileUrl?: string;
  @IsOptional() @IsUrl() evidenceUrl?: string;
  @IsOptional() @IsBoolean() availableForLive?: boolean;
  @IsOptional() @IsBoolean() availableForProductCollab?: boolean;
}

export class UpdateMarketplaceDto extends PartialType(CreateMarketplaceDto) {}

export class CreatePortfolioItemDto {
  @IsString() title: string;
  @IsUrl() contentUrl: string;
  @IsOptional() @IsUrl() thumbnailUrl?: string;
  @IsEnum(SocialPlatform) platform: SocialPlatform;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsInt() @Min(0) views?: number;
}

export class UpdatePortfolioItemDto extends PartialType(CreatePortfolioItemDto) {}
