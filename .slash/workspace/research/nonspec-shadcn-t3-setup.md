# Research: shadcn/ui Setup in T3 App (Next.js + tRPC + Tailwind)

Date: 2026-04-03

## Summary

shadcn/ui integrates well with T3 apps but requires careful configuration given the project uses Tailwind v4 (`@tailwindcss/postcss`). The CLI supports bulk installation via `--all` flag, and the main gotchas involve tailwind.config.ts parsing issues and Tailwind v4 compatibility adjustments.

---

## Findings

### 1. Exact Commands to Initialize shadcn (using bunx)

**For existing Next.js/T3 project:**

```bash
bunx shadcn@latest init
```

**Options for non-interactive init:**

```bash
bunx shadcn@latest init -d --yes
# -d/--defaults: use default configuration
# --yes: skip confirmation prompts
```

**For scaffolding new Next.js project:**

```bash
bunx shadcn@latest init -t next
```

Reference: [shadcn CLI docs](https://ui.shadcn.com/docs/cli)

---

### 2. Bulk Install All Components

**Yes, there IS a wildcard/bulk install command:**

```bash
# Add ALL available components
bunx shadcn@latest add -a
# or
bunx shadcn@latest add --all
```

This installs all components from the shadcn/ui registry. You can then remove what you don't need.

Reference: [CLI add command options](https://ui.shadcn.com/docs/cli#add)

---

### 3. Known Issues & Gotchas with shadcn + T3 App

| Issue                          | Description                                         | Workaround                                               |
| ------------------------------ | --------------------------------------------------- | -------------------------------------------------------- |
| **tailwind.config.ts parsing** | CLI may malform or fail to parse `.ts` config files | Use `.js` extension or manually update config            |
| **Tailwind v4 compatibility**  | This project uses `@tailwindcss/postcss` (v4)       | Leave `tailwind.config` blank in components.json for v4  |
| **Import alias conflicts**     | T3 uses `@/*` alias, shadcn defaults may differ     | Ensure tsconfig.json paths match components.json aliases |

**Related issues:**

- [CLI breaks tailwind.config.ts #5735](https://github.com/shadcn-ui/ui/issues/5735)
- [CLI can't parse tailwind.config.ts #5860](https://github.com/shadcn-ui/ui/issues/5860)
- [No Tailwind CSS configuration found #7404](https://github.com/shadcn-ui/ui/issues/7404)

---

### 4. components.json Configuration

For a T3 app (Next.js + tRPC + Tailwind), here's the recommended configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "", // Leave empty for Tailwind v4
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Key adjustments for this T3 app:**

- Set `tailwind.config` to empty string (required for Tailwind v4)
- CSS path: `src/app/globals.css` (adjust if your globals is elsewhere)
- The T3 app already has `@/*` alias in tsconfig.json, so shadcn's default aliases should work

**Verify your tsconfig.json has:**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### 5. Tailwind/PostCSS Compatibility

**Current project setup:**

- Uses `@tailwindcss/postcss` (Tailwind v4)
- PostCSS config at `postcss.config.js`:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**shadcn compatibility:**

| Tailwind Version | shadcn Support | Notes                                            |
| ---------------- | -------------- | ------------------------------------------------ |
| v3               | Full           | Standard config path works                       |
| v4               | Partial        | Leave `tailwind.config` empty in components.json |

**For Tailwind v4**, shadcn's CLI won't auto-update tailwind.config.js since there's none. The CSS variables will be added to your globals.css directly.

**Recommendation:** Run init with `--defaults` to get standard setup, then manually verify globals.css has the required CSS variables:

```bash
bunx shadcn@latest init -d --yes
```

---

## Step-by-Step Setup for This T3 App

```bash
# 1. Initialize shadcn (use defaults, skip prompts)
bunx shadcn@latest init -d --yes

# 2. Verify components.json was created (check configuration)
cat components.json

# 3. Add all components (optional - add all, remove what you don't need)
bunx shadcn@latest add -a

# 4. Or add specific components you need
bunx shadcn@latest add button card input dialog
```

---

## References

- [shadcn Next.js Installation](https://ui.shadcn.com/docs/installation/next)
- [shadcn CLI Reference](https://ui.shadcn.com/docs/cli)
- [components.json Schema](https://ui.shadcn.com/docs/components-json)
- [Tailwind v4 + shadcn (leave config empty)](https://ui.shadcn.com/docs/components-json#tailwindconfig)
