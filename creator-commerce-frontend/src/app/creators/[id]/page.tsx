"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  CheckCircle2,
  ExternalLink,
  Heart,
  MessageCircle,
  Music2,
  Play,
  Star,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
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
import { useAuth } from "@/lib/auth-context";
import { useFavoriteIds } from "@/lib/use-favorites";
import type { CreatorPassport, CreatorProfile, ReviewsResponse } from "@/lib/types";

const MARKETPLACE_LABEL: Record<string, string> = {
  AMAZON: "Amazon",
  MERCADO_LIBRE: "Mercado Libre",
  TIKTOK_SHOP: "TikTok Shop",
};

const PLATFORM_LABEL: Record<string, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
};

const PLATFORM_ICON: Record<string, LucideIcon> = {
  TIKTOK: Music2,
  INSTAGRAM: Camera,
  YOUTUBE: Play,
  FACEBOOK: MessageCircle,
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
    <Card className="p-4 text-center">
      <p className="text-xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  );
}

export default function CreatorDetailPage() {
  return (
    <AppShell>
      <CreatorDetail />
    </AppShell>
  );
}

function CreatorDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const favorites = useFavoriteIds();

  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [passport, setPassport] = useState<CreatorPassport | null>(null);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !params.id) return;
    // Fetching this creator's profile + passport when the route id changes
    // is exactly what this effect does - the loading state can't be derived
    // from props/render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    Promise.all([
      apiFetch<CreatorProfile>(`/creators/${params.id}`, { token }),
      apiFetch<CreatorPassport>(`/creators/${params.id}/passport`, { token }),
    ])
      .then(([creatorRes, passportRes]) => {
        setCreator(creatorRes);
        setPassport(passportRes);
        apiFetch<ReviewsResponse>(`/reviews/user/${creatorRes.userId}`, { token, query: { pageSize: 10 } })
          .then(setReviews)
          .catch(() => {});
      })
      .catch((err) => setError(err instanceof ApiError ? translateApiError(err.message) : "No pudimos cargar este perfil."))
      .finally(() => setIsLoading(false));
  }, [token, params.id]);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <button type="button" onClick={() => router.back()} className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" />
        Volver
      </button>

      {favorites.error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{favorites.error}</p>}

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar className="size-24">
          <AvatarImage src={creator.profilePhotoUrl ?? undefined} alt={creator.displayName} />
          <AvatarFallback className="text-2xl">{initials(creator.displayName) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{creator.displayName}</h1>
            {passport?.identityVerified && (
              <Badge variant="success">
                <BadgeCheck className="size-3.5" />
                Verificado
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted">{[creator.city, creator.country].filter(Boolean).join(", ")}</p>
          {creator.baseRate && (
            <p className="mt-1 text-sm font-semibold text-primary">Tarifa base: {formatCurrency(Number(creator.baseRate))}</p>
          )}
          {creator.bio && <p className="mt-2 text-sm text-foreground">{creator.bio}</p>}
        </div>
        {favorites.enabled && (
          <Button
            type="button"
            variant={favorites.isFavorited(creator.id) ? "default" : "secondary"}
            className="self-start"
            onClick={() => favorites.toggle(creator.id)}
          >
            <Heart className="size-4" fill={favorites.isFavorited(creator.id) ? "currentColor" : "none"} />
            {favorites.isFavorited(creator.id) ? "Guardado" : "Guardar"}
          </Button>
        )}
      </Card>

      {creator.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {creator.categories.map((c) => (
            <Badge key={c.categoryId} variant={paletteVariant(c.category.name)}>
              {c.category.name}
            </Badge>
          ))}
        </div>
      )}

      {passport && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Creator Passport</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Score" value={`${Math.round(passport.creatorCommerceScore)}/100`} />
            <Stat label="Campañas completadas" value={String(passport.campaignsCompleted)} />
            <Stat label="Entregas a tiempo" value={`${Math.round(passport.onTimeDeliveryRate * 100)}%`} />
            <Stat label="Calificación promedio" value={passport.avgRating ? passport.avgRating.toFixed(1) : "—"} />
            <Stat label="Volverían a contratarlo" value={`${Math.round(passport.brandRehireRate * 100)}%`} />
            <Stat label="Aprobado primera entrega" value={`${Math.round(passport.firstApprovalRate * 100)}%`} />
            <Stat label="Tasa de disputas" value={`${Math.round(passport.disputeRate * 100)}%`} />
          </div>
        </div>
      )}

      {creator.marketplaces.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Marketplaces</h2>
          <div className="flex flex-wrap gap-2">
            {creator.marketplaces.map((m) => (
              <Badge key={m.id} variant={m.verified ? "success" : "outline"}>
                {m.verified && <CheckCircle2 className="size-3.5" />}
                {MARKETPLACE_LABEL[m.marketplace] ?? m.marketplace}
                {!m.verified && " (sin verificar)"}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {creator.socialAccounts.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Redes sociales</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {creator.socialAccounts.map((s) => {
              const Icon = PLATFORM_ICON[s.platform] ?? ExternalLink;
              return (
                <a key={s.id} href={s.profileUrl} target="_blank" rel="noreferrer">
                  <Card className="p-3 transition hover:bg-muted-surface/60">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      <Icon className="size-4 text-primary" />
                      {PLATFORM_LABEL[s.platform] ?? s.platform}
                    </p>
                    <p className="text-xs text-muted">@{s.username}</p>
                    <p className="mt-1 text-sm">{new Intl.NumberFormat("es-MX", { notation: "compact" }).format(s.followers)} seguidores</p>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {creator.portfolioItems && creator.portfolioItems.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Portfolio</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {creator.portfolioItems.map((item) => (
              <SocialEmbed key={item.id} item={item} />
            ))}
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
    </div>
  );
}
