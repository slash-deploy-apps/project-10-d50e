---
created: 2026-04-10T00:00:00Z
last_updated: 2026-04-10T00:00:00Z
type: spec
change_id: powerplaza-catalog-site
status: pending
trigger: 'Rewrite Todo boilerplate to PowerPlaza product catalog & quote inquiry site'
---

# Plan: PowerPlaza Product Catalog Site

## Background & Research

### Research Files

- `.slash/workspace/research/spec-powerplaza-catalog-site-next-intl-v4.md` — next-intl v4 + Next.js 15 App Router setup patterns
- `.slash/workspace/research/spec-powerplaza-catalog-site-auth-drizzle.md` — better-auth admin role + Drizzle ORM SQLite patterns

### Current Codebase State

- **Stack**: Next.js 15 (App Router), tRPC v11, better-auth v1.3, Drizzle ORM, Turso/SQLite, Tailwind CSS v4, shadcn/ui (radix-nova style)
- **DB**: `src/server/db/schema.ts` has 5 tables: `todos` (to remove), `user`, `account`, `session`, `verification` (keep these 4)
- **Auth**: better-auth configured with email/password + optional GitHub OAuth in `src/server/better-auth/config.ts`
- **tRPC**: `publicProcedure` and `protectedProcedure` defined in `src/server/api/trpc.ts`; single `todoRouter` in root
- **i18n**: `next-intl@^4.9.0` installed but NOT configured (no middleware, no [locale] dir, no messages)
- **UI**: 62 shadcn components installed; no custom app components except `todo-list.tsx` (to remove)
- **CSS**: `src/styles/globals.css` has default shadcn neutral palette (needs PowerPlaza Navy/Steel Blue palette)

### Key Existing Code Snippets

**`src/server/db/schema.ts`** — Current schema (lines 1-115):

```ts
import { relations, sql } from 'drizzle-orm';
import { index, sqliteTable } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todo', (d) => ({
  id: d.integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  text: d.text({ length: 256 }).notNull(),
  completed: d.integer({ mode: 'number' }).default(0).notNull(),
  createdAt: d
    .integer({ mode: 'number' })
    .default(sql`(unixepoch())`)
    .notNull(),
}));
// Better Auth core tables: user, account, session, verification (keep as-is)
```

**`src/server/api/trpc.ts`** — Context & procedures (lines 1-135):

```ts
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers: opts.headers });
  return { db, session, ...opts };
};
export const publicProcedure = t.procedure.use(timingMiddleware);
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next({
      ctx: { session: { ...ctx.session, user: ctx.session.user } },
    });
  });
```

**`src/server/better-auth/config.ts`** — Auth config (lines 1-28):

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  // GitHub OAuth conditional...
});
export type Session = typeof auth.$Infer.Session;
```

**`src/server/api/root.ts`** — Router root (lines 1-24):

```ts
export const appRouter = createTRPCRouter({ todo: todoRouter });
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
```

**`src/app/layout.tsx`** — Root layout (lines 1-30):

```ts
import { TRPCReactProvider } from '~/trpc/react';
const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body><TRPCReactProvider>{children}</TRPCReactProvider></body>
    </html>
  );
}
```

**`drizzle.config.ts`** (lines 1-14):

```ts
export default {
  schema: './src/server/db/schema.ts',
  dialect: 'turso',
  dbCredentials: { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN },
  tablesFilter: ['nextjs-trpc-shadcn-better-sqlite-better-auth-boilerplate_*'],
} satisfies Config;
```

### Design System Key Values (from `.slash/workspace/design/system.md`)

- **Colors**: Navy `#0F172A` primary, Steel Blue `#0369A1` accent, Slate `#334155` subdued, Emerald `#059669` success, Amber `#D97706` warning
- **Typography**: Geist Sans body, Geist Mono for model names/specs
- **Style**: Trust & Authority, data-dense, professional
- **Cert badges**: CE/UL/RoHS/CB/EMC/TUV — 24x24 SVG + label
- **i18n**: next-intl with /ko (default) and /en URL prefixes

### next-intl v4 Setup Pattern (from research)

```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  localePrefix: 'always',
});

// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = hasLocale(routing.locales, await requestLocale) ? await requestLocale : routing.defaultLocale;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});

// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
export default createMiddleware(routing);
export const config = { matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)' };

// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
```

### better-auth Admin Role Pattern (from research)

