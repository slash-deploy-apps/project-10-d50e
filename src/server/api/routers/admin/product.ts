import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { products } from '~/server/db/schema';
import { eq, like, and, sql, desc } from 'drizzle-orm';
import { z } from 'zod';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

const productCreateSchema = z.object({
  seriesId: z.string().min(1),
  modelName: z.string().min(1),
  slug: z.string().optional(),
  imageUrl: z.string().optional(),
  inputVoltage: z.string().optional(),
  outputVoltage: z.string().optional(),
  outputCurrent: z.string().optional(),
  outputType: z.string().optional(),
  price: z.number().int().optional(),
  priceNote: z.string().optional(),
  datasheetUrl: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  status: z.enum(['active', 'draft', 'discontinued']).default('draft'),
  specs: z.record(z.string()).optional(),
  specsEn: z.record(z.string()).optional(),
});

const productUpdateSchema = z.object({
  id: z.string().min(1),
  seriesId: z.string().min(1).optional(),
  modelName: z.string().min(1).optional(),
  slug: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  inputVoltage: z.string().nullable().optional(),
  outputVoltage: z.string().nullable().optional(),
  outputCurrent: z.string().nullable().optional(),
  outputType: z.string().nullable().optional(),
  price: z.number().int().nullable().optional(),
  priceNote: z.string().nullable().optional(),
  datasheetUrl: z.string().nullable().optional(),
  certifications: z.array(z.string()).nullable().optional(),
  status: z.enum(['active', 'draft', 'discontinued']).optional(),
  specs: z.record(z.string()).nullable().optional(),
  specsEn: z.record(z.string()).nullable().optional(),
});

export const productRouter = createTRPCRouter({
  list: adminProcedure
    .input(paginationSchema)
    .query(async ({ input }) => {
      const { page, limit, search } = input;
      const offset = (page - 1) * limit;

      const conditions = search
        ? [like(products.modelName, `%${search}%`)]
        : [];

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, totalResult] = await Promise.all([
        db.query.products.findMany({
          where,
          with: {
            series: true,
          },
          limit,
          offset,
          orderBy: [desc(products.createdAt)],
        }),
        db
          .select({ count: sql<number>`count(*)` })
          .from(products)
          .where(where)
          .then((r) => r[0]?.count ?? 0),
      ]);

      return {
        items,
        total: totalResult,
        page,
        limit,
        totalPages: Math.ceil(totalResult / limit),
      };
    }),

  create: adminProcedure
    .input(productCreateSchema)
    .mutation(async ({ input }) => {
      const slug = input.slug ?? slugify(input.modelName);
      const [product] = await db.insert(products).values({
        ...input,
        slug,
      }).returning();

      return product;
    }),

  update: adminProcedure
    .input(productUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(products)
        .set(data)
        .where(eq(products.id, id))
        .returning();

      if (!updated) {
        throw new Error('Product not found');
      }

      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(products)
        .where(eq(products.id, input.id))
        .returning();

      if (!deleted) {
        throw new Error('Product not found');
      }

      return deleted;
    }),
});