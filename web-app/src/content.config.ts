import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live outside the app, in <repo>/assets/, organized as
// <category>/<subtopic>/post.md (category and subtopic are inferred
// from the path — see src/lib/posts.ts).
const posts = defineCollection({
  loader: glob({ base: '../assets', pattern: ['**/*.md', '!**/README.md'] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      // For PDF posts: path to the PDF relative to the markdown file,
      // e.g. "./slides.pdf". Rendered as an embedded viewer.
      pdf: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
