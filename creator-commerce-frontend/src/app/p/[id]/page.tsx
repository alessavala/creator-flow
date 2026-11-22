"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowUpRight, Award, BadgeCheck, CheckCircle2, Copy, ExternalLink, MapPin, Radio, Star, Users, Video } from "lucide-react";
import { FaAmazon } from "react-icons/fa6";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import type { IconType } from "react-icons";
import { PublicShell } from "@/components/tools/public-shell";
import { CommerceMotion } from "@/components/creator-profile/commerce-motion";
import { toast } from "sonner";
import { SocialEmbed } from "@/components/social-embed";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch, ApiError } from "@/lib/api";
import { translateApiError } from "@/lib/error-messages";
import { paletteVariant } from "@/lib/badge-color";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import type { CreatorMarketplace, CreatorPassport, CreatorProfile, ReviewsResponse } from "@/lib/types";

const MARKETPLACE_LABEL: Record<string, string> = {
  AMAZON: "Amazon",
  MERCADO_LIBRE: "Mercado Libre",
  TIKTOK_SHOP: "TikTok Shop",
};

// react-icons/simple-icons has no Mercado Libre mark, so it gets a lettermark
// in its own brand colors instead of a generic store icon.
function MercadoLibreMark({ className }: { className?: string }) {
  return <span className={`font-black ${className ?? ""}`}>ML</span>;
}

// Real brand logos (react-icons, bundled as code - no hotlinked images) on a
// tinted tile in each brand's own color, so marketplaces read at a glance.
const MARKETPLACE_STYLE: Record<string, { icon: IconType | typeof MercadoLibreMark; bg: string; text: string }> = {
  AMAZON: { icon: FaAmazon, bg: "bg-[#FF9900]/10", text: "text-[#FF9900]" },
  MERCADO_LIBRE: { icon: MercadoLibreMark, bg: "bg-[#FFE600]/20", text: "text-[#2D3277]" },
  TIKTOK_SHOP: { icon: SiTiktok, bg: "bg-foreground/10", text: "text-foreground" },
};

const PLATFORM_LABEL: Record<string, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
};

const PLATFORM_STYLE: Record<string, { icon: IconType; bg: string; text: string }> = {
  TIKTOK: { icon: SiTiktok, bg: "bg-foreground/10", text: "text-foreground" },
  INSTAGRAM: { icon: SiInstagram, bg: "bg-[#E4405F]/10", text: "text-[#E4405F]" },
  YOUTUBE: { icon: SiYoutube, bg: "bg-[#FF0000]/10", text: "text-[#FF0000]" },
  FACEBOOK: { icon: SiFacebook, bg: "bg-[#1877F2]/10", text: "text-[#1877F2]" },
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex min-h-28 flex-col justify-center gap-2 rounded-[18px] border-[#E2E8F0] bg-white p-4 text-center shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-border dark:bg-card">
      <p className="text-[28px] font-bold leading-none tracking-tight text-foreground tabular-nums">{value}</p>
      <p className="text-xs leading-relaxed text-muted">{label}</p>
    </Card>
  );
}

