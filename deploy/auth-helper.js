/**
 * CareTechMobile Global Auth Helper
 * Include this script on ALL pages to show logout button when user is logged in
 * 
 * Usage: Add this script tag at the end of your HTML body:
 * <script src="auth-helper.js"></script>
 */

(function () {
    'use strict';

    // Wait for DOM and Supabase
    document.addEventListener('DOMContentLoaded', async function () {
        console.log('[Auth Helper] Initializing...');

        // Check if Supabase and CONFIG are available
        if (typeof CONFIG === 'undefined' || typeof supabase === 'undefined') {
            console.log('[Auth Helper] Supabase or CONFIG not available, skipping');
            return;
        }

        try {
            const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const { data } = await supabaseClient.auth.getSession();

            if (data.session) {
                console.log('[Auth Helper] User logged in:', data.session.user.email);

                // Get user name
                const userName = data.session.user.user_metadata?.full_name ||
                    data.session.user.email.split('@')[0];

                // Find header actions container
                const headerActions = document.querySelector('.nptel-header-actions');
                if (!headerActions) {
                    console.log('[Auth Helper] No header actions found');
                    return;
                }

                // Check if logout already exists
                if (document.getElementById('globalLogoutBtn')) {
                    console.log('[Auth Helper] Logout already exists');
                    return;
                }

                // Keep dark mode toggle
                const darkModeBtn = headerActions.querySelector('.dark-mode-toggle') ||
                    headerActions.querySelector('#darkModeToggle');

                // Clear and rebuild header actions
                headerActions.innerHTML = '';

                if (darkModeBtn) {
                    headerActions.appendChild(darkModeBtn);
                }

                // Add Profile button (if not on profile page)
                if (!window.location.href.includes('profile.html')) {
                    const profileBtn = document.createElement('a');
                    profileBtn.href = 'profile.html';
                    profileBtn.className = 'btn-nptel-login';
                    profileBtn.innerHTML = '<i class="fas fa-user"></i> ' + userName;
                    headerActions.appendChild(profileBtn);
                }

                // Add Logout button
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'btn-nptel-login';
                logoutBtn.id = 'globalLogoutBtn';
                logoutBtn.style.cssText = 'background: linear-gradient(135deg, #dc3545, #c82333); margin-left: 8px;';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                headerActions.appendChild(logoutBtn);

                // Logout handler with back button prevention
                logoutBtn.addEventListener('click', async function (e) {
                    e.preventDefault();
                    console.log('[Auth Helper] Logging out...');

                    try {
                        localStorage.removeItem('loginTime');
                        sessionStorage.clear();

                        // KEY: Set logout flag to prevent back button
                        localStorage.setItem('ctmLoggedOut', Date.now().toString());

                        await supabaseClient.auth.signOut();
                        console.log('[Auth Helper] Logged out successfully');

                        // Show toast if available
                        if (typeof showToast === 'function') {
                            showToast('Logged out successfully', 'info');
                        }

                        // Replace history and redirect
                        window.history.replaceState(null, '', 'dashboard.html');

                        setTimeout(() => {
                            window.location.replace('dashboard.html');
                        }, 500);

                    } catch (err) {
                        console.error('[Auth Helper] Logout error:', err);
                        localStorage.setItem('ctmLoggedOut', Date.now().toString());
                        window.location.replace('dashboard.html');
                    }
                });

                console.log('[Auth Helper] Logout button added');

            } else {
                console.log('[Auth Helper] User not logged in');

                // Show login button if not already there
                const headerActions = document.querySelector('.nptel-header-actions');
                if (headerActions) {
                    const existingLogin = headerActions.querySelector('a[href="dashboard.html"]');
                    if (!existingLogin) {
                        const darkModeBtn = headerActions.querySelector('.dark-mode-toggle') ||
                            headerActions.querySelector('#darkModeToggle');
                        headerActions.innerHTML = '';

                        if (darkModeBtn) {
                            headerActions.appendChild(darkModeBtn);
                        }

                        const loginBtn = document.createElement('a');
                        loginBtn.href = 'dashboard.html';
                        loginBtn.className = 'btn-nptel-login';
                        loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
                        headerActions.appendChild(loginBtn);
                    }
                }
            }
        } catch (err) {
            console.log('[Auth Helper] Auth check error:', err);
        }
    });

    // Block back button after logout on all pages
    window.addEventListener('pageshow', function (event) {
        const loggedOut = localStorage.getItem('ctmLoggedOut');
        if (loggedOut) {
            console.log('[Auth Helper] Logout detected on pageshow - redirecting');
            window.location.replace('dashboard.html');
        }
    });

})();
