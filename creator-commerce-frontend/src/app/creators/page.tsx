"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, Star, UserX } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { CreatorCard } from "@/components/creator-card";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { apiFetch, ApiError } from "@/lib/api";
import { translateApiError } from "@/lib/error-messages";
import { useAuth } from "@/lib/auth-context";
import { useFavoriteIds } from "@/lib/use-favorites";
import type { Category, CreatorProfile, Marketplace, Paginated } from "@/lib/types";

const MARKETPLACE_OPTIONS: { value: Marketplace; label: string; icon: string }[] = [
  { value: "AMAZON", label: "Amazon", icon: "📦" },
  { value: "MERCADO_LIBRE", label: "Mercado Libre", icon: "🛒" },
  { value: "TIKTOK_SHOP", label: "TikTok Shop", icon: "🎵" },
];

export default function CreatorsPage() {
  return (
    <AppShell>
      <CreatorsDiscovery />
    </AppShell>
  );
}

function CreatorsDiscovery() {
  const { token } = useAuth();
  const favorites = useFavoriteIds();

  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace | undefined>();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxRate, setMaxRate] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<"reliabilityScore" | "createdAt" | "baseRateAsc" | "baseRateDesc">("reliabilityScore");
  const [showFilters, setShowFilters] = useState(false);
  const [categorySlug, setCategorySlug] = useState<string | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);

  const [result, setResult] = useState<Paginated<CreatorProfile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Category[]>("/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Paginated<CreatorProfile>>("/creators", {
        token,
        query: {
          q: search || undefined,
          marketplace,
          category: categorySlug,
          verifiedOnly: verifiedOnly || undefined,
          maxBaseRate: maxRate,
          sortBy,
          page,
          pageSize: 12,
        },
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiError ? translateApiError(err.message) : "No pudimos cargar los creadores.");
    } finally {
      setIsLoading(false);
    }
  }, [token, search, marketplace, categorySlug, verifiedOnly, maxRate, sortBy, page]);

  useEffect(() => {
    // Refetching whenever a filter/page changes is the whole point of this
    // effect - the loading/error state it sets can't be derived from props.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Any filter change resets pagination back to page 1.
  function updateFilter(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="relative isolate overflow-hidden rounded-[24px] bg-[#0B1220] px-6 py-8 text-white sm:px-9 sm:py-10">
        <span className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-[#14B8A6]/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5EEAD4]">Creator Flow · E-commerce</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-[40px]">Encuentra creadores que venden con contenido</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#CBD5E1]">Explora especialistas UGC para reseñas, unboxings, demostraciones y anuncios de productos. Compara portafolios y solicita una colaboración.</p>
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          load();
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar creadores, productos, reseñas, unboxings…"
          className="h-12 rounded-xl pl-10"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Chip active={verifiedOnly} icon={<Star className="size-3.5" />} onClick={() => updateFilter(() => setVerifiedOnly((v) => !v))}>
          Verificados
        </Chip>
        {MARKETPLACE_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            icon={option.icon}
            active={marketplace === option.value}
            onClick={() => updateFilter(() => setMarketplace((m) => (m === option.value ? undefined : option.value)))}
          >
            {option.label}
          </Chip>
        ))}
        <Chip icon={<SlidersHorizontal className="size-3.5" />} active={showFilters} onClick={() => setShowFilters((v) => !v)}>
          Filtrar
        </Chip>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-border bg-card p-3 sm:px-4">
        <p className="text-xs text-muted">{result ? `${result.meta.total} ${result.meta.total === 1 ? "creador encontrado" : "creadores encontrados"}` : "Explora especialistas UGC"}</p>
        <label className="flex items-center gap-2 text-xs font-semibold">
          Ordenar:
          <select value={sortBy} onChange={(e) => updateFilter(() => setSortBy(e.target.value as typeof sortBy))}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-[#14B8A6]">
            <option value="reliabilityScore">Mejor Creator Score</option>
            <option value="baseRateAsc">Menor tarifa</option>
            <option value="baseRateDesc">Mayor tarifa</option>
            <option value="createdAt">Más recientes</option>
          </select>
        </label>
      </div>

      {showFilters && (
        <Card className="rounded-[20px] p-4">
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">Presupuesto máximo (USD)</p>
            <div className="flex flex-wrap gap-2">
              {[undefined, 100, 250, 500, 1000].map((value) => (
                <Chip key={value ?? "any"} active={maxRate === value} onClick={() => updateFilter(() => setMaxRate(value))}>
                  {value === undefined ? "Cualquier tarifa" : `Hasta ${value}`}
                </Chip>
              ))}
            </div>
          </div>
          <p className="mb-2 text-sm font-medium">Categoría</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={!categorySlug} onClick={() => updateFilter(() => setCategorySlug(undefined))}>
              Todas
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} active={categorySlug === c.slug} onClick={() => updateFilter(() => setCategorySlug(c.slug))}>
                {c.name}
              </Chip>
            ))}
          </div>
        </Card>
      )}

      {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
      {favorites.error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{favorites.error}</p>}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : result && result.data.length === 0 ? (
        <EmptyState
          icon={UserX}
          title="No encontramos creadores con esos filtros"
          description="Prueba ajustar la búsqueda, cambiar el presupuesto o quitar filtros."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result?.data.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                isFavorited={favorites.enabled ? favorites.isFavorited(creator.id) : undefined}
                onToggleFavorite={favorites.enabled ? () => favorites.toggle(creator.id) : undefined}
              />
            ))}
          </div>

          {result && <Pagination page={page} totalPages={result.meta.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
}