function MarketplaceCard({ marketplace }: { marketplace: CreatorMarketplace }) {
  const style = MARKETPLACE_STYLE[marketplace.marketplace];
  const Icon = style?.icon ?? MercadoLibreMark;
  const isTikTokShop = marketplace.marketplace === "TIKTOK_SHOP";

  return (
    <Card className="flex min-h-40 flex-col gap-4 rounded-[18px] border-[#E2E8F0] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-border">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${style?.bg ?? "bg-muted-surface"}`}>
            <Icon className={`size-5 ${style?.text ?? "text-foreground"}`} />
          </span>
          <p className="text-sm font-semibold">{MARKETPLACE_LABEL[marketplace.marketplace] ?? marketplace.marketplace}</p>
        </div>
        <Badge variant={marketplace.verified ? "success" : "outline"}>
          {marketplace.verified && <CheckCircle2 className="size-3.5" />}
          {marketplace.verified ? "Verificado" : "Sin verificar"}
        </Badge>
      </div>

      {isTikTokShop && (marketplace.availableForLive || marketplace.availableForProductCollab) && (
        <div className="flex flex-wrap gap-1.5">
          {marketplace.availableForLive && (
            <Badge variant="pink">
              <Radio className="size-3.5" />
              Disponible para Lives
            </Badge>
          )}
          {marketplace.availableForProductCollab && (
            <Badge variant="indigo">
              <Users className="size-3.5" />
              Disponible para colaboraciones
            </Badge>
          )}
        </div>
      )}

      {marketplace.profileUrl && (
        <a href={marketplace.profileUrl} target="_blank" rel="noreferrer">
          <Button variant="secondary" size="sm" className="w-full">
            Ver tienda
            <ExternalLink className="size-3.5" />
          </Button>
        </a>
      )}
    </Card>
  );
}

export default function PublicPassportPage() {
  return (
    <PublicShell wide>
      <PublicPassport />
    </PublicShell>
  );
}

function PublicPassport() {
  const params = useParams<{ id: string }>();

  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [passport, setPassport] = useState<CreatorPassport | null>(null);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    Promise.all([apiFetch<CreatorProfile>(`/creators/${params.id}`), apiFetch<CreatorPassport>(`/creators/${params.id}/passport`)])
      .then(([creatorRes, passportRes]) => {
        setCreator(creatorRes);
        setPassport(passportRes);
        apiFetch<ReviewsResponse>(`/reviews/user/${creatorRes.userId}`, { query: { pageSize: 10 } })
          .then(setReviews)
          .catch(() => {});
      })
      .catch((err) => setError(err instanceof ApiError ? translateApiError(err.message) : "No pudimos cargar este Creator Passport."))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  if (error || !creator) {
    return <p className="py-16 text-center text-sm text-destructive">{error ?? "Creador no encontrado."}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="cf-hero relative isolate overflow-hidden rounded-[24px] bg-[#0B1220] px-5 py-7 text-white shadow-[0_24px_70px_rgba(11,18,32,0.18)] sm:px-9 sm:py-10 lg:px-12 lg:py-12">
        <CommerceMotion />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#5EEAD4] sm:text-xs">
              <Video className="size-4" />
              Creator Passport · E-commerce UGC
            </p>
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-24 shrink-0 border-4 border-white/20 shadow-xl sm:size-28">
                <AvatarImage src={creator.profilePhotoUrl ?? undefined} alt={creator.displayName} />
                <AvatarFallback className="bg-[#143745] text-3xl font-bold text-white">{initials(creator.displayName) || "?"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-[30px] font-extrabold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                    {creator.displayName}
                  </h1>
                  {passport?.identityVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#14B8A6]/20 px-2.5 py-1 text-xs font-semibold text-[#99F6E4]">
                      <BadgeCheck className="size-4" /> Identidad verificada
                    </span>
                  )}
                </div>
                {[creator.city, creator.country].filter(Boolean).length > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-[#CBD5E1]">
                    <MapPin className="size-4" />
                    {[creator.city, creator.country].filter(Boolean).join(", ")}
                  </p>
                )}
                {creator.baseRate && (
                  <span className="mt-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    Tarifa base · {formatCurrency(Number(creator.baseRate))}
                  </span>
                )}
              </div>
            </div>
            {creator.bio && <p className="mt-6 max-w-[70ch] text-sm leading-7 text-[#D4E1E9] sm:text-base">{creator.bio}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-5 py-3 text-sm font-bold text-[#062E2B] transition-colors hover:bg-[#5EEAD4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EEAD4]">
                Colaborar con este creador <ArrowUpRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                    .then(() => toast.success("Enlace del Creator Passport copiado"))
                    .catch(() => toast.error("No se pudo copiar el enlace"));
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EEAD4]"
              >
                <Copy className="size-4" /> Compartir perfil
              </button>
            </div>
          </div>
          {passport && (
            <div className="flex shrink-0 flex-col items-start gap-3 lg:items-center">
              <div
                className="flex size-28 items-center justify-center rounded-full p-[7px] shadow-[0_8px_35px_rgba(20,184,166,0.16)] sm:size-36"
                style={{ background: `conic-gradient(#5EEAD4 ${Math.max(0, Math.min(100, passport.creatorCommerceScore))}%, rgba(255,255,255,0.14) 0)` }}
              >
                <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#101C35]">
                  <Award className="mb-1 size-5 text-[#5EEAD4]" />
                  <span className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">{Math.round(passport.creatorCommerceScore)}</span>
                  <span className="text-[10px] text-[#B5C6D4]">de 100</span>
                </div>
              </div>
              <p className="text-xs font-semibold tracking-wide text-[#DCE9F1]">Creator Score</p>
            </div>
          )}
        </div>
      </section>

      {creator.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {creator.categories.map((c) => (
            <Badge key={c.categoryId} variant={paletteVariant(c.category.name)}>
              {c.category.name}
            </Badge>
          ))}
        </div>
      )}

      {creator.portfolioItems && creator.portfolioItems.length > 0 && (
        <section aria-labelledby="portfolio-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0F766E] dark:text-[#5EEAD4]">Contenido UGC</p>
              <h2 id="portfolio-heading" className="text-2xl font-extrabold tracking-[-0.035em] text-foreground sm:text-[28px]">Portafolio de contenido</h2>
              <p className="mt-1 text-sm text-muted">Videos y contenido creativo para marcas y productos online.</p>
            </div>
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted">
              {creator.portfolioItems.length} {creator.portfolioItems.length === 1 ? "pieza" : "piezas"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {creator.portfolioItems.map((item) => (
              <SocialEmbed key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {passport && (
        <section aria-labelledby="passport-stats-heading">
          <div className="mb-5">
            <h2 id="passport-stats-heading" className="text-2xl font-extrabold tracking-[-0.035em] text-foreground">Confianza y desempeño</h2>
            <p className="mt-1 text-sm text-muted">
              {passport.campaignsCompleted > 0
                ? "Indicadores registrados de las colaboraciones en Creator Flow."
                : "Las métricas operativas aparecerán cuando se completen colaboraciones en Creator Flow."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Stat label="Creator Score" value={`${Math.round(passport.creatorCommerceScore)}/100`} />
            <Stat label="Campañas completadas" value={String(passport.campaignsCompleted)} />
            <Stat label="Entregas a tiempo" value={passport.campaignsCompleted > 0 ? `${Math.round(passport.onTimeDeliveryRate * 100)}%` : "—"} />
            <Stat label="Calificación promedio" value={passport.campaignsCompleted > 0 && passport.avgRating ? passport.avgRating.toFixed(1) : "—"} />
            <Stat label="Volverían a contratarlo" value={passport.campaignsCompleted > 0 ? `${Math.round(passport.brandRehireRate * 100)}%` : "—"} />
            <Stat label="Aprobado primera entrega" value={passport.campaignsCompleted > 0 ? `${Math.round(passport.firstApprovalRate * 100)}%` : "—"} />
            <Stat label="Tasa de disputas" value={passport.campaignsCompleted > 0 ? `${Math.round(passport.disputeRate * 100)}%` : "—"} />
          </div>
        </section>
      )}

      {creator.marketplaces.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.035em]">Marketplaces</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creator.marketplaces.map((m) => (
              <MarketplaceCard key={m.id} marketplace={m} />
            ))}
          </div>
        </div>
      )}

      {creator.socialAccounts.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.035em]">Presencia digital</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {creator.socialAccounts.map((s) => {
              const style = PLATFORM_STYLE[s.platform];
              const Icon = style?.icon ?? ExternalLink;
              return (
                <a key={s.id} href={s.profileUrl} target="_blank" rel="noreferrer">
                  <Card className="flex min-w-0 items-center gap-3 rounded-[18px] p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${style?.bg ?? "bg-muted-surface"}`}>
                      <Icon className={`size-5 ${style?.text ?? "text-foreground"}`} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{PLATFORM_LABEL[s.platform] ?? s.platform}</p>
                      <p className="truncate text-xs text-muted">@{s.username}</p>
                      <p className="mt-1 text-sm font-bold tabular-nums">{new Intl.NumberFormat("es-MX", { notation: "compact" }).format(s.followers)} <span className="text-xs font-normal text-muted">seguidores</span></p>
                      {s.averageViews > 0 && <p className="mt-1 text-xs text-muted">{new Intl.NumberFormat("es-MX", { notation: "compact" }).format(s.averageViews)} vistas promedio</p>}
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {reviews && reviews.data.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            Reseñas
            <span className="flex items-center gap-1 text-sm font-normal text-muted">
              <Star className="size-3.5 fill-warning text-warning" />
              {reviews.avgRating.toFixed(1)} ({reviews.meta.total})
            </span>
          </h2>
          <ul className="flex flex-col gap-3">
            {reviews.data.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-border"}`} />
                    ))}
                  </span>
                  <span className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString("es-MX")}</span>
                </div>
                {r.comments && <p className="mt-1 text-sm text-foreground">{r.comments}</p>}
              </Card>
            ))}
          </ul>
        </div>
      )}

      <Card className="relative flex flex-col items-center gap-3 overflow-hidden rounded-[24px] border-0 bg-[#0B1220] p-8 text-center shadow-lg sm:p-11">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 size-40 rounded-full bg-white/10 blur-2xl" />
        <p className="text-lg font-bold text-white sm:text-xl">
          ¿Tu marca quiere trabajar con {creator.displayName}?
        </p>
        <p className="max-w-md text-sm text-[#CBD5E1]">
          Crea una cuenta gratis en Creator Flow y conecta con este creador para tu próxima campaña de e-commerce.
        </p>
        <Link href="/register" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#14B8A6] px-6 py-3 text-sm font-bold text-[#062E2B] transition-colors hover:bg-[#5EEAD4]">Crear cuenta gratis <ArrowUpRight className="size-4" /></Link>
      </Card>
    </div>
  );
}
