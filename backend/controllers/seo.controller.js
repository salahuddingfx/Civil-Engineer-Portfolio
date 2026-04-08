const registry = require("../models/modelRegistry");

async function sitemap(req, res, next) {
  try {
    const routes = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/about", priority: "0.8", changefreq: "monthly" },
      { path: "/services", priority: "0.9", changefreq: "weekly" },
      { path: "/projects", priority: "0.9", changefreq: "weekly" },
      { path: "/testimonials", priority: "0.8", changefreq: "weekly" },
      { path: "/gallery", priority: "0.8", changefreq: "weekly" },
      { path: "/contact", priority: "0.9", changefreq: "monthly" },
    ];
    const dynamicPaths = [];

    const models = [registry.services, registry.projects, registry.gallery];
    for (const model of models) {
      const items = await model.find({ isPublished: true }, { slug: 1, updatedAt: 1 }).lean();
      for (const item of items) {
        dynamicPaths.push({
          path: `/${item.slug}`,
          priority: "0.6",
          changefreq: "monthly",
          updatedAt: item.updatedAt,
        });
      }
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const uniq = [...routes, ...dynamicPaths].filter(
      (entry, index, arr) => arr.findIndex((inner) => inner.path === entry.path) === index
    );

    const urls = uniq
      .map((entry) => {
        const lastmod = entry.updatedAt ? new Date(entry.updatedAt).toISOString() : new Date().toISOString();
        return `<url><loc>${baseUrl}${entry.path}</loc><lastmod>${lastmod}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    return res.send(xml);
  } catch (error) {
    return next(error);
  }
}

function robots(req, res) {
  const text = `User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get("host")}/api/seo/sitemap.xml`;
  res.setHeader("Content-Type", "text/plain");
  res.send(text);
}

module.exports = { sitemap, robots };
