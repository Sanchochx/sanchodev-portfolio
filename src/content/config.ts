import { defineCollection, z } from 'astro:content';

// Collection `projects` — schema 1:1 con INITIAL_SETUP.txt tarea 6.
// Directorio src/content/projects/ queda vacío intencionalmente (US-CONTENT-001):
// el usuario añade los .md/.mdx posteriormente, TypeScript validará cada entrada.
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean(),
    order: z.number(),
  }),
});

export const collections = { projects };
