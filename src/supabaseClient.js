// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your real project credentials
const supabaseUrl = "https://vmykenlocvzapnfuxcxg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZteWtlbmxvY3Z6YXBuZnV4Y3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTg5NzksImV4cCI6MjA2MjEzNDk3OX0.LfI2ycXIlMVGre1btzZJTI1u5DWnuB3oiNbyMTuCr1k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
