import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { adminSettings } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const settingsRouter = createTRPCRouter({
  get: adminProcedure
    .input(z.object({ key: z.string().min(1) }))
    .query(async ({ input }) => {
      const setting = await db.query.adminSettings.findFirst({
        where: eq(adminSettings.key, input.key),
      });
      return setting ?? null;
    }),

  list: adminProcedure.query(async () => {
    return db.query.adminSettings.findMany();
  }),

  set: adminProcedure
    .input(z.object({
      key: z.string().min(1),
      value: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const [upserted] = await db
        .insert(adminSettings)
        .values(input)
        .onConflictDoUpdate({
          target: adminSettings.key,
          set: { value: input.value },
        })
        .returning();

      return upserted;
    }),
});