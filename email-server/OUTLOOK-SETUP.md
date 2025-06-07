# Outlook SMTP Email Setup

This document outlines how to set up and use Outlook SMTP email functionality in the Panel Recut Management System.

## Overview

The application now supports three email providers:
- Resend.com (default)
- Gmail SMTP
- Outlook SMTP (new)

This allows users to choose which email provider they want to use for sending notifications, including panel recut requests and status updates.

## Outlook SMTP Configuration

### Step 1: Enable Two-Factor Authentication

Before you can create an app password for Outlook, you need to enable Two-Factor Authentication (2FA) on your Microsoft account:

1. Go to [Microsoft Account Security Settings](https://account.microsoft.com/security)
2. Select "Advanced security options"
3. Under "Additional security", enable "Two-step verification"
4. Follow the prompts to complete the setup

### Step 2: Generate an App Password

After enabling 2FA, generate an app password:

1. Go to [App passwords settings](https://account.microsoft.com/security/app-passwords)
2. Click "Create a new app password"
3. Give it a name like "Panel Recut App"
4. Copy the 16-character password that appears

### Step 3: Configure the Application

1. In the Panel Recut Management System, click on "Email Settings"
2. Select "Outlook SMTP" as your email provider
3. Enter your complete Outlook email address (e.g., `your.name@outlook.com`)
4. Enter the 16-character app password you generated
5. Save your settings

## Technical Details

### Outlook SMTP Server Settings

The application uses the following settings for Outlook SMTP:

- **Host**: `smtp-mail.outlook.com`
- **Port**: `587`
- **Encryption**: `TLS` (STARTTLS)

### Testing Outlook Email Functionality

To test the Outlook SMTP functionality:

1. Ensure the email server is running: `node email-server/server.js`
2. Configure Outlook settings in the application
3. Submit a new panel recut request or update an existing request status
4. Check if notification emails are received

For direct testing of the Outlook SMTP connection:

```bash
cd email-server
node test-outlook.js
```

## Troubleshooting

If you encounter issues with Outlook emails:

1. **Connection Errors**:
   - Verify your Outlook email address is correct and active
   - Check that the app password is entered correctly (16 characters, no spaces)
   - Ensure your Microsoft account has 2FA enabled

2. **Email Not Sending**:
   - Check the email server logs for specific error messages
   - Make sure the email server is running (`node email-server/server.js`)
   - Verify that notification settings are enabled in the application

3. **Authentication Errors**:
   - Your app password might have expired - generate a new one
   - Microsoft occasionally requires re-authentication or new app passwords
   - Check if your Microsoft account has any security alerts

4. **Rate Limiting**:
   - Outlook may rate-limit emails if too many are sent in a short period
   - Wait a few minutes and try again
