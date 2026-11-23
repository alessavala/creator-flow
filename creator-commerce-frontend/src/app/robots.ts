import type { MetadataRoute } from "next";

const SITE_URL = "https://creatorflow.com.mx";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/profile", "/admin", "/campaigns", "/collaborations", "/favorites"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
