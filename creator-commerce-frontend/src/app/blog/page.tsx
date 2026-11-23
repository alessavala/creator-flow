import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/tools/public-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { paletteVariant } from "@/lib/badge-color";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog | creator.hub",
  description:
    "Guías prácticas de UGC, TikTok Shop, Amazon, Mercado Libre y e-commerce para marcas y creadores de contenido.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  return (
    <PublicShell mainClassName="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-2 text-center">
        <Badge variant="indigo" className="mx-auto">
          Blog
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Guías de UGC y e-commerce</h1>
        <p className="mx-auto max-w-xl text-sm text-muted">
          Contenido práctico para marcas que quieren vender más con creadores, y para creadores que quieren vivir de su contenido.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="flex h-full flex-col gap-3 p-5 transition hover:shadow-md">
              <Badge variant={paletteVariant(post.category)} className="w-fit">
                {post.category}
              </Badge>
              <h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
              <p className="flex-1 text-sm text-muted">{post.description}</p>
              <p className="text-xs text-muted">
                {formatDate(post.publishedAt)} · {post.readingMinutes} min de lectura
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </PublicShell>
  );
}
