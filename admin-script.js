// ============================================
// SUPABASE CONFIGURATION - FIXED
// ============================================
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = CONFIG.SUPABASE_KEY;

// Validate URL before creating client
console.log('🔍 Supabase URL:', SUPABASE_URL);
console.log('🔑 Key length:', SUPABASE_ANON_KEY.length);

// Create Supabase client
let db;
try {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client created successfully');
} catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
}

const API_BASE = SUPABASE_URL;

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentAdmin = null;
let allRequests = [];
let allUsers = [];
let allServices = [];

// ============================================
// DOM ELEMENTS
// ============================================
const loginPage = document.getElementById('loginPage');
const adminLayout = document.getElementById('adminLayout');
const loginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ Admin Panel Initialized');

    if (!db) {
        console.error('❌ Supabase not initialized!');
        return;
    }

    await checkAuthState();
    setupEventListeners();
});

// ============================================
// ADMIN EMAILS - ADD YOUR ADMIN EMAILS HERE
// ============================================
const ADMIN_EMAILS = [
    'info@caretechmobile.com',
    'shihab2em@gmail.com'

    // Add more admin emails as needed
];

// Function to check if user is admin
function isAdmin(email) {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

// ============================================
// AUTH FUNCTIONS
// ============================================
async function checkAuthState() {
    try {
        const { data: { session } } = await db.auth.getSession();

        if (session) {
            // Check if user is an admin
            if (!isAdmin(session.user.email)) {
                console.log('❌ User is not an admin:', session.user.email);
                // Sign out non-admin user from admin panel
                await db.auth.signOut();
                showLoginPage();
                showLoginError('Access Denied! Admin privileges required.');
                return;
            }

            currentAdmin = session.user;
            showAdminPanel();
            loadAllData();
        } else {
            showLoginPage();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showLoginPage();
    }
}

function showLoginError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
}

function showLoginPage() {
    if (loginPage) loginPage.style.display = 'flex';
    if (adminLayout) adminLayout.style.display = 'none';
}

function showAdminPanel() {
    if (loginPage) loginPage.style.display = 'none';
    if (adminLayout) adminLayout.style.display = 'flex';

    if (currentAdmin) {
        const adminName = document.getElementById('adminName');
        if (adminName) {
            adminName.textContent = currentAdmin.email?.split('@')[0] || 'Admin';
        }

        const profileEmail = document.getElementById('profileEmail');
        if (profileEmail) {
            profileEmail.textContent = currentAdmin.email;
        }

        const lastLogin = document.getElementById('lastLogin');
        if (lastLogin) {
            lastLogin.textContent = new Date().toLocaleString('en-IN');
        }
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Sidebar Navigation
    document.querySelectorAll('.sidebar-menu a[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection(e.currentTarget.dataset.section);
        });
    });

    // View All buttons
    document.querySelectorAll('button[data-section]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            navigateToSection(e.currentTarget.dataset.section);
        });
    });

    // Refresh buttons
    document.getElementById('refreshRequests')?.addEventListener('click', loadRequests);
    document.getElementById('refreshUsers')?.addEventListener('click', loadUsers);
    document.getElementById('refreshServices')?.addEventListener('click', loadServices);

    // Add Service
    document.getElementById('addServiceBtn')?.addEventListener('click', () => {
        document.getElementById('addServiceModal').classList.add('active');
    });

    // Close modals
    document.getElementById('closeUpdateModal')?.addEventListener('click', closeAllModals);
    document.getElementById('closeServiceModal')?.addEventListener('click', closeAllModals);
    document.getElementById('closeEditServiceModal')?.addEventListener('click', closeAllModals);
    document.getElementById('cancelUpdateBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('cancelServiceBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('cancelEditServiceBtn')?.addEventListener('click', closeAllModals);

    // Forms
    document.getElementById('updateStatusForm')?.addEventListener('submit', handleUpdateStatus);
    document.getElementById('addServiceForm')?.addEventListener('submit', handleAddService);
    document.getElementById('editServiceForm')?.addEventListener('submit', handleEditService);
    document.getElementById('changePasswordForm')?.addEventListener('submit', handleChangePassword);

    // Password strength
    document.getElementById('newPassword')?.addEventListener('input', checkPasswordStrength);
    document.getElementById('confirmPassword')?.addEventListener('input', checkPasswordMatch);

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });
}

