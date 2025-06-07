// Test script for Outlook SMTP functionality
const nodemailer = require('nodemailer');

// Test Outlook credentials
// Replace these with actual test credentials when running the test
const testCredentials = {
  user: 'your.outlook@example.com',
  password: 'your-app-password'
};

// Create Outlook transporter
const createOutlookTransporter = (outlookUser, outlookAppPassword) => {
  return nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: outlookUser,
      pass: outlookAppPassword
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
};

// Test connection
async function testOutlookSMTP() {
  try {
    console.log('🔍 Testing Outlook SMTP connection...');
    
    const transporter = createOutlookTransporter(
      testCredentials.user, 
      testCredentials.password
    );
    
    // Verify connection configuration
    const verification = await transporter.verify();
    console.log('✅ Outlook SMTP connection verified!', verification);
    
    console.log('📧 Connection settings are valid');
    console.log('📝 SMTP Host: smtp-mail.outlook.com');
    console.log('🔌 SMTP Port: 587');
    console.log('🔐 Security: TLS');
    
    // This script only tests connection, no actual email is sent
    // Uncomment the below section to test sending an email
    /*
    // Test sending email
    const info = await transporter.sendMail({
      from: testCredentials.user,
      to: 'recipient@example.com',
      subject: 'Test Email from Outlook SMTP',
      text: 'This is a test email sent through Outlook SMTP',
      html: '<p>This is a <b>test email</b> sent through Outlook SMTP</p>'
    });
    
    console.log('📨 Email sent!', info.messageId);
    */
    
    return true;
  } catch (error) {
    console.error('❌ Outlook SMTP Test Failed:', error);
    console.log('🔧 Please check your Outlook credentials and app password');
    console.log('📌 Make sure 2FA is enabled and you have generated an app password');
    return false;
  }
}

// Run the test
testOutlookSMTP()
  .then(result => {
    if (result) {
      console.log('✅ Outlook SMTP test completed successfully!');
      console.log('▶️ The Outlook email functionality appears to be properly configured.');
    } else {
      console.log('❌ Outlook SMTP test failed!');
    }
  });
