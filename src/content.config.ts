import { defineCollection, reference, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: './src/content/categories' }),
    schema: z.object({
        name: z.string()
    }),
});

export const imageSchema = ({ image }: SchemaContext) =>
    z.object({
        image: image(),
        description: z.string().optional(),
        alt: z.string().optional(),
    });

const products = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
    schema: ({ image }) => z.object({
        name: z.string(),
        price: z.number(),
        category: reference('categories'),
        thumbnail: imageSchema({ image }),
        images: z.array(imageSchema({ image })),
        draft: z.boolean().default(true),
        featured: z.boolean().default(false),
        properties: z.array(z.string()),
    }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { products, categories };