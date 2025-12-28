/**
 * WhatsApp Manager for Customer Engine
 * Generates dynamic WhatsApp links with region tags.
 */

const WhatsappManager = {
    baseNumber: '919962003738', // Owner's number

    init() {
        this.updateLinks();
    },

    updateLinks() {
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            // Get region tag from RegionManager
            const regionTag = window.RegionManager ? window.RegionManager.getRegionTag() : '#IndiaUser';

            // 1. Check if button has a specific message defined
            let message = link.getAttribute('data-message');

            if (!message) {
                // 2. Default fallback if no specific message
                message = `Hi, I viewed your demo and want this system for my business.`;
            }

            // 3. Append region tag for analytics
            message += ` ${regionTag}`;

            // Override with strict link
            const finalUrl = `https://wa.me/${this.baseNumber}?text=${encodeURIComponent(message)}`;

            link.href = finalUrl;
            link.target = '_blank';

            link.addEventListener('click', () => {
                if (window.trackClick) window.trackClick('whatsapp');
            });
        });
    },

    // Helper to open WA with custom message
    openChat(message) {
        const regionTag = window.RegionManager ? window.RegionManager.getRegionTag() : '';
        const fullMessage = message + ' ' + regionTag;
        const url = `https://wa.me/${this.baseNumber}?text=${encodeURIComponent(fullMessage)}`;
        window.open(url, '_blank');
        if (window.trackClick) window.trackClick('whatsapp');
    }
};

document.addEventListener('DOMContentLoaded', () => WhatsappManager.init());
window.WhatsappManager = WhatsappManager;
