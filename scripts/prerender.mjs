// Build-time prerender: open the built site in headless Chromium once, let
// React fetch Sanity content and render every section, then write the
// finished HTML back into dist/index.html.
//
// Why: crawlers that don't run JavaScript (Bingbot, OAI-SearchBot, ClaudeBot,
// PerplexityBot, GPTBot) otherwise see only <div id="root"></div>. The
// snapshot gives them real body text. Visitors still get the normal SPA —
// React boots on top of the snapshot and re-renders it.
//
// How: no local dev server. Puppeteer intercepts every request to the
// production origin and answers it from dist/, so the page runs under the
// real https://abhishek1337chatterjee.github.io origin. That keeps Sanity's
// CORS allowlist and every runtime code path identical to production.
//
// Runs in CI only (npm run prerender, after npm run build). Needs no secrets:
// it reads the same public Sanity CDN the browser does.
import { readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const ORIGIN = 'https://abhishek1337chatterjee.github.io';
const DIST = resolve('dist');
const RENDER_TIMEOUT_MS = 90_000;

// Nodes that must not be frozen into static HTML: live telemetry (GitHub
// stats fetched per visit) and anything session-bound. React re-creates them
// at runtime; crawlers don't need them.
const STRIP_SELECTORS = ['#github', '[data-prerender="skip"]'];

// Anchors that prove Sanity content actually arrived before we snapshot.
// Each of these sections returns null until its data loads.
const CONTENT_READY_SELECTORS = ['#about', '#skills', '#journey', '#contact'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

// Resolve a request path to a file inside dist/, falling back to index.html
// the way GitHub Pages serves the SPA.
async function readDistFile(urlPath) {
  let filePath = normalize(join(DIST, decodeURIComponent(urlPath)));
  if (!filePath.startsWith(DIST)) return null;
  try {
    const s = await stat(filePath);
    if (s.isDirectory()) filePath = join(filePath, 'index.html');
    await stat(filePath);
  } catch {
    filePath = join(DIST, 'index.html');
  }
  try {
    return { body: await readFile(filePath), type: MIME[extname(filePath)] ?? 'application/octet-stream' };
  } catch {
    return null;
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    // CI runners execute as an unprivileged user without user namespaces;
    // Chromium's sandbox can't start there. The page is our own build.
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    // Reduced motion makes the boot Loader skip itself and framer-motion
    // render final states directly, so nothing is captured mid-animation.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    await page.setRequestInterception(true);
    page.on('request', async (req) => {
      const url = new URL(req.url());
      if (url.origin !== ORIGIN) {
        req.continue();
        return;
      }
      const file = await readDistFile(url.pathname);
      if (!file) {
        req.respond({ status: 404, body: '' });
        return;
      }
      req.respond({ status: 200, headers: { 'content-type': file.type }, body: file.body });
    });

    page.on('pageerror', (err) => console.warn('prerender: page error:', err.message));
    page.on('requestfailed', (req) => {
      console.warn('prerender: request failed:', req.url().slice(0, 120), req.failure()?.errorText ?? '');
    });

    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle0', timeout: RENDER_TIMEOUT_MS });
    for (const sel of CONTENT_READY_SELECTORS) {
      await page.waitForSelector(sel, { timeout: RENDER_TIMEOUT_MS });
    }

    const html = await page.evaluate((strip) => {
      for (const sel of strip) {
        for (const el of document.querySelectorAll(sel)) el.remove();
      }
      return document.documentElement.outerHTML;
    }, STRIP_SELECTORS);

    const out = join(DIST, 'index.html');
    await writeFile(out, `<!doctype html>\n${html}\n`);

    const textChars = await page.evaluate(() => document.body.innerText.length);
    console.log(`prerender: wrote ${out} (${html.length} bytes, ~${textChars} chars of visible text)`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('prerender: failed:', err);
  process.exit(1);
});
