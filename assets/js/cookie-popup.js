/**
 * Cookie Consent Popup Logic
 */
(function () {
    'use strict';

    function initCookiePopup() {
        // specific key used to hide popup once action taken
        const CONSENT_KEY = 'caretech_cookie_consent';

        // If already consented/rejected, do nothing
        if (localStorage.getItem(CONSENT_KEY)) return;

        // Create style link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/css/cookie-popup.css';
        document.head.appendChild(link);

        // Create Popup HTML
        const popup = document.createElement('div');
        popup.className = 'cookie-overlay';
        popup.innerHTML = `
            <div class="cookie-title">We value your privacy</div>
            <div class="cookie-text">
                We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.
            </div>
            <div class="cookie-buttons">
                <button class="btn-cookie btn-customize" id="btnCustomize">Customize</button>
                <button class="btn-cookie btn-reject" id="btnReject">Reject All</button>
                <button class="btn-cookie btn-accept" id="btnAccept">Accept All</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Show with slight delay
        setTimeout(() => {
            popup.classList.add('active');
        }, 1000);

        // Button Actions
        document.getElementById('btnAccept').addEventListener('click', () => {
            localStorage.setItem(CONSENT_KEY, 'accepted');
            closePopup();
        });

        document.getElementById('btnReject').addEventListener('click', () => {
            localStorage.setItem(CONSENT_KEY, 'rejected');
            closePopup();
        });

        document.getElementById('btnCustomize').addEventListener('click', () => {
            alert('Customize options coming soon!');
        });

        function closePopup() {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
            }, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookiePopup);
    } else {
        initCookiePopup();
    }
})();
