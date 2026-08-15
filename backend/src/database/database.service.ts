import { Injectable, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database.Database;

  onModuleInit() {
    this.db = new Database(path.join(process.cwd(), '..', 'frontend', 'data', 'centers-local.db'));
    console.log('Database connected');
  }

  getDb(): Database.Database {
    return this.db;
  }
}