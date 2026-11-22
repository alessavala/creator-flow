"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Play, Video } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { PortfolioItem } from "@/lib/types";

type Platform = PortfolioItem["platform"];

const PLATFORM_NAMES: Record<Platform, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
};

const EMBED_SCRIPTS: Partial<Record<Platform, string>> = {
  TIKTOK: "https://www.tiktok.com/embed.js",
  INSTAGRAM: "https://www.instagram.com/embed.js",
};

function safeUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  try {
    const url = new URL(input);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

// Accepts the main YouTube share and Shorts URL formats, with strict host
// validation so arbitrary domains cannot be turned into trusted embeds.
export function parseYouTubeVideo(input: string) {
  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase().replace(/^(www\.|m\.)/, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = url.pathname.split("/")[1] ?? null;
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? null;
    }
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
    return {
      id,
      isShort: url.pathname.startsWith("/shorts/"),
      embedUrl: `https://www.youtube.com/embed/${id}?playsinline=1&rel=0`,
    };
  } catch {
    return null;
  }
}

function processEmbed(platform: Platform) {
  const w = window as Window & {
    tiktokEmbed?: { lib?: { render?: () => void } };
    instgrm?: { Embeds?: { process?: () => void } };
  };
  if (platform === "TIKTOK") w.tiktokEmbed?.lib?.render?.();
  if (platform === "INSTAGRAM") w.instgrm?.Embeds?.process?.();
}

function useOfficialEmbed(platform: Platform, open: boolean) {
  useEffect(() => {
    if (!open) return;
    const src = EMBED_SCRIPTS[platform];
    if (!src) return;
    const existing = Array.from(document.scripts).find((s) => s.src === src);
    if (existing) {
      // The modal content mounts before effects. Reprocess new blockquotes.
      const frame = requestAnimationFrame(() => processEmbed(platform));
      existing.addEventListener("load", () => processEmbed(platform), { once: true });
      return () => cancelAnimationFrame(frame);
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => processEmbed(platform);
    document.body.appendChild(script);
  }, [platform, open]);
}

function PlatformLogo({ platform }: { platform: Platform }) {
  const className = "size-4";
  if (platform === "YOUTUBE") return <SiYoutube className={className} />;
  if (platform === "INSTAGRAM") return <SiInstagram className={className} />;
  if (platform === "TIKTOK") return <SiTiktok className={className} />;
  return <SiFacebook className={className} />;
}

export function SocialEmbed({ item }: { item: PortfolioItem }) {
  const [open, setOpen] = useState(false);
  const source = safeUrl(item.contentUrl);
  const video = item.platform === "YOUTUBE" ? parseYouTubeVideo(item.contentUrl) : null;
  const thumbnail = safeUrl(item.thumbnailUrl) ??
    (video ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` : null);
  const tiktokId = item.platform === "TIKTOK" && source
    ? source.match(/\/video\/(\d+)/)?.[1]
    : null;

  useOfficialEmbed(item.platform, open);

  return (
    <article className="group min-w-0 overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.10)] dark:border-border dark:bg-card">
      <button
        type="button"
        onClick={() => source && setOpen(true)}
        disabled={!source}
        aria-label={`Reproducir ${item.title} de ${PLATFORM_NAMES[item.platform]}`}
        className="relative block aspect-[9/16] w-full cursor-pointer overflow-hidden bg-[linear-gradient(155deg,#0B1220_0%,#123F4C_60%,#0E7770_100%)] text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#5EEAD4] disabled:cursor-not-allowed"
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-70">
            <div className="size-20 rounded-[22px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md" />
            <Video className="absolute size-9 text-[#5EEAD4]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">UGC · Commerce</span>
          </div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-[#0B1220]/25" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B1220]/70 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
          <PlatformLogo platform={item.platform} />
          {PLATFORM_NAMES[item.platform]}
        </span>
        <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
          <Play className="ml-1 size-6 fill-white text-white" />
        </span>
        <span className="absolute bottom-3 left-3 right-3 text-left text-xs font-medium text-white/85">
          Ver contenido
        </span>
      </button>

      <div className="flex min-h-[92px] flex-col justify-between gap-3 px-3 py-3.5 sm:px-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#0F172A] dark:text-foreground">{item.title}</h3>
        {source && (
          <a href={source} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#0F766E] underline-offset-4 hover:underline dark:text-[#5EEAD4]">
            Ver original <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] w-[calc(100vw-24px)] max-w-[560px] overflow-y-auto border-white/10 bg-[#0B1220] p-4 text-white sm:p-6">
          <div className="pr-9">
            <DialogTitle className="line-clamp-2 text-base font-semibold text-white">{item.title}</DialogTitle>
            <DialogDescription className="mt-1 text-xs text-[#CBD5E1]">
              {PLATFORM_NAMES[item.platform]} · Contenido UGC
            </DialogDescription>
          </div>
          {source && item.platform === "YOUTUBE" && video ? (
            <div className={`mx-auto w-full overflow-hidden rounded-xl bg-black ${video.isShort ? "aspect-[9/16] max-w-[340px]" : "aspect-video"}`}>
              <iframe
                className="size-full"
                src={video.embedUrl}
                title={item.title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : source && item.platform === "TIKTOK" && tiktokId ? (
            <div className="mx-auto max-h-[70dvh] max-w-[340px] overflow-y-auto rounded-xl bg-white">
              <blockquote className="tiktok-embed" cite={source} data-video-id={tiktokId} style={{ minWidth: 270, maxWidth: 340 }}>
                <section><a href={source} target="_blank" rel="noopener noreferrer">{item.title}</a></section>
              </blockquote>
            </div>
          ) : source && item.platform === "INSTAGRAM" ? (
            <div className="mx-auto max-h-[70dvh] max-w-[400px] overflow-y-auto rounded-xl bg-white">
              <blockquote className="instagram-media" data-instgrm-permalink={source} style={{ maxWidth: 400, width: "100%" }}>
                <a href={source} target="_blank" rel="noopener noreferrer">{item.title}</a>
              </blockquote>
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-[#CBD5E1]">
              Este contenido se reproduce directamente en su plataforma de origen.
            </p>
          )}
          {source && (
            <a href={source} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#5EEAD4]">
              Abrir video original <ExternalLink className="size-4" />
            </a>
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}
