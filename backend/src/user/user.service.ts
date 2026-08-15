import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private dbService: DatabaseService) {}

  getProfile(userId: number) {
    const db = this.dbService.getDb();
    return db.prepare('SELECT id, email, name, plan, created_at FROM users WHERE id = ?').get(userId);
  }

  updateProfile(userId: number, data: any) {
    const db = this.dbService.getDb();
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(data.name || '', userId);
    return { success: true };
  }

  getBookmarks(userId: number) {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM user_bookmarks WHERE user_id = ?').all(userId);
  }

  getAds(userId: number) {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM ads WHERE user_id = ?').all(userId);
  }
}
