// Gmail SMTP Email Service
// This service uses your Gmail account with App Password to send emails

export interface GmailEmailConfig {
  gmailUser: string;
  gmailAppPassword: string;
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

export class GmailEmailService {
  private config: GmailEmailConfig;

  constructor(config: GmailEmailConfig) {
    this.config = config;
  }

  // Send email using Gmail SMTP via backend server
  async sendEmail(recipients: EmailRecipients, content: EmailContent): Promise<boolean> {
    try {
      // For client-side Gmail sending, we use our backend service
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gmail: {
            user: this.config.gmailUser,
            appPassword: this.config.gmailAppPassword,
          },
          email: {
            from: this.config.gmailUser,
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
  }

  // Generate professional HTML email template
  generateEmailTemplate(title: string, content: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 20px; background-color: #f9fafb; }
        .container { max-width: 650px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
        .header { background: linear-gradient(135deg, #1f2937, #374151); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1f2937; margin-top: 0; margin-bottom: 24px; font-size: 24px; font-weight: 600; }
        .details { background-color: #f8fafc; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0; }
        .details h3 { margin-top: 0; margin-bottom: 16px; color: #1f2937; font-size: 18px; font-weight: 600; }
        .info-row { display: flex; margin-bottom: 12px; }
        .info-label { font-weight: 600; min-width: 140px; color: #6b7280; }
        .info-value { color: #1f2937; }
        .reason-section, .notes-section { margin: 24px 0; padding: 24px; background-color: #fef7f0; border-radius: 8px; border-left: 4px solid #f59e0b; }
        .panel-list { margin: 24px 0; }
        .panel-item { background-color: #ffffff; padding: 24px; margin: 16px 0; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
        .panel-title { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px; }
        .panel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
        .panel-field { }
        .panel-field-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .panel-field-value { font-size: 16px; color: #1f2937; font-weight: 500; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 8px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .panel-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${this.config.companyName}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
    </div>
</body>
</html>`;
  }
  // Send new damage request notification
  async sendNewRequestNotification(request: any, recipients: EmailRecipients, requestedBy?: string): Promise<boolean> {
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
      'Panel Recut Request',
      `
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
      `
    );    const textContent = `
Panel Recut Request - ${this.config.companyName}

Glider: ${request.gliderName}
Order Number: ${request.orderNumber}${requestedBy ? `
Requested by: ${requestedBy}` : ''}
Submitted: ${new Date(request.submittedAt).toLocaleString()}

Reason: ${request.reason}

${request.notes ? `Notes: ${request.notes}` : ''}

Panels Required:
${request.panels.map((panel: any) => {
  const panelType = panel.panelType.replace(/^General\s*/i, '');
  return `- ${panelType} Panel ${panel.panelNumber}
  Material: ${panel.material}
  Side: ${panel.side}
  Quantity: ${panel.quantity}`;
}).join('\n\n')}

Please review this request and process accordingly.
`;return this.sendEmail(recipients, {
      subject: `Panel Recut Request: ${request.gliderName} (${request.orderNumber})`,
      html: htmlContent,
      text: textContent
    });
  }
  // Send status update notification
  async sendStatusUpdateNotification(request: any, newStatus: string, recipients: EmailRecipients, requestedBy?: string): Promise<boolean> {
    const statusColors = {
      'Pending': 'status-pending',
      'Processing': 'status-processing', 
      'Done': 'status-done'
    };    const htmlContent = this.generateEmailTemplate(
      'Request Status Update',
      `        <h2>Request Status Updated</h2>
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
            <div class="info-value">${newStatus}</div>
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
          <div class="info-row">
            <div class="info-label">Reason:</div>
            <div class="info-value">${request.reason}</div>
          </div>
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
        
        <p style="margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; font-size: 14px; color: #64748b; text-align: center;">
          Request tracking: ${request.orderNumber}
        </p>
      `
    );    const textContent = `
Request Status Update - ${this.config.companyName}

Glider: ${request.gliderName}
Order Number: ${request.orderNumber}${requestedBy ? `
Requested by: ${requestedBy}` : ''}
New Status: ${newStatus}
Updated: ${new Date().toLocaleString()}

Original Request:
Reason: ${request.reason}
Submitted: ${new Date(request.submittedAt).toLocaleString()}

Request tracking: ${request.orderNumber}
`;return this.sendEmail(recipients, {
      subject: `Status Update: ${request.gliderName} - ${newStatus} (${request.orderNumber})`,
      html: htmlContent,
      text: textContent
    });
  }
}

// Create and export a configured instance
export const createGmailEmailService = (config: GmailEmailConfig): GmailEmailService => {
  return new GmailEmailService(config);
};
