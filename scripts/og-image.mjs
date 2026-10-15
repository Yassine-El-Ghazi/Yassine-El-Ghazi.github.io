// Renders public/og.png (1200x630) from the built homepage: the real control-flow graph from the hero
// workbench (scripts/hero-sample) beside the name and lede. Run against `npm run preview`.
// Playwright is not a project dependency; point PLAYWRIGHT at any local install, e.g.
//   PLAYWRIGHT=/path/to/node_modules/playwright/index.mjs node scripts/og-image.mjs http://127.0.0.1:4321/
import { resolve } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright');
const url = process.argv[2] ?? 'http://127.0.0.1:4321/';
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  await document.fonts.ready;
  const graph = document.querySelector('.pane-graph svg').cloneNode(true);
  const fn = document.querySelector('.wb-bar .amber').textContent;
  const card = document.createElement('div');
  card.innerHTML = `
    <div class="og-left">
      <p class="label">Reverse engineering / Malware analysis</p>
      <h1>Yassine<br>El Ghazi</h1>
      <p class="og-lede">I take software apart to understand how it works.</p>
      <p class="og-url">yassine-el-ghazi.github.io</p>
    </div>
    <div class="og-right">
      <div class="og-bar"><span class="label">Function</span><b>${fn}</b><span class="label">gcc -O1 · x86-64</span></div>
      <div class="og-graph"></div>
      <p class="og-cap">Real compiled output, not a real sample</p>
    </div>`;
  card.querySelector('.og-graph').appendChild(graph);
  const style = document.createElement('style');
  style.textContent = `
    body > *:not(.og) { display: none !important; }
    body { background: var(--bg) !important; overflow: hidden; }
    .og { position: fixed; inset: 0; display: grid; grid-template-columns: 1fr 560px; gap: 48px; padding: 56px 64px; box-sizing: border-box;
      background: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.3px) 0 0 / 28px 28px, radial-gradient(closest-side at 80% 40%, rgba(114,167,255,0.14), transparent) , var(--bg); }
    .og-left { display: flex; flex-direction: column; }
    .og-left .label { font-size: 17px; color: var(--muted); }
    .og h1 { margin-top: 28px; font-size: 104px; line-height: 0.92; letter-spacing: -0.065em; font-weight: 640; color: var(--text); }
    .og-lede { margin-top: 30px; font-size: 32px; line-height: 1.18; letter-spacing: -0.03em; color: var(--text); max-width: 13em; }
    .og-url { margin-top: auto; font: 500 20px/1 var(--mono); color: var(--blue); }
    .og-right { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--line-strong); border-radius: 16px; overflow: hidden; }
    .og-bar { display: flex; align-items: baseline; gap: 14px; padding: 16px 22px; background: var(--surface-2); border-bottom: 1px solid var(--line); }
    .og-bar .label { font-size: 15px; } .og-bar b { font: 500 20px var(--mono); color: var(--amber); margin-right: auto; }
    .og-graph { flex: 1; display: grid; place-items: center; padding: 14px 20px 0; }
    .og-graph svg { width: 100%; height: auto; max-height: 400px; }
    .og-graph .edge { stroke-dashoffset: 0; animation: none; } .og-graph .eh { opacity: 1; animation: none; }
    .og-graph .node text { font-size: 13px; } .og-graph .node .t1 { font-size: 14.5px; }
    .og-cap { padding: 12px 22px 16px; font: 500 14px/1 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--dim); }`;
  card.className = 'og';
  document.head.appendChild(style);
  document.body.appendChild(card);
});
const out = resolve('public/og.png');
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(`Wrote ${out}`);
