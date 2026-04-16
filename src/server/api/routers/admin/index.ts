import { createTRPCRouter } from '~/server/api/trpc';
import { productRouter } from './product';
import { categoryRouter } from './category';
import { seriesRouter } from './series';
import { inquiryRouter } from './inquiry';
import { settingsRouter } from './settings';
import { dashboardRouter } from './dashboard';

export const adminRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  series: seriesRouter,
  inquiry: inquiryRouter,
  settings: settingsRouter,
  dashboard: dashboardRouter,
});