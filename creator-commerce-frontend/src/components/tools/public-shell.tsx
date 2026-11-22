"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

// Layout for pages meant to be reachable without logging in (tools, shared
// passports) - a lightweight header/footer instead of the authenticated
// AppShell (sidebar + auth guard), which would redirect anonymous visitors
// straight to /login and defeat the point of a public, shareable page.
export function PublicShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard">
              <Button variant="secondary">Ir a mi cuenta</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary">Crear cuenta</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className={`mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-8 sm:px-8 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>{children}</main>

      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted sm:px-8">
        creator.hub · Marketplace P2P de marcas y creadores
      </footer>
    </div>
  );
}

export function ToolBackLink() {
  return (
    <Link href="/tools" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
      <ArrowLeft className="size-4" />
      Todas las herramientas
    </Link>
  );
}
