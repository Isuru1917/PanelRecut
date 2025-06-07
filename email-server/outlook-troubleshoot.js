// Outlook SMTP Troubleshooter
const nodemailer = require('nodemailer');

// Credentials from command line arguments
const outlookUser = process.argv[2] || '';
const outlookPassword = process.argv[3] || '';

if (!outlookUser || !outlookPassword) {
  console.error('\n❌ Missing required arguments!');
  console.log('\nUsage: node outlook-troubleshoot.js <your-outlook-email> <app-password>\n');
  console.log('Example: node outlook-troubleshoot.js your.email@outlook.com your-app-password\n');
  process.exit(1);
}

console.log('\n🔍 Outlook SMTP Troubleshooter');
console.log('==============================\n');
console.log(`Testing connection for: ${outlookUser}`);
console.log(`Password provided: ${outlookPassword.substring(0, 2)}${'*'.repeat(outlookPassword.length - 4)}${outlookPassword.substring(outlookPassword.length - 2)}\n`);

async function testOutlookAuth() {
  console.log('📡 Testing standard Outlook SMTP configuration...');

  try {
    // Standard Outlook SMTP configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: outlookUser,
        pass: outlookPassword
      },
      debug: true,
      logger: true,
      tls: {
        rejectUnauthorized: false,
        secureProtocol: "TLSv1_2_method"
      }
    });

    console.log('🔄 Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection successful! Authentication works.\n');

    return true;
  } catch (error) {
    console.error('❌ Standard configuration failed:');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    if (error.response) {
      console.error(`   Server Response: ${error.response}`);
    }
    console.log('\n');

    return false;
  }
}

async function testAlternativeConfig() {
  console.log('📡 Testing alternative Outlook configuration...');

  try {
    // Alternative configuration
    const transporter = nodemailer.createTransport({
      service: 'outlook',  // Use built-in outlook service
      auth: {
        user: outlookUser,
        pass: outlookPassword
      }
    });

    console.log('🔄 Verifying connection...');
    await transporter.verify();
    console.log('✅ Alternative configuration successful!\n');

    return true;
  } catch (error) {
    console.error('❌ Alternative configuration failed:');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    if (error.response) {
      console.error(`   Server Response: ${error.response}`);
    }
    console.log('\n');

    return false;
  }
}

async function testOffice365Config() {
  console.log('📡 Testing Office 365 configuration...');

  try {
    // Office 365 configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: outlookUser,
        pass: outlookPassword
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    console.log('🔄 Verifying connection...');
    await transporter.verify();
    console.log('✅ Office 365 configuration successful!\n');

    return true;
  } catch (error) {
    console.error('❌ Office 365 configuration failed:');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    if (error.response) {
      console.error(`   Server Response: ${error.response}`);
    }
    console.log('\n');

    return false;
  }
}

async function main() {
  console.log('⏳ Running tests...\n');
  
  const standardResult = await testOutlookAuth();
  const alternativeResult = await testAlternativeConfig();
  const office365Result = await testOffice365Config();

  console.log('📊 Test Results Summary:');
  console.log('=======================');
  console.log(`Standard Outlook SMTP: ${standardResult ? '✅ Passed' : '❌ Failed'}`);
  console.log(`Alternative Config:    ${alternativeResult ? '✅ Passed' : '❌ Failed'}`);
  console.log(`Office 365 Config:     ${office365Result ? '✅ Passed' : '❌ Failed'}`);
  console.log('\n');

  if (standardResult || alternativeResult || office365Result) {
    console.log('🎉 Good news! At least one configuration worked.');
    
    if (standardResult) {
      console.log('✅ The standard configuration in your application should work fine.');
    } else if (alternativeResult) {
      console.log('⚠️ The standard config failed but the alternative config worked.');
      console.log('   Update server.js to use service: "outlook" instead of host: "smtp-mail.outlook.com"');
    } else {
      console.log('⚠️ Only the Office 365 configuration worked.');
      console.log('   Update server.js to use host: "smtp.office365.com" instead of "smtp-mail.outlook.com"');
    }
  } else {
    console.log('❌ All tests failed. Here are some things to check:');
    console.log('');
    console.log('1️⃣ Verify you have 2FA enabled on your Microsoft account');
    console.log('   - Go to account.microsoft.com/security');
    console.log('   - Enable two-step verification if not already enabled');
    console.log('');
    console.log('2️⃣ Make sure you\'re using an app password, NOT your regular password');
    console.log('   - Go to account.microsoft.com/security/app-passwords');
    console.log('   - Generate a new app password specifically for this application');
    console.log('');
    console.log('3️⃣ Check for typos in your email address');
    console.log('');
    console.log('4️⃣ Your Microsoft account might have additional security restrictions');
    console.log('   - Check your Microsoft account for security alerts');
    console.log('   - Temporarily lower security settings for testing');
    console.log('');
    console.log('5️⃣ Try with a different Outlook or Microsoft account if available');
  }
}

main().catch(console.error);
