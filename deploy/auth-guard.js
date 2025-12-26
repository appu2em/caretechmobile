// ============================================
// auth-guard.js - Login Required System
// ============================================

const AuthGuard = {
    
    // Pages that DON'T need login (public pages)
    publicPages: [
        'index.html',
        '404.html',
        'privacy.html',
        'terms.html',
        'sitemap.html',
        'contact.html',
        'refund.html'
    ],
    
    // Pages that need login
    protectedPages: [
        'dashboard.html',
        'profile.html',
        'admin.html',
        'notification-center.html',
        'ai-tools.html',
        'earning-hub.html',
        'help-center.html',
        'membership.html',
        'payment.html',
        'resources.html',
        'services.html',
        'services-list.html',
        'software.html'
    ],
    
    // Pages that need PAID membership
    premiumPages: [
        'ai-tools.html',
        'earning-hub.html',
        'resources.html',
        'software.html'
    ],
    
    // Check if current page needs auth
    isProtectedPage: function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        return this.protectedPages.some(page => currentPage.includes(page));
    },
    
    // Check if current page needs premium
    isPremiumPage: function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        return this.premiumPages.some(page => currentPage.includes(page));
    },
    
    // Get current user
    getCurrentUser: async function() {
        if (!supabaseClient) {
            console.error('Supabase not initialized');
            return null;
        }
        
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            return user;
        } catch (error) {
            console.error('Auth error:', error);
            return null;
        }
    },
    
    // Get user profile with membership info
    getUserProfile: async function(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Profile error:', error);
            return null;
        }
    },
    
    // Check membership status
    checkMembership: function(profile) {
        if (!profile) return 'free';
        
        const plan = profile.plan || 'free';
        const expiryDate = profile.plan_expiry;
        
        // Check if plan expired
        if (expiryDate && new Date(expiryDate) < new Date()) {
            return 'expired';
        }
        
        return plan; // 'free', 'pro', 'premium'
    },
    
    // Main guard function - call on every page load
    guard: async function() {
        console.log('🔐 AuthGuard checking...');
        
        // Wait for Supabase to initialize
        await this.waitForSupabase();
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Skip for public pages
        if (this.publicPages.some(page => currentPage.includes(page))) {
            console.log('✅ Public page - no auth needed');
            return { allowed: true, user: null };
        }
        
        // Check if page needs auth
        if (this.isProtectedPage()) {
            const user = await this.getCurrentUser();
            
            if (!user) {
                console.log('❌ Not logged in - redirecting...');
                this.showLoginModal();
                return { allowed: false, user: null };
            }
            
            console.log('✅ User logged in:', user.email);
            
            // Check premium pages
            if (this.isPremiumPage()) {
                const profile = await this.getUserProfile(user.id);
                const membership = this.checkMembership(profile);
                
                if (membership === 'free') {
                    console.log('⚠️ Premium required');
                    this.showUpgradeModal();
                    return { allowed: false, user: user, reason: 'premium_required' };
                }
                
                if (membership === 'expired') {
                    console.log('⚠️ Membership expired');
                    this.showRenewModal();
                    return { allowed: false, user: user, reason: 'expired' };
                }
            }
            
            return { allowed: true, user: user };
        }
        
        return { allowed: true, user: null };
    },
    
    // Wait for Supabase
    waitForSupabase: function() {
        return new Promise((resolve) => {
            const check = () => {
                if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    },
    
    // Show login modal
    showLoginModal: function() {
        // Create modal if not exists
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div id="authModal" class="auth-modal">
                    <div class="auth-modal-content">
                        <div class="auth-modal-header">
                            <h2>🔐 Login Required</h2>
                            <p>Please login to access this page</p>
                        </div>
                        
                        <div class="auth-tabs">
                            <button class="auth-tab active" onclick="AuthGuard.switchTab('login')">Login</button>
                            <button class="auth-tab" onclick="AuthGuard.switchTab('signup')">Sign Up</button>
                        </div>
                        
                        <!-- Login Form -->
                        <form id="authLoginForm" class="auth-form">
                            <div class="form-group">
                                <label><i class="fas fa-envelope"></i> Email</label>
                                <input type="email" id="authEmail" placeholder="Enter email" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-lock"></i> Password</label>
                                <input type="password" id="authPassword" placeholder="Enter password" required>
                            </div>
                            <button type="submit" class="btn-auth-submit">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </form>
                        
                        <!-- Signup Form -->
                        <form id="authSignupForm" class="auth-form hidden">
                            <div class="form-group">
                                <label><i class="fas fa-user"></i> Full Name</label>
                                <input type="text" id="authName" placeholder="Your name" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-phone"></i> Phone</label>
                                <input type="tel" id="authPhone" placeholder="10-digit number" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-envelope"></i> Email</label>
                                <input type="email" id="authSignupEmail" placeholder="Enter email" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-lock"></i> Password</label>
                                <input type="password" id="authSignupPassword" placeholder="Min 6 characters" required>
                            </div>
                            <button type="submit" class="btn-auth-submit">
                                <i class="fas fa-user-plus"></i> Create Account
                            </button>
                        </form>
                        
                        <div class="auth-divider"><span>OR</span></div>
                        
                        <button class="btn-whatsapp-login" onclick="AuthGuard.whatsappLogin()">
                            <i class="fab fa-whatsapp"></i> Continue with WhatsApp
                        </button>
                        
                        <p class="auth-footer">
                            <a href="index.html">← Back to Home</a>
                        </p>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.attachFormListeners();
        }
        
        document.getElementById('authModal').classList.add('active');
    },
    
    // Show upgrade modal
    showUpgradeModal: function() {
        const modalHTML = `
            <div id="upgradeModal" class="auth-modal active">
                <div class="auth-modal-content">
                    <div class="auth-modal-header">
                        <h2>👑 Premium Required</h2>
                        <p>This content is for premium members only</p>
                    </div>
                    
                    <div class="upgrade-features">
                        <h4>Premium Features:</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> Access all AI Tools</li>
                            <li><i class="fas fa-check"></i> Earning Hub resources</li>
                            <li><i class="fas fa-check"></i> Premium downloads</li>
                            <li><i class="fas fa-check"></i> Priority support</li>
                        </ul>
                    </div>
                    
                    <div class="upgrade-price">
                        <span class="price">₹299</span>
                        <span class="period">/month</span>
                    </div>
                    
                    <a href="pages/membership.html" class="btn-upgrade">
                        <i class="fas fa-crown"></i> Upgrade Now
                    </a>
                    
                    <p class="auth-footer">
                        <a href="dashboard.html">← Back to Dashboard</a>
                    </p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    // Show renew modal
    showRenewModal: function() {
        const modalHTML = `
            <div id="renewModal" class="auth-modal active">
                <div class="auth-modal-content">
                    <div class="auth-modal-header">
                        <h2>⏰ Membership Expired</h2>
                        <p>Your premium membership has expired</p>
                    </div>
                    
                    <p style="text-align:center;color:#888;margin:20px 0;">
                        Renew now to continue accessing premium features
                    </p>
                    
                    <a href="pages/membership.html" class="btn-upgrade">
                        <i class="fas fa-sync"></i> Renew Membership
                    </a>
                    
                    <p class="auth-footer">
                        <a href="dashboard.html">← Back to Dashboard</a>
                    </p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    // Switch between login/signup tabs
    switchTab: function(tab) {
        const loginForm = document.getElementById('authLoginForm');
        const signupForm = document.getElementById('authSignupForm');
        const tabs = document.querySelectorAll('.auth-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        
        if (tab === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            tabs[0].classList.add('active');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            tabs[1].classList.add('active');
        }
    },
    
    // Attach form listeners
    attachFormListeners: function() {
        // Login form
        document.getElementById('authLoginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const btn = e.target.querySelector('button');
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            btn.disabled = true;
            
            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email, password
                });
                
                if (error) throw error;
                
                showToast('Login successful!', 'success');
                document.getElementById('authModal').remove();
                window.location.reload();
                
            } catch (error) {
                showToast(error.message, 'error');
                btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                btn.disabled = false;
            }
        });
        
        // Signup form
        document.getElementById('authSignupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('authName').value;
            const phone = document.getElementById('authPhone').value;
            const email = document.getElementById('authSignupEmail').value;
            const password = document.getElementById('authSignupPassword').value;
            const btn = e.target.querySelector('button');
            
            if (password.length < 6) {
                showToast('Password must be 6+ characters', 'error');
                return;
            }
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
            btn.disabled = true;
            
            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email, password,
                    options: { data: { full_name: name } }
                });
                
                if (error) throw error;
                
                // Update profile
                if (data.user) {
                    await supabaseClient.from('profiles').update({
                        full_name: name,
                        phone: phone
                    }).eq('id', data.user.id);
                }
                
                showToast('Account created! Check email to verify.', 'success');
                this.switchTab('login');
                
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
                btn.disabled = false;
            }
        });
    },
    
    // WhatsApp login
    whatsappLogin: function() {
        const msg = encodeURIComponent('Hi! I want to login to CareTechMobile dashboard.');
        window.open(`https://wa.me/${CONFIG.ADMIN_WHATSAPP}?text=${msg}`, '_blank');
    },
    
    // Logout
    logout: async function() {
        await supabaseClient.auth.signOut();
        window.location.href = 'index.html';
    }
};

