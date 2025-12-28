/**
 * Region Detector for Customer Engine
 * Detects if user is in India or Gulf based on Timezone.
 * Used by: whatsapp.js, admin.js, tracking.js
 */

const RegionManager = {
    region: 'IN', // Default to India

    // List of Gulf timezones
    gulfTimezones: [
        'Asia/Dubai',
        'Asia/Riyadh',
        'Asia/Qatar',
        'Asia/Kuwait',
        'Asia/Muscat',
        'Asia/Bahrain'
    ],

    init() {
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('Detected Timezone:', timeZone);

            // Check for India
            if (timeZone === 'Asia/Calcutta' || timeZone === 'Asia/Kolkata') {
                this.region = 'IN';
            }
            // Check for Gulf
            else if (this.gulfTimezones.includes(timeZone)) {
                this.region = 'GLF';
            }
            // Default to India for unknown
            else {
                this.region = 'IN';
            }

            // Save to localStorage for persistence
            localStorage.setItem('caretech_region', this.region);

            console.log('Region set to:', this.region);
            this.applyRegion();

            // Dispatch event for other modules
            window.dispatchEvent(new CustomEvent('regionDetected', { detail: { region: this.region } }));

        } catch (e) {
            console.error('Region detection failed, defaulting to IN', e);
        }
    },

    getRegion() {
        // Try localStorage first for consistency
        const saved = localStorage.getItem('caretech_region');
        if (saved) return saved;
        return this.region;
    },

    getRegionTag() {
        return this.region === 'GLF' ? '#GulfUser' : '#IndiaUser';
    },

    applyRegion() {
        // Add a class to body for CSS overrides
        document.body.classList.remove('region-in', 'region-glf');
        document.body.classList.add('region-' + this.region.toLowerCase());

        // Logic to show/hide region specific elements
        document.querySelectorAll('[data-region]').forEach(el => {
            const allowedRegions = el.getAttribute('data-region').split(',');
            if (allowedRegions.includes(this.region)) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => RegionManager.init());
window.RegionManager = RegionManager; // Expose globally
