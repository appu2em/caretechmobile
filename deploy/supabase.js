// supabase.js - Single Configuration File
const SUPABASE_URL = "https://oleuggrzmdtcorlvlapp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZXVnZ3J6bWR0Y29ybHZsYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTI3MDMsImV4cCI6MjA4MTAyODcwM30.dVAunvwATOX1_WMD4KU-O1hgCx0iqa1KGAxHC-n1ndM";

// Create single instance
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Export for use
window.supabaseClient = supabase;