import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
  constructor(private dbService: DatabaseService) {}

  getStats() {
    const db = this.dbService.getDb();
    return {
      totalTools: (db.prepare('SELECT COUNT(*) as count FROM tools').get() as any).count,
      totalBlogs: (db.prepare("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'").get() as any).count,
      totalUsers: (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count,
      totalCategories: (db.prepare('SELECT COUNT(DISTINCT category) as count FROM tools').get() as any).count,
    };
  }

  getTools() {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM tools ORDER BY category, name').all();
  }

  getBlogs() {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM blog_posts ORDER BY published_at DESC LIMIT 50').all();
  }

  getUsers() {
    const db = this.dbService.getDb();
    return db.prepare('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 50').all();
  }
}