// ============================================
// AUTH MODAL STYLES
// ============================================
const authStyles = document.createElement('style');
authStyles.textContent = `
    .auth-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .auth-modal.active {
        display: flex;
    }
    
    .auth-modal-content {
        background: #1a1a2e;
        border-radius: 25px;
        padding: 40px;
        max-width: 420px;
        width: 100%;
        border: 1px solid rgba(255,255,255,0.1);
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .auth-modal-header {
        text-align: center;
        margin-bottom: 25px;
    }
    
    .auth-modal-header h2 {
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    
    .auth-modal-header p {
        color: #888;
    }
    
    .auth-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
    }
    
    .auth-tab {
        flex: 1;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border: none;
        color: #aaa;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
    }
    
    .auth-tab.active {
        background: #15C39A;
        color: #fff;
    }
    
    .auth-form .form-group {
        margin-bottom: 18px;
    }
    
    .auth-form label {
        display: block;
        margin-bottom: 8px;
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .auth-form label i {
        margin-right: 8px;
        color: #15C39A;
    }
    
    .auth-form input {
        width: 100%;
        padding: 14px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 10px;
        color: #fff;
        font-size: 1rem;
    }
    
    .auth-form input:focus {
        outline: none;
        border-color: #15C39A;
    }
    
    .btn-auth-submit {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #15C39A, #0ea57f);
        border: none;
        border-radius: 10px;
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .btn-auth-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(21,195,154,0.3);
    }
    
    .btn-auth-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    .auth-divider {
        text-align: center;
        margin: 25px 0;
        position: relative;
    }
    
    .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(255,255,255,0.1);
    }
    
    .auth-divider span {
        background: #1a1a2e;
        padding: 0 15px;
        color: #666;
        position: relative;
    }
    
    .btn-whatsapp-login {
        width: 100%;
        padding: 14px;
        background: #25D366;
        border: none;
        border-radius: 10px;
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s;
    }
    
    .btn-whatsapp-login:hover {
        background: #20bd5a;
    }
    
    .auth-footer {
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.9rem;
    }
    
    .auth-footer a {
        color: #15C39A;
        text-decoration: none;
    }
    
    .upgrade-features {
        background: rgba(255,255,255,0.03);
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
    }
    
    .upgrade-features h4 {
        margin-bottom: 15px;
        color: #15C39A;
    }
    
    .upgrade-features ul {
        list-style: none;
    }
    
    .upgrade-features li {
        padding: 8px 0;
        color: #ccc;
    }
    
    .upgrade-features li i {
        color: #15C39A;
        margin-right: 10px;
    }
    
    .upgrade-price {
        text-align: center;
        margin: 25px 0;
    }
    
    .upgrade-price .price {
        font-size: 3rem;
        font-weight: 700;
        color: #15C39A;
    }
    
    .upgrade-price .period {
        color: #888;
    }
    
    .btn-upgrade {
        display: block;
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #ffc107, #ff9800);
        border: none;
        border-radius: 10px;
        color: #000;
        font-size: 1rem;
        font-weight: 700;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
    }
    
    .hidden { display: none !important; }
`;
document.head.appendChild(authStyles);

// ============================================
// AUTO-RUN ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    // Wait a bit for Supabase to init
    setTimeout(async () => {
        await AuthGuard.guard();
    }, 500);
});

// Export
window.AuthGuard = AuthGuard;