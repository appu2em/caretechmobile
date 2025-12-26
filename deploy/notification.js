// WhatsApp Notification Helper
const WhatsAppNotify = {
    // Send message via WhatsApp Web
    sendViaWeb: function(phone, message) {
        // Remove any non-digit characters from phone
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Build WhatsApp URL
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        // Open in new window
        window.open(url, '_blank');
        
        console.log('✅ Opening WhatsApp for:', cleanPhone);
    },
    
    // Send to admin
    notifyAdmin: function(message) {
        // ⚠️ Replace with your admin phone number (with country code, no +)
        const adminPhone = '919495253265';
        this.sendViaWeb(adminPhone, message);
    },
    
    // Validate phone number
    isValidPhone: function(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return /^\d{10,15}$/.test(cleanPhone);
    }
};

// Test message function
function sendTestMessage() {
    const phoneInput = document.getElementById('testPhone');
    const messageInput = document.getElementById('testMessage');
    
    if (!phoneInput || !messageInput) {
        console.error('❌ Input elements not found');
        return;
    }
    
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validation
    if (!phone || !message) {
        alert('⚠️ Please fill both phone number and message');
        return;
    }
    
    if (!WhatsAppNotify.isValidPhone(phone)) {
        alert('⚠️ Invalid phone number format\nExample: 919876543210 (country code + number)');
        return;
    }
    
    // Send message
    WhatsAppNotify.sendViaWeb(phone, message);
}

// Send sample notification
function sendSampleNotification(type) {
    let message = '';
    
    switch(type) {
        case 'request':
            const previewRequest = document.getElementById('previewRequest');
            message = previewRequest ? previewRequest.textContent : '';
            break;
            
        case 'payment':
            const previewPayment = document.getElementById('previewPayment');
            message = previewPayment ? previewPayment.textContent : '';
            break;
            
        case 'status':
            const previewStatus = document.getElementById('previewStatus');
            message = previewStatus ? previewStatus.textContent : '';
            break;
            
        default:
            console.error('❌ Unknown notification type:', type);
            return;
    }
    
    if (!message) {
        console.error('❌ Message template not found');
        return;
    }
    
    // Send to admin
    WhatsAppNotify.notifyAdmin(message.trim());
}

console.log('✅ notification.js loaded successfully');