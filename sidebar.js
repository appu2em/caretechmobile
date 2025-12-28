// ===== MOBILE SIDEBAR TOGGLE =====
// Shared sidebar functionality for all pages
(function initMobileSidebar() {
    const hamburger = document.getElementById('mobileHamburger');
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');
    const sidebarLogout = document.getElementById('sidebarLogout');
    const sidebarLoginBtn = document.getElementById('sidebarLoginBtn');
    const sidebarUserName = document.getElementById('sidebarUserName');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Close button
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // Overlay click
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Nav item clicks
    if (sidebar) {
        sidebar.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.addEventListener('click', closeSidebar);
        });
    }

    // Auth check for sidebar
    (async function updateSidebarAuth() {
        try {
            // Check if Supabase is available
            if (typeof window.supabase === 'undefined') {
                console.log('Supabase not loaded yet');
                return;
            }

            if (typeof CONFIG === 'undefined') {
                console.log('CONFIG not loaded yet');
                return;
            }
            const SUPABASE_URL = CONFIG.SUPABASE_URL;
            const SUPABASE_KEY = CONFIG.SUPABASE_KEY;
            const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            const { data: { session } } = await supabaseClient.auth.getSession();

            if (session && session.user) {
                // User is logged in
                const userName = session.user.user_metadata?.full_name ||
                    session.user.email?.split('@')[0] ||
                    'User';

                if (sidebarUserName) sidebarUserName.textContent = userName;
                if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'none';
                if (sidebarLogout) sidebarLogout.style.display = 'flex';

                // Logout handler
                if (sidebarLogout) {
                    sidebarLogout.addEventListener('click', async function (e) {
                        e.preventDefault();
                        closeSidebar();
                        try {
                            await supabaseClient.auth.signOut();
                            sessionStorage.clear();
                            localStorage.setItem('ctmLoggedOut', Date.now().toString());
                            window.location.reload();
                        } catch (err) {
                            console.error('Logout error:', err);
                        }
                    });
                }
            } else {
                // User is NOT logged in
                if (sidebarUserName) sidebarUserName.textContent = 'Guest';
                if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'flex';
                if (sidebarLogout) sidebarLogout.style.display = 'none';
            }
        } catch (err) {
            console.log('Sidebar auth check:', err);
        }
    })();
})();
