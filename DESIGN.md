# Annotated Binary

The portfolio reads like an annotated technical study: a clear explanation beside the artifact that supports it. Its opening pairs Yassine El Ghazi's name and research focus with a real compiled routine. Project sections continue that relationship through implementation notes, diagrams, evaluation details, and explicit limitations.

## Visual system

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f1efe6` | Main page ground |
| `--ink` | `#20221e` | Primary text, strong rules, competition-log ground |
| `--accent` | `#a33327` | Brick-red annotations, selected graph block, links and focus |
| `--muted` | `#5d6259` | Supporting prose and technical metadata |
| `--line` | `#bfc2b4` | Figure, table, and section divisions |
| `--wash` | `#e7e7d9` | Diagram surfaces |

The dark competition band reverses the paper/ink relationship and uses lighter supporting colors. Hairline rules group related evidence. Borders around graph nodes and network endpoints describe actual structures. Section layouts follow their content: an annotated figure, a topology, a result log, or a reading list.

| Typeface | Use |
|---|---|
| Source Serif 4 | Name, headings, figure titles, and selected numeric annotations; italic provides a second voice within the same family |
| Geist | Body text, navigation, controls, and project explanations |
| Geist Mono | Assembly, addresses, code, compact labels, and technical metadata |

Fonts are variable WOFF2 assets served from the site through Fontsource packages. The shared layout owns their imports and preload hints. Body copy starts at 16px with a 1.65 line height; compact figure text is smaller. Display type uses fluid sizes, close tracking, and optical alignment. Test actual names, labels, and instructions at narrow widths before changing the type scale.

## Composition

`global.css` owns the shared tokens, typography, navigation, homepage sections, and breakpoints. Content sits in a container capped at 1320px with 24px side gutters, reduced to 20px on small phones. The desktop hero places the name and introduction beside the binary figure. At 850px and below, the figure follows the introduction; project and supporting sections also become single-column compositions. The sticky header moves its navigation to a second row.

The project narrative begins with the Android scanner, followed by the FortiGate topology, SOC work, and Linux configuration. Native disclosure elements expose evaluation and validation detail without interrupting the main reading path. Research, CTF results, tools, education, and contact information complete the page. Writeups reuse the document shell and add `writeup.css` plus purpose-built technical components.

## The binary exhibit

`BinaryExhibit.astro` renders the committed `hero-sample.json` data. Its source is `scripts/hero-sample/sample.c`, a short, non-malicious hash-and-compare routine authored for the portfolio. The generator compiles with GCC `-O1` and extracts disassembly and ELF metadata with binutils. The current fixture contains 58 function bytes, five basic blocks, and six edges, including the loop back edge. The compiled program is not executed by the generator or the website.

Graph nodes are native buttons. Selecting a node updates its pressed state, highlights incident edges, and displays a matching pseudocode translation and plain-language explanation. Native disclosures reveal the actual instructions. The loop block is selected initially. A polite live region announces user selections, and keyboard focus stays on the selected button. Decorative SVG edges are hidden from assistive technology; branch conditions remain visible as text.

All five readings are present in the generated HTML. Only after the script initializes does the enhanced view hide inactive readings from view and assistive technology while reserving their layout space, so a visitor without JavaScript can read the complete explanation. The graph is an authored visualization of this particular fixture: its node placement, edge paths, and commentary must be reviewed whenever compiler output changes.

## Performance and accessibility

- Keep content and evidence in static HTML. The two small inline enhancements handle section navigation and graph selection; no animation library, canvas renderer, or client framework is required.
- Serve fonts locally, preload only critical faces, and inspect the font requests when changing weights or subsets. The social card is a generated image, not a runtime rendering task.
- Use real headings, landmarks, links, buttons, disclosure controls, table headers, and captions. Preserve the skip link, visible focus styles, and sticky-header anchor offsets.
- Keep explanations available to keyboard and touch visitors. Essential content must not depend on hover, color alone, or motion.
- Reduced-motion preferences disable smooth scrolling and transitions. Keep the page readable in its static state and avoid adding entrance effects that conceal content.
- Check the production build at phone and desktop widths, including graph labels, long links, keyboard focus, disclosures, and social metadata. Treat automated link, type, accessibility, and performance checks as evidence alongside visual review.

`Layout.astro` supplies the canonical URL, page metadata, self-hosted fonts, skip link, and navigation enhancement. `scripts/og-image.mjs` composes the social card from the built exhibit's actual graph and the shared visual system.

## Consulted design references

These repositories were consulted as design prose and implementation references. No third-party skill was installed, and no skill installer, hook, binary, or helper script was executed for this design.

- [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md): subject-led direction, deliberate typography, restrained motion, and critique against generic defaults.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): accessibility, responsive layout, and Astro implementation guidance.
- [Impeccable](https://github.com/pbakaus/impeccable): visual hierarchy, typography, craft checks, and preserving factual content through a redesign.
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md): semantic controls, focus, reduced motion, image sizing, and interface review.
- [Awwwards skill](https://github.com/juliobsz/skills/tree/main/awwwards): a concept anchored in the subject, consistency across pages, and production-browser review. Its motion engine and dependencies are not part of this site.
