import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/tools/public-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownLite } from "@/lib/markdown-lite";
import { paletteVariant } from "@/lib/badge-color";
import { getBlogPost } from "@/lib/blog-posts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Artículo no encontrado | creator.hub" };
  return {
    title: `${post.title} | creator.hub`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <PublicShell mainClassName="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <Link href="/blog" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" />
        Todos los artículos
      </Link>

      <div className="flex flex-col gap-3">
        <Badge variant={paletteVariant(post.category)} className="w-fit">
          {post.category}
        </Badge>
        <h1 className="text-[27px] font-bold leading-tight tracking-[-0.03em] sm:text-[32px]">{post.title}</h1>
        <p className="text-sm text-muted">
          {formatDate(post.publishedAt)} · {post.readingMinutes} min de lectura
        </p>
      </div>

      <MarkdownLite content={post.content} />

      {post.relatedTool && (
        <Link href={post.relatedTool.href}>
          <Button variant="secondary" className="w-fit">
            {post.relatedTool.label}
            <ArrowUpRight className="size-4" />
          </Button>
        </Link>
      )}

      <Card className="flex flex-col items-center gap-2 bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
        <p className="text-sm font-semibold text-foreground">¿Querés profundizar en estrategia de e-commerce?</p>
        <p className="text-sm text-muted">
          En <strong className="text-foreground">Estudio Ecommerce</strong> encontrás recursos enfocados en crecer tu tienda online.
        </p>
        <a href="https://estudioecommerce.com.mx" target="_blank" rel="noreferrer">
          <Button variant="secondary" className="mt-1">
            Visitar Estudio Ecommerce
            <ArrowUpRight className="size-4" />
          </Button>
        </a>
      </Card>

      <Card className="flex flex-col items-center gap-2 p-6 text-center">
        <p className="text-sm font-semibold text-foreground">¿Sos creador o marca?</p>
        <p className="text-sm text-muted">Creá tu cuenta gratis en creator.hub y empezá hoy.</p>
        <Link href="/register">
          <Button className="mt-1">Crear cuenta gratis</Button>
        </Link>
      </Card>
    </PublicShell>
  );
}
