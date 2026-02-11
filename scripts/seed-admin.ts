/**
 * Seed Admin User Script
 * 
 * Creates an admin user in Supabase Auth and profiles table.
 * 
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 * 
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (not the anon key!)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  if (!SUPABASE_URL) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  if (!SERVICE_ROLE_KEY) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nAdd SUPABASE_SERVICE_ROLE_KEY to your .env.local file.');
  console.error('Get it from: Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

// Admin client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Admin user details
const ADMIN_USER = {
  email: 'admin@nucleux.academy',
  password: 'NucleuX@2026',
  full_name: 'Admin User',
  role: 'admin',
};

async function seedAdmin() {
  console.log('🔐 NucleuX Academy - Admin User Seed Script\n');

  try {
    // Step 1: Check if user already exists
    console.log('1. Checking if admin user exists...');
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(u => u.email === ADMIN_USER.email);

    if (existingAdmin) {
      console.log('   ⚠️  Admin user already exists:', existingAdmin.id);
      console.log('   Updating user metadata...');
      
      // Update existing user's metadata
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingAdmin.id,
        {
          user_metadata: {
            full_name: ADMIN_USER.full_name,
            role: ADMIN_USER.role,
            plan: 'premium',
          },
        }
      );

      if (updateError) {
        throw new Error(`Failed to update user: ${updateError.message}`);
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: existingAdmin.id,
          full_name: ADMIN_USER.full_name,
          level: 'admin',
          plan: 'premium',
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.log('   ⚠️  Profile update warning:', profileError.message);
      }

      console.log('   ✅ Admin user updated successfully!\n');
    } else {
      // Step 2: Create new admin user
      console.log('2. Creating admin user in Auth...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: ADMIN_USER.full_name,
          role: ADMIN_USER.role,
          plan: 'premium',
        },
      });

      if (authError) {
        throw new Error(`Failed to create auth user: ${authError.message}`);
      }

      console.log('   ✅ Auth user created:', authData.user.id);

      // Step 3: Create profile
      console.log('3. Creating admin profile...');
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: ADMIN_USER.full_name,
        level: 'admin',
        plan: 'premium',
        specialty: 'Administration',
        onboarding_completed: true,
      });

      if (profileError) {
        console.log('   ⚠️  Profile creation warning:', profileError.message);
        console.log('   (Profile may be auto-created by trigger)');
      } else {
        console.log('   ✅ Profile created');
      }

      // Step 4: Create user preferences
      console.log('4. Creating user preferences...');
      const { error: prefsError } = await supabase.from('user_preferences').insert({
        user_id: authData.user.id,
        daily_goal_minutes: 120,
        mcq_daily_target: 50,
        theme: 'dark',
      });

      if (prefsError) {
        console.log('   ⚠️  Preferences warning:', prefsError.message);
      } else {
        console.log('   ✅ Preferences created');
      }

      // Step 5: Initialize streak
      console.log('5. Initializing streak...');
      const { error: streakError } = await supabase.from('streaks').insert({
        user_id: authData.user.id,
        current_streak: 0,
        longest_streak: 0,
      });

      if (streakError) {
        console.log('   ⚠️  Streak warning:', streakError.message);
      } else {
        console.log('   ✅ Streak initialized');
      }

      console.log('\n✅ Admin user created successfully!\n');
    }

    // Print credentials
    console.log('═══════════════════════════════════════════════');
    console.log('  🔐 ADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════');
    console.log(`  Email:    ${ADMIN_USER.email}`);
    console.log(`  Password: ${ADMIN_USER.password}`);
    console.log(`  Role:     ${ADMIN_USER.role}`);
    console.log('═══════════════════════════════════════════════\n');

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', message);
    process.exit(1);
  }
}

// Run the script
seedAdmin();
