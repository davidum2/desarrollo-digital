import { defineCollection, z, reference } from "astro:content";

const blog = defineCollection({
    type: "content",
    schema: z.object({
        image: z.object({
            url: z.string(),
            alt: z.string()
        }),
        title: z.string(),
        author: z.string(),
        description: z.string(),
        pubDate: z.date(),
        keywords: z.string().array(),
        categories: z.string().array(),
        relatedPosts: z.array(reference('blog')),
    })
})

const blogPostRich = defineCollection({
    type: "content",
    schema: z.object({
        image: z.object({
            url: z.string(),
            alt: z.string()
        }),
        title: z.string(),
        author: z.string(),
        description: z.string(),
        pubDate: z.date(),
        keywords: z.string().array(),
        categories: z.string().array(),
        relatedPosts: z.array(reference('blogPostRich')),
        faqs: z.array(z.object({
            question: z.string(),
            answer: z.string(),
        })).optional(),
    })
});
export const collections = {blog, blogPostRich}