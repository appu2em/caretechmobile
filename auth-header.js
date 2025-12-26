/**
 * Auth Header Handler - Shared script for Login/Logout button toggle
 * Include this script in all pages that have login/logout buttons
 */

(async function initAuthHeader() {
    try {
        // Check if CONFIG and supabase are available
        if (typeof CONFIG === 'undefined' || typeof window.supabase === 'undefined') {
            console.log('Auth: CONFIG or Supabase not available');
            return;
        }
        
        const supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        // Get button elements
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (session && session.user) {
            // User is logged in - show Logout, hide Login
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'flex';
            
            // Show username if element exists
            if (userNameDisplay) {
                const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
                userNameDisplay.textContent = name;
                userNameDisplay.style.display = 'flex';
            }
            
            // Add logout handler
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await supabaseClient.auth.signOut();
                        sessionStorage.clear();
                        localStorage.setItem('ctmLoggedOut', Date.now().toString());
                        window.location.reload();
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                });
            }
        } else {
            // User is NOT logged in - show Login, hide Logout
            if (loginBtn) loginBtn.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userNameDisplay) userNameDisplay.style.display = 'none';
        }
    } catch (error) {
        console.error('Auth header error:', error);
    }
})();
