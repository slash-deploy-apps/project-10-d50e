import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { products, quoteInquiries, categories } from '~/server/db/schema';
import { eq, sql, gte } from 'drizzle-orm';
import { z } from 'zod';

export const dashboardRouter = createTRPCRouter({
  stats: adminProcedure.query(async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [totalProductsResult, totalCategoriesResult, totalInquiriesResult, pendingInquiriesResult, thisWeekResult] =
      await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(products).then((r) => r[0]?.count ?? 0),
        db.select({ count: sql<number>`count(*)` }).from(categories).then((r) => r[0]?.count ?? 0),
        db.select({ count: sql<number>`count(*)` }).from(quoteInquiries).then((r) => r[0]?.count ?? 0),
        db.select({ count: sql<number>`count(*)` })
          .from(quoteInquiries)
          .where(eq(quoteInquiries.status, 'pending'))
          .then((r) => r[0]?.count ?? 0),
        db.select({ count: sql<number>`count(*)` })
          .from(quoteInquiries)
          .where(gte(quoteInquiries.createdAt, oneWeekAgo))
          .then((r) => r[0]?.count ?? 0),
      ]);

    return {
      totalProducts: totalProductsResult,
      totalCategories: totalCategoriesResult,
      totalInquiries: totalInquiriesResult,
      pendingInquiries: pendingInquiriesResult,
      thisWeekInquiries: thisWeekResult,
    };
  }),

  recentInquiries: adminProcedure
    .input(z.object({ limit: z.number().int().positive().max(50).default(10) }))
    .query(async ({ input }) => {
      return db.query.quoteInquiries.findMany({
        orderBy: [sql`${quoteInquiries.createdAt} DESC`],
        limit: input.limit,
      });
    }),

  inquiriesByStatus: adminProcedure.query(async () => {
    const results = await db
      .select({
        status: quoteInquiries.status,
        count: sql<number>`count(*)`,
      })
      .from(quoteInquiries)
      .groupBy(quoteInquiries.status);

    return results;
  }),
});