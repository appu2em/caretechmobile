/**
 * Mobile Menu Handler
 * CareTechMobile - Customer Engine
 */

(function () {
    'use strict';

    // Create mobile menu HTML
    function createMobileMenu() {
        // Check if already exists
        if (document.querySelector('.mobile-sidebar')) return;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.id = 'mobileOverlay';

        // Create sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'mobile-sidebar';
        sidebar.id = 'mobileSidebar';

        sidebar.innerHTML = `
            <div class="sidebar-header">
                <span class="sidebar-logo">CareTechMobile</span>
                <button class="sidebar-close" id="sidebarClose">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            <nav class="sidebar-nav">
                <a href="/">
                    <span class="nav-icon">🏠</span>
                    Home
                </a>
                
                <div class="sidebar-section">Categories</div>
                
                <a href="/shop/">
                    <span class="nav-icon">🛒</span>
                    Shop / Retail
                </a>
                <a href="/service/">
                    <span class="nav-icon">🔧</span>
                    Service Business
                </a>
                <a href="/agency/">
                    <span class="nav-icon">🏢</span>
                    Agency / Company
                </a>
                <a href="/restaurant/">
                    <span class="nav-icon">🍽️</span>
                    Restaurant
                </a>
                <a href="/healthcare/">
                    <span class="nav-icon">🏥</span>
                    Healthcare
                </a>
                <a href="/education/">
                    <span class="nav-icon">🎓</span>
                    Education
                </a>
                <a href="/real-estate/">
                    <span class="nav-icon">🏠</span>
                    Real Estate
                </a>
                <a href="/automobile/">
                    <span class="nav-icon">🚗</span>
                    Automobile
                </a>
                <a href="/salon/">
                    <span class="nav-icon">💇</span>
                    Salon / Spa
                </a>
                <a href="/logistics/">
                    <span class="nav-icon">🚚</span>
                    Logistics
                </a>
                
                <div class="sidebar-section">Quick Links</div>
                
                <a href="/#pricing">
                    <span class="nav-icon">💰</span>
                    Pricing
                </a>
                <a href="/contact.html">
                    <span class="nav-icon">📞</span>
                    Contact Us
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <a href="https://wa.me/919962003738?text=Hi%2C%20I%20want%20to%20know%20more%20about%20CareTechMobile" 
                   class="sidebar-cta" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                </a>
            </div>
        `;

        // Append to body
        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);

        // Add event listeners
        attachEventListeners();

        // Mark current page as active
        markActivePage();
    }

    // Attach event listeners
    function attachEventListeners() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('mobileOverlay');
        const closeBtn = document.getElementById('sidebarClose');

        if (menuToggle) {
            menuToggle.addEventListener('click', function (e) {
                e.preventDefault();
                openMenu();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Close on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        // Close menu on link click (for same-page anchors)
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        sidebarLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                // Small delay to allow navigation
                setTimeout(closeMenu, 100);
            });
        });
    }

    // Open menu
    function openMenu() {
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('mobileOverlay');
        const menuToggle = document.querySelector('.menu-toggle');

        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (menuToggle) menuToggle.classList.add('active');
        document.body.classList.add('menu-open');
    }

    // Close menu
    function closeMenu() {
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('mobileOverlay');
        const menuToggle = document.querySelector('.menu-toggle');

        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Mark active page in sidebar
    function markActivePage() {
        const currentPath = window.location.pathname;
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

        sidebarLinks.forEach(function (link) {
            const href = link.getAttribute('href');

            // Check for exact match or starts with (for subpages)
            if (currentPath === href ||
                (href !== '/' && currentPath.startsWith(href))) {
                link.classList.add('active');
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMobileMenu);
    } else {
        createMobileMenu();
    }

})();
