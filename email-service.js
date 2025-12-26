// ============================================
// email-service.js - Email Notifications (EmailJS)
// ============================================

const EMAIL_CONFIG = {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",    // Get from emailjs.com
    serviceId: "YOUR_SERVICE_ID"             // Get from emailjs.com
};

// Load EmailJS
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = function() {
        if (EMAIL_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
            emailjs.init(EMAIL_CONFIG.publicKey);
            console.log('✅ EmailJS initialized');
        } else {
            console.log('⚠️ EmailJS not configured - add your keys');
        }
    };
    document.head.appendChild(script);
})();

const EmailService = {
    
    send: async function(templateId, params) {
        if (EMAIL_CONFIG.publicKey === "YOUR_EMAILJS_PUBLIC_KEY") {
            console.log('📧 Email would be sent:', params);
            return { success: true };
        }
        
        try {
            await emailjs.send(EMAIL_CONFIG.serviceId, templateId, params);
            console.log('✅ Email sent');
            return { success: true };
        } catch (error) {
            console.error('❌ Email error:', error);
            return { success: false, error };
        }
    },
    
    sendWelcome: function(data) {
        return this.send('template_welcome', {
            to_name: data.name,
            to_email: data.email
        });
    },
    
    sendBookingConfirmation: function(data) {
        return this.send('template_booking', {
            to_name: data.name,
            to_email: data.email,
            service_name: data.service,
            description: data.description
        });
    },
    
    sendPaymentReceipt: function(data) {
        return this.send('template_payment', {
            to_name: data.name,
            to_email: data.email,
            amount: data.amount,
            transaction_id: data.transactionId
        });
    }
};

window.EmailService = EmailService;