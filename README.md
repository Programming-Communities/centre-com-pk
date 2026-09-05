cd ~/projects/centre.com.pk/frontend

# ============================================
# 1. CONFIG FILES
# ============================================
echo "=== next.config.js ===" > project-01-config.txt
cat next.config.js >> project-01-config.txt
echo "" >> project-01-config.txt
echo "=== package.json ===" >> project-01-config.txt
cat package.json >> project-01-config.txt
echo "" >> project-01-config.txt
echo "=== tsconfig.json ===" >> project-01-config.txt
cat tsconfig.json >> project-01-config.txt
echo "" >> project-01-config.txt
echo "=== tailwind.config.js ===" >> project-01-config.txt
cat tailwind.config.js >> project-01-config.txt
echo "" >> project-01-config.txt
echo "=== proxy.ts ===" >> project-01-config.txt
cat proxy.ts >> project-01-config.txt

echo "✅ project-01-config.txt ready"

# ============================================
# 2. LAYOUT FILES (app/)
# ============================================
echo "=== app/layout.tsx ===" > project-02-layout.txt
cat app/layout.tsx >> project-02-layout.txt
echo "" >> project-02-layout.txt
echo "=== app/globals.css ===" >> project-02-layout.txt
cat app/globals.css >> project-02-layout.txt
echo "" >> project-02-layout.txt
echo "=== app/[lang]/layout.tsx ===" >> project-02-layout.txt
cat "app/[lang]/layout.tsx" >> project-02-layout.txt
echo "" >> project-02-layout.txt
echo "=== app/[lang]/page.tsx ===" >> project-02-layout.txt
cat "app/[lang]/page.tsx" >> project-02-layout.txt
echo "" >> project-02-layout.txt
echo "=== app/icon.tsx ===" >> project-02-layout.txt
cat app/icon.tsx >> project-02-layout.txt
echo "" >> project-02-layout.txt
echo "=== app/manifest.ts ===" >> project-02-layout.txt
cat app/manifest.ts >> project-02-layout.txt
echo "" >> project-02-layout.txt
echo "=== app/web-vitals.ts ===" >> project-02-layout.txt
cat app/web-vitals.ts >> project-02-layout.txt

echo "✅ project-02-layout.txt ready"

# ============================================
# 3. ADMIN PANEL FILES
# ============================================
echo "=== ADMIN PANEL FILES ===" > project-03-admin.txt
for file in $(find "app/[lang]/admin" -name "*.tsx" | sort); do
  echo "" >> project-03-admin.txt
  echo "=== $file ===" >> project-03-admin.txt
  cat "$file" >> project-03-admin.txt
  echo "" >> project-03-admin.txt
done

# Admin API routes
for file in $(find "app/api/admin" -name "*.ts" | sort); do
  echo "" >> project-03-admin.txt
  echo "=== $file ===" >> project-03-admin.txt
  cat "$file" >> project-03-admin.txt
  echo "" >> project-03-admin.txt
done

echo "✅ project-03-admin.txt ready"

# ============================================
# 4. DASHBOARD FILES
# ============================================
echo "=== DASHBOARD FILES ===" > project-04-dashboard.txt
for file in $(find "app/[lang]/dashboard" -name "*.tsx" | sort); do
  echo "" >> project-04-dashboard.txt
  echo "=== $file ===" >> project-04-dashboard.txt
  cat "$file" >> project-04-dashboard.txt
  echo "" >> project-04-dashboard.txt
done

echo "✅ project-04-dashboard.txt ready"

# ============================================
# 5. SEO FILES
# ============================================
echo "=== SEO FILES ===" > project-05-seo.txt
for file in $(find "lib/seo" -name "*.ts" -not -name "*.json" | sort); do
  echo "" >> project-05-seo.txt
  echo "=== $file ===" >> project-05-seo.txt
  cat "$file" >> project-05-seo.txt
  echo "" >> project-05-seo.txt
done

echo "✅ project-05-seo.txt ready"

# ============================================
# 6. DATABASE FILES
# ============================================
echo "=== DATABASE FILES ===" > project-06-database.txt
for file in $(find "lib/db" -name "*.ts" | sort); do
  echo "" >> project-06-database.txt
  echo "=== $file ===" >> project-06-database.txt
  cat "$file" >> project-06-database.txt
  echo "" >> project-06-database.txt
done

echo "✅ project-06-database.txt ready"

# ============================================
# 7. COMPONENTS — LAYOUT
# ============================================
echo "=== LAYOUT COMPONENTS ===" > project-07-components-layout.txt
for file in $(find "components/layout" -name "*.tsx" -o -name "*.ts" | sort); do
  echo "" >> project-07-components-layout.txt
  echo "=== $file ===" >> project-07-components-layout.txt
  cat "$file" >> project-07-components-layout.txt
  echo "" >> project-07-components-layout.txt
