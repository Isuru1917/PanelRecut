// Outlook SMTP Email Service
// This service uses your Outlook account with App Password to send emails

export interface OutlookEmailConfig {
  outlookUser: string;
  outlookAppPassword: string;
  companyName: string;
}

export interface EmailRecipients {
  to: string[];
  cc?: string[];
  bcc?: string[];
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export class OutlookEmailService {
  private config: OutlookEmailConfig;

  constructor(config: OutlookEmailConfig) {
    this.config = config;
  }

  // Send email using Outlook SMTP via backend server
  async sendEmail(recipients: EmailRecipients, content: EmailContent): Promise<boolean> {
    try {
      // For client-side Outlook sending, we use our backend service
      const response = await fetch('http://localhost:3001/api/send-outlook-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outlook: {
            user: this.config.outlookUser,
            appPassword: this.config.outlookAppPassword,
          },
          email: {
            from: this.config.outlookUser,
            to: recipients.to,
            cc: recipients.cc,
            bcc: recipients.bcc,
            subject: content.subject,
            html: content.html,
            text: content.text,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Email API responded with status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return true;
    } catch (error) {
      return false;
    }
  }  // Generate modern HTML email template optimized for Outlook desktop app
  generateEmailTemplate(title: string, content: string): string {
    return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Outlook-specific styles */
        #outlook a { padding: 0; }
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass * { line-height: 100%; }
        body {
            font-family: Arial, Helvetica, sans-serif !important;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 20px;
            background-color: #f9fafb;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        table {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }        
        .header {
            background-color: #1f2937;
            color: white;
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.025em;
            font-family: Arial, Helvetica, sans-serif;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
            font-family: Arial, Helvetica, sans-serif;
        }
        .content {
            padding: 32px 24px;
        }
        .content h2 {
            color: #111827;
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
            line-height: 1.3;
            font-family: Arial, Helvetica, sans-serif;
        }
        .content p {
            margin: 0 0 16px 0;
            color: #4b5563;
            font-family: Arial, Helvetica, sans-serif;
        }
        .details {
            background-color: #f8fafc;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
            border: 1px solid #e5e7eb;
        }
        .details h3 {
            margin: 0 0 16px 0;
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            font-family: Arial, Helvetica, sans-serif;
        }
        .details p {
            margin: 0 0 12px 0;
            color: #374151;
            font-family: Arial, Helvetica, sans-serif;
        }
        .details p:last-child {
            margin-bottom: 0;
        }
        .panel-list {
            margin: 20px 0;
        }
        .panel-item {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 12px 0;
            border-left: 4px solid #3b82f6;
        }
        .panel-title {
            font-weight: 600;
            font-size: 16px;
            color: #111827;
            margin-bottom: 12px;
            font-family: Arial, Helvetica, sans-serif;
        }
        .panel-info {
            font-size: 14px;
            color: #6b7280;
            font-family: Arial, Helvetica, sans-serif;
        }
        .panel-info strong {
            color: #374151;
        }
        /* Fallback for Outlook 2007-2016 */
        <!--[if mso]>
        .container { width: 600px !important; }
        .header { background-color: #1f2937 !important; }
        .panel-item { border-left: 4px solid #3b82f6 !important; }
        <![endif]-->
    </style>
</head>
<body>
    <!--[if mso]>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
    <td align="center">
    <![endif]-->
    <div class="container">
        <div class="header">
            <h1>${this.config.companyName}</h1>
            <p>Panel Recut Management System</p>
        </div>
        <div class="content">
            ${content}
        </div>
    </div>
    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
</body>
</html>`;
  }  // Send new damage request notification
  async sendNewRequestNotification(request: any, recipients: EmailRecipients): Promise<boolean> {
    const panelsHtml = request.panels.map((panel: any) => {
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

    const htmlContent = this.generateEmailTemplate(
      'New Panel Recut Request',
      `
        <h2>New Panel Recut Request Submitted</h2>
        <p>A new panel recut request has been submitted and requires your attention.</p>
        
        <div class="details">
          <h3>Request Details</h3>
          <p><strong>Glider:</strong> ${request.gliderName}</p>
          <p><strong>Order Number:</strong> ${request.orderNumber}</p>
          <p><strong>Status:</strong> Pending</p>
          <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
          
          <h3>Reason for Recut</h3>
          <p>${request.reason}</p>
          
          ${request.notes ? `
            <h3>Additional Notes</h3>
            <p>${request.notes}</p>
          ` : ''}
          
          <h3>Panels Required</h3>
          <div class="panel-list">
            ${panelsHtml}
          </div>
        </div>
        
        <p>Please review this request and update the status accordingly in the management system.</p>
      `
    );

    const textContent = `
New Panel Recut Request - ${this.config.companyName}

Glider: ${request.gliderName}
Order Number: ${request.orderNumber}
Status: Pending
Submitted: ${new Date(request.submittedAt).toLocaleString()}

Reason: ${request.reason}

${request.notes ? `Notes: ${request.notes}` : ''}

Panels Required:
${request.panels.map((panel: any) => 
  `- ${panel.panelType.replace(/^General\s*/i, '')} Panel ${panel.panelNumber} (${panel.material}, ${panel.side}, Qty: ${panel.quantity})`
).join('\n')}

Please review this request in the management system.
`;

    return this.sendEmail(recipients, {
      subject: `Panel Recut Request: ${request.gliderName} (${request.orderNumber})`,
      html: htmlContent,
      text: textContent
    });
  }
  // Send status update notification
  async sendStatusUpdateNotification(request: any, newStatus: string, recipients: EmailRecipients): Promise<boolean> {
    const htmlContent = this.generateEmailTemplate(
      'Request Status Update',
      `
        <h2>Request Status Updated</h2>
        <p>The status of a panel recut request has been updated.</p>
        
        <div class="details">
          <h3>Request Information</h3>
          <p><strong>Glider:</strong> ${request.gliderName}</p>
          <p><strong>Order Number:</strong> ${request.orderNumber}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
          <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
          
          <h3>Original Request</h3>
          <p><strong>Reason:</strong> ${request.reason}</p>
          <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
        </div>
        
        <p>Request tracking: ${request.orderNumber}</p>
      `
    );

    const textContent = `
Request Status Update - ${this.config.companyName}

Glider: ${request.gliderName}
Order Number: ${request.orderNumber}
New Status: ${newStatus}
Updated: ${new Date().toLocaleString()}

Original Request:
Reason: ${request.reason}
Submitted: ${new Date(request.submittedAt).toLocaleString()}

Request tracking: ${request.orderNumber}
`;

    return this.sendEmail(recipients, {
      subject: `Status Update: ${request.gliderName} - ${newStatus} (${request.orderNumber})`,
      html: htmlContent,
      text: textContent
    });
  }
}

// Create and export a configured instance
export const createOutlookEmailService = (config: OutlookEmailConfig): OutlookEmailService => {
  return new OutlookEmailService(config);
};