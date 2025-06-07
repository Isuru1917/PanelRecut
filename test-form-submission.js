// Test script to verify the damage request submission with requested_by field
// Run this in the browser console when the app is loaded

function testDamageRequestSubmission() {
  console.log('Testing damage request submission with "Requested by" field...');
  
  // Check if the form has the requestedBy field
  const requestedByField = document.querySelector('input[placeholder*="requested"], input[name*="requested"]');
  
  if (requestedByField) {
    console.log('✓ "Requested by" field found in the form');
  } else {
    console.log('✗ "Requested by" field NOT found in the form');
    return;
  }
  
  // Test data
  const testData = {
    gliderName: 'Test Glider Model',
    orderNumber: 'TEST-2025-001',
    reason: 'Testing requested by field',
    requestedBy: 'John Doe', // This should now be captured
    notes: 'This is a test submission'
  };
  
  console.log('Test data prepared:', testData);
  console.log('To test manually:');
  console.log('1. Fill in the form with the test data above');
  console.log('2. Make sure to fill in the "Requested by" field');
  console.log('3. Add at least one panel');
  console.log('4. Submit the form');
  console.log('5. Check if the request appears in "Recent Requests" with the requestedBy information');
}

// Auto-run when script loads
testDamageRequestSubmission();
