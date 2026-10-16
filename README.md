# Yassine El Ghazi — Cybersecurity portfolio

A static Astro portfolio about reverse engineering, malware analysis, and security engineering. The **Annotated Binary** design presents selected work alongside readable technical evidence, including an interactive control-flow graph from a small portfolio-authored C function.

**Live site:** [yassine-el-ghazi.github.io](https://yassine-el-ghazi.github.io/)

![Desktop preview of the Annotated Binary portfolio](docs/preview.webp)

## Design and stack

Astro 7, strict TypeScript, semantic HTML, custom responsive CSS, and GitHub Pages. Source Serif 4 gives headings their editorial character; Geist handles prose and controls; Geist Mono distinguishes instructions, addresses, and technical metadata. All fonts are self-hosted. Graphite, ivory, and mineral-blue accents connect the homepage's annotated figures, project explanations, and competition log. See [DESIGN.md](DESIGN.md) for tokens, interaction behavior, and design references.

Pages are rendered to static HTML. Small inline scripts enhance navigation state and the selectable binary exhibit. There are no client framework bundles, runtime API calls, analytics, or third-party embeds. The exhibit's instructions and explanations remain available without JavaScript.

## Local development

Requires Node.js 22.12+; CI uses Node.js 24.

```sh
npm ci
npm run dev
```

## Production checks

```sh
npm run check
npm run build
npm run audit:site
npm test
npm run audit:privacy
npm run audit:history
npm run audit:secrets
npm run preview
```

`check` validates Astro and TypeScript. `audit:site` inspects generated links, fragment targets, IDs, metadata, assets, client scripts, and minimum text sizes. Automated checks complement browser review at desktop and phone widths, keyboard testing, and reduced-motion testing.

## Source structure

| Location | Purpose |
|---|---|
| `src/components/` | Homepage sections and the selectable `BinaryExhibit.astro` |
| `src/components/writeup/` | Disassembly, hexdump, registers, metadata, and figures |
| `src/content/writeups/` | Markdown research entries; see [writeup guide](docs/WRITEUPS.md) |
| `src/data/` | Profile, project and competition content, detector results, compiled hero fixture |
| `src/layouts/` | Shared document, fonts, SEO metadata, and writeup layout |
| `src/pages/` | Homepage, research index and entries, custom 404 |
| `src/styles/` | Shared design tokens, homepage and writeup styles |
| `public/` | Favicon, robots.txt, social card |
| `scripts/` | Build checks, compiled fixture generator, social-card renderer |
| `.github/workflows/` | Validation and Pages deployment |

Update `src/data/projects.ts`, `src/data/competitions.ts`, and `src/data/profile.ts` to maintain the content. Technical claims should link to public source code, reproducible artifacts, or official results. Keep benchmark results distinct from the behavior of the deployed scanner or lab.

## Binary exhibit and social card

`scripts/hero-sample/sample.c` is an authored, non-malicious example. The generator compiles it with GCC `-O1`, reads its instructions with `objdump`, and extracts ELF metadata with `readelf`; it does not execute the compiled program. The committed `src/data/hero-sample.json` contains the actual instructions, addresses, basic blocks, edges, and compiler details, so normal site builds need no compiler.

To regenerate it with GCC and binutils installed:

```sh
python3 scripts/hero-sample/generate.py
```

Compiler versions can change the output. Review the five-block graph, branch labels, and explanations in `BinaryExhibit.astro` whenever the fixture changes.

`scripts/og-image.mjs` renders `public/og.png` at 1200×630 using the built exhibit's graph and the site's fonts. Run it against `npm run preview`. Playwright is an authoring tool, not a project dependency; point `PLAYWRIGHT` to a local installation and optionally set `CHROMIUM` to a browser binary:

```sh
PLAYWRIGHT=/path/to/playwright/index.mjs node scripts/og-image.mjs http://127.0.0.1:4321/
```

## Deployment

This account repository uses the root URL `https://yassine-el-ghazi.github.io`, with no project `base` path. Select **GitHub Actions** in **Settings → Pages**.

Pushes to `main` run validation, install locked dependencies, build and inspect the static output, then upload only `dist/` to GitHub Pages. Pull requests run checks without deployment. Actions use pinned commit SHAs and scoped deployment permissions.

## License

Source code is provided under the [MIT License](LICENSE). Personal biography is not licensed for impersonation or reuse as someone else's profile. Source Serif 4, Geist, and Geist Mono use the SIL Open Font License; their font packages include the licenses. Linked projects retain their own licenses.
