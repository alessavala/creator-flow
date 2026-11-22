"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Film, PackageOpen, Play, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { SocialEmbed } from "@/components/social-embed";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { youtubeVideoId } from "@/lib/video-embed";
import type { PortfolioItem, SocialPlatform } from "@/lib/types";

export type CommerceFormat = "Reseñas" | "Unboxing" | "Demostraciones" | "Video Ads" | "Contenido UGC";

const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
};

export function contentFormat(title: string): CommerceFormat {
  const value = title.toLocaleLowerCase("es");
  if (/unbox|desempaqu|primeras impresiones|abriendo/.test(value)) return "Unboxing";
  if (/reseñ|review|opini|probando|vale la pena|comparativa/.test(value)) return "Reseñas";
  if (/demostr|demo|how.to|uso real|tutorial|cómo usar|como usar/.test(value)) return "Demostraciones";
  if (/ads|anuncio|performance|creativo|conversi[oó]n|publicidad/.test(value)) return "Video Ads";
  return "Contenido UGC";
}

function VideoBrand({ platform }: { platform: SocialPlatform }) {
  if (platform === "INSTAGRAM") return <SiInstagram className="size-4 text-[#E4405F]" />;
  if (platform === "TIKTOK") return <SiTiktok className="size-4 text-[#111827] dark:text-white" />;
  if (platform === "YOUTUBE") return <SiYoutube className="size-4 text-[#FF0033]" />;
  return <SiFacebook className="size-4 text-[#1877F2]" />;
}

