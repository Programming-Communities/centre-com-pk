// app/api/admin/tools/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/requireAdmin';
import { generateToolComponent, ToolInput } from '@/lib/tools/toolGenerator';
import { generateSEO } from '@/lib/tools/seoAutoGenerator';
import { generateTranslations } from '@/lib/tools/templateEngine';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body: ToolInput = await req.json();

    if (!body.name || !body.slug || !body.category || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const component = generateToolComponent(body);
    const seoData = body.seo?.title ? body.seo : generateSEO(body);
    const translations = body.translations || generateTranslations(body);

    const toolDir = path.join(process.cwd(), 'components', 'tools', body.category, body.slug);
    if (!fs.existsSync(toolDir)) fs.mkdirSync(toolDir, { recursive: true });

    fs.writeFileSync(path.join(toolDir, 'tool.client.tsx'), component);
    fs.writeFileSync(path.join(toolDir, 'seo.json'), JSON.stringify(seoData, null, 2));
    fs.writeFileSync(path.join(toolDir, 'translations.json'), JSON.stringify(translations, null, 2));

    const db = (await import('@/lib/db/local-db')).getLocalDB();

    const existing = db.prepare('SELECT id FROM tools WHERE slug = ?').get(body.slug);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Tool slug already exists' },
        { status: 409 }
      );
    }

    const result = db.prepare(`
      INSERT INTO tools (slug, category, name, icon, status)
      VALUES (?, ?, ?, ?, 'active')
    `).run(body.slug, body.category, body.name, body.icon || '🔧');

    const toolId = result.lastInsertRowid;

    for (const lang of ['en', 'ur', 'hi', 'ar']) {
      const t = (translations as any)[lang];
      if (t) {
        db.prepare(`
          INSERT INTO tool_content (tool_id, lang, title, description, seo_title, seo_description, seo_keywords)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          toolId, lang, t.title, t.description,
          seoData.title, seoData.description,
          (seoData.keywords || []).join(', ')
        );
      }
    }

    return NextResponse.json({
      success: true,
      toolId,
      message: 'Tool created successfully',
    });
  } catch (error: any) {
    console.error('Tool generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}