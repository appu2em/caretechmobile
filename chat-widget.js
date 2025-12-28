/* ============================================
   CHAT WIDGET - CareTechMobile Bot
   Interactive conversation logic
   ============================================ */

class CTMChatBot {
    constructor() {
        this.currentStep = 0;
        this.userData = {
            name: '',
            businessName: '',
            industry: '',
            city: '',
            service: '',
            priority: ''
        };
        this.industries = [
            { id: 1, emoji: '🛍️', name: 'Shop / Retail' },
            { id: 2, emoji: '🛠️', name: 'Service Business' },
            { id: 3, emoji: '🏢', name: 'Agency / Company' },
            { id: 4, emoji: '🍔', name: 'Restaurant / Cafe' },
            { id: 5, emoji: '🏥', name: 'Healthcare / Clinic' },
            { id: 6, emoji: '🎓', name: 'Education / Training' },
            { id: 7, emoji: '🏠', name: 'Real Estate' },
            { id: 8, emoji: '🚗', name: 'Automobile' },
            { id: 9, emoji: '✂️', name: 'Salon / Spa' },
            { id: 10, emoji: '🚚', name: 'Logistics / Transport' }
        ];
        this.supabase = null;
        this.initSupabase();
        this.init();
    }

    initSupabase() {
        // Initialize Supabase if CONFIG is available
        if (typeof CONFIG !== 'undefined' && window.supabase) {
            try {
                this.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
                console.log('✅ Chat Widget: Supabase connected');
            } catch (err) {
                console.log('⚠️ Chat Widget: Supabase not available, leads will not be saved');
            }
        }
    }

    async saveLeadToSupabase() {
        // Get country from region selector
        const country = window.CTMRegion?.currentRegion?.code || 'IN';
        const countryName = window.CTMRegion?.currentRegion?.name || 'India';

        // Always backup to localStorage first
        const leads = JSON.parse(localStorage.getItem('ctm_leads') || '[]');
        const leadRecord = {
            ...this.userData,
            country: country,
            country_name: countryName,
            timestamp: new Date().toISOString(),
            source: 'chat_widget'
        };
        leads.push(leadRecord);
        localStorage.setItem('ctm_leads', JSON.stringify(leads));
        console.log('✅ Lead saved to localStorage:', leadRecord);

        if (!this.supabase) {
            console.log('⚠️ Supabase not available');
            return;
        }

        try {
            const leadData = {
                user_name: this.userData.name,
                business_name: this.userData.businessName,
                business_city: this.userData.city,
                industry: this.userData.industry,
                service_requested: this.userData.service,
                lead_priority: this.userData.priority,
                lead_status: 'NEW',
                source: 'chat_widget',
                country: country
            };

            // Try to insert into chat_leads table
            const { data, error } = await this.supabase
                .from('chat_leads')
                .insert([leadData]);

            if (error) {
                console.log('⚠️ chat_leads table not found. Run the SQL script in Supabase!');
                console.log('📁 File: supabase-chat-leads.sql');
            } else {
                console.log('✅ Lead saved to Supabase chat_leads:', data);
            }
        } catch (err) {
            console.error('Error saving lead to Supabase:', err);
        }
    }

    init() {
        this.createWidget();
        this.bindEvents();
    }

