"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SocialLoginButtons } from "@/components/social-login-buttons";
import { ApiError } from "@/lib/api";
import { redirectAfterAuth } from "@/lib/redirect-after-auth";
import { translateApiError } from "@/lib/error-messages";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace(redirectAfterAuth(new URLSearchParams(window.location.search).get("next")));
    } catch (err) {
      setError(err instanceof ApiError ? translateApiError(err.message) : "No pudimos iniciar sesión. Intentá de nuevo.");
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
          <h1 className="mb-1 text-2xl font-semibold">Iniciá sesión</h1>
          <p className="mb-6 text-sm text-muted">Conectá con marcas y creadores de contenido.</p>

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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>

          <div className="mt-6">
            <SocialLoginButtons onSuccess={() => router.replace(redirectAfterAuth(new URLSearchParams(window.location.search).get("next")))} onError={(msg) => setError(msg)} />
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="font-semibold text-foreground underline underline-offset-4">
            Registrate
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
