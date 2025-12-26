/**
 * CareTechMobile - WhatsApp Integration
 * 
 * This script handles sending WhatsApp notifications when forms are submitted.
 * 
 * USAGE:
 * 1. Include this script in your HTML pages
 * 2. Call sendWhatsAppLead(formData) when form is submitted
 * 
 * NOTE: For production, move API calls to a backend server for security!
 */

const WHATSAPP_CONFIG = {
    phoneNumberId: '961828997005342',
    // PERMANENT TOKEN - System User (Never Expires)
    accessToken: 'EAAZAsIGSgOysBQUZAamy3u452LkMn3KKkXOCn4tAK6c8ZCGSZCZBW9MNpKJIuYV5fKEWdRaVgEuXH9ycUcmsZA8T87bAcHZBhjFYqGYMOyuzsza6pV9fxLtGeiQnEZAaNfVq3wldhCy6DntJPNZC5xlFnskTg82gpyfv5ZBLSd6KuItvjEuhaHwA540T5r8JQ72f1MnwZDZD',
    adminPhone: '919495253265',
    testNumber: '+1 555 159 7579'
};

/**
 * Generate unique ticket ID
 */
function generateTicketId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CTM-${date}-${random}`;
}

/**
 * Send WhatsApp message via Meta Cloud API
 */
async function sendWhatsAppMessage(to, message) {
    const url = `https://graph.facebook.com/v21.0/${WHATSAPP_CONFIG.phoneNumberId}/messages`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: { body: message }
        })
    });

    return await response.json();
}

/**
 * Send lead notification to Admin and Customer
 * 
 * @param {Object} leadData - { name, phone, service, message }
 */
