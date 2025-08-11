const fs = require('fs');
const path = require('path');

// Supabase project details
const SUPABASE_PROJECT_REF = 'tupfmqgnirxjyhpkieka';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cGZtcWduaXJ4anlocGtpZWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NTcyMTAsImV4cCI6MjA3MDQzMzIxMH0.Coulib2MVXxusqFag6ImveqpTYxU_ZaRxrZSNbKn0tE';

async function executeSQLViaAPI(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql_query: sql })
    });
    
    const result = await response.json();
    return { success: response.ok, result, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function createAllTablesDirectly() {
  console.log('\n🚀 Attempting to create tables directly...\n');
  
  // Read all migration files
  const migrationFiles = [
    'supabase/migrations/001_initial_schema.sql',
    'supabase/migrations/002_rls_policies.sql',
    'supabase/seed.sql'
  ];
  
  console.log('\n📋 MANUAL SETUP REQUIRED\n');
  console.log('Since we cannot execute DDL statements via the API with anon key,');
  console.log('please follow these steps:\n');
  console.log('1. Open Supabase SQL Editor:');
  console.log(`   https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new\n`);
  console.log('2. Copy and paste each SQL block below:\n');
  console.log('='*60 + '\n');
  
  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n📄 FILE: ${file}`);
    console.log('-'.repeat(60));
    console.log('\n-- Copy everything below this line --\n');
    console.log(content);
    console.log('\n-- Copy everything above this line --\n');
    console.log('='*60);
    console.log('\n✅ After pasting, click "Run" in Supabase SQL Editor\n');
    console.log('='*60 + '\n');
  }
  
  console.log('\n✨ After running all 3 SQL scripts:');
  console.log('   - All tables will be created');
  console.log('   - Row Level Security will be enabled');
  console.log('   - Default categories function will be ready');
  console.log('   - You can then sign up in the app!\n');
}

// Since we need a service role key to create tables, let's output the SQL for manual execution
createAllTablesDirectly().catch(console.error);