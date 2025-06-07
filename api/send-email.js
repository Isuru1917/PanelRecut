const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.VITE_RESEND_API_KEY);

// Constants
const FROM_EMAIL = process.env.VITE_FROM_EMAIL || 'noreply@yourdomain.com';
const COMPANY_NAME = process.env.VITE_COMPANY_NAME || 'Your Company';

function generateNewRequestEmailHTML(request) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Damage Recut Request</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f8fafc;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .info-table th,
        .info-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-table th {
          background-color: #f1f5f9;
          font-weight: 600;
          color: #475569;
        }
        .info-table tr:last-child td {
          border-bottom: none;
        }
        .footer {
          background-color: #64748b;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 0 0 8px 8px;
          font-size: 14px;
        }
        .reason-cell {
          max-width: 300px;
          word-wrap: break-word;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">New Damage Recut Request</h1>
      </div>
      
      <div class="content">
        <p>A new damage recut request has been submitted and requires attention.</p>
        
        <table class="info-table">
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
          <tr>
            <td><strong>Order Number</strong></td>
            <td>${request.orderNumber}</td>
          </tr>
          <tr>
            <td><strong>Glider Name</strong></td>
            <td>${request.gliderName}</td>
          </tr>
          <tr>
            <td><strong>Panel Number</strong></td>
            <td>${request.panelNumber}</td>
          </tr>
          <tr>
            <td><strong>Requested by</strong></td>
            <td>${request.requestedBy || 'Not specified'}</td>
          </tr>
          <tr>
            <td><strong>Reason</strong></td>
            <td class="reason-cell">${request.reason}</td>
          </tr>
          <tr>
            <td><strong>Priority</strong></td>
            <td>${request.priority}</td>
          </tr>
          <tr>
            <td><strong>Request Date</strong></td>
            <td>${new Date(request.requestDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</td>
          </tr>
        </table>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Review the damage request details</li>
          <li>Assess material availability</li>
          <li>Schedule the panel recut</li>
          <li>Update the request status in the system</li>
        </ul>
      </div>
      
      <div class="footer">
        <p style="margin: 0;">This is an automated notification from the Panel Recut Management System</p>
      </div>
    </body>
    </html>
  `;
}

function generateNewRequestEmailText(request) {
  return `
NEW DAMAGE RECUT REQUEST

A new damage recut request has been submitted and requires attention.

REQUEST INFORMATION:
- Order Number: ${request.orderNumber}
- Glider Name: ${request.gliderName}
- Panel Number: ${request.panelNumber}
- Requested by: ${request.requestedBy || 'Not specified'}
- Reason: ${request.reason}
- Priority: ${request.priority}
- Request Date: ${new Date(request.requestDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}

NEXT STEPS:
- Review the damage request details
- Assess material availability  
- Schedule the panel recut
- Update the request status in the system

This is an automated notification from the Panel Recut Management System.
  `.trim();
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { to, cc, damageRequest, type } = req.body;

    if (!to || !damageRequest) {
      res.status(400).json({ error: 'Missing required fields: to, damageRequest' });
      return;
    }

    let subject, htmlContent, textContent;

    switch (type) {
      case 'new_request':
        subject = `New Damage Recut Request - ${damageRequest.gliderName} (${damageRequest.orderNumber})`;
        htmlContent = generateNewRequestEmailHTML(damageRequest);
        textContent = generateNewRequestEmailText(damageRequest);
        break;
      case 'status_update':
        subject = `Damage Recut Status Update - ${damageRequest.gliderName} (${damageRequest.orderNumber})`;
        htmlContent = generateNewRequestEmailHTML(damageRequest); // You can create specific templates for status updates
        textContent = generateNewRequestEmailText(damageRequest);
        break;
      case 'completion':
        subject = `Damage Recut Completed - ${damageRequest.gliderName} (${damageRequest.orderNumber})`;
        htmlContent = generateNewRequestEmailHTML(damageRequest); // You can create specific templates for completion
        textContent = generateNewRequestEmailText(damageRequest);
        break;
      default:
        subject = `Damage Recut Notification - ${damageRequest.gliderName} (${damageRequest.orderNumber})`;
        htmlContent = generateNewRequestEmailHTML(damageRequest);
        textContent = generateNewRequestEmailText(damageRequest);
    }

    const emailData = {
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      ...(cc && { cc: Array.isArray(cc) ? cc : [cc] }),
      subject,
      html: htmlContent,
      text: textContent,
    };

    const result = await resend.emails.send(emailData);

    if (result.error) {
      console.error('Error sending email:', result.error);
      res.status(500).json({ error: 'Failed to send email', details: result.error });
      return;
    }

    console.log('Email sent successfully:', result.data?.id);
    res.status(200).json({ 
      success: true, 
      messageId: result.data?.id,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Failed to send email notification:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
