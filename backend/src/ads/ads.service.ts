import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdsService {
  constructor(private dbService: DatabaseService) {}

  getAllAds() {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM ads ORDER BY created_at DESC').all();
  }

  getAdById(id: number) {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM ads WHERE id = ?').get(id);
  }

  createAd(data: any) {
    const db = this.dbService.getDb();
    const result = db.prepare('INSERT INTO ads (title, content, status) VALUES (?, ?, ?)').run(data.title, data.content, data.status || 'active');
    return { id: result.lastInsertRowid };
  }

  deleteAd(id: number) {
    const db = this.dbService.getDb();
    db.prepare('DELETE FROM ads WHERE id = ?').run(id);
    return { success: true };
  }
}