```ts
// In better-auth config: add admin() plugin + role field
import { admin } from 'better-auth/plugins';
export const auth = betterAuth({
  // ...existing config...
  user: {
    additionalFields: { role: { type: 'string', defaultValue: 'user' } },
  },
  plugins: [admin()],
});

// In tRPC: adminProcedure
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin')
    throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx: { session: ctx.session } });
});
```

### Drizzle SQLite Table Pattern (from research)

```ts
// Text PK with UUID
id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
// JSON column
certifications: d.text({ mode: 'json' }).$type<string[]>().default([]),
// Foreign key
categoryId: d.text({ length: 255 }).notNull().references(() => categories.id),
```

---

## Testing Plan (TDD — tests first)

### Schema & Migration Tests

- [ ] Write test for DB schema: verify all new tables (categories, productSeries, products, quoteInquiries, quoteInquiryItems, adminSettings) exist with correct columns
- [ ] Write test for DB schema: verify todos table is removed (query should fail)
- [ ] Write test for relations: categories→productSeries, productSeries→products, quoteInquiries→quoteInquiryItems

### tRPC Router Tests

- [ ] Write test for `category.list` — returns categories with series
- [ ] Write test for `product.list` — pagination, filtering by categorySlug and seriesSlug
- [ ] Write test for `product.getBySlug` — returns product with series/category info
- [ ] Write test for `product.search` — search by modelName
- [ ] Write test for `inquiry.create` — validates input, creates inquiry + items
- [ ] Write test for `admin.product.create/update/delete` — CRUD operations
- [ ] Write test for `admin.category.create/update/delete` — CRUD operations
- [ ] Write test for `admin.series.create/update/delete` — CRUD operations
- [ ] Write test for `admin.inquiry.list/get/updateStatus/addNote` — inquiry management
- [ ] Write test for `admin.settings.get/set` — settings management
- [ ] Write test for `admin.dashboard` — returns stats (totalProducts, totalInquiries, recentInquiries, inquiriesByStatus)
- [ ] Write test for `adminProcedure` — rejects non-admin users with FORBIDDEN

### i18n Tests

- [ ] Write test verifying `/ko` and `/en` routes render correctly
- [ ] Write test verifying language switcher changes URL prefix

### Auth Tests

- [ ] Write test for admin login flow (email/password)
- [ ] Write test for admin seed script (creates admin user with role='admin')
- [ ] Write test for protected admin routes (rejects unauthenticated)

### Page/Component Tests

- [ ] Write test for main page: renders hero, category grid, featured products
- [ ] Write test for product list page: renders category/series info and product table
- [ ] Write test for product detail page: renders model name, specs, certifications, CTA
- [ ] Write test for quote inquiry page: form validation, product selection, submission
- [ ] Write test for admin dashboard: renders KPI cards and recent inquiries
- [ ] Write test for admin product management: renders table and CRUD dialog
- [ ] Write test for admin inquiry management: renders list and detail dialog

---

## Implementation Plan

### Phase 1: Foundation

#### T1.1 — DB Schema

- [ ] Remove `todos` table and its import from `src/server/db/schema.ts`
- [ ] Add `categories` table to `src/server/db/schema.ts`:
  ```ts
  export const categories = sqliteTable('category', (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.text({ length: 255 }).notNull(),
    nameEn: d.text({ length: 255 }).notNull(),
    slug: d.text({ length: 255 }).notNull().unique(),
    description: d.text(),
    descriptionEn: d.text(),
    imageUrl: d.text(),
    sortOrder: d.integer().default(0).notNull(),
    createdAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  }));
  ```
- [ ] Add `productSeries` table to `src/server/db/schema.ts`:
  ```ts
  export const productSeries = sqliteTable('product_series', (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    categoryId: d
      .text({ length: 255 })
      .notNull()
      .references(() => categories.id),
    name: d.text({ length: 255 }).notNull(),
    slug: d.text({ length: 255 }).notNull().unique(),
    description: d.text(),
    descriptionEn: d.text(),
    features: d.text({ mode: 'json' }).$type<string[]>().default([]),
    featuresEn: d.text({ mode: 'json' }).$type<string[]>().default([]),
    imageUrl: d.text(),
    sortOrder: d.integer().default(0).notNull(),
    createdAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  }));
  ```
