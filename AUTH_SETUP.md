# Email Authentication Setup Guide

## Overview
Your Aqua Dynamics application now includes email-based authentication using Supabase Auth. Users can sign up and sign in with their email addresses.

## Features Implemented

### 🔐 **Authentication Components**
- **SignInModal**: Beautiful modal with email/password sign-in and sign-up
- **AuthContext**: React context for managing authentication state
- **User Interface**: Clean header with sign-in/sign-out buttons and user display

### 🎨 **UI Features**
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Shows loading indicators during authentication
- **Error Handling**: Displays helpful error messages
- **Password Toggle**: Show/hide password functionality
- **User Display**: Shows logged-in user's email in header

### 🛡️ **Security Features**
- **Row Level Security**: Database tables protected with RLS policies
- **Email Verification**: Users must verify email addresses (can be configured)
- **Secure Session Management**: Automatic session handling with Supabase

## How to Use

### For Users:
1. **Sign Up**: Click "Sign In" → "Don't have an account? Create one"
2. **Sign In**: Enter email and password, click "Sign In"
3. **Sign Out**: Click the logout icon in the header when logged in

### For Administrators:

#### 1. **Supabase Dashboard Setup**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Configure email settings:
   - **Site URL**: `http://localhost:8083` (development) or your production URL
   - **Redirect URLs**: Add your domain URLs
   - **Email Confirm**: Enable/disable email confirmation

#### 2. **Email Verification (Optional)**
To require email verification:
```sql
-- Run in Supabase SQL Editor
UPDATE auth.users SET email_confirmed_at = NULL WHERE email_confirmed_at IS NOT NULL;
```

#### 3. **Production Configuration**
For production, update the policies in `supabase/setup.sql`:
```sql
-- Remove anonymous access policies
DROP POLICY "Allow anonymous access" ON damage_requests;
DROP POLICY "Allow anonymous access" ON email_settings;
```

## Current Configuration

### 🔧 **Database Policies**
- **Authenticated Users**: Full access to damage_requests and email_settings
- **Anonymous Access**: Currently enabled for testing (remove in production)

### 📧 **Email Settings**
- **Provider**: Supabase (uses their email service by default)
- **Templates**: Default Supabase auth email templates
- **Verification**: Can be enabled/disabled in Supabase dashboard

## Testing

### 1. **Create Test Account**
1. Start the development server: `npm run dev`
2. Click "Sign In" button
3. Click "Don't have an account? Create one"
4. Enter test email and password (min 6 characters)
5. Click "Create Account"

### 2. **Sign In**
1. Use the same email/password to sign in
2. You should see your email displayed in the header
3. Try signing out using the logout button

## Customization Options

### 🎨 **Styling**
- Modify `SignInModal.tsx` for custom styling
- Update colors in Tailwind config for brand consistency

### 🔒 **Security**
- Configure password requirements in Supabase dashboard
- Set up custom email templates
- Add two-factor authentication (Supabase Pro feature)

### 📱 **Additional Features**
- **Social Login**: Add Google, GitHub, etc. (requires Supabase configuration)
- **Password Reset**: Already included in Supabase Auth
- **User Profiles**: Extend with additional user data tables

## Troubleshooting

### Common Issues:
1. **"Invalid login credentials"**: Check email/password are correct
2. **Email not confirmed**: Check spam folder or disable email confirmation
3. **Network errors**: Verify Supabase URL and keys are correct

### Support:
- Check Supabase Auth documentation: https://supabase.com/docs/guides/auth
- Review browser console for detailed error messages
- Test in incognito mode to rule out caching issues
