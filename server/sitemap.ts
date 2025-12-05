import type { Request, Response } from "express";

export function generateSitemap(req: Request, res: Response) {
  const baseUrl = "https://resumai.davidsodre.com";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    { url: "/generator", changefreq: "weekly", priority: "0.9" },
    { url: "/resources", changefreq: "weekly", priority: "0.8" },
    { url: "/dashboard", changefreq: "weekly", priority: "0.7" },
    { url: "/signup", changefreq: "monthly", priority: "0.8" },
    { url: "/login", changefreq: "monthly", priority: "0.6" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}${page.url}" />
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
}
