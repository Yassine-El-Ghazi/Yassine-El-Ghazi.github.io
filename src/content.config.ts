import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Research / writeups. Add real analyses as Markdown files in src/content/writeups/.
// Files starting with an underscore (such as _template.md) are ignored by the loader.
const writeups = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(220),
    date: z.coerce.date(),
    category: z.enum(['reverse-engineering', 'malware-analysis', 'vulnerability-research', 'ctf', 'tooling']),
    target: z.string().optional(),
    arch: z.string().optional(),
    format: z.string().optional(),
    tools: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writeups };
