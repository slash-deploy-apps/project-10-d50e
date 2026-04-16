import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { categories } from '~/server/db/schema';
import { sql } from 'drizzle-orm';

export const categoryRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const result = await db.query.categories.findMany({
      with: {
        series: {
          with: {
            products: {
              columns: { id: true },
            },
          },
        },
      },
      orderBy: [sql`${categories.sortOrder} ASC`],
    });

    return result.map((cat) => ({
      ...cat,
      seriesCount: cat.series.length,
      productCount: cat.series.reduce((sum, s) => sum + s.products.length, 0),
    }));
  }),
});