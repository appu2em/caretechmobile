// ============================================
// AUTH CHECK - For All Pages
// ============================================

const SUPABASE_URL = "https://oleuggrzmdtcorlvlapp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZXVnZ3J6bWR0Y29ybHZsYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTI3MDMsImV4cCI6MjA4MTAyODcwM30.dVAunvwATOX1_WMD4KU-O1hgCx0iqa1KGAxHC-n1ndM";

// Initialize Supabase
const supabaseAuth = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Check auth and update UI
async function initAuth() {
    console.log('🔐 Checking auth status...');

    try {
        const { data: { session } } = await supabaseAuth.auth.getSession();

        if (session && session.user) {
            console.log('✅ User logged in:', session.user.email);
            showLoggedInUI(session.user);
        } else {
            console.log('❌ User not logged in');
            showLoggedOutUI();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showLoggedOutUI();
    }
}

// Show UI for logged in user
function showLoggedInUI(user) {
    const headerCta = document.querySelector('.header-cta');
    if (!headerCta) return;

    // Get user name
    const userName = user.user_metadata?.full_name || user.email.split('@')[0];

    // Update header buttons
    headerCta.innerHTML = `
        <a href="https://wa.me/919962003738" class="btn-whatsapp" target="_blank">
            <i class="fab fa-whatsapp"></i> Chat Now
        </a>
        <a href="profile.html" class="btn-login" style="background: linear-gradient(135deg, #15C39A, #0ea57f);">
            <i class="fas fa-user"></i> ${userName}
        </a>
        <a href="#" class="btn-logout" id="logoutBtn" style="background: #dc3545; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-left: 10px;">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    `;

    // Add logout handler
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Show UI for logged out user
function showLoggedOutUI() {
    const headerCta = document.querySelector('.header-cta');
    if (!headerCta) return;

    headerCta.innerHTML = `
        <a href="https://wa.me/919962003738" class="btn-whatsapp" target="_blank">
            <i class="fab fa-whatsapp"></i> Chat Now
        </a>
        <a href="dashboard.html" class="btn-login">
            <i class="fas fa-sign-in-alt"></i> Login
        </a>
    `;
}

// Logout handler
async function handleLogout(e) {
    e.preventDefault();

    console.log('🚪 Logging out...');

    try {
        // Clear session data
        localStorage.removeItem('loginTime');

        await supabaseAuth.auth.signOut();
        console.log('✅ Logged out successfully');

        // Prevent browser back button from accessing logged-in pages
        // Clear history and redirect to login page
        window.location.replace('dashboard.html');

    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
}

// Listen for auth changes
supabaseAuth.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state changed:', event);

    if (event === 'SIGNED_OUT') {
        showLoggedOutUI();
    } else if (event === 'SIGNED_IN' && session) {
        showLoggedInUI(session.user);
    }
});

// Run on page load
document.addEventListener('DOMContentLoaded', initAuth);

// Run immediately if DOM already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initAuth, 100);
}