- [ ] Add `products` table to `src/server/db/schema.ts`:
  ```ts
  export const products = sqliteTable('product', (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    seriesId: d
      .text({ length: 255 })
      .notNull()
      .references(() => productSeries.id),
    modelName: d.text({ length: 255 }).notNull(),
    slug: d.text({ length: 255 }).notNull().unique(),
    imageUrl: d.text(),
    inputVoltage: d.text(),
    outputVoltage: d.text(),
    outputCurrent: d.text(),
    outputType: d.text(),
    price: d.integer(),
    priceNote: d.text(),
    datasheetUrl: d.text(),
    certifications: d.text({ mode: 'json' }).$type<string[]>().default([]),
    status: d.text({ length: 50 }).default('active').notNull(),
    specs: d.text({ mode: 'json' }).$type<Record<string, string>>().default({}),
    specsEn: d
      .text({ mode: 'json' })
      .$type<Record<string, string>>()
      .default({}),
    createdAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  }));
  ```
- [ ] Add `quoteInquiries` table to `src/server/db/schema.ts`
- [ ] Add `quoteInquiryItems` table to `src/server/db/schema.ts`
- [ ] Add `adminSettings` table to `src/server/db/schema.ts`
- [ ] Add Drizzle relations for all new tables: `categoryRelations`, `productSeriesRelations`, `productRelations`, `quoteInquiryRelations`, `quoteInquiryItemRelations`
- [ ] Update `drizzle.config.ts`: remove `tablesFilter` boilerplate prefix
- [ ] Run `npm run db:generate` to generate migration files
- [ ] Run `npm run db:push` to apply schema to local SQLite

#### T1.2 — i18n Setup

- [ ] Create `src/i18n/routing.ts` with `defineRouting({ locales: ['ko', 'en'], defaultLocale: 'ko', localePrefix: 'always' })`
- [ ] Create `src/i18n/request.ts` with `getRequestConfig` that loads messages based on locale
- [ ] Create `src/i18n/navigation.ts` with `createNavigation` exports (Link, redirect, usePathname, useRouter)
- [ ] Update `next.config.js`: import `createNextIntlPlugin` from `next-intl/plugin`, wrap config with `withNextIntl()`
- [ ] Create `src/middleware.ts` with next-intl middleware using `createMiddleware(routing)`, matcher excludes `/api`, `/admin`, `/_next`, static files
- [ ] Create `messages/ko.json` with base UI strings for: Home, Products, Quote, Common, Admin sections
- [ ] Create `messages/en.json` with matching English strings
- [ ] Move `src/app/page.tsx` → `src/app/[locale]/page.tsx` (replace Todo with landing page stub)
- [ ] Create `src/app/[locale]/layout.tsx` wrapping children with `NextIntlClientProvider`, `setRequestLocale`, `ThemeProvider` (next-themes)
- [ ] Update `src/app/layout.tsx` to be minimal root layout (just html + body, providers moved to [locale] layout)
- [ ] Delete old `src/app/_components/todo-list.tsx`
- [ ] Verify `/ko` and `/en` routes render correctly with `npm run dev`

#### T1.3 — Auth & Admin Seed

- [ ] Add `role` field to user table in `src/server/db/schema.ts`: `role: d.text({ length: 50 }).default('user').notNull()`
- [ ] Update `src/server/better-auth/config.ts`: add `user: { additionalFields: { role: { type: 'string', defaultValue: 'user', input: false } } }` and `plugins: [admin()]`
- [ ] Install better-auth admin plugin: verify `admin` export from `better-auth/plugins` is available
- [ ] Add `adminProcedure` to `src/server/api/trpc.ts`: extends `protectedProcedure` with role check (`ctx.session.user.role !== 'admin'` → FORBIDDEN)
- [ ] Create `src/server/db/seed-admin.ts`: script to upsert admin user (admin@powerplaza.com / admin1234) with role='admin' using `auth.api.createUser()` or direct DB insert
- [ ] Add `db:seed` script to `package.json`: `"db:seed": "npx tsx src/server/db/seed-admin.ts"`
- [ ] Run `npm run db:seed` to create admin user
- [ ] Verify admin login works at `/api/auth/sign-in` with admin credentials

### Phase 2: tRPC API

#### T2.1 — Public Routers

- [ ] Create `src/server/api/routers/category.ts`:
  - `category.list` → returns all categories with their series (using db.query with `with`)
- [ ] Create `src/server/api/routers/product.ts`:
  - `product.list({ categorySlug?, seriesSlug?, page?, limit? })` → paginated product list with category/series filters
  - `product.getBySlug({ slug })` → single product with series and category info
  - `product.search({ query })` → search products by modelName (ILIKE equivalent for SQLite: LIKE with %)
- [ ] Create `src/server/api/routers/inquiry.ts`:
  - `inquiry.create({ customerName, companyName, email, phone, message, items: [{ productId, quantity, note }] })` → creates inquiry + items, zod validation
