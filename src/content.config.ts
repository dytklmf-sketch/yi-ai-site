import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    lang: z.enum(['zh', 'en']),
    pairKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(5),
    description: z.string().min(30),
    service: z.enum(['workbuddy', 'model-services', 'infrastructure']),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    order: z.number().int(),
    sources: z.array(z.object({ label: z.string(), url: z.url({ protocol: /^https$/ }) })).min(1),
  }),
});
export const collections = { guides };
