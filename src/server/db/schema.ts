import { relations, sql } from 'drizzle-orm';
import { index, sqliteTable } from 'drizzle-orm/sqlite-core';

// Better Auth core tables
export const user = sqliteTable('user', (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull().unique(),
  emailVerified: d.integer({ mode: 'boolean' }).default(false),
  image: d.text({ length: 255 }),
  role: d.text({ length: 50 }).default('user').notNull(),
  banned: d.integer({ mode: 'boolean' }).default(false).notNull(),
  banReason: d.text(),
  banExpires: d.integer({ mode: 'timestamp' }),
  createdAt: d
    .integer({ mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
}));

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
}));

export const account = sqliteTable(
  'account',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id),
    accountId: d.text({ length: 255 }).notNull(),
    providerId: d.text({ length: 255 }).notNull(),
    accessToken: d.text(),
    refreshToken: d.text(),
    accessTokenExpiresAt: d.integer({ mode: 'timestamp' }),
    refreshTokenExpiresAt: d.integer({ mode: 'timestamp' }),
    scope: d.text({ length: 255 }),
    idToken: d.text(),
    password: d.text(),
    createdAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  }),
  (t) => [index('account_user_id_idx').on(t.userId)],
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const session = sqliteTable(
  'session',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id),
    token: d.text({ length: 255 }).notNull().unique(),
    expiresAt: d.integer({ mode: 'timestamp' }).notNull(),
    ipAddress: d.text({ length: 255 }),
    userAgent: d.text({ length: 255 }),
    impersonatedBy: d.text({ length: 255 }),
    createdAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  }),
  (t) => [index('session_user_id_idx').on(t.userId)],
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const verification = sqliteTable(
  'verification',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: d.text({ length: 255 }).notNull(),
    value: d.text({ length: 255 }).notNull(),
    expiresAt: d.integer({ mode: 'timestamp' }).notNull(),
    createdAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  }),
  (t) => [index('verification_identifier_idx').on(t.identifier)],
);


// PowerPlaza product catalog tables
export const categories = sqliteTable('category', (d) => ({
  id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }).notNull(),
  nameEn: d.text({ length: 255 }).notNull(),
  slug: d.text({ length: 255 }).notNull().unique(),
  description: d.text(),
  descriptionEn: d.text(),
  imageUrl: d.text(),
  sortOrder: d.integer().default(0).notNull(),
  createdAt: d.integer({ mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
}));

export const productSeries = sqliteTable('product_series', (d) => ({
  id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  categoryId: d.text({ length: 255 }).notNull().references(() => categories.id),
  name: d.text({ length: 255 }).notNull(),
  slug: d.text({ length: 255 }).notNull().unique(),
  description: d.text(),
  descriptionEn: d.text(),
  features: d.text({ mode: 'json' }).$type<string[]>().default([]),
  featuresEn: d.text({ mode: 'json' }).$type<string[]>().default([]),
  imageUrl: d.text(),
  sortOrder: d.integer().default(0).notNull(),
  createdAt: d.integer({ mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
}));

export const products = sqliteTable('product', (d) => ({
  id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  seriesId: d.text({ length: 255 }).notNull().references(() => productSeries.id),
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
  specsEn: d.text({ mode: 'json' }).$type<Record<string, string>>().default({}),
  createdAt: d.integer({ mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
}));

export const quoteInquiries = sqliteTable('quote_inquiry', (d) => ({
  id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerName: d.text({ length: 255 }).notNull(),
  companyName: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull(),
  phone: d.text({ length: 255 }),
  message: d.text(),
  status: d.text({ length: 50 }).default('pending').notNull(),
  adminNote: d.text(),
  createdAt: d.integer({ mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: d.integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
}));

export const quoteInquiryItems = sqliteTable('quote_inquiry_item', (d) => ({
  id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  inquiryId: d.text({ length: 255 }).notNull().references(() => quoteInquiries.id),
  productId: d.text({ length: 255 }).notNull().references(() => products.id),
  quantity: d.integer().default(1).notNull(),
  note: d.text(),
}));

export const adminSettings = sqliteTable('admin_setting', (d) => ({
  key: d.text({ length: 255 }).notNull().primaryKey(),
  value: d.text().notNull(),
}));

// Relations for PowerPlaza product catalog
export const categoryRelations = relations(categories, ({ many }) => ({
  series: many(productSeries),
}));

export const productSeriesRelations = relations(productSeries, ({ one, many }) => ({
  category: one(categories, { fields: [productSeries.categoryId], references: [categories.id] }),
  products: many(products),
}));

export const productRelations = relations(products, ({ one }) => ({
  series: one(productSeries, { fields: [products.seriesId], references: [productSeries.id] }),
}));

export const quoteInquiryRelations = relations(quoteInquiries, ({ many }) => ({
  items: many(quoteInquiryItems),
}));

export const quoteInquiryItemRelations = relations(quoteInquiryItems, ({ one }) => ({
  inquiry: one(quoteInquiries, { fields: [quoteInquiryItems.inquiryId], references: [quoteInquiries.id] }),
  product: one(products, { fields: [quoteInquiryItems.productId], references: [products.id] }),
}));