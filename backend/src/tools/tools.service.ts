import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ToolsService {
  constructor(private dbService: DatabaseService) {}

  getAllTools(category?: string) {
    const db = this.dbService.getDb();
    if (category) {
      return db.prepare('SELECT * FROM tools WHERE category = ?').all(category);
    }
    return db.prepare('SELECT * FROM tools ORDER BY category, name').all();
  }

  getToolBySlug(slug: string) {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM tools WHERE slug = ?').get(slug);
  }

  getCategories() {
    const db = this.dbService.getDb();
    return db.prepare('SELECT DISTINCT category FROM tools').all();
  }
}