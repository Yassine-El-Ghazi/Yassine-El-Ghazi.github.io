# Publishing research and writeups

The site is ready for real reversing and malware-analysis writeups. None are published yet, and none should be invented.

## Add a writeup
1. Copy `src/content/writeups/_template.md` to `src/content/writeups/<slug>.md` (underscore files are ignored by the loader).
2. Fill in the frontmatter (`title`, `summary`, `date`, `category`, optional `target`, `arch`, `format`, `tools`, `tags`) and set `draft: false`.
3. Write the analysis in Markdown. Fenced blocks (```asm, ```c, ```text) are syntax highlighted and styled as analysis listings.
4. Put screenshots and graphs in `public/writeups/<slug>/` and reference them with descriptive alt text.
5. Run `npm run check && npm run build && npm run audit:site`.

The first published entry makes `/writeups/` indexable and adds it to the sitemap automatically (see `astro.config.mjs`). Until then it is `noindex` and shows "Coming as I publish analyses."

## Components for richer pages
`src/components/writeup/` has `Disasm`, `HexDump`, `Registers`, `MetaTable`, and `Figure`. They are Astro components, so use them in a hand-written `.astro` page; plain Markdown does not render components and MDX is intentionally not installed. All content passed to them must come from a real analysis.

## Safety
Do not publish live malware, working exploits for unpatched software, credentials, private samples, or anything covered by an NDA or employer confidentiality.
