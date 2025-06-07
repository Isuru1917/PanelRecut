# Outlook SMTP Email Setup Guide

This guide explains how to set up and use Outlook (Hotmail, Live, Microsoft accounts) for sending email notifications in the Panel Recut Management System.

## Overview

Outlook SMTP provides an alternative to Gmail for sending email notifications from the application. This is particularly useful if:
- You prefer to use your Microsoft account
- You have issues with Gmail SMTP
- Your organization uses Microsoft 365

## Step-by-Step Setup Instructions

### 1. Enable Two-Factor Authentication (2FA)

To use app passwords with Outlook/Microsoft accounts, you must first enable two-factor authentication:

1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Sign in with your Microsoft account
3. Click on "Advanced security options" or "Security"
4. Enable "Two-step verification" if it's not already on
5. Follow the prompts to complete the setup (typically involves adding your phone number)

### 2. Generate an App Password

After enabling 2FA, you can generate an app password:

1. Go to [App passwords](https://account.microsoft.com/security/app-passwords) in your Microsoft account
   - If you can't find it, go to Security > Advanced security options > App passwords
2. Click "Create a new app password"
3. Give it a name like "Panel Recut App"
4. Microsoft will generate a 16-character password
5. **Important**: Copy this password immediately - you won't be able to see it again!
   - Make sure to copy the password WITHOUT any spaces

### 3. Configure the Application

1. In the Panel Recut Management System, open **Email Settings**
2. Select "Outlook SMTP" as your email provider
3. Enter your complete Outlook email address (e.g., `your.name@outlook.com`, `your.name@hotmail.com`)
4. Paste the app password you generated (without spaces)
5. Click "Save Settings"

## Troubleshooting Common Errors

### Error 535: Authentication unsuccessful

If you see an error like this:
```
535 5.7.139 Authentication unsuccessful, the request did not meet the criteria to be authenticated successfully.
```

This means your authentication attempt failed. Here's how to fix it:

1. **Verify 2FA is enabled**: App passwords only work when 2FA is enabled on your Microsoft account.

2. **Use app password, not regular password**: Make sure you're using the app password generated in your Microsoft account, NOT your regular account password.

3. **Check for spaces**: When copying the app password, make sure there are no spaces or extra characters.

4. **Regenerate app password**: Your app password might have expired.
   - Go back to Microsoft Account Security
   - Delete the old app password
   - Generate a new one and try again

5. **Try the troubleshooting script**: For more detailed diagnostics, run:
   ```
   cd email-server
   node outlook-troubleshoot.js your.email@outlook.com your-app-password
   ```

6. **Check account restrictions**: Some Microsoft accounts might have restrictions on app access:
   - Look for any security alerts in your Microsoft account
   - Check if your organizational policies allow SMTP access

7. **Alternative SMTP settings**: If all else fails, try these alternative settings:
   - Host: smtp.office365.com (instead of smtp-mail.outlook.com)
   - Port: 587 (remains the same)
   - Security: STARTTLS (remains the same)

The troubleshooting script will automatically test different server configurations and tell you which one works for your account.

## Troubleshooting

### Common Issues

#### Authentication Failed
- Ensure your email address is entered correctly
- Verify the app password was pasted correctly without spaces
- Check that your Microsoft account doesn't have any security holds
- App passwords might expire - you may need to generate a new one

#### Connection Timeout
- Check if your firewall is blocking outgoing SMTP connections
- Some networks restrict outbound email traffic on port 587
- Verify that the email server is running (`node email-server/server.js`)

#### Rate Limiting
Microsoft has sending limits:
- Free accounts: ~300 emails per day
- Microsoft 365: Higher limits based on your subscription

#### Email Not Received
- Check your spam/junk folder
- Some email servers may reject messages from personal Outlook accounts
- Verify recipient email address is correct

### Advanced Troubleshooting

For more detailed troubleshooting, you can:

1. Run the email verification script:
   ```
   cd email-server
   node verify-email-services.js
   ```

2. Check the server logs for specific error codes

3. Use the Email Test Page for direct testing of credentials and connections

## SMTP Server Details

The application uses these SMTP settings for Outlook:

- **Host**: smtp-mail.outlook.com
- **Port**: 587
- **Security**: TLS (STARTTLS)
- **Authentication**: Normal Login (username/password)

## Support

If you continue to experience issues with Outlook email:

1. Try using Gmail SMTP as an alternative
2. Check Microsoft's status page for Outlook service issues
3. Contact support with the specific error messages from the application logs
