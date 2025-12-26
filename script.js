// ===============================================
// CareTechMobile - Complete JavaScript
// Author: Shihab Rajendran
// Version: 1.0
// ===============================================
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
        
        // Close on link click
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
});
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && !e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-toggle')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// ===== STICKY HEADER ON SCROLL =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ANIMATE ON SCROLL (AOS) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.service-card, .tool-card, .earning-card, .software-card, .resource-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animate-in styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== SEARCH FUNCTIONALITY =====
function setupSearch(searchInputId, itemSelector) {
    const searchInput = document.getElementById(searchInputId);
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll(itemSelector);
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Setup search for different pages
setupSearch('toolSearch', '.tool-card');
setupSearch('softwareSearch', '.software-card');
setupSearch('earningSearch', '.earning-card');

// ===== FILTER FUNCTIONALITY =====
function setupFilters(filterClass, itemSelector) {
    const filterBtns = document.querySelectorAll(filterClass);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-category');
            const items = document.querySelectorAll(itemSelector);
            
            items.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Setup filters for different pages
setupFilters('.filter-btn', '.tool-card');
setupFilters('.category-filter', '.software-card');

// ===== TABS FUNCTIONALITY =====
function setupTabs(tabClass, contentClass) {
    const tabs = document.querySelectorAll(tabClass);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            
            // Hide all content
            document.querySelectorAll(contentClass).forEach(content => {
                content.classList.remove('active');
            });
            
            // Show target content
            const targetId = this.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZXVnZ3J6bWR0Y29ybHZsYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTI3MDMsImV4cCI6MjA4MTAyODcwM30.dVAunvwATOX1_WMD4KU-O1hgCx0iqa1KGAxHC-n1ndM"; // <-- PASTE HERE!
// Setup tabs if they exist
setupTabs('.tab-btn', '.tab-content');

// ===== MODAL FUNCTIONALITY =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text, buttonElement) {
    // Modern clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            showCopyFeedback(buttonElement);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(buttonElement);
        } catch (err) {
            console.error('Copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(element) {
    if (!element) return;
    
    const originalText = element.innerHTML;
    element.innerHTML = '<i class="fas fa-check"></i> Copied!';
    element.style.background = '#10B981';
    
    setTimeout(() => {
        element.innerHTML = originalText;
        element.style.background = '';
    }, 2000);
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[^0-9]/g, ''));
}

// Form submission handler
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        // Let specific forms handle their own submission
        if (this.hasAttribute('data-custom-submit')) {
            return;
        }
        
        // Don't prevent default for forms with specific IDs
        const formId = this.id;
        if (formId === 'loginForm' || formId === 'newsletterForm') {
            return;
        }
        
        e.preventDefault();
        
        const formData = new FormData(this);
        console.log('Form submitted:', Object.fromEntries(formData));
        
        // Show success message
        showToast('Form submitted successfully!', 'success');
        this.reset();
    });
});

// ===== WHATSAPP CONTACT FUNCTIONS =====
function contactViaWhatsApp(message) {
    const phone = '919962003738';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
}

function bookService(serviceName, price) {
    const message = `*Service Booking Request*\n\nService: ${serviceName}\nPrice: ${price}\n\nI want to book this service. Please provide details.`;
    contactViaWhatsApp(message);
}

function downloadSoftware(softwareName) {
    const message = `*Software Download Request*\n\nSoftware: ${softwareName}\n\nPlease send me the download link and installation instructions.`;
    contactViaWhatsApp(message);
}

// ===== LOADING SPINNER =====
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading-spinner';
    loader.innerHTML = '<div class="spinner"></div>';
    loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
    
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid #15C39A;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loading-spinner');
    if (loader) {
        loader.remove();
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:30px;right:30px;padding:1rem 1.5rem;background:#15C39A;color:white;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;animation:slideIn 0.3s ease;';
    
    if (type === 'error') {
        toast.style.background = '#EF4444';
    } else if (type === 'warning') {
        toast.style.background = '#F59E0B';
    } else if (type === 'success') {
        toast.style.background = '#10B981';
    }
    
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(toastStyle);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate counters when in viewport
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, 0, target, 2000);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(counter => {
    counterObserver.observe(counter);
});

// ===== LAZY LOADING IMAGES =====
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = 'position:fixed;bottom:100px;right:30px;width:50px;height:50px;background:#2D3748;color:white;border:none;border-radius:50%;cursor:pointer;opacity:0;transition:opacity 0.3s;z-index:998;display:none;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);';

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'flex';
        setTimeout(() => backToTopBtn.style.opacity = '1', 10);
    } else {
        backToTopBtn.style.opacity = '0';
        setTimeout(() => backToTopBtn.style.display = 'none', 300);
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== PRICE FORMATTER =====
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(price);
}

// ===== DATE FORMATTER =====
function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// ===== LOCAL STORAGE HELPERS =====
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
};

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c CareTechMobile ', 'background: #15C39A; color: white; font-size: 20px; padding: 10px;');
console.log('%c Built by Shihab Rajendran ', 'background: #2D3748; color: white; font-size: 14px; padding: 5px;');
console.log('Website: https://caretechmobile.com');
console.log('Need help? WhatsApp: +91 9962003738');

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.CareTechMobile = {
    openModal,
    closeModal,
    showLoading,
    hideLoading,
    showToast,
    copyToClipboard,
    contactViaWhatsApp,
    bookService,
    downloadSoftware,
    formatPrice,
    formatDate,
    storage
};
function showAllHelp() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => item.style.display = 'block');
}
async function signupUser(email, password, name, phone) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    showToast(error.message, "error");
    return;
  }

  const user = data.user;

  if (user) {
    await supabase
      .from("profiles")
      .update({
        name: name,
        phone: phone
      })
      .eq("id", user.id);
  }

  showToast("Signup successful! Please login.", "success");
}
async function loginUser(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showToast(error.message, "error");
    return;
  }

  window.location.href = "dashboard.html";
}


console.log('✅ CareTechMobile JavaScript loaded successfully!');
// ========== MOBILE MENU TOGGLE ==========
document.addEventListener('DOMContentLoaded', function() {
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            console.log('Menu toggled');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header')) {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        });
    });

});
