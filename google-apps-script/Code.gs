/**
 * Panel Recut Email Service - Google Apps Script
 * Modern and Professional Email Template
 */

// Configuration - You can customize these values
const DEFAULT_COMPANY_NAME = 'Panel Recut Company';
const FROM_EMAIL = Session.getActiveUser().getEmail();

/**
 * Main function to handle email sending requests
 */
function doPost(e) {
  try {
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle preflight OPTIONS request
    if (e.parameter && e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeaders(corsHeaders);
    }    // Parse the request body
    const requestData = JSON.parse(e.postData.contents);
    const { type, request, recipients, content, companyName, requestedBy } = requestData;

    // Use provided company name or default
    const COMPANY_NAME = companyName || DEFAULT_COMPANY_NAME;

    console.log('Received email request:', { 
      type, 
      hasRequest: !!request, 
      hasRecipients: !!recipients,
      companyName: COMPANY_NAME,
      requestedBy: requestedBy || 'Not provided'
    });

    let result;
    if (type === 'new_request') {
      result = sendNewRequestNotification(request, recipients, COMPANY_NAME, requestedBy);
    } else if (type === 'status_update') {
      result = sendStatusUpdateNotification(request, recipients, COMPANY_NAME, requestedBy);
    } else if (type === 'custom_email') {
      result = sendCustomEmail(recipients, content, COMPANY_NAME);
    } else {
      throw new Error('Invalid email type specified: ' + type);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId || result.threadId,
        details: result
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(corsHeaders);

  } catch (error) {
    console.error('Error sending email:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Failed to send email',
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
  }
}

/**
 * Handle GET requests for health checks
 */
function doGet(e) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'OK',
      service: 'Panel Recut Google Apps Script Email Service',
      timestamp: new Date().toISOString(),
      user: Session.getActiveUser().getEmail(),
      version: '2.0'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(corsHeaders);
}

/**
 * Send custom email with provided content
 */
function sendCustomEmail(recipients, content, companyName) {
  const { subject, html, text } = content;
  
  if (!subject || (!html && !text)) {
    throw new Error('Email content missing subject or body');
  }

  return sendEmail(recipients, subject, html || text, text, companyName);
}

/**
 * Send new damage request notification
 */
function sendNewRequestNotification(request, recipients, companyName, requestedBy) {
  // Updated subject line without emoji and changed text
  const subject = `Panel Recut Request: ${request.gliderName} (${request.orderNumber})`;
  
  const htmlContent = generateEmailTemplate(
    'Panel Recut Request',
    generateNewRequestContent(request, requestedBy),
    companyName
  );
  
  const textContent = generateNewRequestTextContent(request, companyName, requestedBy);
  
  return sendEmail(recipients, subject, htmlContent, textContent, companyName);
}

/**
 * Send status update notification
 */
function sendStatusUpdateNotification(request, recipients, companyName, requestedBy) {
  const subject = `Status Update: ${request.gliderName} - ${request.status} (${request.orderNumber})`;
  
  const htmlContent = generateEmailTemplate(
    'Request Status Update',
    generateStatusUpdateContent(request, requestedBy),
    companyName
  );
  
  const textContent = generateStatusUpdateTextContent(request, companyName, requestedBy);
  
  return sendEmail(recipients, subject, htmlContent, textContent, companyName);
}

/**
 * Generate modern, professional HTML email template
 */
function generateEmailTemplate(title, content, companyName) {
  const COMPANY_NAME = companyName || DEFAULT_COMPANY_NAME;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #2c3e50; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 650px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2c3e50; margin-top: 0; font-size: 24px; font-weight: 600; margin-bottom: 20px; }
        .details { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .details h3 { margin-top: 0; color: #475569; font-size: 18px; font-weight: 600; margin-bottom: 20px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .info-label { font-weight: 600; color: #64748b; min-width: 140px; }
        .info-value { color: #1e293b; flex: 1; }
        .panel-list { margin: 25px 0; }
        .panel-item { background: white; padding: 25px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
        .panel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
        .panel-field { display: flex; flex-direction: column; }
        .panel-field-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .panel-field-value { font-size: 16px; color: #1e293b; font-weight: 500; }
        .panel-title { font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 15px; }
        .reason-section { background: #fef7f0; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .notes-section { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${COMPANY_NAME}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate new request email content with improved layout
 */
function generateNewRequestContent(request, requestedBy) {
  // Generate panels with improved layout - remove "General" prefix
  const panelsHtml = request.panels.map(panel => {
    const panelType = panel.panelType.replace(/^General\s*/i, ''); // Remove "General" prefix
    return `
    <div class="panel-item">
      <div class="panel-title">${panelType} - Panel ${panel.panelNumber}</div>
      <div class="panel-grid">
        <div class="panel-field">
          <div class="panel-field-label">Material</div>
          <div class="panel-field-value">${panel.material}</div>
        </div>
        <div class="panel-field">
          <div class="panel-field-label">Side</div>
          <div class="panel-field-value">${panel.side}</div>
        </div>
        <div class="panel-field">
          <div class="panel-field-label">Quantity</div>
          <div class="panel-field-value">${panel.quantity}</div>
        </div>
      </div>
    </div>
  `;
  }).join('');

  return `
    <h2>Panel Recut Request Submitted</h2>
    <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">A new panel recut request has been submitted and requires your attention.</p>
    
    <div class="details">
      <h3>Request Information</h3>
      <div class="info-row">
        <div class="info-label">Glider:</div>
        <div class="info-value">${request.gliderName}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Order Number:</div>
        <div class="info-value">${request.orderNumber}</div>
      </div>
      ${requestedBy ? `
      <div class="info-row">
        <div class="info-label">Requested by:</div>
        <div class="info-value">${requestedBy}</div>
      </div>
      ` : ''}
      <div class="info-row">
        <div class="info-label">Submitted:</div>
        <div class="info-value">${new Date(request.submittedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
      </div>
    </div>
    
    <div class="reason-section">
      <h3 style="margin-top: 0; color: #92400e;">Reason for Recut</h3>
      <p style="margin: 0; font-size: 16px; line-height: 1.6;">${request.reason}</p>
    </div>
    
    ${request.notes ? `
      <div class="notes-section">
        <h3 style="margin-top: 0; color: #0369a1;">Additional Notes</h3>
        <p style="margin: 0; font-size: 16px; line-height: 1.6;">${request.notes}</p>
      </div>
    ` : ''}
    
    <h3 style="color: #374151; margin-top: 30px; margin-bottom: 20px;">Panels Required</h3>
    <div class="panel-list">
      ${panelsHtml}
    </div>
    
    <p style="margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; font-size: 14px; color: #64748b; text-align: center;">
      Please review this request and process accordingly.
    </p>
  `;
}

/**
 * Generate status update email content
 */
function generateStatusUpdateContent(request, requestedBy) {
  return `
    <h2>Request Status Updated</h2>
    <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">The status of a panel recut request has been updated.</p>
    
    <div class="details">
      <h3>Request Information</h3>
      <div class="info-row">
        <div class="info-label">Glider:</div>
        <div class="info-value">${request.gliderName}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Order Number:</div>
        <div class="info-value">${request.orderNumber}</div>
      </div>
      ${requestedBy ? `
      <div class="info-row">
        <div class="info-label">Requested by:</div>
        <div class="info-value">${requestedBy}</div>
      </div>
      ` : ''}
      <div class="info-row">
        <div class="info-label">New Status:</div>
        <div class="info-value" style="font-weight: 600; color: #059669;">${request.status}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Updated:</div>
        <div class="info-value">${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
      </div>
    </div>
    
    <div class="reason-section">
      <h3 style="margin-top: 0; color: #92400e;">Original Request</h3>
      <p><strong>Reason:</strong> ${request.reason}</p>
      <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
    </div>
    
    <p style="margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; font-size: 14px; color: #64748b; text-align: center;">
      Request tracking: ${request.orderNumber}
    </p>
  `;
}

/**
 * Generate plain text content for new requests
 */
function generateNewRequestTextContent(request, companyName, requestedBy) {
  const COMPANY_NAME = companyName || DEFAULT_COMPANY_NAME;
  
  return `
Panel Recut Request - ${COMPANY_NAME}

Glider: ${request.gliderName}
Order Number: ${request.orderNumber}${requestedBy ? `
Requested by: ${requestedBy}` : ''}
Submitted: ${new Date(request.submittedAt).toLocaleString()}

Reason: ${request.reason}

${request.notes ? `Notes: ${request.notes}` : ''}

Panels Required:
${request.panels.map(panel => {
  const panelType = panel.panelType.replace(/^General\s*/i, '');
  return `- ${panelType} Panel ${panel.panelNumber}
  Material: ${panel.material}
  Side: ${panel.side}
  Quantity: ${panel.quantity}`;
}).join('\n\n')}

Please review this request and process accordingly.
`;
}

/**
 * Generate plain text content for status updates
 */
function generateStatusUpdateTextContent(request, companyName, requestedBy) {
  const COMPANY_NAME = companyName || DEFAULT_COMPANY_NAME;
  
  return `
Request Status Update - ${COMPANY_NAME}

Glider: ${request.gliderName}
Order Number: ${request.orderNumber}${requestedBy ? `
Requested by: ${requestedBy}` : ''}
New Status: ${request.status}
Updated: ${new Date().toLocaleString()}

Original Request:
Reason: ${request.reason}
Submitted: ${new Date(request.submittedAt).toLocaleString()}

Request tracking: ${request.orderNumber}
`;
}

/**
 * Send email using Gmail API
 */
function sendEmail(recipients, subject, htmlContent, textContent, companyName) {
  try {
    const COMPANY_NAME = companyName || DEFAULT_COMPANY_NAME;
    
    // Prepare recipient list
    const toEmails = Array.isArray(recipients.to) ? recipients.to.join(',') : recipients.to;
    const ccEmails = recipients.cc && recipients.cc.length > 0 ? recipients.cc.join(',') : '';
    const bccEmails = recipients.bcc && recipients.bcc.length > 0 ? recipients.bcc.join(',') : '';
    
    console.log('Sending email to:', toEmails);
    if (ccEmails) console.log('CC:', ccEmails);
    if (bccEmails) console.log('BCC:', bccEmails);
    
    // Prepare email options
    const emailOptions = {
      htmlBody: htmlContent,
      name: COMPANY_NAME
    };
    
    if (ccEmails) {
      emailOptions.cc = ccEmails;
    }
    
    if (bccEmails) {
      emailOptions.bcc = bccEmails;
    }
    
    // Use Gmail service to send the email
    GmailApp.sendEmail(
      toEmails,
      subject,
      textContent,
      emailOptions
    );
    
    console.log('Email sent successfully');
    
    return {
      success: true,
      messageId: `gas-${new Date().getTime()}`,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
}

/**
 * Test function to verify the setup
 */
function testEmailService() {
  const testRequest = {
    gliderName: 'Test Glider',
    orderNumber: 'TEST-001',
    reason: 'Testing email service',
    submittedAt: new Date().toISOString(),
    panels: [
      {
        panelType: 'General Wing Panel',
        panelNumber: '1',
        material: 'Ripstop Nylon',
        side: 'Left',
        quantity: '1'
      }
    ],
    notes: 'This is a test email'
  };
  
  const testRecipients = {
    to: [Session.getActiveUser().getEmail()]
  };
  
  return sendNewRequestNotification(testRequest, testRecipients, 'Test Company');
}
