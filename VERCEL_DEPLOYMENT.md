# Vercel Deployment Guide

This guide will help you deploy your Panel Recut application to Vercel with email functionality.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Resend API Key**: Get your API key from [resend.com](https://resend.com)

## Step 1: Prepare Your Repository

Ensure these files are in your repository:
- `vercel.json` - Vercel configuration
- `api/send-email.js` - Email API endpoint
- `api/package.json` - API dependencies
- `src/services/vercelEmailService.ts` - Frontend service

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd "g:\My Software\Panel Recut\glide-panel-flow-main"
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N (for first deployment)
# - What's your project's name? panel-recut-app (or your choice)
# - In which directory is your code located? ./
```

## Step 3: Configure Environment Variables

After deployment, set up environment variables in Vercel:

### Via Vercel Dashboard:
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_RESEND_API_KEY` | Your Resend API key | Production, Preview, Development |
| `VITE_FROM_EMAIL` | Your sender email | Production, Preview, Development |
| `VITE_COMPANY_NAME` | Your company name | Production, Preview, Development |
| `VITE_API_URL` | https://your-app-name.vercel.app | Production, Preview, Development |

### Via Vercel CLI:
```powershell
# Add environment variables
vercel env add VITE_RESEND_API_KEY
# Enter your Resend API key when prompted

vercel env add VITE_FROM_EMAIL
# Enter your sender email when prompted

vercel env add VITE_COMPANY_NAME
# Enter your company name when prompted

vercel env add VITE_API_URL
# Enter your deployed app URL when prompted
```

## Step 4: Update Your Domain

1. After deployment, Vercel will give you a URL like `https://your-app-name.vercel.app`
2. Update the `VITE_API_URL` environment variable with this URL
3. Redeploy if needed: `vercel --prod`

## Step 5: Test Email Functionality

1. Visit your deployed application
2. Fill out and submit a damage report form
3. Check if emails are being sent successfully
4. Monitor the Vercel Function logs for any errors

## Step 6: Custom Domain (Optional)

To use a custom domain:

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `VITE_API_URL` to use your custom domain

## Monitoring and Logs

### View Function Logs:
1. Go to Vercel Dashboard → Functions
2. Click on `/api/send-email`
3. View real-time logs and performance metrics

### Via CLI:
```powershell
# View logs
vercel logs

# View logs for specific function
vercel logs --filter="/api/send-email"
```

## Local Development with Vercel API

To test the Vercel API locally:

```powershell
# Install Vercel CLI if not already installed
npm i -g vercel

# Run Vercel dev server
vercel dev

# Your app will be available at http://localhost:3000
# API endpoints will be available at http://localhost:3000/api/send-email
```

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check environment variables in Vercel Dashboard
2. **API endpoint not found**: Ensure `api/send-email.js` is in the repository
3. **CORS errors**: The API includes CORS headers, but verify your domain
4. **Build errors**: Check Vercel build logs in the dashboard

### Debug Steps:

1. Check Vercel Function logs for errors
2. Verify all environment variables are set
3. Test API endpoint directly: `https://your-app.vercel.app/api/send-email`
4. Check Network tab in browser dev tools

## Environment Variables Reference

### Required for Email Service:
- `VITE_RESEND_API_KEY`: Your Resend API key
- `VITE_FROM_EMAIL`: Sender email address
- `VITE_COMPANY_NAME`: Company name for emails

### Required for Frontend:
- `VITE_API_URL`: Your Vercel app URL
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Next Steps

After successful deployment:
1. Update your email settings in the application
2. Test all functionality
3. Share the deployed URL with your team
4. Set up monitoring and alerts if needed

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Resend documentation: [resend.com/docs](https://resend.com/docs)
3. Review function logs in Vercel Dashboard
