/**
 * Language Manager for Customer Engine
 * Handles auto-detection, manual switching, and DOM updates.
 */

const LanguageManager = {
    currentLang: 'en',

    init() {
        // 1. Try to get from LocalStorage
        const savedLang = localStorage.getItem('caretech_lang');

        // 2. browser detection if no save
        if (savedLang) {
            this.currentLang = savedLang;
        } else {
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('ta')) this.currentLang = 'ta';
            else if (browserLang.startsWith('ml')) this.currentLang = 'ml';
            else this.currentLang = 'en';
        }

        console.log('Language initialized:', this.currentLang);
        this.applyLanguage(this.currentLang);
    },

    setLanguage(lang) {
        if (!translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('caretech_lang', lang);
        this.applyLanguage(lang);
    },

    applyLanguage(lang) {
        // Update DOM elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
};

// Auto-init on load if translations exist
if (typeof translations !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => LanguageManager.init());
}
