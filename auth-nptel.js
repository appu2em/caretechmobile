// ============================================
// AUTH-NPTEL.JS - Auth Check for All NPTEL-Style Pages
// Add this script to all NPTEL-themed pages
// ============================================

(function () {
    'use strict';

    // Supabase Config
    const SUPABASE_URL = "https://oleuggrzmdtcorlvlapp.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZXVnZ3J6bWR0Y29ybHZsYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTI3MDMsImV4cCI6MjA4MTAyODcwM30.dVAunvwATOX1_WMD4KU-O1hgCx0iqa1KGAxHC-n1ndM";

    let supabaseClient = null;

    // Initialize
    async function init() {
        console.log('🔐 NPTEL Auth Check initializing...');

        // Wait for Supabase
        if (!window.supabase) {
            console.log('⏳ Waiting for Supabase...');
            setTimeout(init, 100);
            return;
        }

        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            await checkAuth();
        } catch (err) {
            console.error('Auth init error:', err);
        }
    }

    // Check authentication status
    async function checkAuth() {
        try {
            const { data } = await supabaseClient.auth.getSession();

            if (data.session) {
                console.log('✅ User logged in:', data.session.user.email);
                showLoggedInUI(data.session.user);
            } else {
                console.log('❌ User not logged in - showing Login button');
                showLoggedOutUI();
            }
        } catch (err) {
            console.error('Auth check error:', err);
            showLoggedOutUI();
        }
    }

    // Show logged in UI - Profile + Logout buttons
    function showLoggedInUI(user) {
        const headerActions = document.querySelector('.nptel-header-actions');
        if (!headerActions) return;

        const userName = user.user_metadata?.full_name || user.email.split('@')[0];

        // Keep dark mode toggle
        const darkModeBtn = headerActions.querySelector('.dark-mode-toggle');
        headerActions.innerHTML = '';

        if (darkModeBtn) {
            headerActions.appendChild(darkModeBtn);
        }

        // Add Profile button
        const profileBtn = document.createElement('a');
        profileBtn.href = 'profile.html';
        profileBtn.className = 'btn-nptel-login';
        profileBtn.innerHTML = '<i class="fas fa-user"></i> ' + userName;
        headerActions.appendChild(profileBtn);

        // Add Logout button
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.className = 'btn-nptel-login';
        logoutBtn.id = 'nptelLogoutBtn';
        logoutBtn.style.cssText = 'background: #dc3545; margin-left: 8px;';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        headerActions.appendChild(logoutBtn);

        // Logout handler
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Show logged out UI - Login button
    function showLoggedOutUI() {
        const headerActions = document.querySelector('.nptel-header-actions');
        if (!headerActions) return;

        // Check if login button already exists
        const existingLoginBtn = headerActions.querySelector('.btn-nptel-login');
        if (existingLoginBtn && existingLoginBtn.textContent.includes('Login')) {
            return; // Already showing login
        }

        // Keep dark mode toggle
        const darkModeBtn = headerActions.querySelector('.dark-mode-toggle');
        headerActions.innerHTML = '';

        if (darkModeBtn) {
            headerActions.appendChild(darkModeBtn);
        }

        // Add Login button
        const loginBtn = document.createElement('a');
        loginBtn.href = 'dashboard.html';
        loginBtn.className = 'btn-nptel-login';
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
        headerActions.appendChild(loginBtn);
    }

    // Logout handler
    async function handleLogout(e) {
        e.preventDefault();
        console.log('🚪 Logging out...');

        try {
            // Clear session data
            localStorage.removeItem('loginTime');

            await supabaseClient.auth.signOut();
            console.log('✅ Logged out successfully');

            // Redirect to login page (prevents back button access)
            window.location.replace('dashboard.html');

        } catch (err) {
            console.error('Logout error:', err);
            alert('Error logging out. Please try again.');
        }
    }

    // Listen for auth changes
    function setupAuthListener() {
        if (!supabaseClient) return;

        supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Auth state changed:', event);

            if (event === 'SIGNED_OUT') {
                showLoggedOutUI();
            } else if (event === 'SIGNED_IN' && session) {
                showLoggedInUI(session.user);
            }
        });
    }

    // Browser back button check
    window.addEventListener('popstate', async function () {
        if (supabaseClient) {
            const { data } = await supabaseClient.auth.getSession();
            if (!data.session) {
                showLoggedOutUI();
            }
        }
    });

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