function previewImage(item: PortfolioItem): string | null {
  if (item.thumbnailUrl && /^https?:\/\//i.test(item.thumbnailUrl)) return item.thumbnailUrl;
  if (item.platform === "YOUTUBE") {
    const id = youtubeVideoId(item.contentUrl);
    if (id) return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  }
  return null;
}

export function CommerceVideoPoster({
  item,
  onPlay,
  featured = false,
}: {
  item: PortfolioItem;
  onPlay: (item: PortfolioItem) => void;
  featured?: boolean;
}) {
  const image = previewImage(item);
  const format = contentFormat(item.title);
  return (
    <button
      type="button"
      onClick={() => onPlay(item)}
      aria-label={"Reproducir " + item.title}
      className={[
        "group relative isolate block w-full overflow-hidden bg-[#0B1220] text-left text-white",
        featured ? "aspect-[16/10] rounded-[20px] sm:aspect-[16/9]" : "aspect-[9/16] rounded-[16px]",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#14B8A6]",
      ].join(" ")}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_75%_30%,#1D716D_0%,#132B3E_40%,#0B1220_100%)]">
          <div className="flex flex-col items-center gap-3 text-white/65">
            <Film className="size-12 text-[#5EEAD4]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Video UGC</span>
          </div>
        </div>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/10 to-[#07111F]/15" />
      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-[#0F172A] shadow-sm">
        <VideoBrand platform={item.platform} />
        {PLATFORM_NAMES[item.platform]}
      </span>
      <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/25 backdrop-blur-sm transition-transform group-hover:scale-110 sm:size-14">
        <Play className="ml-0.5 size-6 fill-white text-white" />
      </span>
      <span className="absolute inset-x-3 bottom-3 flex flex-col gap-1">
        <span className="w-fit rounded-full border border-white/20 bg-white/15 px-2 py-1 text-[10px] font-semibold backdrop-blur">
          {format}
        </span>
        {featured && <span className="line-clamp-2 text-base font-bold leading-snug sm:text-lg">{item.title}</span>}
      </span>
    </button>
  );
}

const FILTERS: Array<CommerceFormat | "Todos"> = [
  "Todos", "Reseñas", "Unboxing", "Demostraciones", "Video Ads", "Contenido UGC",
];

export function CommerceCatalog({
  items,
  onPlay,
}: {
  items: PortfolioItem[];
  onPlay: (item: PortfolioItem) => void;
}) {
  const [format, setFormat] = useState<CommerceFormat | "Todos">("Todos");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform | "Todas">("Todas");
  const availableFormats = useMemo(
    () => FILTERS.filter((f) => f === "Todos" || items.some((item) => contentFormat(item.title) === f)),
    [items],
  );
  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("es");
    return items.filter((item) =>
      (format === "Todos" || contentFormat(item.title) === format) &&
      (platform === "Todas" || item.platform === platform) &&
      (!term || item.title.toLocaleLowerCase("es").includes(term))
    );
  }, [items, format, query, platform]);
  const availablePlatforms = Array.from(new Set(items.map((item) => item.platform)));

  if (items.length === 0) return null;

  return (
    <section id="portafolio" aria-labelledby="commerce-catalog-heading" className="scroll-mt-20">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0F766E] dark:text-[#5EEAD4]">Explora el catálogo</p>
          <h2 id="commerce-catalog-heading" className="text-[25px] font-extrabold tracking-[-0.04em] text-foreground sm:text-[30px]">Portafolio de contenido UGC</h2>
          <p className="mt-1 text-sm text-muted">Videos, reseñas de productos y creativos para marcas de e-commerce.</p>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted">
          {items.length} {items.length === 1 ? "contenido" : "contenidos"}
        </span>
      </div>

      <div className="mb-5 rounded-[20px] border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#14B8A6]">
            <Search className="size-4 shrink-0 text-muted" />
            <span className="sr-only">Buscar contenido UGC</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar reseñas, unboxings, productos…"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <SlidersHorizontal className="size-4 text-muted" />
            <span className="sr-only">Filtrar plataforma</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform | "Todas")}
              className="min-w-0 bg-transparent text-sm font-medium text-foreground outline-none"
            >
              <option value="Todas">Todas las plataformas</option>
              {availablePlatforms.map((p) => <option value={p} key={p}>{PLATFORM_NAMES[p]}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar por formato">
          {availableFormats.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={format === f}
              onClick={() => setFormat(f)}
              className={[
                "rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#14B8A6]",
                format === f
                  ? "border-[#0B726A] bg-[#0F766E] text-white"
                  : "border-border bg-background text-muted hover:border-[#14B8A6] hover:text-foreground",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {visible.map((item) => (
            <article key={item.id} className="min-w-0 rounded-[20px] border border-border bg-card p-2.5 shadow-[0_5px_20px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-3">
              <CommerceVideoPoster item={item} onPlay={onPlay} />
              <div className="flex flex-col gap-2 px-1 py-3">
                <h3 className="line-clamp-2 min-h-10 text-[13px] font-bold leading-5 text-foreground sm:text-sm">{item.title}</h3>
                <p className="text-xs text-muted">{contentFormat(item.title)} · {PLATFORM_NAMES[item.platform]}</p>
                {item.views > 0 && <p className="text-xs text-muted">{new Intl.NumberFormat("es-MX", { notation: "compact" }).format(item.views)} visualizaciones declaradas</p>}
                <a
                  href={item.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#0F766E] underline-offset-4 hover:underline dark:text-[#5EEAD4]"
                >
                  Ver original <ExternalLink className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-border bg-card px-5 py-10 text-center">
          <PackageOpen className="size-8 text-muted" />
          <p className="text-sm font-semibold text-foreground">No hay videos con estos filtros.</p>
          <button className="text-sm font-semibold text-[#0F766E] underline dark:text-[#5EEAD4]" onClick={() => { setQuery(""); setFormat("Todos"); setPlatform("Todas"); }}>Ver todos los videos</button>
        </div>
      )}
    </section>
  );
}

export function CommerceVideoDialog({
  item,
  onClose,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[94dvh] w-[calc(100vw-24px)] max-w-[700px] overflow-auto rounded-[20px] p-4 sm:p-6">
        <DialogTitle className="pr-8 text-lg font-bold">{item?.title ?? "Video UGC"}</DialogTitle>
        <DialogDescription>Contenido del portafolio. El reproductor es proporcionado por la plataforma de origen.</DialogDescription>
        {item && (
          <div key={item.id} className="min-w-0">
            <SocialEmbed item={item} />
            <a href={item.contentUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted-surface">
              <ExternalLink className="size-4" /> Ver video original
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
