// Writes dist/sitemap.xml at build time so <lastmod> always reflects the
// deploy date instead of a hand-edited value that goes stale.
// Runs automatically via the npm "postbuild" hook.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://abhishek1337chatterjee.github.io';
const PAGES = [{ path: '/', changefreq: 'weekly', priority: '1.0' }];

const lastmod = new Date().toISOString().slice(0, 10);
const urls = PAGES.map(
  (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = resolve('dist/sitemap.xml');
writeFileSync(out, xml);
console.log(`sitemap: wrote ${out} (lastmod ${lastmod})`);