    createWidget() {
        const widgetHTML = `
            <div class="ctm-chat-widget" id="ctmChatWidget">
                <button class="chat-toggle-btn" id="chatToggle">
                    <i class="fas fa-comment-dots chat-icon"></i>
                    <i class="fas fa-times close-icon"></i>
                    <span class="chat-notification" id="chatNotification">1</span>
                </button>
                
                <div class="chat-window">
                    <div class="chat-header">
                        <div class="chat-header-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chat-header-info">
                            <h4>CareTech Assistant</h4>
                            <p>Business Automation Expert</p>
                        </div>
                        <div class="chat-header-status"></div>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages"></div>
                    
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                        <button class="chat-send-btn" id="chatSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        this.messagesContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
    }

    bindEvents() {
        const toggle = document.getElementById('chatToggle');
        const widget = document.getElementById('ctmChatWidget');
        const sendBtn = document.getElementById('chatSend');
        const notification = document.getElementById('chatNotification');

        toggle.addEventListener('click', () => {
            widget.classList.toggle('open');
            if (widget.classList.contains('open')) {
                notification.style.display = 'none';
                if (this.currentStep === 0) {
                    this.startConversation();
                }
            }
        });

        sendBtn.addEventListener('click', () => this.handleUserInput());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
    }

    startConversation() {
        this.currentStep = 1;
        setTimeout(() => {
            this.addBotMessage("Hello 👋 Welcome to CareTechMobile.\nMay I know your good name?");
        }, 500);
    }

    addBotMessage(text, options = null) {
        this.showTyping();

        setTimeout(() => {
            this.hideTyping();

            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-msg bot';
            msgDiv.innerHTML = `
                <div class="bot-label"><i class="fas fa-robot"></i> CareTech Bot</div>
                ${text.replace(/\n/g, '<br>')}
            `;

            if (options) {
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'chat-options';
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'chat-option-btn';
                    btn.textContent = opt.text;
                    btn.onclick = () => this.handleOptionClick(opt.value, opt.text);
                    optionsDiv.appendChild(btn);
                });
                msgDiv.appendChild(optionsDiv);
            }

            this.messagesContainer.appendChild(msgDiv);
            this.scrollToBottom();
        }, 1000);
    }

    addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg user';
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot typing-msg';
        typing.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        this.messagesContainer.appendChild(typing);
        this.scrollToBottom();
    }

    hideTyping() {
        const typing = this.messagesContainer.querySelector('.typing-msg');
        if (typing) typing.remove();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    handleUserInput() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addUserMessage(text);
        this.input.value = '';
        this.processInput(text);
    }

    handleOptionClick(value, text) {
        // Remove option buttons
        const optionsDiv = this.messagesContainer.querySelector('.chat-options');
        if (optionsDiv) optionsDiv.remove();

        this.addUserMessage(text);
        this.processInput(value, text);
    }

    processInput(value, displayText = null) {
        const lowerValue = value.toLowerCase();

        // Check for common intents first
        if (lowerValue.includes('price') || lowerValue.includes('cost') || lowerValue.includes('rate')) {
            this.addBotMessage("Our complete Business Automation Package is\n₹4,999 (one-time setup).\nNo monthly fees! 💰");
            return;
        }

        if (lowerValue.includes('demo')) {
            this.showDemoResponse();
            return;
        }

        if (lowerValue.includes('call') || lowerValue.includes('human') || lowerValue.includes('expert')) {
            this.showHumanHandoff();
            return;
        }

        // Process based on current step
        switch (this.currentStep) {
            case 1: // Name
                this.userData.name = value;
                this.currentStep = 2;
                this.addBotMessage(`Nice to meet you, ${this.userData.name}! 😊\nWhat is your Shop or Business Name?`);
                break;

            case 2: // Business Name
                this.userData.businessName = value;
                this.currentStep = 3;
                this.showIndustryOptions();
                break;

            case 3: // Industry
                this.userData.industry = displayText || value;
                this.currentStep = 4;
                this.addBotMessage("Which city is your business located in? 📍");
                break;

            case 4: // City
                this.userData.city = value;
                this.currentStep = 5;
                this.showServiceOptions();
                break;

            case 5: // Service
                this.userData.service = displayText || value;
                this.currentStep = 6;
                this.showTimingOptions();
                break;

            case 6: // Timing/Priority
                this.userData.priority = value;
                this.currentStep = 7;
                this.showFinalResponse();
                break;

            default:
                this.addBotMessage("Thank you! Would you like to connect with us on WhatsApp for more details? 📱", [
                    { text: "Yes, Connect! 💬", value: "whatsapp" },
                    { text: "Demo First", value: "demo" }
                ]);
        }
    }

    showIndustryOptions() {
        const options = this.industries.map(ind => ({
            text: `${ind.emoji} ${ind.name}`,
            value: ind.id.toString()
        }));

        this.addBotMessage(`Thanks! ${this.userData.businessName} sounds great! 👍\n\nWhich industry do you belong to?`, options);
    }

    showServiceOptions() {
        this.addBotMessage("What can we help you with today?", [
            { text: "🤖 WhatsApp Automation", value: "whatsapp_automation" },
            { text: "👥 Mini CRM", value: "mini_crm" },
            { text: "🌐 Website Design", value: "website" },
            { text: "📱 Android App", value: "app" },
            { text: "📢 Social Media Ads", value: "ads" }
        ]);
    }

    showTimingOptions() {
        this.addBotMessage("When are you planning to start this? ⏰", [
            { text: "🔥 Immediately", value: "HIGH" },
            { text: "📅 This Week", value: "HIGH" },
            { text: "🗓️ This Month", value: "MEDIUM" },
            { text: "🔍 Just Exploring", value: "LOW" }
        ]);
    }

    showFinalResponse() {
        const priority = this.userData.priority;
        let response = '';

        // Save lead to Supabase
        this.saveLeadToSupabase();

        // Track lead conversion in GA
        this.trackEvent('generate_lead', {
            priority: priority,
            industry: this.userData.industry,
            service: this.userData.service,
            city: this.userData.city
        });

        if (priority === 'HIGH') {
            response = `Perfect, ${this.userData.name}! 🎉\n\nI'll connect you with our team right away.\n\nYour details:\n📋 Business: ${this.userData.businessName}\n📍 City: ${this.userData.city}\n\nClick below to continue on WhatsApp! 👇`;
        } else {
            response = `Thank you, ${this.userData.name}! 🙏\n\nOur team will contact you within 24 hours.\n\nMeanwhile, feel free to chat with us on WhatsApp! 👇`;
        }

