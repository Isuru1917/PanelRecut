# Gmail SMTP Email Server

This is a simple Node.js/Express server that handles Gmail SMTP email sending for the Panel Recut Management application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd email-server
npm install
```

### 2. Start the Server
```bash
npm start
# or for development with auto-restart:
npm run dev
```

The server will run on `http://localhost:3001`

### 3. Configure Your Main App

1. **Disable Test Mode**: 
   - Open your main application
   - Click the green mail icon (Email Configuration)
   - Uncheck "Test Mode"
   - Make sure your Gmail credentials are entered
   - Click "Save Configuration"

2. **Test Email Sending**:
   - Submit a new panel recut request
   - Check both the browser console and the email server terminal
   - You should see successful email sending logs

## API Endpoints

- `POST /api/send-email` - Send email via Gmail SMTP
- `GET /health` - Health check endpoint

## How It Works

1. Your React app sends email requests to `http://localhost:3001/api/send-email`
2. The server receives the Gmail credentials and email content
3. Server uses `nodemailer` to send emails via Gmail SMTP
4. Server returns success/failure response to your app

## Security Notes

- Gmail credentials are passed from the frontend (not stored on the server)
- Only use this for development/local environments
- For production, consider using environment variables or a more secure credential storage method

## Troubleshooting

- **Email server not running**: Make sure to start the server with `npm start`
- **Connection refused**: Check that the server is running on port 3001
- **Gmail authentication failed**: Verify your Gmail App Password is correct
- **CORS errors**: The server includes CORS headers for localhost development
