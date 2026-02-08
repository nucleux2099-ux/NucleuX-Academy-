import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qwkuoygcvkbomunazpce.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3VveWdjdmtib211bmF6cGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0Nzk3ODYsImV4cCI6MjA4NjA1NTc4Nn0.2CY40gCHMrmXTVUPVT8mDFHZuhRy0XCmKvUkfuHyGdo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { data, error } = await supabase.auth.signUp({
  email: 'narasimha@nucleux.academy',
  password: 'NarasimhaAdmin123!',
  options: {
    data: {
      full_name: 'Narasimha (Admin)',
      role: 'admin',
      user_type: 'practicing_doctor',
      specialty: 'Surgery'
    }
  }
});

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('User created:', data.user?.id);
  console.log('Email:', data.user?.email);
  console.log('Session:', data.session ? 'Yes' : 'No (check email)');
}
