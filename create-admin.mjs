import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_SEED_EMAIL;
const adminPassword = process.env.ADMIN_SEED_PASSWORD;
const adminName = process.env.ADMIN_SEED_NAME || 'Admin User';

if (!supabaseUrl || !supabaseAnonKey || !adminEmail || !adminPassword) {
  console.error('Missing required environment variables for create-admin.mjs:');
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!adminEmail) console.error('  - ADMIN_SEED_EMAIL');
  if (!adminPassword) console.error('  - ADMIN_SEED_PASSWORD');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { data, error } = await supabase.auth.signUp({
  email: adminEmail,
  password: adminPassword,
  options: {
    data: {
      full_name: adminName,
      role: 'admin',
      user_type: 'practicing_doctor',
      specialty: 'Surgery',
    },
  },
});

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('User created:', data.user?.id);
  console.log('Email:', data.user?.email);
  console.log('Session:', data.session ? 'Yes' : 'No (check email)');
}
