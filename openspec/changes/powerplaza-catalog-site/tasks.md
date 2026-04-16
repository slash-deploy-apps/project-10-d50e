# Tasks: PowerPlaza Product Catalog Site

## Phase 1: Foundation

- [ ] **T1.1** DB Schema: Create `categories`, `productSeries`, `products`, `quoteInquiries`, `quoteInquiryItems`, `adminSettings` tables in `src/server/db/schema.ts`. Remove old `todos` table. Run `drizzle-kit generate` and `drizzle-kit migrate`.
  - Files: `src/server/db/schema.ts`, `drizzle.config.ts`
- [ ] **T1.2** i18n Setup: Install `next-intl`, configure middleware for `/ko` and `/en` locale prefixes, create message files `messages/ko.json` and `messages/en.json` with base UI strings, update `next.config.js`.
  - Files: `src/middleware.ts`, `messages/`, `next.config.js`, `src/i18n/`, `src/app/[locale]/layout.tsx`
- [ ] **T1.3** Auth & Admin Seed: Update better-auth config. Create admin seed script that creates an initial admin user (admin@powerplaza.com / admin1234) on first DB migration. Add admin role check to protectedProcedure.
  - Files: `src/server/better-auth/config.ts`, `src/server/db/seed.ts`, `src/server/api/trpc.ts`

## Phase 2: tRPC API

- [ ] **T2.1** Public Routers: Create `category`, `product`, `inquiry` routers. category.list, product.list (paginated, filterable by category/series), product.getBySlug, product.search, inquiry.create.
  - Files: `src/server/api/routers/category.ts`, `src/server/api/routers/product.ts`, `src/server/api/routers/inquiry.ts`, `src/server/api/root.ts`
- [ ] **T2.2** Admin Routers: Create admin sub-routers for product CRUD, category CRUD, series CRUD, inquiry management, settings, dashboard stats. All use protectedProcedure.
  - Files: `src/server/api/routers/admin/`, `src/server/api/root.ts`

## Phase 3: Public Pages (UI)

- [ ] **T3.1** Layout & Navigation: Create site header with nav (Home, Products, DC-DC, AC-DC, EV, Quote), language switcher, footer with company info placeholder. Responsive mobile menu.
  - Files: `src/app/[locale]/layout.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/language-switcher.tsx`
- [ ] **T3.2** Main Page: Hero banner introducing PowerPlaza, 3 category cards linking to product lists, featured products section.
  - Files: `src/app/[locale]/page.tsx`, `src/components/main-hero.tsx`, `src/components/category-grid.tsx`
- [ ] **T3.3** Product List Pages: Category page showing series list. Series page showing products in table/grid view with specs. Pagination. Filtering.
  - Files: `src/app/[locale]/products/page.tsx`, `src/app/[locale]/products/[categorySlug]/page.tsx`, `src/app/[locale]/products/[categorySlug]/[seriesSlug]/page.tsx`, `src/components/product-card.tsx`, `src/components/product-table.tsx`
- [ ] **T3.4** Product Detail Page: Product image, model name, series info, spec table (Vin, Vout, Iout, etc), certifications badges, price, datasheet download link, "견적 문의" CTA button.
  - Files: `src/app/[locale]/products/[categorySlug]/[seriesSlug]/[productSlug]/page.tsx`, `src/components/product-detail.tsx`
- [ ] **T3.5** Quote Inquiry Page: Form with product selector (add multiple products with quantities), customer info fields (name, company, email, phone, message). Form validation with zod. Success confirmation.
  - Files: `src/app/[locale]/quote/page.tsx`, `src/components/quote-form.tsx`

## Phase 4: Admin Panel

- [ ] **T4.1** Admin Login Page: Email/password login form using better-auth. Redirect to dashboard after login.
  - Files: `src/app/admin/login/page.tsx`
- [ ] **T4.2** Admin Layout & Dashboard: Admin sidebar nav, dashboard page with stats (total products, total inquiries, recent inquiries, inquiries by status).
  - Files: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/components/admin/sidebar.tsx`, `src/components/admin/dashboard-stats.tsx`
- [ ] **T4.3** Admin Product Management: Product list with search/filter, add/edit product form (model name, series, specs, image URL, price, certifications, datasheet URL), delete with confirmation.
  - Files: `src/app/admin/products/`, `src/components/admin/product-form.tsx`
- [ ] **T4.4** Admin Category & Series Management: CRUD for categories and series with name (ko/en), slug, description, features, image, sort order.
  - Files: `src/app/admin/categories/`, `src/components/admin/category-form.tsx`, `src/components/admin/series-form.tsx`
- [ ] **T4.5** Admin Inquiry Management: Inquiry list with status filter, detail view showing customer info + products + quantities, status update (pending/reviewed/replied/closed), admin note.
  - Files: `src/app/admin/inquiries/`, `src/components/admin/inquiry-detail.tsx`
- [ ] **T4.6** Admin Settings: Notification email address setting, company info for footer.
  - Files: `src/app/admin/settings/page.tsx`

## Phase 5: Data & Polish

- [ ] **T5.1** Seed Script: Create comprehensive seed data with all PowerPlaza products. 3 categories, 34 series, 100+ products with real specs and image URLs from powerplaza.net.
  - Files: `src/server/db/seed.ts`
- [ ] **T5.2** Email Notification: Setup email sending for new quote inquiries. Use Resend or nodemailer. Send to admin notification email from settings.
  - Files: `src/lib/email.ts`, update `inquiry.create` router
- [ ] **T5.3** Responsive Design & Polish: Ensure all pages work on mobile. Dark/light mode support. Loading states. Error states.
  - Files: various component files