async function sendWhatsAppLead(leadData) {
    const ticketId = generateTicketId();

    // Prepare messages
    const customerMessage = `🙏 வணக்கம் ${leadData.name}!

CareTechMobile-ல உங்கள் enquiry received!

🎫 Ticket: ${ticketId}
📋 Service: ${leadData.service}

⏰ நாங்கள் 30 நிமிடத்தில் contact பண்றோம்!

- CareTechMobile Team`;

    const adminMessage = `🔔 NEW LEAD!

🎫 ${ticketId}
👤 ${leadData.name}
📱 ${leadData.phone}
🔧 ${leadData.service}
💬 ${leadData.message}

Reply: CLOSE ${ticketId}`;

    try {
        // Send to Admin
        const adminResult = await sendWhatsAppMessage(
            WHATSAPP_CONFIG.adminPhone,
            adminMessage
        );
        console.log('Admin notification sent:', adminResult);

        // Note: Customer message only works if they've messaged first (24-hour window)
        // For new customers, use template messages instead

        return {
            success: true,
            ticketId: ticketId,
            adminResult: adminResult
        };
    } catch (error) {
        console.error('WhatsApp send error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Example: Hook into contact form
 */
function initContactFormWhatsApp() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            // Get form data
            const formData = new FormData(contactForm);
            const leadData = {
                name: formData.get('name') || 'Unknown',
                phone: formData.get('phone') || '',
                service: formData.get('service') || 'General Enquiry',
                message: formData.get('message') || ''
            };

            // Format phone number (remove spaces, add country code if needed)
            if (leadData.phone) {
                leadData.phone = leadData.phone.replace(/\D/g, '');
                if (!leadData.phone.startsWith('91')) {
                    leadData.phone = '91' + leadData.phone;
                }
            }

            // Send WhatsApp notification (don't await to avoid blocking form submit)
            sendWhatsAppLead(leadData).then(result => {
                console.log('WhatsApp notification result:', result);
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactFormWhatsApp);
} else {
    initContactFormWhatsApp();
}

// ============================================
// MODULE B: BOOKING AUTOMATION
// ============================================

/**
 * Generate unique booking ID
 */
function generateBookingId() {
    return 'BK-' + Date.now().toString(36).toUpperCase();
}

/**
 * Send booking confirmation via WhatsApp
 * 
 * @param {Object} bookingData - { name, phone, service, date, time }
 */
async function sendWhatsAppBooking(bookingData) {
    const bookingId = generateBookingId();

    // Customer confirmation message
    const customerMessage = `✅ Booking Confirmed!

🎫 Booking ID: ${bookingId}
👤 Name: ${bookingData.name}
🔧 Service: ${bookingData.service}
📅 Date: ${bookingData.date}
⏰ Time: ${bookingData.time}

📍 Location: CareTechMobile
📞 Contact: 9962003738

நன்றி! We look forward to serving you! 🙏`;

    // Admin notification
    const adminMessage = `📅 NEW BOOKING!

🎫 ${bookingId}
👤 ${bookingData.name}
📱 ${bookingData.phone}
🔧 ${bookingData.service}
📅 ${bookingData.date} @ ${bookingData.time}

Reply: CONFIRM ${bookingId}`;

    try {
        const adminResult = await sendWhatsAppMessage(
            WHATSAPP_CONFIG.adminPhone,
            adminMessage
        );
        console.log('Booking notification sent:', adminResult);

        return {
            success: true,
            bookingId: bookingId,
            adminResult: adminResult
        };
    } catch (error) {
        console.error('Booking WhatsApp error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// MODULE C: PAYMENT AUTOMATION
// ============================================

/**
 * Send payment receipt via WhatsApp
 * 
 * @param {Object} paymentData - { name, phone, amount, paymentId, service }
 */
async function sendWhatsAppPaymentReceipt(paymentData) {
    const receiptMessage = `✅ Payment Received!

💰 Amount: ₹${paymentData.amount}
🧾 Payment ID: ${paymentData.paymentId}
🔧 Service: ${paymentData.service}
📅 Date: ${new Date().toLocaleDateString('en-IN')}

Thank you for choosing CareTechMobile! 🙏

For support: 9962003738`;

    const adminMessage = `💰 PAYMENT RECEIVED!

👤 ${paymentData.name}
📱 ${paymentData.phone}
💵 ₹${paymentData.amount}
🧾 ${paymentData.paymentId}
🔧 ${paymentData.service}`;

    try {
        const adminResult = await sendWhatsAppMessage(
            WHATSAPP_CONFIG.adminPhone,
            adminMessage
        );
        console.log('Payment notification sent:', adminResult);

        return {
            success: true,
            adminResult: adminResult
        };
    } catch (error) {
        console.error('Payment WhatsApp error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Hook for Razorpay payment success
 * Call this from Razorpay success handler
 */
function onPaymentSuccess(razorpayResponse, orderDetails) {
    const paymentData = {
        name: orderDetails.name || 'Customer',
        phone: orderDetails.phone || '',
        amount: orderDetails.amount || 0,
        paymentId: razorpayResponse.razorpay_payment_id,
        service: orderDetails.service || 'Service'
    };

    // Format phone
    if (paymentData.phone) {
        paymentData.phone = paymentData.phone.replace(/\D/g, '');
        if (!paymentData.phone.startsWith('91')) {
            paymentData.phone = '91' + paymentData.phone;
        }
    }

    return sendWhatsAppPaymentReceipt(paymentData);
}

// ============================================
// MODULE D: FOLLOW-UP (Requires Backend/N8N)
// ============================================
// Note: Follow-up automation requires scheduled tasks
// Use N8N or a backend cron job for this feature

// ============================================
// MODULE E: ADMIN COMMANDS (Requires N8N Webhook)
// ============================================
// Note: Admin command processing requires WhatsApp webhook
// Use N8N to receive and process incoming messages

// ============================================
// MODULE F: BROADCAST
// ============================================

/**
 * Send broadcast message to multiple recipients
 * WARNING: Use with caution - WhatsApp has rate limits!
 * 
 * @param {Array} recipients - Array of { phone, name }
 * @param {string} messageTemplate - Message with {{name}} placeholder
 */
async function sendWhatsAppBroadcast(recipients, messageTemplate) {
    const results = [];

    for (const recipient of recipients) {
        // Rate limiting - wait 1 second between messages
        await new Promise(resolve => setTimeout(resolve, 1000));

        const personalizedMessage = messageTemplate.replace(/\{\{name\}\}/g, recipient.name);

        try {
            const result = await sendWhatsAppMessage(recipient.phone, personalizedMessage);
            results.push({ phone: recipient.phone, success: true, result });
        } catch (error) {
            results.push({ phone: recipient.phone, success: false, error: error.message });
        }
    }

    console.log('Broadcast complete:', results);
    return results;
}

// ============================================
// MODULE G: AI AUTO-REPLY (Requires Backend)
// ============================================
// Note: AI auto-reply requires:
// 1. WhatsApp webhook to receive messages
// 2. AI API (OpenAI/Gemini) for generating responses
// Use N8N or a backend server for this feature

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

window.CareTechWhatsApp = {
    // Module A: Lead Capture
    sendWhatsAppLead,
    sendWhatsAppMessage,
    generateTicketId,

    // Module B: Booking
    sendWhatsAppBooking,
    generateBookingId,

    // Module C: Payment
    sendWhatsAppPaymentReceipt,
    onPaymentSuccess,

    // Module F: Broadcast
    sendWhatsAppBroadcast,

    // Config
    config: WHATSAPP_CONFIG
};

console.log('🚀 CareTechMobile WhatsApp Integration loaded!');
console.log('Available functions:', Object.keys(window.CareTechWhatsApp));