- [ ] Update `src/server/api/root.ts`: replace `todo` router with `category`, `product`, `inquiry` routers
- [ ] Delete `src/server/api/routers/todo.ts`

#### T2.2 — Admin Routers

- [ ] Create `src/server/api/routers/admin/product.ts`:
  - `admin.product.list({ page?, limit?, search? })` — paginated, searchable
  - `admin.product.create({ seriesId, modelName, slug, imageUrl, inputVoltage, outputVoltage, outputCurrent, outputType, price, priceNote, datasheetUrl, certifications, status, specs, specsEn })` — zod validated
  - `admin.product.update({ id, ...partial fields })` — partial update
  - `admin.product.delete({ id })` — hard delete
- [ ] Create `src/server/api/routers/admin/category.ts`:
  - `admin.category.list()` — all categories
  - `admin.category.create({ name, nameEn, slug, description, descriptionEn, imageUrl, sortOrder })`
  - `admin.category.update({ id, ...partial })`
  - `admin.category.delete({ id })`
- [ ] Create `src/server/api/routers/admin/series.ts`:
  - `admin.series.list({ categoryId? })` — optionally filtered
  - `admin.series.create({ categoryId, name, slug, description, descriptionEn, features, featuresEn, imageUrl, sortOrder })`
  - `admin.series.update({ id, ...partial })`
  - `admin.series.delete({ id })`
- [ ] Create `src/server/api/routers/admin/inquiry.ts`:
  - `admin.inquiry.list({ status?, page?, limit? })` — filterable, paginated
  - `admin.inquiry.get({ id })` — with items and product details
  - `admin.inquiry.updateStatus({ id, status })` — status: pending/reviewed/replied/closed
  - `admin.inquiry.addNote({ id, adminNote })`
- [ ] Create `src/server/api/routers/admin/settings.ts`:
  - `admin.settings.get({ key })` — get single setting
  - `admin.settings.list()` — get all settings
  - `admin.settings.set({ key, value })` — upsert setting
- [ ] Create `src/server/api/routers/admin/dashboard.ts`:
  - `admin.dashboard.stats()` — returns { totalProducts, totalInquiries, pendingInquiries, thisWeekInquiries }
  - `admin.dashboard.recentInquiries({ limit? })` — last N inquiries with customer info
  - `admin.dashboard.inquiriesByStatus()` — count grouped by status
- [ ] Create `src/server/api/routers/admin/index.ts` — aggregator router combining all admin sub-routers
- [ ] Update `src/server/api/root.ts`: add `admin` router with `adminProcedure` protection
- [ ] Delete `src/app/_components/todo-list.tsx` if still present

### Phase 3: Public Pages (UI)

#### T3.1 — Layout & Navigation

- [ ] Update `src/styles/globals.css` with PowerPlaza design system colors (Navy/Steel Blue light+dark themes per design system doc)
- [ ] Add Geist Mono font to layout: import from `next/font/google`, add `--font-geist-mono` CSS variable
- [ ] Create `src/components/site-header.tsx`: sticky top nav with logo (POWERPLAZA text), nav links (Home, Products dropdown with DC-DC/AC-DC/EV, Quote), language switcher, theme toggle, admin link; mobile hamburger → Sheet sidebar
- [ ] Create `src/components/site-footer.tsx`: 4-column grid (company info, product categories, customer support, about), copyright, language selector; mobile stacked
- [ ] Create `src/components/language-switcher.tsx`: ghost button with KO | EN, active language underline, uses `useLocale` + `useRouter` from `src/i18n/navigation.ts`
- [ ] Create `src/components/theme-toggle.tsx`: ghost button with Sun/Moon Lucide icons, uses `next-themes` `useTheme`
- [ ] Update `src/app/[locale]/layout.tsx`: add SiteHeader and SiteFooter, ThemeProvider from next-themes, wrap with NextIntlClientProvider
- [ ] Verify responsive: test header mobile menu, footer stacking at small viewport

#### T3.2 — Main Page

- [ ] Create `src/components/main-hero.tsx`: gradient bg (navy→steel blue), headline ("신뢰성을 전원으로" / "Powering Reliability"), subheadline, 2 CTA buttons (제품 둘러보기 primary + 견적 문의 outline)
- [ ] Create `src/components/category-grid.tsx`: 3 cards (DC-DC / AC-DC / EV Component), each with image + name + description + product count + link; hover lift effect
- [ ] Create `src/components/featured-products.tsx`: 6-8 product cards from representative models per series
- [ ] Create `src/components/trust-section.tsx`: certification marks (CE/UL/RoHS/CB), company history brief, credibility indicators
- [ ] Implement `src/app/[locale]/page.tsx`: compose MainHero + CategoryGrid + FeaturedProducts + TrustSection
- [ ] Wire up tRPC queries: `api.category.list` for categories, `api.product.list` for featured products

