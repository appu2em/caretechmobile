/**
 * Clone Logic for Customer Engine
 * Handles the "Use this Demo" buttons to capture lead intent.
 */

const CloneManager = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.querySelectorAll('.btn-use-demo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const demoType = document.title.split('-')[0].trim();
                const message = `Hi, I am interested in using the *${demoType}* demo for my business!`;

                // Use WhatsappManager if available, else direct link
                if (window.WhatsappManager) {
                    window.WhatsappManager.openChat(message);
                } else {
                    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => CloneManager.init());
