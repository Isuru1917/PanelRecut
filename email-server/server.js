const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail SMTP transporter
const createGmailTransporter = (gmailUser, gmailAppPassword) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    }
  });
};

// Outlook SMTP transporter
const createOutlookTransporter = (outlookUser, outlookAppPassword) => {
  console.log('📧 Creating Outlook transporter with:');
  console.log('User:', outlookUser);
  console.log('Password length:', outlookAppPassword ? outlookAppPassword.length : 0);
  
  return nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: outlookUser,
      pass: outlookAppPassword
    },
    debug: true, // Enable debug output
    logger: true, // Log information to console
    tls: {
      // Fix for TLS issues with Outlook
      rejectUnauthorized: false, 
      secureProtocol: "TLSv1_2_method"
    }
  });
};

// Gmail Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { gmail, email } = req.body;
    
    console.log('📧 Sending email via Gmail SMTP...');
    console.log('From:', gmail.user);
    console.log('To:', email.to);
    console.log('Subject:', email.subject);
    
    // Create transporter with provided credentials
    const transporter = createGmailTransporter(gmail.user, gmail.appPassword);
    
    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified');
    
    // Send email
    const info = await transporter.sendMail({
      from: email.from,
      to: email.to.join(', '),
      cc: email.cc ? email.cc.join(', ') : undefined,
      bcc: email.bcc ? email.bcc.join(', ') : undefined,
      subject: email.subject,
      html: email.html,
      text: email.text
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });
    
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to send email'
    });
  }
});

// Outlook Email sending endpoint
app.post('/api/send-outlook-email', async (req, res) => {
  try {
    const { outlook, email } = req.body;
    
    console.log('📧 Sending email via Outlook SMTP...');
    console.log('From:', outlook.user);
    console.log('To:', email.to);
    console.log('Subject:', email.subject);
    
    // Validate inputs before proceeding
    if (!outlook.user || !outlook.user.includes('@')) {
      throw new Error('Invalid Outlook email address format');
    }
    
    if (!outlook.appPassword) {
      throw new Error('Outlook app password is missing');
    }
    
    if (outlook.appPassword.length < 8) {
      throw new Error('Outlook app password appears too short');
    }
    
    // Create transporter with provided credentials
    const transporter = createOutlookTransporter(outlook.user, outlook.appPassword);
    
    try {
      // Verify connection
      console.log('🔄 Verifying Outlook SMTP connection...');
      await transporter.verify();
      console.log('✅ Outlook SMTP connection verified');
    } catch (verifyError) {
      console.error('❌ Outlook SMTP connection failed:', verifyError);
      throw new Error(`Outlook SMTP connection failed: ${verifyError.message}`);
    }
    
    console.log('📤 Attempting to send email via Outlook...');
    
    // Send email
    const info = await transporter.sendMail({
      from: email.from,
      to: email.to.join(', '),
      cc: email.cc ? email.cc.join(', ') : undefined,
      bcc: email.bcc ? email.bcc.join(', ') : undefined,
      subject: email.subject,
      html: email.html,
      text: email.text
    });
    
    console.log('✅ Email sent successfully via Outlook:', info.messageId);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully via Outlook'
    });
    
  } catch (error) {
    console.error('❌ Failed to send email via Outlook:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to send email via Outlook'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Panel Recut Email Server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email server running on port ${PORT}`);
  console.log(`📧 Gmail SMTP endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`📧 Outlook SMTP endpoint: http://localhost:${PORT}/api/send-outlook-email`);
});
