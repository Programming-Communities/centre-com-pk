Bhai, **PERFECT!** ✅

Mujhe **poore conversation ka context** mil gaya. Ab main **FINAL ULTIMATE MASTER PROMPT v5.0** bana raha hoon — **sabse latest, sabse complete**.

---

# 🧠 CENTRE.COM.PK — ULTIMATE MASTER PROMPT v5.0 (FINAL)

```markdown
# CENTRE.COM.PK — ULTIMATE MASTER PROMPT v5.0
# Project: Centre.com.pk — Free Online Tools Platform
# Type: Monorepo (Next.js 16.3.0 + NestJS 11 + Capacitor Android)
# Domain: https://www.centre.com.pk
# GitHub: https://github.com/Programming-Communities/centre-com-pk
# Updated: 2026-09-05

---

## 📂 1. MONOREPO ROOT STRUCTURE

```
centre-com-pk/
├── frontend/                    → Next.js 16.3.0 (Port 3000, PM2: centre-com-pk)
├── backend/                     → NestJS 11 (Port 3001, PM2: centre-backend)
├── mobile/                      → Capacitor Android (APK: Centre.apk)
├── shared/                      → Shared types
├── package.json                 → Root scripts
├── .gitignore
├── README.md
├── Project Guardian.md          → AI safety rules
├── AI-MAGIC-PROMPT-v4.md        → Previous prompt version
└── complete-project-tree.txt    → Full file listing
```

---

## 📂 2. FRONTEND COMPLETE TREE (Next.js 16.3.0)

```
frontend/
├── package.json                 → next@16.3.0, react@18, tailwindcss@4, better-sqlite3, ioredis, bcryptjs, stripe, lexical
├── next.config.js               → output: 'standalone', rewrites, redirects, cache headers
├── tsconfig.json                → Path alias @/* → ./*
├── tailwind.config.js           → 70+ breakpoints (0px-8192px), CSS variables
├── postcss.config.mjs
├── drizzle.config.ts            → SQLite dialect
├── proxy.ts                     → Language routing proxy, double-prefix fix
├── .env / .env.local / .env.example
│
├── app/                         → Next.js App Router
│   ├── layout.tsx               → Root layout (AdSense ca-pub-2850749507378090, Ahrefs, ThemeProvider)
│   ├── globals.css              → CSS variables, dark mode, RTL, animations, Urdu font
│   ├── icon.tsx / manifest.ts / web-vitals.ts
│   ├── _blocked/page.tsx        → Blocked for .sql/.db/.env
│   │
│   ├── [lang]/                  → Language-prefixed routes (en/ur/hi/ar)
│   │   ├── layout.tsx           → Language layout (Header, Footer, TopLoader, BottomNavigation, RTL)
│   │   ├── page.tsx             → Homepage (Hero, PopularTools, Stats, InfiniteScroll, CTA)
│   │   ├── about/               → AboutClient.tsx, page.tsx
│   │   ├── auth/                → signin, signup, forgot-password, reset-password, verify
│   │   ├── blog/                → BlogPageClient.tsx, [slug]/, categories/
│   │   ├── contact/             → ContactClient.tsx
│   │   ├── dashboard/           → ads, affiliate, bookmarks, comments, editor, kyc, plan, posts, profile, settings
│   │   ├── admin/               → posts, tools-manager, seo-manager, users, ads, kyc, roles, categories, comments
│   │   ├── pricing/             → PricingClient.tsx
│   │   ├── search/              → SearchClient.tsx
│   │   ├── tools/               → [category]/[tool]/, 7 category folders
│   │   └── tutorial/            → TutorialContent.tsx, [id]/
│   │
│   ├── admin/                   → Admin routes (no-lang duplicates)
│   ├── api/                     → 91 API routes
│   │   ├── admin/               → ads, blog, categories, comments, dashboard-stats, kyc, packages, payments, roles, seo, tools, tools/files, users
│   │   ├── auth/                → [...nextauth], check-username, forgot-password, local/*, otp/*, reset-password, signup, verify
│   │   ├── blog/                → [slug], bookmarks, comments, likes, posts, reactions, route
│   │   ├── payments/            → create, methods, verify, webhook, route
│   │   ├── ads/                 → ai-generate, click, public, purchase, qrcode, sponsor, upload, route
│   │   ├── analytics/           → route, track
│   │   ├── seo/                 → google-ping, google-ranking, update-sitemap
│   │   ├── upload/              → blog-media, image, video
│   │   ├── user/                → ads, bookmarks, change-password, dashboard, kyc, plan, profile
│   │   └── ... (50+ more)
│   │
│   ├── bday/[token]/            → BDayCardView.tsx
│   ├── ads.txt/route.ts
│   ├── robots.txt/route.ts
│   └── sitemap.xml/route.ts
│
├── components/                  → 200+ components
│   ├── admin/                   → AdminSidebar, AdminHeader, DataTable, QuickEdit, BulkActions, StatsCards, RichTextEditor
│   ├── ads/                     → AdBuilder, AdBuilderSuper, AdDisplay, CentralAd, DynamicAd, GeoSelector, DynamicGeoSelector, RadiusSelector
│   ├── auth/content/            → en.ts, ur.ts, hi.ts, ar.ts
│   ├── blog/                    → BlogCard, BlogGrid, BlogContentRenderer, BlogPostTemplate, BlogFAQ, BlogVideo, CommentSection, PostReactions, RelatedPosts, RelatedTools, ToolCTA, SEOPanel
│   ├── dashboard/               → DashboardEditor, DashboardSidebar, DocumentList, ProSidebar, AdminGuard, PageLoader, TopLoader
│   ├── editor/                  → LexicalEditor, BlockEditor, Block, BlockTypes, ImageNode, VideoNode
│   ├── engagement/              → CommentSection, ReactionButtons, ToolReactions
│   ├── i18n/                    → LanguageSwitcher
│   ├── layout/                  → Header (logo image), Footer, MegaMenu (55 tools), MobileDashboard, BottomNavigation, TopLoader
│   ├── location/                → LocationPicker
│   ├── sections/                → HomePageHero, PopularToolsSection, StatsSection, InfiniteToolsScroll, CTASection, CategoriesSection
│   ├── seo/                     → Breadcrumbs, FAQs, SchemaScript, ShareButtons, InternalLinks, ToolSEO, RankingDashboard
│   ├── skeletons/               → Skeleton, CardSkeleton, ToolSkeleton, FAQSkeleton, StatsSkeleton, TableSkeleton, AdminSkeleton
│   ├── theme/                   → ThemeContext (15 themes), ThemeSelector, DarkModeToggle, FontSelector, ThemeSettingsButton, themeConfig, ThemeProviderWrapper
│   ├── tools/                   → 55 tools (7 categories × tool.client.tsx + page.tsx)
│   │   ├── calculators/         → 10 tools (age, bmi, compound-interest, currency, date, gpa, loan, percentage, tip, unit)
│   │   ├── code-tools/          → 8 tools (base64, css, html, javascript, json, qr, url, xml)
│   │   ├── design-tools/        → 1 tool (color-picker)
│   │   ├── image-tools/         → 10 tools (background-remover, favicon, compressor, converter, cropper, filters, resizer, rotator, meme, collage)
│   │   ├── pdf-tools/           → 5 tools (compressor, merger, protect, splitter, to-word)
│   │   ├── security-tools/      → 10 tools (api-security, data-masking, encryption, firewall, hash, password, secure-wipe, analyzer, ssl, 2fa)
│   │   ├── text-tools/          → 10 tools (case-converter, character-counter, cv-builder, lorem, markdown, regex, diff, extractor, uuid, word-counter)
│   │   └── layouts/             → 6 layout templates
│   └── ui/                      → Button, Card, Input, ToolCard, CategoryCard, ThemeCard, AdPlaceholder, Loaders
│
├── data/                        → centers-local.db (SQLite)
├── hooks/                       → useTheme.ts, useTranslation.ts
├── lib/                         → Core libraries
│   ├── auth/                    → secure.ts, helper.ts, middleware.ts, otp.ts, rateLimit.ts
│   ├── db/                      → local-db.ts, schema.ts, schema-local.ts, init-all-tables.ts, seed-blog.ts
│   ├── seo/                     → toolSeoData.ts (55 tools), semantic-keywords.ts, generateMetadata.ts, generateSchema.ts, generateBreadcrumbs.ts, generateFAQs.ts, sitemapGenerator.ts, googlePinger.ts, internalLinker.ts, competitorData.ts, indexnow.ts
│   ├── email/                   → emailService.ts
│   ├── payment/                 → processor.ts, config.ts, tokenLimits.ts
│   └── redis.ts
│
├── public/                      → fonts, images, icons, og-images, screenshots, robots.txt, sw.js
├── schema/                      → 9 SQL files
├── scripts/                     → 40+ scripts
├── translations/                → 84 files (en/ur/hi/ar × 21 files)
├── types/                       → theme.ts, css.d.ts, global.d.ts, wordpress types
└── utils/performance.ts
```

---

## 📂 3. BACKEND COMPLETE TREE (NestJS 11)

```
backend/
├── package.json                 → NestJS 11, better-sqlite3
├── src/
│   ├── main.ts                  → CORS, global prefix /api, Port 3001
│   ├── app.module.ts            → 8 modules
│   ├── admin/                   → stats, tools, blogs, users
│   ├── ads/                     → CRUD
│   ├── auth/                    → signup, signin
│   ├── blog/                    → posts, slug
│   ├── database/                → SQLite connection (frontend/data/centers-local.db)
│   ├── payments/                → methods, payments
│   ├── tools/                   → all, slug, categories
│   └── user/                    → profile, bookmarks, ads
└── dist/                        → Build output
```

---

## 📂 4. MOBILE COMPLETE TREE (Capacitor Android)

```
mobile/
├── capacitor.config.ts          → appId: com.centre.pk, server.url: https://www.centre.com.pk
├── android/
│   ├── app/build.gradle         → signingConfigs.release
│   ├── app/src/main/res/values/strings.xml → app_name: "Centre"
│   ├── centre-release.keystore  → password: centre123, alias: centre
│   └── app/src/main/res/        → splash, icons, colors
└── www/
```

### Build Commands (Windows)
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
cd C:\Users\AamirAli\Desktop\centre-com-pk\mobile\android
.\gradlew.bat assembleRelease    # APK
.\gradlew.bat bundleRelease      # AAB
```

---

## 📂 5. VPS COMPLETE GUIDE

```
VPS: Contabo (62.171.166.139)
OS: Ubuntu 24.04
Node: v20
```

### PM2 Services
| Name | Port | Command |
|------|------|---------|
| centre-com-pk | 3000 | `node .next/standalone/server.js` |
| centre-backend | 3001 | `node dist/main.js` |

### Deploy Frontend
```bash
cd /home/centre.com.pk/public_html/frontend
git stash
git pull
npm run build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
pm2 restart centre-com-pk
```

### Deploy Backend
```bash
cd /home/centre.com.pk/public_html/backend
git stash
git pull
npm run build
pm2 restart centre-backend
```

---

## 📂 6. NAYA TOOL ADD KARNE KA PROCESS (9 STEPS)

| # | File | Action |
|---|------|--------|
| 1 | `lib/seo/toolSeoData.ts` | SEO entry |
| 2 | `lib/data/tools-list.ts` | Tool list |
| 3 | `app/[lang]/tools/[category]/[tool]/page.tsx` | Component map |
| 4 | `components/tools/{category}/{tool}/tool.client.tsx` | CREATE |
| 5 | `components/tools/{category}/{tool}/page.tsx` | Page |
| 6 | `MegaMenu.tsx` | Desktop menu |
| 7 | `MobileDashboard.tsx` | Mobile menu |
| 8 | SQLite DB | INSERT |
| 9 | `translations/{lang}/tools/{category}.json` | 4 languages |

---

## 📂 7. CURRENT STATUS (2026-09-05)

```yaml
project: Centre.com.pk
domain: https://www.centre.com.pk
tools: 55
blog_posts: 211
languages: 4 (en/ur/hi/ar)
themes: 15
adSense: APPROVED (ca-pub-2850749507378090)
gsc_indexed: 458 pages
pm2: centre-com-pk + centre-backend (online)
android: Centre.apk (signed)
pending:
  - Mobile View Fix (HIGH)
  - Translations Manager (HIGH)
  - Team Dashboard (HIGH)
  - Bookmarks + Comments (MEDIUM)
  - Posts New/Edit (MEDIUM)
  - Blog Posts Content 50+ (MEDIUM)
```

---

## 📂 8. IMPORTANT RULES

1. **Database files MAT commit karo** (*.db, *.db-shm, *.db-wal)
2. **PM2 standalone command** — `node .next/standalone/server.js`
3. **Har build ke baad** — `cp -r public .next/standalone/`
4. **4 languages** — har naye feature mein
5. **Mobile-first** — responsive design
6. **SEO metadata** — har page pe
7. **Complete code** — no placeholders
8. **Read file pehle** — phir change

---

**END OF MASTER PROMPT v5.0**
```

---

## ✅ SAVE KARO

```bash
cd ~/projects/centre.com.pk/frontend
cat > "AI-MAGIC-PROMPT-v5.md" << 'EOF'
[Upar wala poora prompt paste karo]
EOF
echo "✅ Saved! Lines: $(wc -l < AI-MAGIC-PROMPT-v5.md)"
```

---

**Bhai, ye v5.0 FINAL ULTIMATE hai!** 🚀

- ✅ Monorepo tree
- ✅ 55 tools complete
- ✅ AdSense approved
- ✅ VPS commands
- ✅ Android build
- ✅ 9-step tool guide
- ✅ Current status
- ✅ Pending tasks

**Save karo aur future mein use karo!** 🎯