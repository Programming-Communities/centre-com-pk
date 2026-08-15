import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BlogService {
  constructor(private dbService: DatabaseService) {}

  getPosts(limit = 20, lang?: string) {
    const db = this.dbService.getDb();
    let query = "SELECT * FROM blog_posts WHERE status = 'published'";
    const params: any[] = [];
    if (lang && lang !== 'all') {
      query += ' AND lang = ?';
      params.push(lang);
    }
    query += ' ORDER BY published_at DESC LIMIT ?';
    params.push(limit);
    return db.prepare(query).all(...params);
  }

  getPostBySlug(slug: string) {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug);
  }
}