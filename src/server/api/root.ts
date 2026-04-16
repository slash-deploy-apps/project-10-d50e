import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { categoryRouter } from './routers/category';
import { productRouter } from './routers/product';
import { inquiryRouter } from './routers/inquiry';
import { adminRouter } from './routers/admin';

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  product: productRouter,
  inquiry: inquiryRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);