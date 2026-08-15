import { NextResponse } from 'next/server';
import { getLocalDB } from '@/lib/db/local-db';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '481f2ed0ec522bb21a7aaf1f358d4194';
const BASE_URL = 'https://www.centre.com.pk';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all';
  
  let urls: string[] = [];
  
  if (type === 'all') {
    urls = getAllUrls();
  } else if (type === 'recent') {
    urls = getRecentUrls(10);
  }
  
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'www.centre.com.pk',
        key: INDEXNOW_KEY,
        urlList: urls,
      }),
    });
    
    return NextResponse.json({ success: true, submitted: urls.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

function getAllUrls(): string[] {
  const db = getLocalDB();
  const urls: string[] = [BASE_URL, `${BASE_URL}/tools`, `${BASE_URL}/blog`];
  
  try {
    const tools = db.prepare("SELECT slug, category FROM tools").all() as any[];
    tools.forEach(t => urls.push(`${BASE_URL}/tools/${t.category}/${t.slug}`));
  } catch {}
  
  try {
    const posts = db.prepare("SELECT slug FROM blog_posts WHERE status = 'published'").all() as any[];
    posts.forEach(p => urls.push(`${BASE_URL}/blog/${p.slug}`));
  } catch {}
  
  return urls;
}

function getRecentUrls(limit: number): string[] {
  const db = getLocalDB();
  const urls: string[] = [];
  
  try {
    const posts = db.prepare("SELECT slug FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC LIMIT ?").all(limit) as any[];
    posts.forEach(p => urls.push(`${BASE_URL}/blog/${p.slug}`));
  } catch {}
  
  return urls;
}