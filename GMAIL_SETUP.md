# Gmail User Quick Start Guide

## 🚀 Quick Setup for Gmail Users

Since you have a Gmail account, here's the **fastest way** to get email notifications working:

### Option 1: Resend (Recommended) - 5 Minutes Setup

1. **Sign up for Resend (FREE)**
   - Go to [resend.com](https://resend.com)
   - Sign up using your Gmail account
   - ✅ You get **3,000 free emails per month**

2. **Get Your API Key**
   - Once logged in, go to "API Keys" in the dashboard
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Configure in Your App**
   - Click the green email icon in your app header
   - Paste your API key
   - For testing: Use `delivered@resend.dev` as the "from" email
   - Keep "Test Mode" checked initially

4. **Test It**
   - Submit a panel recut request
   - Check your browser console - you should see the email content

### Option 2: Use Your Gmail Directly (Advanced)

This requires more setup but uses your existing Gmail:

1. **Enable 2-Factor Authentication**
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**
   - In Security settings → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password

3. **Code Changes Required**
   - This option needs SMTP configuration instead of Resend API
   - Requires modifying the email service to use Gmail SMTP

## 📧 Recommended Setup Steps

1. **Start with Option 1 (Resend)** - it's much easier!
2. Use `delivered@resend.dev` for testing
3. Add your actual domain later for production
4. Test with a few requests first

## 🔧 Environment Variables

Add these to your `.env` file:

```bash
# For Resend (Option 1)
VITE_RESEND_API_KEY=re_your_api_key_here
VITE_FROM_EMAIL=delivered@resend.dev
VITE_COMPANY_NAME=Aqua Dynamics

# For Gmail SMTP (Option 2) - requires code changes
VITE_GMAIL_USER=your.email@gmail.com
VITE_GMAIL_APP_PASSWORD=your_16_char_app_password
```

## 🎯 Next Steps

1. Set up Resend account (5 minutes)
2. Configure in your app
3. Test with a few requests
4. When ready for production, add your own domain to Resend

Need help? The email configuration modal in your app has detailed instructions!