#### T3.3 — Product List Pages

- [ ] Create `src/app/[locale]/products/page.tsx`: redirect to main or show all categories overview
- [ ] Create `src/app/[locale]/products/[categorySlug]/page.tsx`: breadcrumb, category hero (name+description+image), series cards grid (2x3), link to series pages
- [ ] Create `src/app/[locale]/products/[categorySlug]/[seriesSlug]/page.tsx`: breadcrumb, series hero (name+description+feature badges), product table with columns (modelName, inputVoltage, outputVoltage, outputCurrent, outputType, price, certifications, datasheet); row click → detail page; mobile overflow-x-auto
- [ ] Create `src/components/product-card.tsx`: compact card with image, modelName (font-mono), key spec, price, certification dots; hover lift
- [ ] Create `src/components/product-table.tsx`: data table using shadcn Table, specs columns, certification badge column, datasheet download icon; responsive wrapper
- [ ] Wire up tRPC: `api.category.list` for breadcrumb, `api.product.list({ categorySlug, seriesSlug })` for data
- [ ] Add pagination to product list using shadcn Pagination component

#### T3.4 — Product Detail Page

- [ ] Create `src/app/[locale]/products/[categorySlug]/[seriesSlug]/[productSlug]/page.tsx`: 2-column layout
- [ ] Create `src/components/product-detail.tsx`:
  - Left column: product image (large), datasheet download button overlay
  - Right column: modelName (h1, font-mono), series link, core specs table (Vin, Vout, Iout, outputType), price (large typography with priceNote), additional specs (specs/specsEn JSON key-value table)
  - Certification badges section: SVG icons + labels, active=primary color, inactive=gray-400
  - CTA: "견적 문의하기" accent button linking to `/[locale]/quote?product={slug}`
- [ ] Create `src/components/certification-badge.tsx`: reusable badge component (24x24 SVG + label), accepts `type` prop (ce/ul/rohs/cb/emc/tuv) and `active` boolean
- [ ] Wire up tRPC: `api.product.getBySlug({ slug })` for product data
- [ ] Generate metadata: model name as title, spec summary as description

#### T3.5 — Quote Inquiry Page

- [ ] Create `src/app/[locale]/quote/page.tsx`: 2-column layout
- [ ] Create `src/components/quote-form.tsx` (client component with `'use client'`):
  - Left: product selector — search/dropdown to add products, selected product list with model name + quantity input (-/+/number) + delete button
  - Right: customer info form — name, company name, email, phone, message (textarea)
  - Zod validation: email format, required fields, at least 1 product selected
  - Submit: calls `api.inquiry.create` mutation
  - Success state: confirmation message with inquiry ID, "다른 문의하기" button
  - Error state: form field error messages
- [ ] Support URL query param `?product={slug}` to pre-select a product (from product detail CTA)
- [ ] Wire up product search: `api.product.search` for product selector dropdown
- [ ] Wire up submission: `api.inquiry.create` mutation

### Phase 4: Admin Panel

#### T4.1 — Admin Login Page

- [ ] Create `src/app/admin/login/page.tsx`: centered card on dark bg, email+password fields, login button; uses `authClient.signIn.email()` from better-auth client
- [ ] Create `src/app/admin/layout.tsx`: minimal layout (no SiteHeader/Footer), check auth session — if authenticated redirect to `/admin`, otherwise render children
- [ ] Add admin auth check: redirect to `/admin/login` if not authenticated when accessing `/admin/*` routes
- [ ] Style: max-w-sm card, PowerPlaza logo top, clean minimal

#### T4.2 — Admin Layout & Dashboard

