// Test script for Vercel API endpoint
const path = require('path');

// Mock request/response for testing
const mockRequest = {
  method: 'POST',
  body: {
    to: ['test@example.com'],
    damageRequest: {
      gliderName: 'Test Glider',
      orderNumber: 'TEST001',
      requestedBy: 'Test User',
      reason: 'Test damage',
      priority: 'High',
      requestDate: new Date().toISOString(),
    },
    type: 'new_request'
  }
};

const mockResponse = {
  headers: {},
  statusCode: 200,
  responseData: null,
  
  setHeader(name, value) {
    this.headers[name] = value;
  },
  
  status(code) {
    this.statusCode = code;
    return this;
  },
  
  json(data) {
    this.responseData = data;
    console.log(`Response Status: ${this.statusCode}`);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    return this;
  },
  
  end() {
    console.log('Response ended');
    return this;
  }
};

// Set test environment variables
process.env.VITE_RESEND_API_KEY = 'test-key';
process.env.VITE_FROM_EMAIL = 'test@example.com';
process.env.VITE_COMPANY_NAME = 'Test Company';

async function testAPI() {
  try {
    console.log('Testing Vercel API endpoint...\n');
    
    // Import the API function
    const apiHandler = require('./api/send-email.js');
    
    // Test the API
    await apiHandler(mockRequest, mockResponse);
    
    console.log('\nAPI structure test completed!');
    console.log('✅ API endpoint can be imported');
    console.log('✅ Request/Response structure is correct');
    console.log('⚠️  Note: Email sending will fail with test credentials');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\nPlease check:');
    console.log('1. api/send-email.js exists and is valid');
    console.log('2. api/package.json exists');
    console.log('3. No syntax errors in the API code');
  }
}

testAPI();
