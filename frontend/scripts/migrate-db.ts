import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:centers123@localhost:5432/centers';

async function migrate() {
  const pool = new Pool({ connectionString });
  
  try {
    console.log('🔄 Running migrations...');
    
    // Read and execute schema files
    const schemaDir = path.join(process.cwd(), 'schema');
    const files = fs.readdirSync(schemaDir).filter(f => f.endsWith('.sql')).sort();
    
    for (const file of files) {
      console.log(`  📄 ${file}`);
      const sql = fs.readFileSync(path.join(schemaDir, file), 'utf-8');
      await pool.query(sql);
    }
    
    console.log('✅ Migrations complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
