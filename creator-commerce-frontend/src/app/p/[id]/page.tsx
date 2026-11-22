"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Award, BadgeCheck, CheckCircle2, Clock3, Copy, ExternalLink,
  MapPin, PackageCheck, PackageOpen, ShieldCheck, ShoppingBag, Star, Users, Video,
} from "lucide-react";
import { toast } from "sonner";
import { PublicShell } from "@/components/tools/public-shell";
import { CommerceCatalog, CommerceVideoDialog, CommerceVideoPoster } from "@/components/passport/commerce-catalog";
import { AnimatedCommerceBackground } from "@/components/passport/animated-commerce-background";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch, ApiError } from "@/lib/api";
import { translateApiError } from "@/lib/error-messages";
import { formatCurrency } from "@/lib/format";
import { MARKETPLACE_LABEL, MARKETPLACE_STYLE, MercadoLibreMark, PLATFORM_LABEL, PLATFORM_STYLE } from "@/lib/platform-style";
import type { CreatorMarketplace, CreatorPassport, CreatorProfile, PortfolioItem, ReviewsResponse } from "@/lib/types";

function initials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((piece) => piece[0]?.toUpperCase()).join("");
}

function titleCase(name: string): string {
  return name.split(" ").filter(Boolean)[0] || "este creador";
}

const FAMILY_LABELS: Record<string, string> = { PAPA: "Papá", MAMA: "Mamá", FAMILIA: "Familia" };

function CreatorMeta({ creator }: { creator: CreatorProfile }) {
  const info = [
    creator.familyRole ? FAMILY_LABELS[creator.familyRole] : null,
    typeof creator.age === "number" ? `${creator.age} años` : null,
    [creator.city, creator.country].filter(Boolean).join(", ") || null,
  ].filter(Boolean);
  if (!info.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
      <MapPin className="size-4 text-[#0F766E]" />
      {info.map((text, i) => (
        <span key={text} className="inline-flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-border">·</span>}
          {text}
        </span>
      ))}
    </div>
  );
}

