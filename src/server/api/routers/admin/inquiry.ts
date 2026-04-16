import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { quoteInquiries } from '~/server/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { z } from 'zod';

export const inquiryRouter = createTRPCRouter({
  list: adminProcedure
    .input(z.object({
      status: z.string().optional(),
      page: z.number().int().positive().default(1),
      limit: z.number().int().positive().max(100).default(20),
    }))
    .query(async ({ input }) => {
      const { status, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = status
        ? [eq(quoteInquiries.status, status)]
        : [];

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, totalResult] = await Promise.all([
        db.query.quoteInquiries.findMany({
          where,
          with: { items: true },
          limit,
          offset,
          orderBy: [desc(quoteInquiries.createdAt)],
        }),
        db
          .select({ count: sql<number>`count(*)` })
          .from(quoteInquiries)
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

  get: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      const inquiry = await db.query.quoteInquiries.findFirst({
        where: eq(quoteInquiries.id, input.id),
        with: {
          items: {
            with: { product: true },
          },
        },
      });

      if (!inquiry) {
        throw new Error('Inquiry not found');
      }

      return inquiry;
    }),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.string().min(1),
      status: z.enum(['pending', 'reviewed', 'quoted', 'closed']),
    }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(quoteInquiries)
        .set({ status: input.status })
        .where(eq(quoteInquiries.id, input.id))
        .returning();

      if (!updated) {
        throw new Error('Inquiry not found');
      }

      return updated;
    }),

  addNote: adminProcedure
    .input(z.object({
      id: z.string().min(1),
      adminNote: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(quoteInquiries)
        .set({ adminNote: input.adminNote })
        .where(eq(quoteInquiries.id, input.id))
        .returning();

      if (!updated) {
        throw new Error('Inquiry not found');
      }

      return updated;
    }),
});