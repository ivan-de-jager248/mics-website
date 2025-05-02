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

// Define the schema for an individual variation inline
const variationSchema = z.object({
    name: z.string(),
    properties: z.array(z.string()).optional(),
    body: z.string(),
    draft: z.boolean().default(true),
});

const products = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
    schema: ({ image }) => z.object({
        name: z.string(),
        category: reference('categories'),
        thumbnail: imageSchema({ image }),
        images: z.array(imageSchema({ image })).optional(), // Make images optional
        draft: z.boolean().default(true),
        featured: z.boolean().default(false),
        variations: z.array(variationSchema).min(1), // Use the inline schema, make optional
    }),
});

// 4. Export the updated collections
export const collections = { products, categories };