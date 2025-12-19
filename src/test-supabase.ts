// Test script untuk cek koneksi Supabase
// Jalankan dengan: npx tsx src/test-supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rupservmtmdqgekakuki.supabase.co';
const supabaseKey = 'sb_publishable_08rBG67Kx1ulQd-5vJCWBQ_V3faWsyc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...\n');

  try {
    // Test 1: Check profile table
    console.log('1. Checking profile table...');
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .single();

    if (profileError) {
      console.log('   ❌ Profile error:', profileError.message);
    } else {
      console.log('   ✅ Profile found:', profile?.name);
    }

    // Test 2: Check skills table
    console.log('\n2. Checking skills table...');
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*');

    if (skillsError) {
      console.log('   ❌ Skills error:', skillsError.message);
    } else {
      console.log('   ✅ Skills count:', skills?.length);
    }

    // Test 3: Check stats table
    console.log('\n3. Checking stats table...');
    const { data: stats, error: statsError } = await supabase
      .from('stats')
      .select('*');

    if (statsError) {
      console.log('   ❌ Stats error:', statsError.message);
    } else {
      console.log('   ✅ Stats count:', stats?.length);
    }

    // Test 4: Check projects table
    console.log('\n4. Checking projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) {
      console.log('   ❌ Projects error:', projectsError.message);
    } else {
      console.log('   ✅ Projects count:', projects?.length);
    }

    console.log('\n✅ Connection test completed!');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
