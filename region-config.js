/* ============================================
   REGION CONFIG - CareTechMobile
   Multi-country support with auto-detection
   ============================================ */

const CTMRegion = {
    // Supported regions
    regions: {
        'IN': {
            code: 'IN',
            name: 'India',
            flag: '🇮🇳',
            currency: '₹',
            currencyCode: 'INR',
            phone: '+91 99620 03738',
            whatsapp: '919962003738',
            priceMultiplier: 1, // Base price
            language: 'en-IN'
        },
        'AE': {
            code: 'AE',
            name: 'UAE',
            flag: '🇦🇪',
            currency: 'AED',
            currencyCode: 'AED',
            phone: '+971 50 XXX XXXX',
            whatsapp: '919962003738', // Same for now
            priceMultiplier: 0.044, // INR to AED
            language: 'en-AE'
        },
        'SA': {
            code: 'SA',
            name: 'Saudi Arabia',
            flag: '🇸🇦',
            currency: 'SAR',
            currencyCode: 'SAR',
            phone: '+966 5X XXX XXXX',
            whatsapp: '919962003738',
            priceMultiplier: 0.045, // INR to SAR
            language: 'en-SA'
        },
        'US': {
            code: 'US',
            name: 'USA',
            flag: '🇺🇸',
            currency: '$',
            currencyCode: 'USD',
            phone: '+1 XXX XXX XXXX',
            whatsapp: '919962003738',
            priceMultiplier: 0.012, // INR to USD
            language: 'en-US'
        },
        'GB': {
            code: 'GB',
            name: 'UK',
            flag: '🇬🇧',
            currency: '£',
            currencyCode: 'GBP',
            phone: '+44 XXX XXX XXXX',
            whatsapp: '919962003738',
            priceMultiplier: 0.0095, // INR to GBP
            language: 'en-GB'
        }
    },

    currentRegion: null,

    // Initialize region detection
    init() {
        // Check localStorage first
        const saved = localStorage.getItem('ctm_region');
        if (saved && this.regions[saved]) {
            this.setRegion(saved, false);
        } else {
            // Auto-detect
            this.autoDetect();
        }

        // Create selector UI
        this.createSelector();

        // Update page content
        this.updatePageContent();

        console.log('🌍 Region initialized:', this.currentRegion);
    },

    // Auto-detect country
    async autoDetect() {
        try {
            // Try IP-based detection (free API)
            const response = await fetch('https://ipapi.co/json/', { timeout: 3000 });
            const data = await response.json();

            if (data.country_code && this.regions[data.country_code]) {
                this.setRegion(data.country_code, true);
                return;
            }
        } catch (err) {
            console.log('IP detection failed, using browser locale');
        }

        // Fallback: Browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const countryCode = browserLang.split('-')[1] || 'IN';

        if (this.regions[countryCode]) {
            this.setRegion(countryCode, true);
        } else {
            // Default to India
            this.setRegion('IN', true);
        }
    },

    // Set current region
    setRegion(code, save = true) {
        if (!this.regions[code]) {
            code = 'IN';
        }

        this.currentRegion = this.regions[code];

        if (save) {
            localStorage.setItem('ctm_region', code);
        }

        // Update UI
        this.updatePageContent();
        this.updateSelectorDisplay();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('regionChange', {
            detail: this.currentRegion
        }));
    },

    // Create region selector in header
    createSelector() {
        const selector = document.createElement('div');
        selector.className = 'region-selector';
        selector.innerHTML = `
            <button class="region-btn" id="regionToggle">
                <span class="region-flag">${this.currentRegion.flag}</span>
                <span class="region-name">${this.currentRegion.code}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="region-dropdown" id="regionDropdown">
                ${Object.values(this.regions).map(r => `
                    <div class="region-option ${r.code === this.currentRegion.code ? 'active' : ''}" 
                         data-code="${r.code}">
                        <span class="region-flag">${r.flag}</span>
                        <span class="region-name">${r.name}</span>
                        <span class="region-currency">${r.currency}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Insert after dark mode toggle or before header actions
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.insertBefore(selector, headerActions.firstChild);
        }

        // Event listeners
        const toggle = document.getElementById('regionToggle');
        const dropdown = document.getElementById('regionDropdown');

        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // Option click
        dropdown?.querySelectorAll('.region-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.setRegion(opt.dataset.code);
                dropdown.classList.remove('show');
            });
        });

        // Close on outside click
        document.addEventListener('click', () => {
            dropdown?.classList.remove('show');
        });
    },

    // Update selector display
    updateSelectorDisplay() {
        const btn = document.getElementById('regionToggle');
        if (btn && this.currentRegion) {
            btn.innerHTML = `
                <span class="region-flag">${this.currentRegion.flag}</span>
                <span class="region-name">${this.currentRegion.code}</span>
                <i class="fas fa-chevron-down"></i>
            `;
        }

        // Update active state in dropdown
        document.querySelectorAll('.region-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.code === this.currentRegion.code);
        });
    },

    // Update page content based on region
    updatePageContent() {
        if (!this.currentRegion) return;

        // Update prices (elements with data-price-inr attribute)
        document.querySelectorAll('[data-price-inr]').forEach(el => {
            const inrPrice = parseFloat(el.dataset.priceInr);
            const convertedPrice = Math.round(inrPrice * this.currentRegion.priceMultiplier);
            el.textContent = `${this.currentRegion.currency}${convertedPrice.toLocaleString()}`;
        });

        // Update WhatsApp links
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            const url = new URL(link.href);
            url.pathname = `/${this.currentRegion.whatsapp}`;
            link.href = url.toString();
        });

        // Update phone numbers (elements with class .region-phone)
        document.querySelectorAll('.region-phone').forEach(el => {
            el.textContent = this.currentRegion.phone;
        });
    },

    // Format price for display
    formatPrice(inrAmount) {
        if (!this.currentRegion) return `₹${inrAmount}`;
        const converted = Math.round(inrAmount * this.currentRegion.priceMultiplier);
        return `${this.currentRegion.currency}${converted.toLocaleString()}`;
    },

    // Get WhatsApp link
    getWhatsAppLink(message = '') {
        const base = `https://wa.me/${this.currentRegion?.whatsapp || '919962003738'}`;
        return message ? `${base}?text=${encodeURIComponent(message)}` : base;
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    CTMRegion.init();
});
