import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { categories } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const categoryCreateSchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

const categoryUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

export const categoryRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return db.query.categories.findMany({
      with: { series: true },
      orderBy: [sql`${categories.sortOrder} ASC`],
    });
  }),

  create: adminProcedure
    .input(categoryCreateSchema)
    .mutation(async ({ input }) => {
      const [category] = await db.insert(categories).values(input).returning();
      return category;
    }),

  update: adminProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(categories)
        .set(data)
        .where(eq(categories.id, id))
        .returning();

      if (!updated) {
        throw new Error('Category not found');
      }

      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning();

      if (!deleted) {
        throw new Error('Category not found');
      }

      return deleted;
    }),
});