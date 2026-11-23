import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

// Hardcoded to the documented production domain (see DEPLOYMENT.easypanel.md)
// rather than threading a new NEXT_PUBLIC_SITE_URL through the Docker build -
// update this once the domain is actually live on the server.
const SITE_URL = "https://creatorflow.com.mx";

const STATIC_ROUTES = ["", "/creators", "/tools", "/blog", "/register", "/login"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
  }));
  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly" as const,
  }));
  return [...staticEntries, ...blogEntries];
}
