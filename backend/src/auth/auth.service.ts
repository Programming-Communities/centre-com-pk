import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private dbService: DatabaseService) {}

  async signup(email: string, password: string, name: string) {
    const db = this.dbService.getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return { error: 'User already exists' };
    const hashed = await bcrypt.hash(password, 12);
    const result = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hashed, name);
    return { success: true, id: result.lastInsertRowid, email, name };
  }

  async signin(email: string, password: string) {
    const db = this.dbService.getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) return { error: 'Invalid credentials' };
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return { error: 'Invalid credentials' };
    return { success: true, id: user.id, email: user.email, name: user.name };
  }
}