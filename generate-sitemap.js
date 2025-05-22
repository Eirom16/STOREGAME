const fs = require("fs");
const path = require("path");

const BASE_URL = "https://retrostoregame.netlify.app"; // Cambia por tu dominio real
const OUTPUT_FILE = "sitemap.xml";
const ROOT_DIR = "./"; // O "./public" si usas esa carpeta

function getHtmlFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let urls = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      urls = urls.concat(getHtmlFiles(fullPath));
    } else if (file.name.endsWith(".html")) {
      let relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, "/");
      if (relativePath === "index.html") relativePath = "";
      else relativePath = relativePath.replace(/index\.html$/, "").replace(/\.html$/, "/");
      urls.push(`${BASE_URL}/${relativePath}`);
    }
  }

  return urls;
}

function generateSitemap(urls) {
  const now = new Date().toISOString().split("T")[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

const urls = getHtmlFiles(ROOT_DIR);
const sitemap = generateSitemap(urls);
fs.writeFileSync(OUTPUT_FILE, sitemap);

console.log(`✅ Sitemap generado con ${urls.length} páginas -> ${OUTPUT_FILE}`);
