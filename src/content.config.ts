import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
});

const blogPostRich = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blogPostRich',
  }),
});

export const collections = { blog, blogPostRich };
