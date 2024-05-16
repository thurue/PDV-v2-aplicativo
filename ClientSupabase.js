import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qsdqootkqcodopabbzxe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZHFvb3RrcWNvZG9wYWJienhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3MzQzNTQsImV4cCI6MjAzMTMxMDM1NH0.vraDL6mHEjTbAQYIuNjr24Mdgfq_0fkfBEJB2GQKoSA';

export const supabase = createClient(supabaseUrl, supabaseKey);