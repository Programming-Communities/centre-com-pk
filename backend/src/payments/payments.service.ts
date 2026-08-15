import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentsService {
  constructor(private dbService: DatabaseService) {}

  getMethods() {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM payment_methods WHERE is_active = 1').all();
  }

  getPayments() {
    const db = this.dbService.getDb();
    return db.prepare('SELECT * FROM payments ORDER BY created_at DESC').all();
  }

  createPayment(data: any) {
    const db = this.dbService.getDb();
    const result = db.prepare('INSERT INTO payments (user_id, plan, amount_pkr, status) VALUES (?, ?, ?, ?)').run(data.user_id, data.plan, data.amount, 'pending');
    return { id: result.lastInsertRowid };
  }
}
