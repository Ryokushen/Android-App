const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://tupfmqgnirxjyhpkieka.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cGZtcWduaXJ4anlocGtpZWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NTcyMTAsImV4cCI6MjA3MDQzMzIxMH0.Coulib2MVXxusqFag6ImveqpTYxU_ZaRxrZSNbKn0tE';

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filePath, description) {
  try {
    console.log(`\n📦 Running: ${description}...`);
    
    // Read the SQL file
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolons but be careful with functions/triggers
    const statements = sql
      .split(/;\s*$/gm)
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      // Skip comments-only statements
      if (statement.replace(/--.*$/gm, '').trim().length === 0) continue;
      
      try {
        // Extract first few words for logging
        const preview = statement.substring(0, 50).replace(/\n/g, ' ');
        
        // Execute the SQL statement
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        }).single();
        
        if (error) {
          // Try direct execution as fallback
          const { error: directError } = await supabase.from('_exec').select(statement);
          
          if (directError) {
            console.log(`  ⚠️  Skipped: ${preview}...`);
            console.log(`      Reason: ${directError.message}`);
            errorCount++;
          } else {
            console.log(`  ✅ Success: ${preview}...`);
            successCount++;
          }
        } else {
          console.log(`  ✅ Success: ${preview}...`);
          successCount++;
        }
      } catch (err) {
        console.log(`  ❌ Error: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n  Summary: ${successCount} successful, ${errorCount} failed/skipped`);
    return { success: successCount, errors: errorCount };
    
  } catch (error) {
    console.error(`❌ Failed to run ${description}:`, error.message);
    return { success: 0, errors: 1 };
  }
}

async function checkTables() {
  console.log('\n🔍 Checking created tables...\n');
  
  const tablesToCheck = [
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
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);
      
      if (error) {
        console.log(`  ❌ ${table}: Not accessible (${error.message})`);
      } else {
        console.log(`  ✅ ${table}: Ready`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: Error (${err.message})`);
    }
  }
}

async function setupDatabase() {
  console.log('🚀 Starting Database Setup for Personal Finance Tracker\n');
  console.log('================================');
  
  // Note: We'll need to run these via Supabase Dashboard SQL Editor
  // since the service role key provided is the same as anon key
  
  console.log('\n⚠️  IMPORTANT: The migrations need to be run manually in Supabase Dashboard');
  console.log('\nPlease follow these steps:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/tupfmqgnirxjyhpkieka/sql/new');
  console.log('2. Copy the contents of each file below and run them in order:\n');
  
  const migrations = [
    {
      file: path.join(__dirname, 'supabase/migrations/001_initial_schema.sql'),
      description: 'Create all tables and indexes'
    },
    {
      file: path.join(__dirname, 'supabase/migrations/002_rls_policies.sql'),
      description: 'Set up Row Level Security policies'
    },
    {
      file: path.join(__dirname, 'supabase/seed.sql'),
      description: 'Create default categories function'
    }
  ];
  
  for (const migration of migrations) {
    console.log(`\n📄 File: ${migration.file}`);
    console.log(`   Description: ${migration.description}`);
    
    // Show first few lines as preview
    try {
      const content = fs.readFileSync(migration.file, 'utf8');
      const lines = content.split('\n').slice(0, 5);
      console.log('\n   Preview:');
      lines.forEach(line => console.log(`     ${line}`));
      console.log('     ...\n');
    } catch (err) {
      console.log(`   Could not read file: ${err.message}`);
    }
  }
  
  console.log('\n================================');
  console.log('\nAfter running the migrations in Supabase Dashboard:');
  console.log('1. The database will be fully set up');
  console.log('2. You can run the app and create an account');
  console.log('3. Default categories will be created for new users automatically');
  
  // Try to check what tables exist
  console.log('\n🔍 Attempting to check current database state...');
  await checkTables();
}

// Run the setup
setupDatabase().catch(console.error);