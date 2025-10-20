
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

const supabaseUrl = 'https://qgkyltjpshbniyfmqabr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFna3lsdGpwc2hibml5Zm1xYWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NjM2MTYsImV4cCI6MjA3NjIzOTYxNn0.b1ysogujjtXmx0tMZE7U-96bAJim-TeKGAAP5ZRIAFc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