done

echo "✅ project-07-components-layout.txt ready"

# ============================================
# 8. COMPONENTS — SEO
# ============================================
echo "=== SEO COMPONENTS ===" > project-08-components-seo.txt
for file in $(find "components/seo" -name "*.tsx" -o -name "*.ts" | sort); do
  echo "" >> project-08-components-seo.txt
  echo "=== $file ===" >> project-08-components-seo.txt
  cat "$file" >> project-08-components-seo.txt
  echo "" >> project-08-components-seo.txt
done

echo "✅ project-08-components-seo.txt ready"

# ============================================
# 9. TRANSLATIONS
# ============================================
echo "=== TRANSLATIONS ===" > project-09-translations.txt
for file in $(find "translations/en" -name "*.json" | sort); do
  echo "" >> project-09-translations.txt
  echo "=== $file ===" >> project-09-translations.txt
  cat "$file" >> project-09-translations.txt
  echo "" >> project-09-translations.txt
done

echo "✅ project-09-translations.txt ready"

# ============================================
# 10. TOOLS LIST + SEO DATA
# ============================================
echo "=== TOOLS DATA ===" > project-10-tools-data.txt
echo "=== lib/data/tools-list.ts ===" >> project-10-tools-data.txt
cat lib/data/tools-list.ts >> project-10-tools-data.txt
echo "" >> project-10-tools-data.txt
echo "=== lib/data/categories.ts ===" >> project-10-tools-data.txt
cat lib/data/categories.ts >> project-10-tools-data.txt
echo "" >> project-10-tools-data.txt
echo "=== lib/seo/toolSeoData.ts ===" >> project-10-tools-data.txt
cat lib/seo/toolSeoData.ts >> project-10-tools-data.txt

echo "✅ project-10-tools-data.txt ready"

# ============================================
# ALL FILES LIST
# ============================================
echo "=== COMPLETE FILE LIST ===" > project-00-file-list.txt
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.css" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -not -name "package-lock.json" | sort >> project-00-file-list.txt

echo "✅ project-00-file-list.txt ready"

# ============================================
# FILE SIZES CHECK
# ============================================
echo "=== ALL TXT FILES ==="
ls -la project-*.txt

echo ""
echo "=== TOTAL LINES ==="
wc -l project-*.txt | tail -1







📋 AB BACKEND BHI ADD KARO — 2 EXTRA FILES
cd ~/projects/centre.com.pk

# ============================================
# 12. BACKEND FILES
# ============================================
echo "=== BACKEND FILES ===" > project-12-backend.txt
for file in $(find "backend/src" -name "*.ts" | sort); do
  echo "" >> project-12-backend.txt
  echo "=== $file ===" >> project-12-backend.txt
  cat "$file" >> project-12-backend.txt
  echo "" >> project-12-backend.txt
done

# Backend config
echo "=== backend/package.json ===" >> project-12-backend.txt
cat backend/package.json >> project-12-backend.txt
echo "" >> project-12-backend.txt

echo "✅ project-12-backend.txt ready"

# ============================================
# 13. BACKEND CONFIG + API ROUTES (FRONTEND API)
# ============================================
echo "=== FRONTEND API ROUTES ===" > project-13-api-routes.txt
for file in $(find "frontend/app/api" -name "*.ts" | sort); do
  echo "" >> project-13-api-routes.txt
  echo "=== $file ===" >> project-13-api-routes.txt
  cat "$file" >> project-13-api-routes.txt
  echo "" >> project-13-api-routes.txt
done

echo "✅ project-13-api-routes.txt ready"

# ============================================
# 14. TOOLS COMPONENTS (55 TOOLS)
# ============================================
echo "=== TOOLS COMPONENTS ===" > project-14-tools-components.txt
for file in $(find "frontend/components/tools" -name "*.tsx" -name "*.ts" | sort); do
  echo "" >> project-14-tools-components.txt
  echo "=== $file ===" >> project-14-tools-components.txt
  cat "$file" >> project-14-tools-components.txt
  echo "" >> project-14-tools-components.txt
done

echo "✅ project-14-tools-components.txt ready"

# ============================================
# 15. THEME SYSTEM
# ============================================
echo "=== THEME SYSTEM ===" > project-15-theme.txt
for file in $(find "frontend/components/theme" -name "*.ts" -o -name "*.tsx" | sort); do
  echo "" >> project-15-theme.txt
  echo "=== $file ===" >> project-15-theme.txt
  cat "$file" >> project-15-theme.txt
  echo "" >> project-15-theme.txt
done

echo "✅ project-15-theme.txt ready"

# ============================================
# ALL FILES SIZE
# ============================================
echo "=== ALL TXT FILES ==="
ls -la project-*.txt

echo ""
echo "=== TOTAL LINES ==="
wc -l project-*.txt | tail -1