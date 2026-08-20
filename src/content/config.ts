import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })
});

export const collections = {
  posts: postsCollection,
};