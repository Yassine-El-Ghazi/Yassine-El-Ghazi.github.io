// Render the 1200 × 630 social card from the homepage's actual compiled-example graph.
// Run against `npm run preview`. Playwright is a local authoring tool, not a site dependency.
// PLAYWRIGHT=/path/to/playwright/index.mjs CHROMIUM=/path/to/chrome node scripts/og-image.mjs URL
import { resolve } from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright');
const browser = await chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  ...(process.env.CHROMIUM_NO_SANDBOX === '1' ? { args: ['--no-sandbox'] } : {}),
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto(process.argv[2] ?? 'http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const graph = document.querySelector('#binary-exhibit .flow');
    if (!graph) throw new Error('Built binary exhibit is required');
    const card = document.createElement('main');
    card.className = 'og';
    card.innerHTML = `<div class="og-copy"><p class="eyebrow">Reverse engineering / Malware analysis</p><h1>Yassine<br><em>El Ghazi.</em></h1><p class="og-lede">Understand the program.<br>Follow the evidence.</p><p class="og-url">yassine-el-ghazi.github.io</p></div><div class="og-figure"><p class="eyebrow">Figure 01 / Control flow</p><h2>A small routine,<br><em>taken apart.</em></h2><div class="og-graph"></div><p class="figure-note">Authored C example · 58 bytes · x86-64</p></div>`;
    card.querySelector('.og-graph').append(graph.cloneNode(true));
    const style = document.createElement('style');
    style.textContent = `body > *:not(.og){display:none!important}body{overflow:hidden}.og{position:fixed;inset:0;display:grid;grid-template-columns:1fr 480px;gap:70px;padding:48px 60px;background:var(--paper)}.og-copy{display:flex;flex-direction:column}.og .eyebrow{font-size:13px}.og h1{font-size:108px;line-height:.92;letter-spacing:-.065em;margin:48px 0 0}.og h1 em{color:var(--accent)}.og-lede{font-size:25px;line-height:1.4;margin-top:28px;color:var(--ink)}.og-url{font:14px/1.6 var(--mono);margin-top:auto}.og-figure{border-top:1px solid var(--ink);padding-top:12px}.og h2{font-size:31px;margin:12px 0 0}.og h2 em{color:var(--accent)}.og .flow{margin-top:6px;height:380px}.og .flow-block{pointer-events:none}.og .figure-note{border-top:1px solid var(--line);padding-top:10px}`;
    document.head.append(style);
    document.body.append(card);
  });
  const out = resolve('public/og.png');
  await page.screenshot({ path: out });
  console.log(`Wrote ${out}`);
} finally { await browser.close(); }
