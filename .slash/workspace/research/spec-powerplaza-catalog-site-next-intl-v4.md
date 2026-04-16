# Research: next-intl v4 Setup with Next.js 15 App Router

**Date:** 2026-04-10

**Summary:** This document provides a complete configuration pattern for setting up next-intl v4 with Next.js 15 App Router for URL-prefix locale routing (e.g., `/ko`, `/en`). All code snippets are based on official next-intl documentation and represent the recommended pattern for production use.

---

## 1. next.config.js Configuration with createNextIntlPlugin()

**File:** `next.config.ts` (or `next.config.js`)

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
```

**Explanation:** The `createNextIntlPlugin()` function wraps your Next.js configuration and automatically links to your `i18n/request.ts` file. By default, it looks for `src/i18n/request.ts` or `./i18n/request.ts`. You can specify a custom path if needed:

```typescript
const withNextIntl = createNextIntlPlugin('./somewhere/else/request.ts');
```

---

## 2. i18n/routing.ts File Structure with defineRouting

**File:** `src/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ko'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Locale prefix mode: 'always' | 'as-needed' | 'never'
  // For URL-prefix routing (/ko, /en), use 'always'
  localePrefix: 'always',
});
```

**Additional Options (for localized pathnames):**

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always',

  // Optional: Localized pathnames
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      ko: '/about-ko',
    },
    '/contact': {
      en: '/contact',
      ko: '/contact-ko',
    },
  },
});
```

---

## 3. i18n/request.ts File Structure for Server-Side

**File:** `src/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;

  // Validate that the requested locale is supported
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

**Note:** Place the `messages` folder at the project root (same level as `src`), so the import path `../../messages/${locale}.json` works correctly.

---

## 4. Middleware Setup for next-intl

**File:** `src/middleware.ts` (or `src/proxy.ts` for Next.js 16+)

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

**Matcher Options:**

```typescript
export const config = {
  // Simple pattern (recommended)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'

  // Or explicit locale matching
  matcher: [
    '/',
    '/(en|ko)/:path*'
  ]
};
```

---

## 5. [locale] App Directory Structure

**Project Structure:**

```
your-project/
├── messages/
│   ├── en.json
│   └── ko.json
├── src/
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   └── navigation.ts    (optional, for locale-aware navigation)
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── (other routes...)
│   └── middleware.ts
├── next.config.ts
└── package.json
```

**Key Point:** All routes must be placed inside the `[locale]` dynamic segment to enable locale-based routing.

---

## 6. NextIntlClientProvider in layout.tsx

**File:** `src/app/[locale]/layout.tsx`

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';

// Enable static generation for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  // Get messages for Client Components
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## 7. Using getTranslations and useTranslations in Server/Client Components

### Server Components (using getTranslations)

**File:** `src/app/[locale]/page.tsx`

```typescript
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('welcome', { name: 'John' })}</p>
    </main>
  );
}
```

**With interpolation and pluralization:**

```typescript
const t = await getTranslations('HomePage');

// Interpolation
<p>{t('greeting', { name: user.name })}</p>

// Pluralization
<p>{t('itemsCount', { count: itemCount })}</p>
```

### Client Components (using useTranslations)

**File:** `src/components/Counter.tsx`

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function Counter() {
  const t = useTranslations('Counter');

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
    </div>
  );
}
```

**Shared Component (works as both Server and Client):**

```typescript
// This component executes as Server Component by default,
// but will run as Client Component if imported from a Client Component
import { useTranslations } from 'next-intl';

export default function UserProfile({ user }) {
  const t = useTranslations('UserProfile');

  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('followers', { count: user.followers })}</p>
    </section>
  );
}
```

### Locale-Aware Navigation (Optional but Recommended)

**File:** `src/i18n/navigation.ts`

```typescript
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

**Usage in components:**

```typescript
import { Link, usePathname } from '@/i18n/navigation';

// Link component (automatically adds locale prefix)
<Link href="/about">About</Link>
<Link href="/" locale="ko">한국어</Link>

// usePathname (returns pathname without locale)
const pathname = usePathname(); // Returns '/about' not '/en/about'

// useRouter
const router = useRouter();
router.push('/dashboard');
```

---

## 8. Message File Structure

**File:** `messages/en.json`

```json
{
  "HomePage": {
    "title": "Welcome",
    "welcome": "Welcome, {name}!",
    "description": "This is the home page"
  },
  "Navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "Counter": {
    "title": "Counter",
    "description": "Click to increment",
    "itemsCount": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
  },
  "Auth": {
    "SignUp": {
      "title": "Sign up",
      "form": {
        "placeholder": "Please enter your name",
        "submit": "Submit"
      }
    }
  }
}
```

**File:** `messages/ko.json`

```json
{
  "HomePage": {
    "title": "환영합니다",
    "welcome": "{name}님 환영합니다!",
    "description": "이것은 홈 페이지입니다"
  },
  "Navigation": {
    "home": "홈",
    "about": "정보",
    "contact": "연락처"
  },
  "Counter": {
    "title": "카운터",
    "description": "클릭하여 증가",
    "itemsCount": "{count, plural, =0 {아이템 없음} =1 {하나의 아이템} other {#개의 아이템}}"
  },
  "Auth": {
    "SignUp": {
      "title": "회원가입",
      "form": {
        "placeholder": "이름을 입력하세요",
        "submit": "제출"
      }
    }
  }
}
```

**ICU Message Format Support:**

- **Interpolation:** `{name}` or `{count, number}`
- **Pluralization:** `{count, plural, =0 {Zero} =1 {One} other {#}}`
- **Select:** `{gender, select, male {He} female {She} other {They}}`
- **Date/Number formatting:** `{date, date, short}` or `{amount, number, currency}`

---

## Summary

| Component      | File Path                     | Purpose                               |
| -------------- | ----------------------------- | ------------------------------------- |
| Next.js Plugin | `next.config.ts`              | Wraps config with next-intl           |
| Routing Config | `src/i18n/routing.ts`         | Defines locales, default, prefix mode |
| Request Config | `src/i18n/request.ts`         | Server-side locale/message resolution |
| Middleware     | `src/middleware.ts`           | Locale detection and routing          |
| Locale Layout  | `src/app/[locale]/layout.tsx` | Root layout with provider             |
| Page/Component | `src/app/[locale]/*.tsx`      | Server/Client components              |
| Messages       | `messages/{locale}.json`      | Translation files                     |

---

## References

- Official Docs: https://next-intl.dev/docs/getting-started/app-router
- Routing Setup: https://next-intl.dev/docs/routing/setup
- Middleware: https://next-intl.dev/docs/routing/middleware
- Configuration: https://next-intl.dev/docs/usage/configuration
