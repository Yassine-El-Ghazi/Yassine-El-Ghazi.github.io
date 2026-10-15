import { audit } from './audit-privacy.mjs';
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';

const root = resolve('dist');
const failures = [];
async function filesAt(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesAt(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const files = await filesAt(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${file}: duplicate HTML IDs`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) failures.push(`${file}: expected one h1`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|data:)/.test(href)) continue;
    const [path, fragment] = href.split('#');
    const candidate = path ? resolve(path.startsWith('/') ? root : dirname(file), '.' + (path.startsWith('/') ? path : '/' + path).split('?')[0]) : file;
    if (!candidate.startsWith(root + '/') && candidate !== root) { failures.push(`Invalid path: ${href}`); continue; }
    let target = candidate;
    try { if ((await stat(target)).isDirectory()) target = join(target, 'index.html'); await stat(target); }
    catch { failures.push(`${file}: missing local target ${href}`); continue; }
    if (fragment && target.endsWith('.html')) {
      const destination = await readFile(target, 'utf8');
      if (!destination.includes(`id="${fragment}"`)) failures.push(`${file}: missing anchor ${href}`);
    }
  }
  if (/<script\b[^>]*src=/.test(html)) failures.push(`${file}: unexpected external or bundled client JavaScript`);
  const inline = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  if (inline.length > 2 || inline.reduce((sum, code) => sum + code.length, 0) > 4800) failures.push(`${file}: inline JavaScript exceeds the two-script, 4.8KB first-party budget`);
  if (/internship|\bCBI\b|\bPFA\b/i.test(html.replace(/<[^>]+>/g, ' '))) failures.push(`${file}: private internship/company wording must stay out of the public site`);
}
// Readability floor: no declared text size below 12px (SVG diagram text; HTML labels use 12.5px) in shipped CSS.
for (const file of files.filter(f => f.endsWith('.css'))) {
  const css = await readFile(file, 'utf8');
  for (const match of css.matchAll(/font(?:-size)?:[^;{}]*?(\d+(?:\.\d+)?)px/g)) {
    if (Number(match[1]) < 12) failures.push(`${file}: text size ${match[1]}px is below the 12px floor`);
  }
}
const index = await readFile(join(root, 'index.html'), 'utf8');
for (const required of ['name="description"', 'rel="canonical"', 'property="og:title"', 'name="twitter:card" content="summary_large_image"', 'property="og:image" content="https://', 'name="twitter:image:alt"', 'href="/favicon.svg"', 'id="main"']) {
  if (!index.includes(required)) failures.push(`Missing metadata or landmark: ${required}`);
}
for (const asset of ['404.html', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', 'favicon.svg', 'og.png']) {
  if (!files.includes(join(root, asset))) failures.push(`Missing required asset: ${asset}`);
}
const privacy = await audit({ dist: true });
for (const f of privacy.findings) failures.push(`${JSON.stringify(f.path)}:${f.line} [${f.rule}] review required`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Site audit passed: ${htmlFiles.length} HTML pages; internal links, anchors, metadata (including the Open Graph image), assets, private-wording guard, text-size floor, and JavaScript limits (no external/bundled scripts, two small inline scripts, 4.8KB combined) verified.`);
