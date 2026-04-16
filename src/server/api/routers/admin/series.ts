import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { productSeries } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const seriesCreateSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  features: z.array(z.string()).optional(),
  featuresEn: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

const seriesUpdateSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  features: z.array(z.string()).nullable().optional(),
  featuresEn: z.array(z.string()).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

export const seriesRouter = createTRPCRouter({
  list: adminProcedure
    .input(z.object({ categoryId: z.string().optional() }))
    .query(async ({ input }) => {
      const where = input.categoryId
        ? eq(productSeries.categoryId, input.categoryId)
        : undefined;

      return db.query.productSeries.findMany({
        where,
        with: { category: true },
        orderBy: [sql`${productSeries.sortOrder} ASC`],
      });
    }),

  create: adminProcedure
    .input(seriesCreateSchema)
    .mutation(async ({ input }) => {
      const [series] = await db.insert(productSeries).values(input).returning();
      return series;
    }),

  update: adminProcedure
    .input(seriesUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(productSeries)
        .set(data)
        .where(eq(productSeries.id, id))
        .returning();

      if (!updated) {
        throw new Error('Series not found');
      }

      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(productSeries)
        .where(eq(productSeries.id, input.id))
        .returning();

      if (!deleted) {
        throw new Error('Series not found');
      }

      return deleted;
    }),
});