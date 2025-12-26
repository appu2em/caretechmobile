# 📱 CareTechMobile

A comprehensive mobile repair, AI tools, and digital services platform built with modern web technologies. Features user authentication, payment integration, and a beautiful NPTEL-inspired dark theme.

![CareTechMobile](https://img.shields.io/badge/CareTechMobile-v1.0-15C39A?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

- 🔐 **User Authentication** - Email/Password, Google OAuth, WhatsApp Login
- 💳 **Payment Integration** - UPI/Razorpay payment gateway
- 🌙 **Dark Mode** - Beautiful NPTEL-inspired glassmorphism theme
- 📱 **Responsive Design** - Works on Desktop, Tablet, Mobile
- 👤 **User Dashboard** - Profile management, service requests
- 🛠️ **Admin Panel** - Manage users, payments, services
- 📞 **WhatsApp Support** - Floating WhatsApp button for quick contact

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5/CSS3 | Frontend Structure & Styling |
| JavaScript | Interactive Functionality |
| Supabase | Authentication & Database |
| Razorpay | Payment Gateway |
| Font Awesome | Icons |

## 🚀 Getting Started

### Prerequisites

- Web Browser (Chrome, Firefox, Edge)
- Supabase Account (for authentication)
- Razorpay Account (for payments - optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/caretechmobile.git
   cd caretechmobile
   ```

2. **Configure Supabase:**
   - Create a project on [Supabase](https://supabase.com)
   - Update the Supabase URL and API Key in:
     - `index.html`
     - `dashboard.html`
     - `profile.html`

3. **Enable OAuth Providers (optional):**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google and add your OAuth credentials

4. **Run the application:**
   - Open `index.html` in your browser
   - Or use a local server:
   ```bash
   npx serve .
   ```

## 📁 Project Structure

```
caretechmobile/
├── index.html          # Landing page
├── dashboard.html      # User login & dashboard
├── profile.html        # User profile page
├── admin.html          # Admin panel
├── payment.html        # Payment page
├── services.html       # Services listing
├── contact.html        # Contact page
├── nptel-theme.css     # Main theme stylesheet
├── admin-script.js     # Admin panel scripts
├── auth-helper.js      # Authentication helper
├── manifest.json       # PWA manifest
└── sw.js               # Service worker
```

## 🔑 Authentication Methods

| Method | Status | Description |
|--------|--------|-------------|
| Email/Password | ✅ Active | Standard Supabase auth |
| Google OAuth | ✅ Active | Sign in with Google |
| WhatsApp | ✅ Active | Manual verification flow |

## 💰 Payment Options

- UPI (GPay, PhonePe, Paytm)
- Razorpay Gateway
- Manual WhatsApp verification

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📞 Contact

- **WhatsApp:** +91 9962003738
- **Email:** shihab2em@gmail.com
- **Website:** [caretechmobile.com](https://caretechmobile.com)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ by CareTechMobile Team</p>