        this.addBotMessage(response);

        setTimeout(() => {
            const waBtn = document.createElement('a');
            waBtn.href = `https://wa.me/919962003738?text=Hi! I'm ${this.userData.name} from ${this.userData.businessName}, ${this.userData.city}. Interested in ${this.userData.service}.`;
            waBtn.target = '_blank';
            waBtn.className = 'whatsapp-connect-btn';
            waBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Continue on WhatsApp';
            this.messagesContainer.appendChild(waBtn);
            this.scrollToBottom();
        }, 1500);
    }

    showDemoResponse() {
        this.addBotMessage("Yes 👍\nWe will show you a quick demo via WhatsApp or call.\n\nClick below to schedule! 📅");
        setTimeout(() => {
            const waBtn = document.createElement('a');
            waBtn.href = `https://wa.me/919962003738?text=Hi! I'd like a demo of CareTechMobile automation.`;
            waBtn.target = '_blank';
            waBtn.className = 'whatsapp-connect-btn';
            waBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Book Demo on WhatsApp';
            this.messagesContainer.appendChild(waBtn);
            this.scrollToBottom();
        }, 1200);
    }

    showHumanHandoff() {
        this.addBotMessage("Sure 👍\nOur expert will contact you shortly.\n\nFor immediate assistance, connect on WhatsApp! 📱");
        setTimeout(() => {
            const waBtn = document.createElement('a');
            waBtn.href = `https://wa.me/919962003738?text=Hi! I need to speak with an expert.`;
            waBtn.target = '_blank';
            waBtn.className = 'whatsapp-connect-btn';
            waBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Talk to Expert';
            this.messagesContainer.appendChild(waBtn);
            this.scrollToBottom();
        }, 1200);
    }

    // Google Analytics Event Tracking
    trackEvent(eventName, params = {}) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, {
                ...params,
                country: window.CTMRegion?.currentRegion?.code || 'IN'
            });
            console.log('📊 GA Event:', eventName, params);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const bot = new CTMChatBot();

    // Track chat widget interactions
    document.getElementById('chatToggle')?.addEventListener('click', () => {
        bot.trackEvent('chat_widget_open', { action: 'open' });
    });

    // Track WhatsApp button clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.whatsapp-connect-btn')) {
            bot.trackEvent('whatsapp_click', {
                action: 'connect',
                source: 'chat_widget'
            });
        }
        if (e.target.closest('.whatsapp-float')) {
            bot.trackEvent('whatsapp_click', {
                action: 'float_button'
            });
        }
    });
});