// ============================================
// LOGIN
// ============================================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    loginError.style.display = 'none';

    try {
        const { data, error } = await db.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // Check if user is an admin
        if (!isAdmin(data.user.email)) {
            console.log('❌ Login blocked - not an admin:', data.user.email);
            await db.auth.signOut(); // Sign out non-admin user
            throw new Error('Access Denied! Admin privileges required.');
        }

        currentAdmin = data.user;
        showAdminPanel();
        loadAllData();
        showToast('Welcome back, Admin!', 'success');

    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = error.message || 'Invalid credentials';
        loginError.style.display = 'block';
    } finally {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Admin Panel';
        loginBtn.disabled = false;
    }
}

// ============================================
// LOGOUT
// ============================================
async function handleLogout() {
    try {
        await db.auth.signOut();
        currentAdmin = null;
        showLoginPage();
        showToast('Logged out successfully', 'info');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'error');
    }
}

// ============================================
// NAVIGATION
// ============================================
function navigateToSection(sectionId) {
    // Update sidebar
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

    // Show section
    document.querySelectorAll('.section-page').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId)?.classList.add('active');

    // Update title
    const titles = {
        'dashboard': { title: 'Dashboard', subtitle: 'Overview of your business' },
        'requests': { title: 'Service Requests', subtitle: 'Manage all service requests' },
        'users': { title: 'Users', subtitle: 'All registered users' },
        'services': { title: 'Services', subtitle: 'Manage your services' },
        'payments': { title: 'Payments', subtitle: 'Payment history & reports' },
        'settings': { title: 'Settings', subtitle: 'Admin account settings' }
    };

    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    if (pageTitle) pageTitle.textContent = titles[sectionId]?.title || sectionId;
    if (pageSubtitle) pageSubtitle.textContent = titles[sectionId]?.subtitle || '';
}

