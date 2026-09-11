// app/api/admin/tools/bulk-create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ToolInput, generateToolComponent } from '@/lib/tools/toolGenerator';
import { generateSEO } from '@/lib/tools/seoAutoGenerator';
import { generateTranslations } from '@/lib/tools/templateEngine';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { tools }: { tools: ToolInput[] } = await req.json();
    if (!Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json({ success: false, error: 'Tools array required' }, { status: 400 });
    }

    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const results: any[] = [];
    const errors: any[] = [];

    for (const tool of tools) {
      try {
        const existing = db.prepare('SELECT id FROM tools WHERE slug = ?').get(tool.slug);
        if (existing) {
          errors.push({ slug: tool.slug, error: 'Already exists' });
          continue;
        }

        const component = generateToolComponent(tool);
        const seoData = tool.seo?.title ? tool.seo : generateSEO(tool);
        const translations = tool.translations || generateTranslations(tool);

        const toolDir = path.join(process.cwd(), 'components', 'tools', tool.category, tool.slug);
        fs.mkdirSync(toolDir, { recursive: true });
        fs.writeFileSync(path.join(toolDir, 'tool.client.tsx'), component);
        fs.writeFileSync(path.join(toolDir, 'seo.json'), JSON.stringify(seoData, null, 2));
        fs.writeFileSync(path.join(toolDir, 'translations.json'), JSON.stringify(translations, null, 2));

        const result = db.prepare(`
          INSERT INTO tools (slug, category, name, icon, status)
          VALUES (?, ?, ?, ?, 'active')
        `).run(tool.slug, tool.category, tool.name, tool.icon || '🔧');

        for (const lang of ['en', 'ur', 'hi', 'ar']) {
          const t = (translations as any)[lang];
          if (t) {
            db.prepare(`
              INSERT INTO tool_content (tool_id, lang, title, description, seo_title, seo_description, seo_keywords)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(result.lastInsertRowid, lang, t.title, t.description, seoData.title, seoData.description, (seoData.keywords || []).join(', '));
          }
        }
        results.push({ slug: tool.slug, id: result.lastInsertRowid });
      } catch (err: any) {
        errors.push({ slug: tool.slug, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      created: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}