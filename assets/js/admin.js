/**
 * Admin Dashboard Logic for Customer Engine
 * Renders stats including regional breakdown.
 */

const AdminManager = {
    init() {
        if (!this.checkAuth()) {
            this.showLogin();
            return;
        }

        this.renderStats();
        this.setupEventListeners();
    },

    checkAuth() {
        return sessionStorage.getItem('caretech_admin_auth') === 'true';
    },

    login(password) {
        if (password === 'caretech@123') {
            sessionStorage.setItem('caretech_admin_auth', 'true');
            location.reload();
        } else {
            alert('Invalid Password');
        }
    },

    logout() {
        sessionStorage.removeItem('caretech_admin_auth');
        location.reload();
    },

    showLogin() {
        document.body.innerHTML = `
            <div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;gap:1rem;font-family:Inter,sans-serif;">
                <h2>Admin Login</h2>
                <input type="password" id="adminPass" placeholder="Enter Password" style="padding:10px;border:1px solid #ddd;border-radius:4px;">
                <button onclick="AdminManager.login(document.getElementById('adminPass').value)" style="padding:10px 20px;background:#ec5b5b;color:#fff;border:none;border-radius:4px;cursor:pointer;">Login</button>
            </div>
        `;
    },

    renderStats() {
        const stats = JSON.parse(localStorage.getItem('caretech_stats') || '{"totalVisitors":0,"todayClicks":0,"regions":{"IN":0,"GLF":0}}');

        const totalEl = document.getElementById('totalVisitors');
        const todayEl = document.getElementById('todayClicks');
        const indiaEl = document.getElementById('indiaVisits');
        const gulfEl = document.getElementById('gulfVisits');

        if (totalEl) totalEl.textContent = stats.totalVisitors;
        if (todayEl) todayEl.textContent = stats.todayClicks;
        if (indiaEl) indiaEl.textContent = stats.regions?.IN || 0;
        if (gulfEl) gulfEl.textContent = stats.regions?.GLF || 0;
    },

    setupEventListeners() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        document.querySelectorAll('.btn-reply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const msg = e.target.getAttribute('data-msg');
                navigator.clipboard.writeText(msg).then(() => {
                    alert('Reply copied to clipboard!');
                });
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => AdminManager.init());
window.AdminManager = AdminManager;