function MarketplaceCard({ marketplace }: { marketplace: CreatorMarketplace }) {
  const style = MARKETPLACE_STYLE[marketplace.marketplace];
  const Icon = style?.icon ?? MercadoLibreMark;
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-[18px] border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${style?.bg ?? "bg-muted-surface"}`}>
          <Icon className={`size-5 ${style?.text ?? "text-foreground"}`} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{MARKETPLACE_LABEL[marketplace.marketplace] ?? marketplace.marketplace}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            {marketplace.verified ? <CheckCircle2 className="size-3 text-[#0F766E]" /> : null}
            {marketplace.verified ? "Afiliación verificada" : "Sin verificar"}
          </p>
        </div>
      </div>
      {marketplace.marketplace === "TIKTOK_SHOP" &&
        (marketplace.availableForLive || marketplace.availableForProductCollab) && (
          <div className="flex flex-wrap gap-1.5">
            {marketplace.availableForLive && <Badge variant="secondary">Lives</Badge>}
            {marketplace.availableForProductCollab && <Badge variant="secondary">Colaboraciones</Badge>}
          </div>
        )}
      {marketplace.profileUrl && (
        <a href={marketplace.profileUrl} target="_blank" rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] underline-offset-4 hover:underline dark:text-[#5EEAD4]">
          Visitar perfil <ExternalLink className="size-3.5" />
        </a>
      )}
    </article>
  );
}

function ScoreCard({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(100, score));
  return (
    <div className="rounded-[18px] border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-muted"><Award className="size-4 text-[#0F766E]" /> Creator Score</span>
        <span className="text-xl font-extrabold tabular-nums text-foreground">{Math.round(score)}<span className="text-xs font-medium text-muted">/100</span></span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#DCEBEA] dark:bg-[#134E4A]"
        role="progressbar" aria-label="Creator Score" aria-valuenow={Math.round(normalized)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[#14B8A6]" style={{ width: normalized + "%" }} />
      </div>
      <p className="mt-2 text-[11px] leading-4 text-muted">Indicador interno de Creator Flow. No equivale a ventas garantizadas.</p>
    </div>
  );
}

export default function PublicPassportPage() {
  return (
    <PublicShell mainClassName="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-9 px-4 py-8 sm:px-8">
      <PublicPassport />
    </PublicShell>
  );
}

function PublicPassport() {
  const params = useParams<{ id: string }>();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [passport, setPassport] = useState<CreatorPassport | null>(null);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([
      apiFetch<CreatorProfile>(`/creators/${params.id}`),
      apiFetch<CreatorPassport>(`/creators/${params.id}/passport`),
    ]).then(([profile, pass]) => {
      if (!alive) return;
      setCreator(profile);
      setPassport(pass);
      apiFetch<ReviewsResponse>(`/reviews/user/${profile.userId}`, { query: { pageSize: 10 } })
        .then((r) => { if (alive) setReviews(r); }).catch(() => {});
    }).catch((e) => {
      if (alive) setError(e instanceof ApiError ? translateApiError(e.message) : "No pudimos cargar el Creator Passport.");
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [params.id]);

  if (loading) return (
    <div className="flex w-full flex-col gap-6">
      <Skeleton className="h-[330px] w-full rounded-[24px]" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-52 rounded-[20px]" />)}
      </div>
    </div>
  );

  if (error || !creator) return <p className="py-20 text-center text-sm text-destructive">{error ?? "Creador no encontrado."}</p>;

  const featured = creator.portfolioItems?.[0];
  const allItems = creator.portfolioItems ?? [];
  const platformsCount = creator.socialAccounts.length;
  const categoryName = creator.categories[0]?.category.name;
  const hireUrl = `/contratar/${creator.id}`;

  return (
    <div className="flex min-w-0 w-full flex-col gap-9">
      <nav aria-label="Ubicación en el sitio" className="flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:underline">Inicio</Link><span aria-hidden>/</span>
        <Link href="/creators" className="hover:underline">Creadores</Link><span aria-hidden>/</span>
        <span className="min-w-0 truncate font-medium text-foreground">{creator.displayName}</span>
      </nav>

      {/* Editorial creator storefront: the second, light media-kit direction. */}
      <section className="relative isolate overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_14px_50px_rgba(15,23,42,0.05)]">
        <div className="relative h-20 overflow-hidden bg-[#0B1220] sm:h-24">
          <AnimatedCommerceBackground />
          <span className="absolute bottom-3 left-5 z-10 rounded-full border border-white/20 bg-[#0B1220]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#B1F5E7] backdrop-blur-sm sm:left-8">
            Creator Passport · E-commerce
          </span>
        </div>

        <div className="grid gap-8 px-5 pb-7 pt-0 sm:px-8 sm:pb-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)] lg:gap-10">
          <div className="min-w-0">
            <Avatar className="relative -mt-9 size-[94px] border-[5px] border-card shadow-lg sm:size-28">
              <AvatarImage src={creator.profilePhotoUrl ?? undefined} alt={creator.displayName} />
              <AvatarFallback className="bg-[#D8F5F0] text-2xl font-extrabold text-[#0F766E]">{initials(creator.displayName) || "?"}</AvatarFallback>
            </Avatar>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.045em] text-foreground sm:text-[40px]">
                {creator.displayName}
              </h1>
              {passport?.identityVerified && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  <BadgeCheck className="size-4" /> Identidad verificada
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
              {categoryName ? `Creador UGC · ${categoryName}` : "Creador de contenido UGC para e-commerce"}
            </p>
            <CreatorMeta creator={creator} />
            {creator.bio && <p className="mt-5 max-w-[68ch] text-sm leading-7 text-foreground/85">{creator.bio}</p>}
            {creator.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {creator.categories.map((cat) => (
                  <span key={cat.categoryId} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80">
                    {cat.category.name}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={hireUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#115E59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14B8A6]">
                <ShoppingBag className="size-4" /> Solicitar colaboración <ArrowRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(window.location.href)
                  .then(() => toast.success("Enlace copiado"))
                  .catch(() => toast.error("No se pudo copiar el enlace"))}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted-surface focus-visible:outline-2 focus-visible:outline-[#14B8A6]">
                <Copy className="size-4" /> Compartir
              </button>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4 pt-0 lg:pt-6">
            {featured ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs font-bold text-foreground"><Video className="size-4 text-[#0F766E]" /> Video destacado</p>
                  <a href="#portafolio" className="text-xs font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]">Ver todos</a>
                </div>
                <CommerceVideoPoster featured item={featured} onPlay={setSelectedVideo} />
              </div>
            ) : (
              <div className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-[20px] bg-[#0B1220]">
                <AnimatedCommerceBackground />
                <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center text-white">
                  <PackageOpen className="size-9 text-[#5EEAD4]" />
                  <p className="text-sm font-semibold">Contenido de e-commerce</p>
                  <p className="text-xs text-white/65">Aquí aparecerán los videos destacados del creador.</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-border bg-background px-4 py-3">
                <p className="text-xs text-muted">Tarifa base</p>
                <p className="mt-1 text-lg font-extrabold text-[#0F766E] dark:text-[#5EEAD4]">
                  {creator.baseRate ? formatCurrency(Number(creator.baseRate)) : "A convenir"}
                </p>
                <p className="mt-1 text-[11px] text-muted">Sujeta al alcance del proyecto</p>
              </div>
              <div className="rounded-[18px] border border-border bg-background px-4 py-3">
                <p className="text-xs text-muted">Plazo habitual</p>
                <p className="mt-1 flex items-center gap-1 text-lg font-extrabold text-foreground"><Clock3 className="size-4" /> {creator.turnaroundDays} días</p>
                <p className="mt-1 text-[11px] text-muted">A confirmar con la marca</p>
              </div>
            </div>
            {passport && <ScoreCard score={passport.creatorCommerceScore} />}
          </div>
        </div>
      </section>

      <CommerceCatalog items={allItems} onPlay={setSelectedVideo} />

      <section aria-labelledby="trust-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0F766E] dark:text-[#5EEAD4]">Información de confianza</p>
            <h2 id="trust-title" className="text-2xl font-extrabold tracking-[-0.04em]">Conoce al creador</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-[18px] border border-border bg-card p-4">
            <p className="text-xs text-muted">Campañas completadas</p>
            <p className="mt-2 text-2xl font-extrabold tabular-nums">{passport?.campaignsCompleted ?? 0}</p>
          </div>
          <div className="rounded-[18px] border border-border bg-card p-4">
            <p className="text-xs text-muted">Calificación promedio</p>
            <p className="mt-2 flex items-center gap-1 text-2xl font-extrabold">
              {reviews && reviews.meta.total > 0 ? reviews.avgRating.toFixed(1) : "—"}
              {reviews && reviews.meta.total > 0 && <Star className="size-5 fill-[#F59E0B] text-[#F59E0B]" />}
            </p>
            {reviews && reviews.meta.total > 0 && <p className="mt-1 text-xs text-muted">{reviews.meta.total} valoraciones</p>}
          </div>
          <div className="rounded-[18px] border border-border bg-card p-4">
            <p className="text-xs text-muted">Cuentas sociales</p>
            <p className="mt-2 flex items-center gap-1 text-2xl font-extrabold"><Users className="size-5 text-[#0F766E]" /> {platformsCount}</p>
          </div>
          <div className="rounded-[18px] border border-border bg-card p-4">
            <p className="text-xs text-muted">Entregas a tiempo</p>
            <p className="mt-2 text-2xl font-extrabold tabular-nums">
              {passport && passport.campaignsCompleted > 0 ? Math.round(passport.onTimeDeliveryRate * 100) + "%" : "—"}
            </p>
            {(!passport || passport.campaignsCompleted === 0) && <p className="mt-1 text-xs text-muted">Sin historial suficiente</p>}
          </div>
        </div>
      </section>

      {(creator.categories.length > 0 || creator.marketplaces.length > 0) && (
        <section aria-labelledby="categories-title" className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-[22px] border border-border bg-card p-5 sm:p-6">
            <h2 id="categories-title" className="text-xl font-extrabold tracking-tight">Categorías especiales</h2>
            <p className="mt-1 text-sm text-muted">Especialidades que el creador eligió en Creator Flow.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {creator.categories.length ? creator.categories.map((cat) => (
                <span key={cat.categoryId} className="inline-flex items-center gap-2 rounded-xl bg-muted-surface px-3.5 py-2 text-sm font-semibold">
                  <PackageCheck className="size-4 text-[#0F766E]" /> {cat.category.name}
                </span>
              )) : <p className="text-sm text-muted">Aún no se han agregado categorías.</p>}
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-sm font-semibold">Modalidades de colaboración</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {creator.acceptsProduct && <Badge variant="outline">Intercambio por producto</Badge>}
                {creator.acceptsFixedFee && <Badge variant="outline">Pago fijo</Badge>}
                {creator.acceptsCommission && <Badge variant="outline">Comisiones</Badge>}
              </div>
            </div>
          </div>
          <div className="rounded-[22px] border border-border bg-card p-5 sm:p-6">
            <h2 className="text-xl font-extrabold tracking-tight">Marketplaces</h2>
            <p className="mt-1 text-sm text-muted">Presencia y colaboraciones asociadas a plataformas de venta.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {creator.marketplaces.length
                ? creator.marketplaces.map((m) => <MarketplaceCard key={m.id} marketplace={m} />)
                : <p className="text-sm text-muted">Sin marketplaces registrados.</p>}
            </div>
          </div>
        </section>
      )}

      {creator.socialAccounts.length > 0 && (
        <section aria-labelledby="social-title">
          <h2 id="social-title" className="mb-5 text-2xl font-extrabold tracking-[-0.04em]">Presencia digital</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {creator.socialAccounts.map((account) => {
              const style = PLATFORM_STYLE[account.platform];
              const Icon = style?.icon ?? ExternalLink;
              return (
                <a key={account.id} href={account.profileUrl} target="_blank" rel="noopener noreferrer"
                  className="group flex min-w-0 items-center gap-3 rounded-[18px] border border-border bg-card p-4 transition-shadow hover:shadow-md">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${style?.bg ?? "bg-muted-surface"}`}>
                    <Icon className={`size-5 ${style?.text ?? "text-foreground"}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{PLATFORM_LABEL[account.platform] ?? account.platform}</p>
                    <p className="truncate text-xs text-muted">@{account.username}</p>
                    <p className="mt-1 text-sm font-semibold tabular-nums">{new Intl.NumberFormat("es-MX", { notation: "compact" }).format(account.followers)} seguidores</p>
                    {account.averageViews > 0 && <p className="text-xs text-muted">{new Intl.NumberFormat("es-MX", { notation: "compact" }).format(account.averageViews)} vistas promedio declaradas</p>}
                  </div>
                  <ExternalLink className="size-4 shrink-0 text-muted group-hover:text-[#0F766E]" />
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="reviews-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0F766E] dark:text-[#5EEAD4]">Opiniones de marcas</p>
            <h2 id="reviews-title" className="text-2xl font-extrabold tracking-[-0.04em]">Reseñas de colaboraciones</h2>
            <p className="mt-1 text-sm text-muted">Valoraciones asociadas a colaboraciones dentro de Creator Flow.</p>
          </div>
          {reviews && reviews.meta.total > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-sm font-bold">
              <Star className="size-4 fill-[#F59E0B] text-[#F59E0B]" />
              {reviews.avgRating.toFixed(1)} <span className="font-normal text-muted">({reviews.meta.total})</span>
            </div>
          )}
        </div>
        {reviews && reviews.data.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.data.map((review) => (
              <article key={review.id} className="flex min-h-44 flex-col rounded-[20px] border border-border bg-card p-5 shadow-sm">
                <div className="flex gap-1" role="img" aria-label={review.rating + " de 5 estrellas"}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`size-4 ${i < review.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-transparent text-border"}`} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-foreground">
                  {review.comments ? "“" + review.comments + "”" : "Valoración de colaboración registrada en Creator Flow."}
                </p>
                <div className="mt-5 border-t border-border pt-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold"><ShieldCheck className="size-4 text-[#0F766E]" /> Reseña de colaboración</p>
                  <time dateTime={review.createdAt} className="mt-1 block text-xs text-muted">
                    {new Date(review.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long" })}
                  </time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center gap-3 rounded-[20px] p-8 text-center">
            <Star className="size-8 text-[#F59E0B]" />
            <p className="text-sm font-semibold">Las primeras reseñas aparecerán después de colaborar.</p>
            <p className="text-xs text-muted">Solo mostramos valoraciones reales; nunca testimonios inventados.</p>
          </Card>
        )}
      </section>

      <section className="relative isolate overflow-hidden rounded-[24px] bg-[#0B1220] p-8 text-white sm:p-10">
        <AnimatedCommerceBackground />
        <div className="relative z-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5EEAD4]">Colaboraciones en e-commerce</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              ¿Tu marca necesita contenido que conecte?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#CBD5E1]">
              Invita a {titleCase(creator.displayName)} a tu campaña de UGC y define los entregables con claridad.
            </p>
          </div>
          <Link href={hireUrl} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-5 py-3 text-sm font-bold text-[#062E2B] transition-colors hover:bg-[#5EEAD4]">
            Solicitar colaboración <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <CommerceVideoDialog item={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
}
