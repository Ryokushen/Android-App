const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection configuration
// Try different user format - just 'postgres' without project ID
const connectionString = `postgresql://postgres:zod!8%26HWbD0qhbuY@aws-0-us-east-1.pooler.supabase.com:6543/postgres?options=project%3Dtupfmqgnirxjyhpkieka`;

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    return false;
  }
}

async function checkTables() {
  console.log('\n📊 Checking existing tables...\n');
  
  try {
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `);
    
    if (result.rows.length === 0) {
      console.log('  ⚠️  No tables found in public schema');
      return [];
    }
    
    console.log(`  Found ${result.rows.length} tables:`);
    const tables = result.rows.map(row => row.tablename);
    tables.forEach(table => console.log(`    ✓ ${table}`));
    
    return tables;
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return [];
  }
}

async function checkAuthSchema() {
  console.log('\n🔐 Checking auth schema...\n');
  
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.schemata 
        WHERE schema_name = 'auth'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('  ✅ Auth schema exists');
      
      // Check auth.users table
      const usersResult = await client.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables 
          WHERE table_schema = 'auth' 
          AND table_name = 'users'
        );
      `);
      
      if (usersResult.rows[0].exists) {
        console.log('  ✅ auth.users table exists');
        
        // Count users
        const countResult = await client.query(`
          SELECT COUNT(*) FROM auth.users;
        `);
        console.log(`  📊 Total users: ${countResult.rows[0].count}`);
      }
    } else {
      console.log('  ⚠️  Auth schema not found');
    }
  } catch (error) {
    console.error('❌ Error checking auth schema:', error.message);
  }
}

async function runMigration(filePath, description) {
  console.log(`\n📦 Running migration: ${description}`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolons but handle functions/triggers properly
    const statements = sql
      .split(/;\s*$/gm)
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      // Skip comment-only statements
      if (statement.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//gm, '').trim().length === 0) {
        continue;
      }
      
      try {
        const preview = statement.substring(0, 60).replace(/\n/g, ' ');
        await client.query(statement);
        console.log(`  ✅ ${preview}...`);
        successCount++;
      } catch (error) {
        const preview = statement.substring(0, 60).replace(/\n/g, ' ');
        console.log(`  ⚠️  Failed: ${preview}...`);
        console.log(`      Error: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n  Summary: ${successCount} successful, ${errorCount} failed`);
    return { success: successCount, errors: errorCount };
    
  } catch (error) {
    console.error(`❌ Failed to read migration file:`, error.message);
    return { success: 0, errors: 1 };
  }
}

async function runAllMigrations() {
  console.log('\n🚀 Running all migrations...\n');
  
  const migrations = [
    {
      file: path.join(__dirname, 'supabase/migrations/001_initial_schema.sql'),
      description: 'Initial schema - Tables and indexes'
    },
    {
      file: path.join(__dirname, 'supabase/migrations/002_rls_policies.sql'),
      description: 'Row Level Security policies'
    },
    {
      file: path.join(__dirname, 'supabase/seed.sql'),
      description: 'Seed data and default categories function'
    }
  ];
  
  for (const migration of migrations) {
    if (fs.existsSync(migration.file)) {
      await runMigration(migration.file, migration.description);
    } else {
      console.log(`  ⚠️  Migration file not found: ${migration.file}`);
    }
  }
}

async function testQuery() {
  console.log('\n🧪 Testing database queries...\n');
  
  try {
    // Test categories table
    const result = await client.query(`
      SELECT COUNT(*) FROM categories;
    `);
    console.log(`  ✅ Categories table accessible - Count: ${result.rows[0].count}`);
    
    // Test if RLS is enabled
    const rlsResult = await client.query(`
      SELECT relrowsecurity 
      FROM pg_class 
      WHERE relname = 'categories';
    `);
    console.log(`  ${rlsResult.rows[0]?.relrowsecurity ? '✅' : '⚠️ '} RLS enabled on categories: ${rlsResult.rows[0]?.relrowsecurity || false}`);
    
  } catch (error) {
    console.error('❌ Query test failed:', error.message);
  }
}

async function createDefaultCategoriesFunction() {
  console.log('\n🔧 Creating default categories function...\n');
  
  const sql = `
    CREATE OR REPLACE FUNCTION create_default_categories()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Income categories
      INSERT INTO public.categories (user_id, name, parent_id) VALUES
        (NEW.id, 'Income', NULL),
        (NEW.id, 'Salary', (SELECT id FROM categories WHERE user_id = NEW.id AND name = 'Income' LIMIT 1)),
        (NEW.id, 'Freelance', (SELECT id FROM categories WHERE user_id = NEW.id AND name = 'Income' LIMIT 1)),
        (NEW.id, 'Investments', (SELECT id FROM categories WHERE user_id = NEW.id AND name = 'Income' LIMIT 1));
      
      -- Expense categories
      INSERT INTO public.categories (user_id, name, parent_id) VALUES
        (NEW.id, 'Housing', NULL),
        (NEW.id, 'Rent/Mortgage', (SELECT id FROM categories WHERE user_id = NEW.id AND name = 'Housing' LIMIT 1)),
        (NEW.id, 'Utilities', (SELECT id FROM categories WHERE user_id = NEW.id AND name = 'Housing' LIMIT 1)),
        (NEW.id, 'Transportation', NULL),
        (NEW.id, 'Food & Dining', NULL),
        (NEW.id, 'Shopping', NULL),
        (NEW.id, 'Entertainment', NULL),
        (NEW.id, 'Healthcare', NULL),
        (NEW.id, 'Education', NULL),
        (NEW.id, 'Other', NULL);
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Create trigger if it doesn't exist
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION create_default_categories();
  `;
  
  try {
    await client.query(sql);
    console.log('  ✅ Default categories function and trigger created');
  } catch (error) {
    console.error('  ❌ Failed to create function:', error.message);
  }
}

async function main() {
  console.log('🗄️  Supabase Database Manager\n');
  console.log('================================\n');
  
  // Connect to database
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }
  
  // Check what tables exist
  const tables = await checkTables();
  
  // Check auth schema
  await checkAuthSchema();
  
  // Expected tables
  const expectedTables = [
    'categories',
    'accounts',
    'transactions',
    'budgets',
    'budget_entries',
    'subscriptions',
    'debts',
    'investment_accounts',
    'holdings',
    'goals',
    'feature_flags'
  ];
  
  const missingTables = expectedTables.filter(table => !tables.includes(table));
  
  if (missingTables.length > 0) {
    console.log('\n⚠️  Missing tables:', missingTables.join(', '));
    
    // Ask if we should run migrations
    console.log('\n📝 Running migrations to create missing tables...');
    await runAllMigrations();
    
    // Check tables again
    await checkTables();
  } else {
    console.log('\n✅ All expected tables exist');
  }
  
  // Create default categories function
  await createDefaultCategoriesFunction();
  
  // Test queries
  await testQuery();
  
  // Close connection
  await client.end();
  console.log('\n👋 Database connection closed');
}

// Handle errors gracefully
process.on('unhandledRejection', async (error) => {
  console.error('Unhandled error:', error);
  await client.end();
  process.exit(1);
});

// Run the main function
main().catch(console.error);