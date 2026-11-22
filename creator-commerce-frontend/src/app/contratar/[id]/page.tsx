"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, CheckCircle2, Send, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/format";
import type { Campaign, CreatorProfile, Paginated } from "@/lib/types";

export default function HireCreatorPage() {
  return (
    <AppShell>
      <HireCreator />
    </AppShell>
  );
}

function HireCreator() {
  const params = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "BRAND" || !params.id) return;
    let alive = true;
    Promise.all([
      apiFetch<CreatorProfile>(`/creators/${params.id}`, { token }),
      apiFetch<Paginated<Campaign>>("/campaigns/mine", { token, query: { pageSize: 100 } }),
    ]).then(([c, res]) => {
      if (!alive) return;
      setCreator(c);
      setCampaigns(res.data.filter((campaign) => campaign.status === "PUBLISHED"));
    }).catch((e) => {
      if (alive) setError(e instanceof ApiError ? e.message : "No se pudieron consultar las campañas.");
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token, params.id, user?.role]);

  if (user?.role !== "BRAND") {
    return (
      <div className="mx-auto max-w-xl rounded-[24px] border border-border bg-card p-8 text-center shadow-sm">
        <ShoppingBag className="mx-auto mb-3 size-10 text-[#0F766E]" />
        <h1 className="text-2xl font-extrabold">Solicitar una colaboración</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Para invitar a un creador a tu campaña, ingresa con una cuenta de marca.
        </p>
        {!user ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/register?role=BRAND&next=${encodeURIComponent("/contratar/" + params.id)}`}
              className="rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white hover:bg-[#115E59]">
              Crear cuenta de marca
            </Link>
            <Link href={`/login?next=${encodeURIComponent("/contratar/" + params.id)}`}
              className="rounded-xl border border-border px-5 py-3 text-sm font-bold">
              Ya tengo cuenta
            </Link>
          </div>
        ) : (
          <Link href="/creators" className="mt-5 inline-flex text-sm font-semibold text-primary underline">Explorar creadores</Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <Link href={`/p/${params.id}`} className="inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver al Creator Passport
      </Link>
      <header className="rounded-[24px] bg-[#0B1220] p-7 text-white sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5EEAD4]">Colaboración UGC · E-commerce</p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Invitar a {creator?.displayName ?? "este creador"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">
          Elige una campaña publicada y envía una invitación. El creador podrá aceptarla o rechazarla.
        </p>
      </header>

      {loading ? (
        <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted">Cargando campañas…</p>
      ) : success ? (
        <div role="status" className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
          <CheckCircle2 className="mb-3 size-8" />
          <h2 className="text-lg font-bold">Invitación enviada correctamente</h2>
          <p className="mt-2 text-sm">La invitación ya está registrada. Espera la respuesta del creador en Creator Flow.</p>
          <Link href="/campaigns" className="mt-4 inline-flex text-sm font-bold underline">Ver mis campañas</Link>
        </div>
      ) : (
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm sm:p-8">
          {creator && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-xl bg-background p-4">
              <div className="min-w-0">
                <p className="truncate text-base font-bold">{creator.displayName}</p>
                <p className="text-xs text-muted">
                  {[creator.city, creator.country].filter(Boolean).join(", ")}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-muted">Tarifa de referencia</p>
                <p className="text-sm font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                  {creator.baseRate ? formatCurrency(Number(creator.baseRate)) : "A negociar"}
                </p>
              </div>
            </div>
          )}
          {campaigns.length === 0 ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold">Primero necesitas una campaña publicada</h2>
              <p className="text-sm leading-6 text-muted">
                Creator Flow envía invitaciones vinculadas a campañas. Crea tu campaña, publícala y regresa al perfil del creador.
              </p>
              <Link href="/campaigns" className="inline-flex w-fit rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white">
                Crear o publicar campaña
              </Link>
              <Link href="/profile" className="text-xs text-muted underline">¿Necesitas completar el perfil de tu marca?</Link>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!token || !campaignId || sending) return;
                setSending(true);
                setError("");
                try {
                  await apiFetch("/applications/invite", {
                    method: "POST",
                    token,
                    body: { creatorId: params.id, campaignId, message: message.trim() || undefined },
                  });
                  setSuccess(true);
                } catch (err) {
                  setError(err instanceof ApiError ? err.message : "No se pudo enviar la invitación.");
                } finally {
                  setSending(false);
                }
              }}
            >
              <h2 className="text-lg font-bold">Solicitar una colaboración</h2>
              <div>
                <label htmlFor="invite-campaign" className="mb-2 block text-sm font-semibold">Campaña publicada</label>
                <select id="invite-campaign" required value={campaignId} onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-[#14B8A6]">
                  <option value="">Selecciona una campaña</option>
                  {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="invite-message" className="mb-2 block text-sm font-semibold">Mensaje para el creador (opcional)</label>
                <textarea id="invite-message" rows={4} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hola, nos gustaría colaborar contigo en un video de producto para nuestra campaña..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-[#14B8A6]" />
              </div>
              <div className="flex items-start gap-2 text-xs leading-5 text-muted">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#0F766E]" />
                Enviar la invitación no representa un cobro ni confirma una contratación.
              </div>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={!campaignId || sending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50">
                <Send className="size-4" /> {sending ? "Enviando invitación…" : "Enviar invitación"}
              </button>
            </form>
          )}
          {error && campaigns.length === 0 && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
