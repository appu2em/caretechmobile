/**
 * AI Demo Chat Widget Logic
 * Matches EXACTLY with AI_BOT_LOGIC.md
 * Flow: Name -> Business -> Industry -> City -> Needs -> Qualification -> Booking
 */

(function () {
    'use strict';

    // State
    const state = {
        current: 'INIT',
        data: {
            userName: '',
            mobileNumber: '',
            email: '',
            businessName: '',
            businessCity: '',
            category: '',
            priority: ''
        }
    };

    // Standard Options for Service Expansion
    const STANDARD_OPTS = [
        { text: "🌐 Website Design", value: "GEN_WEB" },
        { text: "📱 Android App (APK)", value: "GEN_APP" },
        { text: "🍎 iOS App Support", value: "GEN_IOS" },
        { text: "📍 Google Maps SEO", value: "GEN_SEO" },
        { text: "📢 Social Media Ads", value: "GEN_ADS" }
    ];

    const responses = {
        // --- STEP 1: USER & BUSINESS DETAILS ---
        INIT: {
            text: "Hello 👋 Welcome to CareTechMobile.\n\nMay I know your good name?",
            inputType: 'text',
            nextStep: 'SAVE_USER_NAME'
        },
        SAVE_USER_NAME: { nextStep: 'ASK_MOBILE' },

        // --- STEP 1B: MOBILE NUMBER ---
        ASK_MOBILE: {
            text: "Nice to meet you, {{Name}}! 📱\n\nCan you share your **mobile number**?",
            inputType: 'text',
            nextStep: 'SAVE_MOBILE'
        },
        SAVE_MOBILE: { nextStep: 'ASK_EMAIL' },

        // --- STEP 1C: EMAIL ADDRESS ---
        ASK_EMAIL: {
            text: "Thanks! 📧\n\nAnd your **email address** please?",
            inputType: 'text',
            nextStep: 'SAVE_EMAIL'
        },
        SAVE_EMAIL: { nextStep: 'ASK_BUSINESS_NAME' },

        // --- STEP 2: BUSINESS NAME ---
        ASK_BUSINESS_NAME: {
            text: "Perfect! ✅\n\nWhat is your **Shop or Business Name**?",
            inputType: 'text',
            nextStep: 'SAVE_BUSINESS_NAME'
        },
        SAVE_BUSINESS_NAME: { nextStep: 'ASK_INDUSTRY' },

        // --- STEP 2: INDUSTRY SELECTION ---
        ASK_INDUSTRY: {
            text: "Thanks! **{{Business}}** sounds great.\n\nWhich industry do you belong to?",
            options: [
                { text: "🛍️ Shop / Retail", value: "CAT_SHOP_START" },
                { text: "🛠️ Service Business", value: "CAT_SERVICE_START" },
                { text: "🏢 Agency / Company", value: "CAT_AGENCY_START" },
                { text: "🍔 Restaurant / Cafe", value: "CAT_REST_START" },
                { text: "🏥 Healthcare / Clinic", value: "CAT_HEALTH_START" },
                { text: "🎓 Education / Training", value: "CAT_EDU_START" },
                { text: "🏠 Real Estate", value: "CAT_REAL_START" },
                { text: "🚗 Automobile", value: "CAT_AUTO_START" },
                { text: "✂️ Salon / Spa", value: "CAT_SALON_START" },
                { text: "🚚 Logistics", value: "CAT_LOG_START" }
            ]
        },

        // --- STEP 3: LOCATION CAPTURE (Intermediate Step for all Cats) ---
        ASK_CITY: {
            text: "Which city is your business located in?",
            inputType: 'text',
            nextStep: 'SAVE_CITY'
        },
        SAVE_CITY: {
            // Logic to redirect back to specific category start
            nextStep: 'REDIRECT_TO_CATEGORY'
        },


        // --- STEP 4: CATEGORY-SPECIFIC FLOWS (After City) ---

        // SHOP
        CAT_SHOP_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_SHOP_OPTS' },
        FLOW_SHOP_OPTS: {
            text: "What do you need for your shop?",
            options: [
                { text: "Billing Software (POS)", value: "QUALIFY_LEAD" },
                { text: "Online WhatsApp Store", value: "QUALIFY_LEAD" },
                { text: "Inventory Management", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // SERVICE
        CAT_SERVICE_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_SERVICE_OPTS' },
        FLOW_SERVICE_OPTS: {
            text: "Automation helps service businesses grow faster. What do you want to set up?",
            options: [
                { text: "Customer Enquiry Handling", value: "QUALIFY_LEAD" },
                { text: "Appointment Booking", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // AGENCY
        CAT_AGENCY_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_AGENCY_OPTS' },
        FLOW_AGENCY_OPTS: {
            text: "Let’s scale your agency. What are you looking for?",
            options: [
                { text: "Client Onboarding System", value: "QUALIFY_LEAD" },
                { text: "Payment Reminder Automation", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // RESTAURANT
        CAT_REST_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_REST_OPTS' },
        FLOW_REST_OPTS: {
            text: "Let’s increase your food orders 🍔. What do you need?",
            options: [
                { text: "Digital Menu & Ordering", value: "QUALIFY_LEAD" },
                { text: "Table Reservation System", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // HEALTHCARE
        CAT_HEALTH_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_HLTH_OPTS' },
        FLOW_HLTH_OPTS: {
            text: "Healthcare needs simple and reliable systems 🏥. How can we help?",
            options: [
                { text: "Patient Appointment Booking", value: "QUALIFY_LEAD" },
                { text: "Report / Follow-up Delivery", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // EDUCATION
        CAT_EDU_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_EDU_OPTS' },
        FLOW_EDU_OPTS: {
            text: "Education systems should be smooth 🎓. What do you want to manage?",
            options: [
                { text: "Student Admissions", value: "QUALIFY_LEAD" },
                { text: "Fee & Reminder System", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // REAL ESTATE
        CAT_REAL_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_REAL_OPTS' },
        FLOW_REAL_OPTS: {
            text: "Real estate moves fast 🏠. What do you want to automate?",
            options: [
                { text: "Buyer / Tenant Lead Capture", value: "QUALIFY_LEAD" },
                { text: "Site Visit Scheduling", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // AUTOMOBILE
        CAT_AUTO_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_AUTO_OPTS' },
        FLOW_AUTO_OPTS: {
            text: "Let’s drive more business 🚗. What do you need?",
            options: [
                { text: "Service Booking", value: "QUALIFY_LEAD" },
                { text: "Test Drive Booking", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // SALON
        CAT_SALON_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_SALON_OPTS' },
        FLOW_SALON_OPTS: {
            text: "Fill your chairs and slots ✂️. What are you looking for?",
            options: [
                { text: "Appointment Booking", value: "QUALIFY_LEAD" },
                { text: "Festival / Offer Promotions", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // LOGISTICS
        CAT_LOG_START: { nextStep: 'ASK_CITY', targetCategory: 'FLOW_LOG_OPTS' },
        FLOW_LOG_OPTS: {
            text: "Logistics works best with automation 🚚. Choose what you need.",
            options: [
                { text: "Shipment Tracking", value: "QUALIFY_LEAD" },
                { text: "Pickup Request System", value: "QUALIFY_LEAD" },
                ...STANDARD_OPTS
            ]
        },

        // --- STEP 5: LEAD QUALIFICATION ---
        QUALIFY_LEAD: {
            text: "Great choice.\n\nWhen are you planning to start this?",
            options: [
                { text: "Immediately", value: "PRIORITY_HIGH" },
                { text: "This week", value: "PRIORITY_HIGH" },
                { text: "This month", value: "PRIORITY_MED" },
                { text: "Just exploring", value: "PRIORITY_LOW" }
            ]
        },

        // --- STEP 6: CLOSING / BOOKING ---
        PRIORITY_HIGH: {
            text: "Perfect. Since you want to start soon, let's setup a quick demo call. Which time works?",
            options: [{ text: "Today Morning", value: "CONFIRMED" }, { text: "Today Afternoon", value: "CONFIRMED" }, { text: "Tomorrow", value: "CONFIRMED" }]
        },
        PRIORITY_MED: {
            text: "Understood. Our team can explain the plan so you are ready when the time comes.",
            options: [{ text: "Schedule Call", value: "CONFIRMED" }, { text: "Send PDF Info", value: "END_INFO" }]
        },
        PRIORITY_LOW: {
            text: "No problem! We are here whenever you are ready. Feel free to explore our website.",
            options: [{ text: "Start Over", value: "INIT" }]
        },

        CONFIRMED: {
            text: "Your appointment is confirmed ✅\nWe will send a reminder on your WhatsApp.",
            options: [{ text: "Start Over", value: "INIT" }]
        },
        END_INFO: {
            text: "We have sent the details to your WhatsApp ✅.",
            options: [{ text: "Start Over", value: "INIT" }]
        },

        // Standard Opts Mapping
        GEN_WEB: { nextStep: 'QUALIFY_LEAD' }, // Direct to qualify
        GEN_APP: { nextStep: 'QUALIFY_LEAD' },
        GEN_IOS: { nextStep: 'QUALIFY_LEAD' },
        GEN_SEO: { nextStep: 'QUALIFY_LEAD' },
        GEN_ADS: { nextStep: 'QUALIFY_LEAD' },

        PRICING: {
            text: "Our complete Business Automation Package is ₹4,999 (one-time setup). No monthly fees.",
            options: [{ text: "OK, Book Demo", value: "CONFIRMED" }]
        }
    };

    function initChatWidget() {
        if (!document.querySelector('link[href="/assets/css/ai-demo.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/assets/css/ai-demo.css';
            document.head.appendChild(link);
        }

        if (!document.getElementById('aiChatWindow')) {
            const widget = document.createElement('div');
            widget.innerHTML = `
                <div class="ai-widget-toggle" id="aiToggle">
                    🤖 Try AI Demo
                </div>

                <div class="ai-chat-window" id="aiChatWindow">
                    <div class="chat-header">
                        <div class="bot-avatar">🤖</div>
                        <div class="header-info">
                            <h4>CareTech AI</h4>
                            <span>Online | Reply Instantly</span>
                        </div>
                        <button class="close-chat" id="closeChat">&times;</button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages"></div>
                    <div class="typing-indicator" id="typingIndicator">
                        <span></span><span></span><span></span>
                    </div>

                    <div class="chat-input-area" id="inputArea">
                        <div class="options-container" id="optionsContainer"></div>
                        <div class="text-input-container" id="textInputContainer" style="display:none; gap:5px; margin-top:5px;">
                            <input type="text" id="aiTextInput" placeholder="Type here..." style="flex:1; padding:8px; border:1px solid #ddd; border-radius:20px; outline:none;">
                            <button id="aiSendBtn" style="background:#128C7E; color:white; border:none; padding:8px 15px; border-radius:20px; cursor:pointer;">➤</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(widget);

            document.getElementById('aiToggle').addEventListener('click', toggleChat);
            document.getElementById('closeChat').addEventListener('click', toggleChat);
            document.getElementById('aiSendBtn').addEventListener('click', handleTextSubmit);
            document.getElementById('aiTextInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleTextSubmit();
            });
        }
    }

    function toggleChat() {
        const chat = document.getElementById('aiChatWindow');
        const toggle = document.getElementById('aiToggle');

        if (chat.classList.contains('active')) {
            chat.classList.remove('active');
            toggle.style.display = 'flex';
        } else {
            chat.classList.add('active');
            toggle.style.display = 'none';
            if (document.getElementById('chatMessages').children.length === 0) {
                processState('INIT');
            }
        }
    }

    function addMessage(text, sender) {
        const msgs = document.getElementById('chatMessages');
        const d = new Date();
        const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = text.replace(/\n/g, '<br>') + `<span class="msg-time">${time}</span>`;

        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
        document.getElementById('typingIndicator').style.display = 'block';
        const msgs = document.getElementById('chatMessages');
        msgs.scrollTop = msgs.scrollHeight;
    }

    function hideTyping() {
        document.getElementById('typingIndicator').style.display = 'none';
    }

    function showOptions(options) {
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        document.getElementById('textInputContainer').style.display = 'none';

        if (!options) return;

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.innerText = opt.text;
            btn.onclick = () => handleUserChoice(opt.text, opt.value);
            container.appendChild(btn);
        });
    }

    function showInput() {
        document.getElementById('optionsContainer').innerHTML = '';
        document.getElementById('textInputContainer').style.display = 'flex';
        document.getElementById('aiTextInput').focus();
    }

    function processState(stateKey) {
        state.current = stateKey;
        let data = responses[stateKey] || responses['INIT'];

        // Handle Dynamic Text Replacement
        let displayText = data.text || "";
        displayText = displayText.replace("{{Name}}", state.data.userName);
        displayText = displayText.replace("{{Business}}", state.data.businessName);

        // Special Logic: Redirect mapping for GEN options
        if (stateKey.startsWith('GEN_')) {
            processState('QUALIFY_LEAD');
            return;
        }

        // Handle Redirects (e.g., Save steps)
        if (!data.text && data.nextStep) {
            processState(data.nextStep);
            return;
        }

        showTyping();

        setTimeout(() => {
            hideTyping();
            addMessage(displayText, 'bot');

            if (data.inputType === 'text') {
                showInput();
            } else {
                showOptions(data.options);
            }
        }, 800);
    }

    function handleUserChoice(text, nextStep) {
        addMessage(text, 'user');

        // Handle Category Start with City Capture logic
        if (nextStep.startsWith('CAT_')) {
            // Save target flow to state so we know where to go after city
            state.data.targetCategory = responses[nextStep].targetCategory;
            processState('ASK_CITY');
            return;
        }

        document.getElementById('optionsContainer').innerHTML = '';
        setTimeout(() => processState(nextStep), 500);
    }

    function handleTextSubmit() {
        const input = document.getElementById('aiTextInput');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        addMessage(text, 'user');

        if (state.current === 'INIT') {
            state.data.userName = text;
            processState('SAVE_USER_NAME');
        } else if (state.current === 'ASK_MOBILE') {
            state.data.mobileNumber = text;
            processState('SAVE_MOBILE');
        } else if (state.current === 'ASK_EMAIL') {
            state.data.email = text;
            processState('SAVE_EMAIL');
        } else if (state.current === 'ASK_BUSINESS_NAME') {
            state.data.businessName = text;
            processState('SAVE_BUSINESS_NAME');
        } else if (state.current === 'ASK_CITY') {
            state.data.businessCity = text;
            // Go to saved target category (e.g., FLOW_SHOP_OPTS)
            processState(state.data.targetCategory);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }

})();
