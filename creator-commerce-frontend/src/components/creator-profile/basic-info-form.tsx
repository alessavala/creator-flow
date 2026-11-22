"use client";

import { FormEvent, useState } from "react";
import { Button } from "../button";
import { Input, Textarea } from "../input";
import { apiFetch, ApiError } from "@/lib/api";
import { translateApiError } from "@/lib/error-messages";
import { useAuth } from "@/lib/auth-context";
import type { CreatorProfile } from "@/lib/types";

interface FormState {
  displayName: string;
  bio: string;
  country: string;
  city: string;
  age: string;
  isParent: boolean;
  profilePhotoUrl: string;
  turnaroundDays: string;
  baseRate: string;
  acceptsProduct: boolean;
  acceptsFixedFee: boolean;
  acceptsCommission: boolean;
}

function toFormState(creator: CreatorProfile | null): FormState {
  return {
    displayName: creator?.displayName ?? "",
    bio: creator?.bio ?? "",
    country: creator?.country ?? "",
    city: creator?.city ?? "",
    age: creator?.age ? String(creator.age) : "",
    isParent: creator?.isParent ?? false,
    profilePhotoUrl: creator?.profilePhotoUrl ?? "",
    turnaroundDays: String(creator?.turnaroundDays ?? 14),
    baseRate: creator?.baseRate ? String(creator.baseRate) : "",
    acceptsProduct: creator?.acceptsProduct ?? true,
    acceptsFixedFee: creator?.acceptsFixedFee ?? true,
    acceptsCommission: creator?.acceptsCommission ?? true,
  };
}

export function BasicInfoForm({ creator, onSaved }: { creator: CreatorProfile | null; onSaved: (creator: CreatorProfile) => void }) {
  const { token } = useAuth();
  const [form, setForm] = useState<FormState>(() => toFormState(creator));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await apiFetch<CreatorProfile>("/creators/me", {
        method: "PUT",
        token,
        body: {
          displayName: form.displayName,
          bio: form.bio || undefined,
          country: form.country,
          city: form.city || undefined,
          age: form.age ? Number(form.age) : undefined,
          isParent: form.isParent,
          profilePhotoUrl: form.profilePhotoUrl || undefined,
          turnaroundDays: Number(form.turnaroundDays) || 14,
          baseRate: form.baseRate ? Number(form.baseRate) : undefined,
          acceptsProduct: form.acceptsProduct,
          acceptsFixedFee: form.acceptsFixedFee,
          acceptsCommission: form.acceptsCommission,
        },
      });
      onSaved(updated);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof ApiError ? translateApiError(err.message) : "No pudimos guardar tu perfil.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Nombre público</label>
        <Input required value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Bio</label>
        <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">País</label>
          <Input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="MX" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Ciudad</label>
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="mb-3 text-sm font-semibold">Sobre mí — visible en mi Creator Passport</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="creator-age" className="mb-1.5 block text-sm font-medium">Edad (opcional)</label>
            <Input id="creator-age" type="number" min={18} max={100} placeholder="Ej. 30" value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <label className="flex items-center gap-3 self-end rounded-xl border border-border bg-card p-3 text-sm">
            <input type="checkbox" checked={form.isParent} onChange={(e) => setForm({ ...form, isParent: e.target.checked })}
              className="size-4 accent-teal-600" />
            Mostrar «Soy papá / mamá» en mi perfil
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">Solo se publican los datos que decidas compartir.</p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Foto de perfil (URL)</label>
        <Input type="url" value={form.profilePhotoUrl} onChange={(e) => setForm({ ...form, profilePhotoUrl: e.target.value })} placeholder="https://…" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Días de entrega habituales</label>
          <Input
            type="number"
            min={1}
            value={form.turnaroundDays}
            onChange={(e) => setForm({ ...form, turnaroundDays: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Tarifa base</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="Ej: 150"
            value={form.baseRate}
            onChange={(e) => setForm({ ...form, baseRate: e.target.value })}
          />
          <p className="mt-1 text-xs text-muted">Lo que cobras por colaboración; las marcas lo ven en tu perfil.</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Tipos de colaboración que aceptas</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.acceptsProduct} onChange={(e) => setForm({ ...form, acceptsProduct: e.target.checked })} />
            Solo producto
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.acceptsFixedFee} onChange={(e) => setForm({ ...form, acceptsFixedFee: e.target.checked })} />
            Pago fijo
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.acceptsCommission}
              onChange={(e) => setForm({ ...form, acceptsCommission: e.target.checked })}
            />
            Comisión externa
          </label>
        </div>
      </div>

      {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {savedAt && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Perfil guardado.</p>}

      <Button type="submit" disabled={isSaving} className="w-fit">
        {isSaving ? "Guardando…" : "Guardar"}
      </Button>
    </form>
  );
}
