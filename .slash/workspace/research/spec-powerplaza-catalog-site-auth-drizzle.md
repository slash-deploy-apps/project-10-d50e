# Research: PowerPlaza Auth & Drizzle Implementation Patterns

**Date**: 2026-04-10

---

## Summary

This document covers two technical topics for the PowerPlaza project: (1) Setting up better-auth with admin roles and RBAC, and (2) Drizzle ORM patterns for SQLite with text primary keys and JSON columns.

---

## Topic 1: better-auth Admin Role Setup

### 1.1 Adding a Custom "role" Field to the User Table

Use the `additionalFields` property in the user configuration to extend the user schema:

```typescript
// auth.ts
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'customer',
        input: false, // Don't allow users to set their own role
      },
    },
  },
});
```

**Key properties for `additionalFields`**:

- `type`: The data type (`"string"`, `"number"`, `"boolean"`, `"date"`, `"string[]"`, `"number[]"`)
- `required`: Whether the field is mandatory
- `defaultValue`: Default value for new users
- `input`: Whether users can provide this value during signup (set `false` for admin-controlled fields like role)

After updating the config, run the better-auth CLI to generate migrations:

```bash
npx auth generate
npx auth migrate
```

For the client to infer the additional fields, add the `inferAdditionalFields` plugin:

```typescript
// auth-client.ts
import { createAuthClient } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields()],
});
```

### 1.2 Adding Admin Plugin & Custom Role Check

The admin plugin adds role-based access control and admin endpoints:

```typescript
// auth.ts
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  plugins: [
    admin({
      // Default role for new users (default: "user")
      defaultRole: 'customer',
      // Roles considered as admin (default: ["admin"])
      adminRoles: ['admin'],
      // Static list of user IDs that bypass permission checks
      adminUserIds: ['usr_initial-admin-id'],
      // Custom access control (optional - for advanced permissions)
      // ac: customAccessControl,
      // roles: { admin: {...}, manager: {...} },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'customer',
        input: false,
      },
    },
  },
});
```

On the client side, add the admin plugin:

```typescript
// auth-client.ts
import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields(), adminClient()],
});
```

The admin plugin automatically adds a `role` column to the `user` table.

### 1.3 Creating an Admin Guard in tRPC protectedProcedure

Create middleware that checks for admin role in your tRPC setup:

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

// Basic auth middleware - ensures user is logged in
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // TypeScript now knows user is guaranteed
    },
  });
});

// Admin guard middleware - checks for admin role
const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  // Check role from session user object
  const userRole = ctx.user.role;
  const isAdminRole =
    userRole === 'admin' ||
    (Array.isArray(userRole) && userRole.includes('admin'));

  if (!isAdminRole) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Export reusable procedures
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = protectedProcedure.use(isAdmin);
```

Usage in routers:

```typescript
// server/routers/admin.ts
import { router, adminProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const adminRouter = router({
  // Admin-only endpoint
  createProduct: adminProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        category: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can access this
      return ctx.db.insert(productsTable).values(input);
    }),

  // Regular protected endpoint
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(ordersTable);
  }),
});
```

### 1.4 Seeding an Admin User Programmatically

There are two main approaches:

**Approach 1: Using the Admin Plugin API (server-side)**

```typescript
// scripts/seed-admin.ts
import { auth } from '@/lib/auth'; // Your better-auth instance
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

async function seedAdmin() {
  try {
    // Create admin user via admin API
    const adminUser = await auth.api.createUser({
      headers: {
        /* admin auth headers */
      },
      body: {
        email: 'admin@powerplaza.com',
        password: 'SecureAdmin123!',
        name: 'PowerPlaza Admin',
        role: 'admin', // Set admin role directly
        data: {
          department: 'Management',
        },
      },
    });

    console.log('Admin user created:', adminUser.user.id);
  } catch (error) {
    console.error('Failed to create admin:', error);
  }
}

