"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, UserRound } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialLoginButtons } from "@/components/social-login-buttons";
import { ApiError } from "@/lib/api";
import { translateApiError } from "@/lib/error-messages";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";
import { redirectAfterAuth } from "@/lib/redirect-after-auth";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<UserRole>(() => (searchParams.get("role") === "BRAND" ? "BRAND" : "CREATOR"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(email, password, role);
      router.replace(redirectAfterAuth(searchParams.get("next")));
    } catch (err) {
      setError(err instanceof ApiError ? translateApiError(err.message) : "No pudimos crear tu cuenta. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card className="p-8">
          <h1 className="mb-1 text-2xl font-semibold">Creá tu cuenta</h1>
          <p className="mb-6 text-sm text-muted">Elegí cómo querés usar la plataforma.</p>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="CREATOR" className="gap-1.5">
                <UserRound className="size-4" />
                Soy Creador
              </TabsTrigger>
              <TabsTrigger value="BRAND" className="gap-1.5">
                <Building2 className="size-4" />
                Soy Marca
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted">Mínimo 8 caracteres.</p>
            </div>

            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-6">
            <SocialLoginButtons role={role} onSuccess={() => router.replace(redirectAfterAuth(searchParams.get("next")))} onError={(msg) => setError(msg)} />
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-foreground underline underline-offset-4">
            Iniciá sesión
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
