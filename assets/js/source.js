/**
 * Source Detector for Customer Engine
 * Identifies where the traffic is coming from (Direct, FB, Insta, etc.)
 */

const SourceManager = {
    currentSource: 'direct',

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const sourceParam = urlParams.get('utm_source') || urlParams.get('source'); // Support both standard UTM and simple 'source'

        if (sourceParam) {
            this.currentSource = sourceParam;
            sessionStorage.setItem('caretech_source', sourceParam);
        } else {
            const savedSource = sessionStorage.getItem('caretech_source');
            if (savedSource) {
                this.currentSource = savedSource;
            } else if (document.referrer) {
                if (document.referrer.includes('facebook.com')) this.currentSource = 'facebook';
                else if (document.referrer.includes('instagram.com')) this.currentSource = 'instagram';
                else if (document.referrer.includes('google.com')) this.currentSource = 'google';
                else this.currentSource = 'referral';
            }
        }

        console.log('Traffic Source:', this.currentSource);
    },

    getSource() {
        return this.currentSource;
    }
};

SourceManager.init();
