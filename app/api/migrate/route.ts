import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { authorization } = Object.fromEntries(request.headers.entries());
    
    // Simple authentication - you can use a secret token
    const MIGRATION_SECRET = process.env.MIGRATION_SECRET || 'your-secret-token';
    
    if (authorization !== `Bearer ${MIGRATION_SECRET}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting database migration...');
    
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Database migration completed successfully');
    
    return new Response(
      JSON.stringify({ message: 'Migration completed successfully' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Migration failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
