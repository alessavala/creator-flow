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
export function PublicShell({ children, mainClassName }: { children: React.ReactNode; mainClassName?: string }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Link href="/blog" className="hidden text-sm font-medium text-muted hover:text-foreground sm:block">
            Blog
          </Link>
        </div>
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

      <main className={mainClassName ?? "mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8"}>{children}</main>

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