seedAdmin();
```

**Approach 2: Direct Database Insert (if admin plugin not enabled)**

```typescript
// scripts/seed-admin.ts
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'better-auth';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  const adminEmail = 'admin@powerplaza.com';

  // Check if admin already exists
  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  if (existingAdmin) {
    console.log('Admin already exists:', existingAdmin.id);
    return;
  }

  // Create admin user directly in DB
  const [adminUser] = await db
    .insert(users)
    .values({
      id: 'admin-' + crypto.randomUUID().slice(0, 12),
      name: 'PowerPlaza Admin',
      email: adminEmail,
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Additional fields from better-auth schema
      // Note: You may need to add role column to your users table
    })
    .returning();

  console.log('Admin user created:', adminUser.id);
}

seedAdmin();
```

---

## Topic 2: Drizzle ORM SQLite Schema Patterns

### 2.1 Creating Tables with Text PK using CUID (Not Auto-increment)

For text primary keys, use `text()` with `$defaultFn()` to generate CUIDs:

```typescript
// src/db/schema/users.ts
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  // Text primary key with auto-generated CUID
  id: text('id')
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
```

**Alternative using drizzle-cuid2 package** (for more collision-resistant IDs):

```typescript
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sqliteCuid2 } from 'drizzle-cuid2';

export const users = sqliteTable('users', {
  id: sqliteCuid2('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
});
```

Install `drizzle-cuid2`:

```bash
npm install drizzle-cuid2
```

### 2.2 Creating JSON Columns in SQLite (Text Column with JSON Type)

SQLite doesn't have native JSON columns, so use `text()` with `$type<T>()`:

```typescript
// src/db/schema/products.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id')
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  name: text('name').notNull(),
  price: integer('price').notNull(), // Store prices in cents

  // JSON column for flexible attributes
  metadata: text('metadata').$type<{
    sku?: string;
    barcode?: string;
    dimensions?: {
      width: number;
      height: number;
      depth: number;
    };
    tags?: string[];
  }>(),

  // Another JSON column for category-specific data
  categoryData: text('category_data').$type<Record<string, any>>(),
});

export type ProductMetadata = typeof products.metadata._infer;
```

**Usage in queries:**

```typescript
import { eq } from 'drizzle-orm';
import { products } from './schema';

// Insert with JSON data
await db.insert(products).values({
  name: 'Widget',
  price: 1999,
  metadata: {
    sku: 'WDG-001',
    dimensions: { width: 10, height: 5, depth: 2 },
    tags: ['sale', 'featured'],
  },
});

// Query JSON (note: SQLite JSON extraction is limited)
const result = await db.query.products.findFirst({
  where: eq(products.id, productId),
});

// Access typed JSON
console.log(result.metadata.sku);
```

### 2.3 Creating Foreign Key Relations

**Inline foreign key (recommended for simple cases):**

```typescript
// src/db/schema/orders.ts
import {
  sqliteTable,
  text,
  integer,
  foreignKey,
} from 'drizzle-orm/sqlite-core';
import { users, products } from './index';

export const orders = sqliteTable('orders', {
  id: text('id')
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  status: text('status').notNull().default('pending'),
  total: integer('total').notNull(), // In cents

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

// Define relations
import { relations } from 'drizzle-orm';

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));
```

**Composite foreign key with explicit constraint:**

```typescript
// src/db/schema/order-items.ts
import {
  sqliteTable,
  text,
  integer,
  foreignKey,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { orders, products } from './index';

export const orderItems = sqliteTable(
  'order_items',
  {
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),

    productId: text('product_id')
      .notNull()
      .references(() => products.id),

    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(),
  },
  (table) => ({
    // Composite primary key
    pk: primaryKey({ columns: [table.orderId, table.productId] }),

    // Explicit foreign key constraint with custom name
    orderFk: foreignKey({
      columns: [table.orderId],
      foreignColumns: [orders.id],
    }).onDelete('cascade'),
  }),
);
```

**Foreign key actions available:**

- `onDelete: "cascade"` - Delete related rows
- `onDelete: "restrict"` - Prevent deletion if related rows exist
- `onDelete: "set null"` - Set FK to NULL
- `onDelete: "set default"` - Set FK to default value

### 2.4 Using drizzle-kit Generate and Migrate for SQLite

**Step 1: Install dependencies**

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit
```