- [ ] Create `src/components/admin/sidebar.tsx`: shadcn Sidebar component with nav items (Dashboard, Products, Categories, Inquiries, Settings), collapsible, PowerPlaza logo, logout button
- [ ] Create `src/app/admin/layout.tsx` (update): add SidebarProvider + AdminSidebar, auth guard (redirect to login if no session)
- [ ] Create `src/app/admin/page.tsx`: dashboard page with 4 KPI cards + recent inquiries table + inquiries by status chart
- [ ] Create `src/components/admin/dashboard-stats.tsx`: 4 KPI cards (total products, total inquiries, pending inquiries, this week inquiries) using shadcn Card; icons from Lucide; hover lift
- [ ] Create `src/components/admin/recent-inquiries.tsx`: table of 5 most recent inquiries with customer name, company, date, status badge; link to detail
- [ ] Create `src/components/admin/inquiries-chart.tsx`: recharts PieChart showing inquiries by status (pending=amber, reviewed=blue, replied=green, closed=gray)
- [ ] Wire up tRPC: `api.admin.dashboard.stats()`, `api.admin.dashboard.recentInquiries()`, `api.admin.dashboard.inquiriesByStatus()`

#### T4.3 — Admin Product Management

- [ ] Create `src/app/admin/products/page.tsx`: search bar + category filter + product table + "Add Product" button
- [ ] Create `src/components/admin/product-form.tsx`: Dialog with form fields — modelName, seriesId (select), inputVoltage, outputVoltage, outputCurrent, outputType, price, priceNote, imageUrl, datasheetUrl, certifications (checkboxes: CE/UL/RoHS/CB/EMC/TUV), status (active/inactive select), specs JSON editor
- [ ] Create `src/components/admin/product-table.tsx`: shadcn DataTable — columns: modelName, series, category, price, status (badge), actions (edit/delete); search and filter controls; pagination
- [ ] Implement CRUD: add (dialog open → form submit → `api.admin.product.create`), edit (prefill form → `api.admin.product.update`), delete (confirm dialog → `api.admin.product.delete`)
- [ ] Wire up series dropdown: fetch from `api.admin.series.list` for form select

#### T4.4 — Admin Category & Series Management

- [ ] Create `src/app/admin/categories/page.tsx`: two sections — categories list + series list per selected category
- [ ] Create `src/components/admin/category-form.tsx`: Dialog with fields — name (ko), nameEn, slug (auto-generated from name), description, descriptionEn, imageUrl, sortOrder
- [ ] Create `src/components/admin/series-form.tsx`: Dialog with fields — categoryId (select), name, slug, description, descriptionEn, features (JSON tag input), featuresEn, imageUrl, sortOrder
- [ ] Implement category CRUD: list all, add/edit dialog, delete with confirmation
- [ ] Implement series CRUD: list by category, add/edit dialog, delete with confirmation (check if products exist)
- [ ] Create `src/components/admin/category-list.tsx`: card list of categories with edit/delete actions, expand to show series
- [ ] Create `src/components/admin/series-list.tsx`: table of series within selected category with edit/delete actions

#### T4.5 — Admin Inquiry Management

- [ ] Create `src/app/admin/inquiries/page.tsx`: status filter tabs (All/Pending/Reviewed/Replied/Closed) + inquiry table + detail dialog
- [ ] Create `src/components/admin/inquiry-table.tsx`: shadcn DataTable — columns: inquiry ID (short), customerName, companyName, createdAt, status (color badge), actions; sortable; pagination
- [ ] Create `src/components/admin/inquiry-detail.tsx`: Dialog/Sheet showing full inquiry — customer info section, product list (modelName + quantity + note per item), status update dropdown, adminNote textarea, save button
- [ ] Implement status update: `api.admin.inquiry.updateStatus({ id, status })`
- [ ] Implement admin note: `api.admin.inquiry.addNote({ id, adminNote })`
- [ ] Status badge colors: pending=amber, reviewed=blue, replied=green, closed=gray (using shadcn Badge variants)

#### T4.6 — Admin Settings

- [ ] Create `src/app/admin/settings/page.tsx`: simple form page
- [ ] Settings fields: notification email address (for inquiry alerts), company name (ko), company name (en), company address, company phone
- [ ] Load settings: `api.admin.settings.list()` on mount
- [ ] Save settings: `api.admin.settings.set({ key, value })` per field on submit
- [ ] Success toast on save using sonner

### Phase 5: Data & Polish

#### T5.1 — Seed Script

