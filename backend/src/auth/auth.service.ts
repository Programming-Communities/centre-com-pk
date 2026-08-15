import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private dbService: DatabaseService) {}

  signup(email: string, password: string, name: string) {
    const db = this.dbService.getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return { error: 'User already exists' };
    const result = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, password, name);
    return { success: true, id: result.lastInsertRowid, email, name };
  }

  signin(email: string, password: string) {
    const db = this.dbService.getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password) as any;
    if (!user) return { error: 'Invalid credentials' };
    return { success: true, id: user.id, email: user.email, name: user.name };
  }
}