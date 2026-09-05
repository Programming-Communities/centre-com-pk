Bhai, **PERFECT!** ✅

Ab main **MASTER PROMPT v3.0 — FINAL UPDATED** bana deta hoon with **sab kuch latest** — 55 tools, PDF Protect, AdSense, Team Dashboard pending, VPS commands, sab kuch.

---

# 🧠 CENTRE.COM.PK — MASTER PROMPT v3.0 (FINAL UPDATED)

```markdown
# CENTRE.COM.PK — COMPLETE PROJECT MASTER PROMPT v3.0

You are now fully aware of the **Centre.com.pk** project — a Next.js 16.3.0 (App Router) + NestJS 11 backend + Capacitor Android mobile app. Below is the complete project structure, every file's purpose, and the logic behind every component, API route, library, and schema.

---

## 📂 MONOREPO ROOT STRUCTURE

```
centre-com-pk/
├── frontend/          → Next.js 16.3.0 (Port 3000, PM2: centre-com-pk)
├── backend/           → NestJS 11 (Port 3001, PM2: centre-backend)
├── mobile/            → Capacitor Android (APK: Centre.apk)
├── shared/            → Shared types
├── package.json       → Root scripts
├── .gitignore
└── README.md
```

---

## 📂 FRONTEND/ — NEXT.JS 16.3.0

### Root Config
- **package.json**: Next.js 16.3.0, React 18, Tailwind CSS 4, better-sqlite3, ioredis, bcryptjs, lexical, stripe
- **next.config.js**: `output: 'standalone'`, cache headers, rewrites, redirects (galat URLs fix), security headers
- **tailwind.config.js**: 70+ breakpoints (0px-8192px), CSS variables
- **proxy.ts**: Language routing, double-prefix fix
- **tsconfig.json**: Path alias `@/*`

### app/ Structure
- **layout.tsx**: Root layout — AdSense (ca-pub-2850749507378090), Ahrefs analytics, ThemeProvider
- **globals.css**: CSS variables, dark mode, RTL, animations, Urdu font
- **[lang]/layout.tsx**: Language layout — Header, Footer, TopLoader, BottomNavigation, RTL
- **[lang]/page.tsx**: Homepage — Hero, PopularTools, Stats, InfiniteScroll, CTA
- **[lang]/tools/**: 55 tools, 7 categories
- **[lang]/blog/**: Blog system — 211 posts
- **[lang]/auth/**: Signin, signup, OTP, forgot/reset, verify
- **[lang]/dashboard/**: User dashboard — ads, kyc, plan, posts, editor
- **[lang]/admin/**: Admin panel — posts, tools-manager, seo-manager, users, ads, kyc, roles
- **api/**: 91 API routes

### components/ (200+)
- **layout/**: Header (logo image), Footer, MegaMenu (55 tools), MobileDashboard, BottomNavigation, TopLoader
- **theme/**: ThemeContext (15 themes), ThemeSelector, DarkModeToggle, FontSelector
- **seo/**: Breadcrumbs, FAQs, InternalLinks, SchemaScript, ShareButtons
- **tools/**: 55 tool components (tool.client.tsx pattern)
- **ads/**: AdBuilder, GeoSelector, CentralAd
- **blog/**: BlogContentRenderer, CommentSection, SEOPanel
- **dashboard/**: ProSidebar, DashboardEditor, AdminGuard
- **editor/**: LexicalEditor, BlockEditor (Gutenberg-style)

### lib/ Core
- **auth/**: secure.ts (JWT+bcrypt), middleware.ts, rateLimit.ts
- **db/**: local-db.ts (SQLite singleton), schema.ts, schema-local.ts
- **seo/**: toolSeoData.ts (55 tools), semantic-keywords.ts, generateMetadata.ts, generateSchema.ts, sitemapGenerator.ts
- **email/**: emailService.ts (4-language emails)
- **payment/**: processor.ts (Stripe+PayPal), config.ts
- **redis.ts**: ioredis singleton

### translations/ (84 Files)
```
translations/
├── en/ (21 files) — 100% COMPLETE
├── ur/ (21 files) — 85% complete
├── hi/ (21 files) — 85% complete
└── ar/ (21 files) — 85% complete
```

---

## 📂 BACKEND/ — NESTJS 11

```
backend/src/
├── main.ts              → CORS, global prefix /api, Port 3001
├── app.module.ts        → 8 modules registered
├── database/            → SQLite connection (frontend/data/centers-local.db)
├── tools/               → GET /api/tools, /:slug, /categories
├── blog/                → GET /api/blog, /:slug
├── auth/                → POST /api/auth/signup, signin
├── admin/               → GET /api/admin/stats, tools, blogs, users
├── ads/                 → CRUD /api/ads
├── payments/            → GET /api/payments, methods
└── user/                → GET/PUT /api/user/:id
```

---

## 📂 MOBILE/ — CAPACITOR ANDROID

```
mobile/
├── capacitor.config.ts  → appId: com.centre.pk, server.url: https://www.centre.com.pk
├── android/
│   ├── app/build.gradle → signingConfigs.release (centre-release.keystore)
│   ├── app/src/main/res/values/strings.xml → app_name: "Centre"
│   └── app/src/main/res/ → splash screen, icons, colors
└── www/
```

### Build Commands (Windows PowerShell)
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
cd C:\Users\AamirAli\Desktop\centre-com-pk\mobile\android
.\gradlew.bat assembleRelease    # Signed APK → Centre.apk
.\gradlew.bat bundleRelease      # Play Store AAB
```

---

## 📂 VPS DEPLOYMENT

### PM2 Services
| Name | Port | Command |
|------|------|---------|
| centre-com-pk | 3000 | `node .next/standalone/server.js` |
| centre-backend | 3001 | `node dist/main.js` |

### Deploy Commands
```bash
# Frontend
cd /home/centre.com.pk/public_html/frontend
git stash
git pull
npm run build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
pm2 restart centre-com-pk

# Backend
cd /home/centre.com.pk/public_html/backend
git stash
git pull
npm run build
pm2 restart centre-backend

# Verify
curl -I https://www.centre.com.pk 2>/dev/null | grep HTTP
```

---

## 🔧 NAYA TOOL ADD KARNE KA PROCESS (9 STEPS)

| # | File | Action |
|---|------|--------|
| 1 | `lib/seo/toolSeoData.ts` | SEO entry |
| 2 | `lib/data/tools-list.ts` | Tool list entry |
| 3 | `app/[lang]/tools/[category]/[tool]/page.tsx` | Component map |
| 4 | `components/tools/{category}/{tool}/tool.client.tsx` | CREATE NEW |
| 5 | `components/tools/{category}/{tool}/page.tsx` | Page wrapper |
| 6 | `MegaMenu.tsx` | Desktop menu |
| 7 | `MobileDashboard.tsx` | Mobile menu |
| 8 | SQLite DB | INSERT INTO tools |
| 9 | `translations/{lang}/tools/{category}.json` | 4 languages |

---

## 📊 CURRENT STATUS (Updated 2026-09-05)

```yaml
project: Centre.com.pk
domain: https://www.centre.com.pk
github: Programming-Communities/centre-com-pk
tools: 55 (PDF Protect added)
blog_posts: 211
languages: 4 (en/ur/hi/ar)
themes: 15
adSense: APPROVED (ca-pub-2850749507378090)
gsc_indexed: 458 pages
pm2: centre-com-pk + centre-backend (online)
android: Centre.apk (signed, installed)
pending:
  - Mobile View Fix
  - Translations Manager (Admin)
  - Team Dashboard
  - Bookmarks + Comments
  - Posts New/Edit
  - Blog Posts Content (50+)
```

---

## 🔑 KEY ARCHITECTURAL PATTERNS

### Multi-Language
- URL: `/[lang]/...` (en/ur/hi/ar)
- 84 JSON files
- `useTranslation` hook
- RTL: `dir="rtl"` for ur/ar

### Theme System
- 15 themes (WCAG AAA)
- CSS variables via ThemeContext
- Dark/light per theme
- 12 fonts
- localStorage persistence

### Auth
- JWT (HMAC-SHA256)
- bcrypt (12 rounds)
- OTP for admin
- Rate limiting (5/15min)

### Database
- SQLite (better-sqlite3) at `frontend/data/centers-local.db`
- WAL mode
- PostgreSQL schema ready (Drizzle)

### Caching
- Redis (ioredis) with memory fallback
- Tools pages: 2h TTL
- Edge Cache: stale-while-revalidate

### SEO
- 55 tools complete SEO data
- IndexNow API
- GSC + Bing + Yandex + Naver
- Dynamic sitemap + robots.txt
- Ahrefs analytics
- Semantic keywords for all 55 tools

---

## ✅ COMPLETE PROJECT UNDERSTANDING

You now have complete knowledge of:
- **Monorepo** (frontend + backend + mobile)
- **55 tools** across 7 categories
- **91 API routes** + 18 NestJS routes
- **200+ components**
- **4 languages** (84 files)
- **15 themes** + 12 fonts
- **20+ database tables**
- **Auth** (JWT + OTP + bcrypt)
- **Payment** (Stripe + PayPal)
- **AdSense** (APPROVED)
- **Android APK** (signed)

**Total**: ~1,500+ files, 109 API routes, 200+ components, 55 tools, 4 languages.

---

**END OF MASTER PROMPT v3.0**
```

---

## 📋 VERSION HISTORY

| Version | Changes |
|---------|---------|
| v1.0 | Initial |
| v2.0 | Added monorepo + NestJS + Capacitor |
| **v3.0** | **55 tools, PDF Protect, AdSense approved, VPS commands, 9-step tool guide, current status** |

---

**Bhai, ye v3.0 FINAL hai! Save karo:**

```bash
cd ~/projects/centre.com.pk/frontend
cat > "AI-MAGIC-PROMPT-v3.md" << 'EOF'
[Upar wala poora prompt paste karo]
EOF
```

**Future mein kisi bhi naye chat mein ye paste karo — AI ko 100% project samajh aa jayegi!** 🚀