// ============================================
// LOAD ALL DATA
// ============================================
async function loadAllData() {
    console.log('📊 Loading all data...');
    try {
        await Promise.all([
            loadDashboardStats(),
            loadRequests(),
            loadUsers(),
            loadServices()
        ]);
        console.log('✅ All data loaded');
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ============================================
// DASHBOARD STATS
// ============================================
async function loadDashboardStats() {
    try {
        const { count: usersCount, error: usersError } = await db
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const { count: requestsCount, error: requestsError } = await db
            .from('service_requests')
            .select('*', { count: 'exact', head: true });

        const { count: completedCount } = await db
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed');

        const { count: servicesCount, error: servicesError } = await db
            .from('services')
            .select('*', { count: 'exact', head: true });

        document.getElementById('totalUsers').textContent = usersError ? '-' : (usersCount || 0);
        document.getElementById('totalRequests').textContent = requestsError ? '-' : (requestsCount || 0);
        document.getElementById('completedRequests').textContent = completedCount || 0;
        document.getElementById('totalServices').textContent = servicesError ? '-' : (servicesCount || 0);

    } catch (error) {
        console.error('Error loading stats:', error);
        // Show dashes for all stats on error
        document.getElementById('totalUsers').textContent = '-';
        document.getElementById('totalRequests').textContent = '-';
        document.getElementById('completedRequests').textContent = '-';
        document.getElementById('totalServices').textContent = '-';
    }
}

// ============================================
// REQUESTS
// ============================================
async function loadRequests() {
    const tbody = document.getElementById('allRequestsTable');
    const recentTbody = document.getElementById('recentRequestsTable');
    try {
        const { data, error } = await db
            .from('service_requests')
            .select(`*, services (service_name)`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        allRequests = data || [];
        renderRequestsTable();
        renderRecentRequests();
        updateRequestCounts();

    } catch (error) {
        console.error('Error loading requests:', error);
        const errorMsg = `<tr><td colspan="6" class="empty-state"><i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i><h4>Could not load requests</h4><p>${error.message || 'Check database connection'}</p></td></tr>`;
        if (tbody) tbody.innerHTML = errorMsg;
        if (recentTbody) recentTbody.innerHTML = errorMsg.replace('colspan="6"', 'colspan="5"');
    }
}

function renderRequestsTable() {
    const tbody = document.getElementById('allRequestsTable');
    if (!tbody) return;

    if (allRequests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fas fa-inbox"></i><h4>No requests yet</h4></td></tr>`;
        return;
    }

    tbody.innerHTML = allRequests.map(req => `
        <tr>
            <td>#${req.id?.slice(0, 8) || 'N/A'}</td>
            <td>${req.services?.service_name || req.service_type || 'Unknown'}</td>
            <td><span class="priority-badge ${req.priority || 'normal'}">${req.priority || 'Normal'}</span></td>
            <td><span class="status-badge ${req.status}">${formatStatus(req.status)}</span></td>
            <td>${formatDate(req.created_at)}</td>
            <td>
                <button class="btn-icon" onclick="viewRequest('${req.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="openUpdateModal('${req.id}')"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderRecentRequests() {
    const tbody = document.getElementById('recentRequestsTable');
    if (!tbody) return;

    const recent = allRequests.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fas fa-inbox"></i><p>No requests yet</p></td></tr>`;
        return;
    }

    tbody.innerHTML = recent.map(req => `
        <tr>
            <td>#${req.id?.slice(0, 8) || 'N/A'}</td>
            <td>${req.services?.service_name || req.service_type || 'Unknown'}</td>
            <td><span class="status-badge ${req.status}">${formatStatus(req.status)}</span></td>
            <td>${formatDate(req.created_at)}</td>
            <td><button class="btn-icon" onclick="openUpdateModal('${req.id}')"><i class="fas fa-edit"></i></button></td>
        </tr>
    `).join('');
}

function updateRequestCounts() {
    const pending = document.getElementById('pendingCount');
    const progress = document.getElementById('progressCount');
    const completed = document.getElementById('completedCount');

    if (pending) pending.textContent = allRequests.filter(r => r.status === 'pending').length;
    if (progress) progress.textContent = allRequests.filter(r => r.status === 'in_progress').length;
    if (completed) completed.textContent = allRequests.filter(r => r.status === 'completed').length;
}

// ============================================
// USERS
// ============================================
async function loadUsers() {
    const tbody = document.getElementById('allUsersTable');
    try {
        const { data, error } = await db
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allUsers = data || [];
        renderUsersTable();

    } catch (error) {
        console.error('Error loading users:', error);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-state"><i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i><h4>Could not load users</h4><p>${error.message || 'Check database connection'}</p></td></tr>`;
        }
    }
}

function renderUsersTable() {
    const tbody = document.getElementById('allUsersTable');
    if (!tbody) return;

    if (allUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state"><i class="fas fa-users"></i><h4>No users yet</h4></td></tr>`;
        return;
    }

    tbody.innerHTML = allUsers.map(user => {
        // Check if user is admin
        const userIsAdmin = isAdmin(user.email);
        const planDisplay = userIsAdmin ? 'Admin' : (user.plan || 'Free');
        const planClass = userIsAdmin ? 'admin' : (user.plan || 'free');

        return `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}</div>
                    <div><strong>${user.full_name || 'Unknown'}</strong><br><small>${user.email || ''}</small></div>
                </div>
            </td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="plan-badge ${planClass}">${planDisplay}</span></td>
            <td>${formatDate(user.created_at)}</td>
        </tr>
    `}).join('');
}

// ============================================
// SERVICES
// ============================================
async function loadServices() {
    const tbody = document.getElementById('allServicesTable');
    try {
        const { data, error } = await db
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allServices = data || [];
        renderServicesTable();

    } catch (error) {
        console.error('Error loading services:', error);
        // Show error state instead of endless loading
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i><h4>Could not load services</h4><p>${error.message || 'Database table may not exist'}</p><button class="btn-sm btn-outline" onclick="loadServices()"><i class="fas fa-sync-alt"></i> Retry</button></td></tr>`;
        }
    }
}

function renderServicesTable() {
    const tbody = document.getElementById('allServicesTable');
    if (!tbody) return;

    if (allServices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fas fa-cogs"></i><h4>No services yet</h4><p>Click "Add Service" to create one</p></td></tr>`;
        return;
    }

    tbody.innerHTML = allServices.map(service => `
        <tr>
            <td><strong>${service.service_name || service.name}</strong></td>
            <td><span class="category-badge">${getCategoryIcon(service.category)} ${service.category || 'General'}</span></td>
            <td>₹${service.price || 0}</td>
            <td><span class="status-badge ${service.active ? 'completed' : 'cancelled'}">${service.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button class="btn-icon" onclick="openEditServiceModal('${service.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteService('${service.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// UPDATE REQUEST
// ============================================
function openUpdateModal(requestId) {
    const request = allRequests.find(r => r.id === requestId);
    if (!request) return;

    document.getElementById('updateRequestId').value = requestId;
    document.getElementById('newStatus').value = request.status || 'pending';
    document.getElementById('estimatedCost').value = request.estimated_cost || '';
    document.getElementById('finalCost').value = request.final_cost || '';
    document.getElementById('adminNotes').value = request.admin_notes || '';

    document.getElementById('updateStatusModal').classList.add('active');
}

async function handleUpdateStatus(e) {
    e.preventDefault();

    const requestId = document.getElementById('updateRequestId').value;
    const updates = {
        status: document.getElementById('newStatus').value,
        estimated_cost: document.getElementById('estimatedCost').value || null,
        final_cost: document.getElementById('finalCost').value || null,
        admin_notes: document.getElementById('adminNotes').value,
        updated_at: new Date().toISOString()
    };

    try {
        const { error } = await db
            .from('service_requests')
            .update(updates)
            .eq('id', requestId);

        if (error) throw error;

        showToast('Request updated!', 'success');
        closeAllModals();
        loadRequests();
        loadDashboardStats();

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to update', 'error');
    }
}

// ============================================
// ADD SERVICE
// ============================================
async function handleAddService(e) {
    e.preventDefault();

    const newService = {
        service_name: document.getElementById('serviceName').value.trim(),
        category: document.getElementById('serviceCategory').value,
        price: parseInt(document.getElementById('servicePrice').value) || 0,
        description: document.getElementById('serviceDesc').value.trim(),
        active: true,
        created_at: new Date().toISOString()
    };

    try {
        const { error } = await db.from('services').insert([newService]);

        if (error) throw error;

        showToast('Service added!', 'success');
        closeAllModals();
        document.getElementById('addServiceForm').reset();
        loadServices();
        loadDashboardStats();

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to add service', 'error');
    }
}

// ============================================
// EDIT SERVICE
// ============================================
function openEditServiceModal(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;

    document.getElementById('editServiceId').value = serviceId;
    document.getElementById('editServiceName').value = service.service_name || service.name || '';
    document.getElementById('editServiceCategory').value = service.category || 'repair';
    document.getElementById('editServicePrice').value = service.price || 0;
    document.getElementById('editServiceDesc').value = service.description || '';
    document.getElementById('editServiceStatus').value = service.active ? 'true' : 'false';

    document.getElementById('editServiceModal').classList.add('active');
}

async function handleEditService(e) {
    e.preventDefault();

    const serviceId = document.getElementById('editServiceId').value;
    const updates = {
        service_name: document.getElementById('editServiceName').value.trim(),
        category: document.getElementById('editServiceCategory').value,
        price: parseInt(document.getElementById('editServicePrice').value) || 0,
        description: document.getElementById('editServiceDesc').value.trim(),
        active: document.getElementById('editServiceStatus').value === 'true',
        updated_at: new Date().toISOString()
    };

    try {
        const { error } = await db.from('services').update(updates).eq('id', serviceId);

        if (error) throw error;

        showToast('Service updated!', 'success');
        closeAllModals();
        loadServices();

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to update', 'error');
    }
}

// ============================================
// DELETE SERVICE
// ============================================
async function deleteService(serviceId) {
    if (!confirm('Delete this service?')) return;

    try {
        const { error } = await db.from('services').delete().eq('id', serviceId);

        if (error) throw error;

        showToast('Service deleted!', 'success');
        loadServices();
        loadDashboardStats();

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to delete', 'error');
    }
}

// ============================================
// CHANGE PASSWORD
// ============================================
async function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const successAlert = document.getElementById('passwordSuccess');
    const errorAlert = document.getElementById('passwordError');
    const errorMsg = document.getElementById('passwordErrorMsg');
    const btn = document.getElementById('changePasswordBtn');

    if (successAlert) successAlert.style.display = 'none';
    if (errorAlert) errorAlert.style.display = 'none';

    if (newPassword.length < 6) {
        if (errorMsg) errorMsg.textContent = 'Password must be at least 6 characters';
        if (errorAlert) errorAlert.style.display = 'flex';
        return;
    }

    if (newPassword !== confirmPassword) {
        if (errorMsg) errorMsg.textContent = 'Passwords do not match';
        if (errorAlert) errorAlert.style.display = 'flex';
        return;
    }

    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        btn.disabled = true;
    }

    try {
        const { error } = await db.auth.updateUser({ password: newPassword });

        if (error) throw error;

        if (successAlert) successAlert.style.display = 'flex';
        document.getElementById('changePasswordForm')?.reset();

        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        if (strengthFill) strengthFill.style.width = '0%';
        if (strengthText) strengthText.textContent = '';

    } catch (error) {
        console.error('Error:', error);
        if (errorMsg) errorMsg.textContent = error.message || 'Failed to update password';
        if (errorAlert) errorAlert.style.display = 'flex';
    } finally {
        if (btn) {
            btn.innerHTML = '<i class="fas fa-save"></i> Update Password';
            btn.disabled = false;
        }
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('newPassword')?.value || '';
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const reqLength = document.getElementById('req-length');

    if (reqLength) {
        if (password.length >= 6) {
            reqLength.classList.add('valid');
        } else {
            reqLength.classList.remove('valid');
        }
    }

    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    strength = Math.min(strength, 100);

    if (strengthFill) {
        strengthFill.style.width = strength + '%';

        if (strength < 30) {
            strengthFill.style.background = '#e74c3c';
        } else if (strength < 60) {
            strengthFill.style.background = '#f39c12';
        } else if (strength < 80) {
            strengthFill.style.background = '#3498db';
        } else {
            strengthFill.style.background = '#27ae60';
        }
    }

    if (strengthText) {
        if (strength < 30) {
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#e74c3c';
        } else if (strength < 60) {
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#f39c12';
        } else if (strength < 80) {
            strengthText.textContent = 'Good';
            strengthText.style.color = '#3498db';
        } else {
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#27ae60';
        }
    }

    checkPasswordMatch();
}

function checkPasswordMatch() {
    const newPass = document.getElementById('newPassword')?.value || '';
    const confirmPass = document.getElementById('confirmPassword')?.value || '';
    const reqMatch = document.getElementById('req-match');

    if (reqMatch) {
        if (confirmPass.length > 0 && newPass === confirmPass) {
            reqMatch.classList.add('valid');
        } else {
            reqMatch.classList.remove('valid');
        }
    }
}

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input || !button) return;

    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// ============================================
// UTILITIES
// ============================================
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status || 'Unknown';
}

function getCategoryIcon(category) {
    const icons = {
        'repair': '🔧',
        'software': '💻',
        'automation': '🤖',
        'consulting': '📊'
    };
    return icons[category] || '📦';
}

function viewRequest(requestId) {
    openUpdateModal(requestId);
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.log(`Toast [${type}]: ${message}`);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };

    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// GLOBAL FUNCTIONS (for onclick handlers)
// ============================================
window.viewRequest = viewRequest;
window.openUpdateModal = openUpdateModal;
window.openEditServiceModal = openEditServiceModal;
window.deleteService = deleteService;
window.togglePasswordVisibility = togglePasswordVisibility;

console.log('📜 Admin script loaded successfully');