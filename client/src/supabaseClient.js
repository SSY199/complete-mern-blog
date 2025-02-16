import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://blbotdusfhltkgmlcgmb.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsYm90ZHVzZmhsdGtnbWxjZ21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MjQyNDIsImV4cCI6MjA1NTIwMDI0Mn0.3zMTLoo9IedMWB88PmWN-JAR4u3NGJAW6CUHr5JaYCg'; // Replace with your Supabase public key
export const supabase = createClient(supabaseUrl, supabaseKey);