- [ ] Create `src/server/db/seed.ts`: comprehensive seed replacing seed-admin.ts
- [ ] Seed categories (3): DC-DC Converter (dc-dc), AC-DC Converter (ac-dc), EV Component (ev-component)
- [ ] Seed DC-DC series (21): SPS, SCS, SKM, SPD, SCE, SCP, SPM, SPR, SCR, SDR, SDW, SFW, SGW, SHN, SHR, SVN, SVR, SBL, SBP, SWD, etc.
- [ ] Seed AC-DC series (8): APS, APM, ACR, ADM, ADN, AMN, etc.
- [ ] Seed EV series (5): EVM, EVP, EVR, EVC, EVB, etc.
- [ ] Seed products: 3-5 representative products per series (100+ total) with realistic specs (input voltage, output voltage, output current, output type, price, certifications, datasheet URLs)
- [ ] Seed admin user: admin@powerplaza.com / admin1234 with role='admin'
- [ ] Seed admin settings: notification email, company info
- [ ] Use image URLs from powerplaza.net for products/series where available, placeholder images otherwise
- [ ] Update `package.json` db:seed script to point to new seed file
- [ ] Run `npm run db:seed` and verify data in db.sqlite

#### T5.2 — Email Notification

- [ ] Create `src/lib/email.ts`: email sending utility using Resend (preferred) or nodemailer as fallback
- [ ] Add `RESEND_API_KEY` to `.env.example` and `src/env.js` server env validation
- [ ] Create email template function `sendInquiryNotification(inquiry, items)` — sends to admin notification email from adminSettings
- [ ] Update `inquiry.create` router: after successful inquiry creation, call `sendInquiryNotification()` (fire-and-forget, don't block response)
- [ ] Add admin settings UI for notification email in T4.6 (already planned)
- [ ] Test email sending with Resend test mode or log output in dev

#### T5.3 — Responsive Design & Polish

- [ ] Audit all pages for mobile responsiveness: test at 320px, 768px, 1024px, 1440px breakpoints
- [ ] Fix product table mobile: add overflow-x-auto wrapper with min-width 640px, add card-view toggle option
- [ ] Fix admin tables mobile: horizontal scroll with sticky first column
- [ ] Add loading states: shadcn Skeleton components for all data-fetching pages (product list, product detail, admin tables)
- [ ] Add empty states: shadcn Empty component with icon + message + CTA for no products, no inquiries, etc.
- [ ] Add error states: friendly error display for failed tRPC calls with retry button
- [ ] Verify dark/light mode works on all pages (next-themes ThemeProvider already in layout)
- [ ] Add hover interactions: card lift (translate-y-[-1px] + shadow increase, 200ms ease-out), focus rings (ring-2 ring-accent)
- [ ] Add page transitions: subtle fade-in on page navigation
- [ ] Verify certification badges render correctly in both light and dark mode
- [ ] Final cross-browser check: Chrome, Firefox, Safari

---

## Parallelization Plan

### Batch 1 — Foundation (sequential within, parallel where possible)

- [ ] **Coder A**: T1.1 DB Schema — `src/server/db/schema.ts`, `drizzle.config.ts`, run migration
  - files: `src/server/db/schema.ts`, `drizzle.config.ts`

### Batch 2 — Foundation (parallel after Batch 1)

- [ ] **Coder A**: T1.2 i18n Setup — `src/i18n/*`, `src/middleware.ts`, `next.config.js`, `messages/*`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
  - files: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/middleware.ts`, `next.config.js`, `messages/ko.json`, `messages/en.json`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/layout.tsx`
- [ ] **Coder B**: T1.3 Auth & Admin — `src/server/better-auth/config.ts`, `src/server/api/trpc.ts`, `src/server/db/seed-admin.ts`, `package.json`
  - files: `src/server/better-auth/config.ts`, `src/server/api/trpc.ts`, `src/server/db/seed-admin.ts`, `package.json`

### Batch 3 — tRPC API (parallel after Batch 2)

- [ ] **Coder A**: T2.1 Public Routers — `src/server/api/routers/category.ts`, `src/server/api/routers/product.ts`, `src/server/api/routers/inquiry.ts`, `src/server/api/root.ts`
  - files: `src/server/api/routers/category.ts`, `src/server/api/routers/product.ts`, `src/server/api/routers/inquiry.ts`, `src/server/api/root.ts`
- [ ] **Coder B**: T2.2 Admin Routers — `src/server/api/routers/admin/*.ts`, `src/server/api/root.ts` (merge only after Coder A finishes root.ts)
  - files: `src/server/api/routers/admin/product.ts`, `src/server/api/routers/admin/category.ts`, `src/server/api/routers/admin/series.ts`, `src/server/api/routers/admin/inquiry.ts`, `src/server/api/routers/admin/settings.ts`, `src/server/api/routers/admin/dashboard.ts`, `src/server/api/routers/admin/index.ts`

### Batch 4 — Public Pages + Admin Pages (parallel, no shared files)

- [ ] **Coder A**: T3.1 Layout + T3.2 Main Page + T3.3 Product List
  - files: `src/styles/globals.css`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/language-switcher.tsx`, `src/components/theme-toggle.tsx`, `src/components/main-hero.tsx`, `src/components/category-grid.tsx`, `src/components/featured-products.tsx`, `src/components/trust-section.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/products/page.tsx`, `src/app/[locale]/products/[categorySlug]/page.tsx`, `src/app/[locale]/products/[categorySlug]/[seriesSlug]/page.tsx`, `src/components/product-card.tsx`, `src/components/product-table.tsx`
- [ ] **Coder B**: T4.1 Admin Login + T4.2 Dashboard + T4.3 Products + T4.4 Categories + T4.5 Inquiries + T4.6 Settings
  - files: `src/app/admin/login/page.tsx`, `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/components/admin/sidebar.tsx`, `src/components/admin/dashboard-stats.tsx`, `src/components/admin/recent-inquiries.tsx`, `src/components/admin/inquiries-chart.tsx`, `src/app/admin/products/page.tsx`, `src/components/admin/product-form.tsx`, `src/components/admin/product-table.tsx`, `src/app/admin/categories/page.tsx`, `src/components/admin/category-form.tsx`, `src/components/admin/series-form.tsx`, `src/components/admin/category-list.tsx`, `src/components/admin/series-list.tsx`, `src/app/admin/inquiries/page.tsx`, `src/components/admin/inquiry-table.tsx`, `src/components/admin/inquiry-detail.tsx`, `src/app/admin/settings/page.tsx`

### Batch 5 — Product Detail + Quote (parallel, after Batch 4 partially)

- [ ] **Coder A**: T3.4 Product Detail + T3.5 Quote Inquiry
  - files: `src/app/[locale]/products/[categorySlug]/[seriesSlug]/[productSlug]/page.tsx`, `src/components/product-detail.tsx`, `src/components/certification-badge.tsx`, `src/app/[locale]/quote/page.tsx`, `src/components/quote-form.tsx`

### Batch 6 — Data & Polish (after all UI batches)

- [ ] **Coder A**: T5.1 Seed Script
  - files: `src/server/db/seed.ts`, `package.json`
- [ ] **Coder B**: T5.2 Email Notification + T5.3 Responsive Polish
  - files: `src/lib/email.ts`, `src/env.js`, `.env.example`, various component touch-ups

### Dependencies

- **Batch 1 → Batch 2**: DB schema must exist before i18n/auth setup (schema changes affect migration)
- **Batch 2 → Batch 3**: i18n setup must be done before pages; auth/admin must be done before admin routers
- **Batch 3 → Batch 4**: tRPC routers must exist before pages can call them (though pages can be built with mock data initially)
- **Batch 4 → Batch 5**: Product list pages must exist before detail/quote pages (breadcrumb links, navigation)
- **Batch 5 → Batch 6**: All pages must be built before seed data and polish

### Risk Areas

- **`src/server/api/root.ts`**: Shared between Coder A (public routers) and Coder B (admin routers) in Batch 3 — Coder A writes first, Coder B merges after
- **`src/app/layout.tsx`**: Modified in T1.2 (i18n) — must not conflict with future layout changes
- **`src/styles/globals.css`**: Modified in T3.1 (PowerPlaza palette) — single writer only
- **`src/server/db/schema.ts`**: Modified in T1.1 and T1.3 — must be sequential (schema first, then role field)
- **`package.json`**: Modified in T1.3 and T5.1 — coordinate seed script additions
- **next-intl middleware**: The middleware matcher must exclude `/admin/*` routes since admin panel is not localized
- **better-auth admin plugin**: May require `npm install` if not included in base better-auth package

---

## Done Criteria

- [ ] All 19 OpenSpec tasks completed (T1.1–T5.3 checked in tasks.md)
- [ ] DB has 7 tables: categories, productSeries, products, quoteInquiries, quoteInquiryItems, adminSettings + 4 auth tables (no todos)
- [ ] `/ko` and `/en` routes render all public pages with correct translations
- [ ] Product catalog browsable: main → category → series → product detail
- [ ] Quote inquiry form submits successfully and saves to DB
- [ ] Admin login works with admin@powerplaza.com / admin1234
- [ ] Admin CRUD works for products, categories, series, inquiries
- [ ] Admin dashboard shows correct stats
- [ ] Seed script creates 3 categories, 34 series, 100+ products
- [ ] Dark/light mode works on all pages
- [ ] All pages responsive at 320px–1440px breakpoints
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run check` (lint + typecheck) passes
- [ ] All tRPC router tests pass
