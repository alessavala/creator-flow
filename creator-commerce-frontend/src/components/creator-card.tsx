import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Heart, MapPin, Play, Star, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { paletteGradient, paletteVariant } from "@/lib/badge-color";
import { formatCurrency } from "@/lib/format";
import { youtubeVideoId } from "@/lib/video-embed";
import type { CreatorProfile } from "@/lib/types";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

interface CreatorCardProps {
  creator: CreatorProfile;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export function CreatorCard({ creator, isFavorited, onToggleFavorite }: CreatorCardProps) {
  const maxFollowers = creator.socialAccounts.reduce((max, s) => Math.max(max, s.followers), 0);
  const isVerified = creator.verificationLevel !== "REGISTERED";
  const sample = creator.portfolioItems?.[0];
  const youtubeId = sample?.platform === "YOUTUBE" ? youtubeVideoId(sample.contentUrl) : undefined;
  const poster = sample?.thumbnailUrl || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null);
  const hasReviews = creator.campaignsCompleted > 0 && creator.avgRating > 0;

  return (
    <div className="group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.09)]">
      <Link href={`/p/${creator.id}`} className="block min-w-0 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#14B8A6]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted-surface">
          {poster || creator.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster || creator.profilePhotoUrl || ""} alt={sample ? "Muestra del trabajo de " + creator.displayName : creator.displayName}
              loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
          ) : (
            <div className={`flex size-full items-center justify-center bg-gradient-to-br text-5xl font-bold text-foreground/60 ${paletteGradient(creator.displayName)}`}>
              {initials(creator.displayName) || "?"}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061623]/40 via-transparent to-transparent" />
          {sample && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0B1220]/85 px-3 py-1.5 text-[11px] font-semibold text-white">
              <Play className="size-3 fill-white" /> Ver video UGC
            </span>
          )}
          {isVerified && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#0F766E]">
              <BadgeCheck className="size-3.5" /> Identidad verificada
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 min-w-0 font-extrabold text-foreground">{creator.displayName}</h3>
            <ArrowUpRight className="size-4 shrink-0 text-muted transition-colors group-hover:text-[#0F766E]" />
          </div>
          <p className="mt-1 flex min-w-0 items-center gap-1 text-xs text-muted">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{[creator.city, creator.country].filter(Boolean).join(", ") || "Ubicación no especificada"}</span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {hasReviews && (
              <span className="inline-flex items-center gap-1 font-bold text-foreground">
                <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                {creator.avgRating.toFixed(1)}
              </span>
            )}
            {maxFollowers > 0 && (
              <span className="inline-flex items-center gap-1 text-muted">
                <Users className="size-3.5" />
                {new Intl.NumberFormat("es-MX", { notation: "compact" }).format(maxFollowers)} seguidores
              </span>
            )}
            <span className="rounded-full bg-[#E6F7F3] px-2 py-1 text-[11px] font-semibold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
              {Math.round(creator.reliabilityScore)}/100 score
            </span>
          </div>

          {creator.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {creator.categories.slice(0, 2).map((c) => (
                <Badge key={c.categoryId} variant={paletteVariant(c.category.name)}>{c.category.name}</Badge>
              ))}
            </div>
          )}
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-[11px] text-muted">Tarifa base de referencia</p>
            <p className="mt-1 text-lg font-extrabold text-[#0F766E] dark:text-[#5EEAD4]">
              {creator.baseRate ? formatCurrency(Number(creator.baseRate)) : "Consultar tarifa"}
            </p>
            <p className="mt-1 text-xs text-muted">Entrega habitual: {creator.turnaroundDays} días</p>
          </div>
        </div>
      </Link>
      <div className="mt-auto flex gap-2 px-4 pb-4">
        <Link href={`/contratar/${creator.id}`} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#0F766E] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#115E59]">
          Solicitar colaboración
        </Link>
        {onToggleFavorite && (
          <button type="button" aria-label={isFavorited ? "Quitar de favoritos" : "Guardar creador"}
            onClick={onToggleFavorite} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted hover:text-[#E11D48] focus-visible:outline-2 focus-visible:outline-[#14B8A6]">
            <Heart className="size-4" fill={isFavorited ? "currentColor" : "none"} />
          </button>
        )}
      </div>
    </div>
  );
}
