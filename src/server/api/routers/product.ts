import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { products, productSeries, categories } from '~/server/db/schema';
import { eq, like, and, sql, desc, inArray } from 'drizzle-orm';
import { z } from 'zod';

const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const productRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      paginationSchema.extend({
        categorySlug: z.string().optional(),
        seriesSlug: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit, categorySlug, seriesSlug } = input;
      const offset = (page - 1) * limit;

      // Resolve series IDs from category/series slug filters
      let seriesIds: string[] | undefined;
      if (seriesSlug || categorySlug) {
        const seriesConditions = [];
        if (categorySlug) seriesConditions.push(eq(categories.slug, categorySlug));
        if (seriesSlug) seriesConditions.push(eq(productSeries.slug, seriesSlug));

        const matchingSeries = await db
          .select({ id: productSeries.id })
          .from(productSeries)
          .leftJoin(categories, eq(productSeries.categoryId, categories.id))
          .where(and(...seriesConditions));

        seriesIds = matchingSeries.map((s) => s.id);
        if (seriesIds.length === 0) {
          return { items: [], total: 0, page, limit, totalPages: 0 };
        }
      }

      const conditions = [eq(products.status, 'active')];
      if (seriesIds) {
        conditions.push(inArray(products.seriesId, seriesIds));
      }

      const where = and(...conditions);

      const [items, totalResult] = await Promise.all([
        db.query.products.findMany({
          where: where,
          with: {
            series: {
              with: { category: true },
            },
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

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: and(eq(products.slug, input.slug), eq(products.status, 'active')),
        with: {
          series: {
            with: { category: true },
          },
        },
      });

      if (!product) {
        return null;
      }

      return product;
    }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      return db.query.products.findMany({
        where: and(
          like(products.modelName, `%${input.query}%`),
          eq(products.status, 'active'),
        ),
        with: {
          series: {
            with: { category: true },
          },
        },
        limit: 20,
      });
    }),
});