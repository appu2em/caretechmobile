// supabase.js - Single Configuration File
const SUPABASE_URL = typeof CONFIG !== 'undefined' ? CONFIG.SUPABASE_URL : "";
const SUPABASE_KEY = typeof CONFIG !== 'undefined' ? CONFIG.SUPABASE_KEY : "";

// Create single instance
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Export for use
window.supabaseClient = supabase;