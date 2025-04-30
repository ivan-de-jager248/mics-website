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
        category: reference('categories'),
        thumbnail: imageSchema({ image }),
        images: z.array(imageSchema({ image })),
        draft: z.boolean().default(true),
        featured: z.boolean().default(false),
    }),
});

const productVariations = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/variations' }),
    schema: z.object({
        name: z.string(), 
        product: reference('products'), 
        properties: z.array(z.string()),
        draft: z.boolean().default(true),
    }),
});

// 4. Export all collections
export const collections = { products, categories, productVariations };