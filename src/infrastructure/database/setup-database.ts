import { DatabaseConnection } from '@/infrastructure/database/DataBaseConnection';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  const db = DatabaseConnection.getInstance();
  
  try {
    console.log('🔧 Setting up database...');
    
    // Read and execute migration
    const migrationPath = path.join(__dirname, '../src/infrastructure/database/migrations/001_create_users_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await db.query(migrationSQL);
    
    console.log('✅ Database setup completed successfully');
    
    // Test the connection
    const result = await db.query('SELECT current_database(), current_user, version()');
    console.log('📊 Database info:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

setupDatabase();