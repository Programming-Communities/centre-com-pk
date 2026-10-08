# New Tool Checklist — Centre.com.pk

Har naya tool banate waqt yeh rules follow karo:

## 1. Registration
- [ ] Add entry to `lib/seo/toolSeoData.ts`
- [ ] Fields: slug, category, title, description, keywords, faqs, relatedTools, schemaType, priority, changefreq
- [ ] Verify: sitemap includes new tool (curl /sitemap.xml | grep tool-slug)

## 2. URL Policy
- [ ] English URL is UNPREFIXED (e.g. /tools/text-tools/cv-builder)
- [ ] Other languages prefixed (e.g. /ur/tools/text-tools/cv-builder)
- [ ] Canonical: unprefixed for English, prefixed for others
- [ ] Do NOT hardcode /${lang}/ in page.tsx

## 3. Metadata
- [ ] Title: 50-60 chars
- [ ] Description: 150-160 chars
- [ ] robots: { index: true, follow: true } (unless tool is thin/private)
- [ ] openGraph: title, description, url, type

## 4. DB Safety
- [ ] Every DB query wrapped in try/catch
- [ ] No write-in-render (view counters should be non-blocking)
- [ ] Use getLocalDB() singleton, not new Database()
- [ ] Generic error to client, log server-side

## 5. Auth
- [ ] User routes: use `requireUser(req)`
- [ ] Admin routes: use `requireAdmin(req)` (accepts admin + super_admin)
- [ ] NEVER trust client-supplied user_id — derive from JWT
- [ ] NEVER trust client-supplied role

## 6. Uploads (if applicable)
- [ ] Auth required (requireUser)
- [ ] MIME allowlist (image/jpeg, image/png, image/webp, image/gif)
- [ ] Size cap (5 MB)
- [ ] Extension from validated MIME, not from client filename
- [ ] Filename: crypto.randomUUID()

## 7. Error Handling
- [ ] Error boundary: app/[lang]/blog/[slug]/error.tsx (or equivalent)
- [ ] No e.message leak in responses
- [ ] Return generic error + log real error

## 8. Testing
- [ ] Build pass: npm run build
- [ ] tsc: npx tsc --noEmit | grep -i tool-slug
- [ ] Test: curl /tools/{category}/{slug} → 200
- [ ] Test: curl /ur/tools/{category}/{slug} → 200
- [ ] Test: curl /sitemap.xml | grep tool-slug → 4 URLs

## 9. Commit
- [ ] Follow existing commit message style
- [ ] Refs: .agent/D3-REPORT.md (if SEO-related)