**Step 2: Configure drizzle.config.ts**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  db: {
    // For better-sqlite3
    url: process.env.DATABASE_URL || 'file:local.db',
  },
});
```

**Step 3: Common CLI commands**

```bash
# Generate SQL migration files (without pushing)
npx drizzle-kit generate

# Push schema changes directly to database (dev mode)
npx drizzle-kit push

# Open Drizzle Studio (visual database editor)
npx drizzle-kit studio

# Introspect existing database to generate schema
npx drizzle-kit introspect

# Apply pending migrations
npx drizzle-kit migrate
```

**Migration output location:** `./drizzle/` folder (configurable via `out`)

### 2.5 Pattern for Seed Scripts with Drizzle

**Basic seed script:**

```typescript
// scripts/seed.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, products, categories } from '../src/db/schema';

const sqlite = new Database(process.env.DATABASE_URL || 'file:local.db');
const db = drizzle(sqlite);

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed categories first
  const [electronics] = await db
    .insert(categories)
    .values({
      id: 'cat-electronics',
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      slug: 'electronics',
    })
    .returning();

  console.log('Created category:', electronics.id);

  // Seed products
  const [laptop] = await db
    .insert(products)
    .values({
      id: 'prod-laptop-001',
      name: 'Professional Laptop',
      description: 'High-performance laptop for professionals',
      price: 129900, // $1,299.00 in cents
      categoryId: electronics.id,
      stock: 50,
      metadata: {
        sku: 'LAP-PRO-001',
        tags: ['sale', 'featured'],
      },
    })
    .returning();

  console.log('Created product:', laptop.id);

  console.log('✅ Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => sqlite.close());
```

**Run the seed:**

```bash
npx tsx scripts/seed.ts
```

**Seed with better-auth user integration:**

```typescript
// scripts/seed.ts
import 'dotenv/config';
import { auth } from '../src/lib/auth';
import { db } from '../src/lib/db';
import { users, products } from '../src/db/schema';
import { hash } from 'better-auth';

async function seed() {
  console.log('🌱 Seeding database...');

  // Use better-auth API to create admin user
  // (requires admin plugin to be enabled)
  try {
    const admin = await auth.api.createUser({
      body: {
        email: 'admin@powerplaza.com',
        password: 'Admin123!',
        name: 'PowerPlaza Admin',
        role: 'admin',
      },
    });
    console.log('Admin user created:', admin.user.id);
  } catch (e: any) {
    // User might already exist
    if (e.code === 'USER_ALREADY_EXISTS') {
      console.log('Admin user already exists');
    } else {
      throw e;
    }
  }

  // Seed products directly
  await db.insert(products).values({
    id: 'prod-sample-001',
    name: 'Sample Product',
    price: 999,
    stock: 100,
  });

  console.log('✅ Seeding complete!');
}

seed().catch(console.error);
```

---

## Recommendations

1. **For better-auth**: Enable the admin plugin and use `additionalFields` for the role. Use the admin API for programmatic user creation rather than direct DB inserts when possible.

2. **For Drizzle + SQLite**: Use text primary keys with `crypto.randomUUID()` for uniqueness. JSON columns should use `text()` with `$type<T>()` for full TypeScript support.

3. **For migrations**: Use `drizzle-kit push` during development and `generate` + `migrate` for production deployments.

4. **For seed scripts**: Keep them idempotent (check for existing data before inserting) and use the proper ordering (parents before children).
