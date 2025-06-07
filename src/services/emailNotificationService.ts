import { Resend } from 'resend';
import { DamageRequest } from '../types/types';

// Initialize Resend with your API key from environment variables
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || 'your-resend-api-key-here');

export interface EmailNotificationOptions {
  to: string[];
  cc?: string[];
  damageRequest: DamageRequest;
  type: 'new_request' | 'status_update' | 'completion';
}

export class EmailNotificationService {
  private static readonly FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'noreply@yourdomain.com';
  private static readonly COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || 'Aqua Dynamics';

  /**
   * Send email notification for a new damage request
   */
  static async sendNewRequestNotification(options: EmailNotificationOptions): Promise<boolean> {
    try {
      const { to, cc, damageRequest } = options;
      
      const subject = `New Damage Recut Request - ${damageRequest.gliderName} (${damageRequest.orderNumber})`;
      const htmlContent = this.generateNewRequestEmailHTML(damageRequest);
      const textContent = this.generateNewRequestEmailText(damageRequest);

      const emailData = {
        from: `${this.COMPANY_NAME} <${this.FROM_EMAIL}>`,
        to,
        cc,
        subject,
        html: htmlContent,
        text: textContent,
      };

      const result = await resend.emails.send(emailData);
      
      if (result.error) {
        console.error('Error sending email:', result.error);
        return false;
      }

      console.log('Email sent successfully:', result.data?.id);
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  /**
   * Send email notification for status updates
   */
  static async sendStatusUpdateNotification(options: EmailNotificationOptions): Promise<boolean> {
    try {
      const { to, cc, damageRequest } = options;
      
      const subject = `Status Update - ${damageRequest.gliderName} (${damageRequest.orderNumber}) - ${damageRequest.status}`;
      const htmlContent = this.generateStatusUpdateEmailHTML(damageRequest);
      const textContent = this.generateStatusUpdateEmailText(damageRequest);

      const emailData = {
        from: `${this.COMPANY_NAME} <${this.FROM_EMAIL}>`,
        to,
        cc,
        subject,
        html: htmlContent,
        text: textContent,
      };

      const result = await resend.emails.send(emailData);
      
      if (result.error) {
        console.error('Error sending status update email:', result.error);
        return false;
      }

      console.log('Status update email sent successfully:', result.data?.id);
      return true;
    } catch (error) {
      console.error('Failed to send status update email:', error);
      return false;
    }
  }

  /**
   * Generate HTML content for new request email
   */
  private static generateNewRequestEmailHTML(request: DamageRequest): string {
    const panelsHtml = request.panels.map(panel => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${panel.panelNumber}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${panel.material}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${panel.quantity}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${panel.side}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Damage Recut Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">          <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px;">New Damage Recut Request</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #1e40af; margin-top: 0;">Request Details</h2>
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tr>
                <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">Glider Name:</td>
                <td style="padding: 8px; background-color: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">${request.gliderName}</td>
              </tr>              <tr>
                <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">Order Number:</td>
                <td style="padding: 8px; background-color: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">${request.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">Requested by:</td>
                <td style="padding: 8px; background-color: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">${request.requestedBy || 'Not specified'}</td>
              </tr>              <tr>
                <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">Reason:</td>
                <td style="padding: 8px; background-color: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">${request.reason}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">Status:</td>
                <td style="padding: 8px; background-color: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">
                  <span style="background-color: #fbbf24; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; font-family: Arial, sans-serif;">
                    ${request.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">Submitted:</td>
                <td style="padding: 8px; background-color: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif;">${new Date(request.submittedAt).toLocaleString()}</td>
              </tr>
            </table>            <h3 style="color: #1e40af; margin-top: 25px; font-family: Arial, sans-serif;">Panel Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <thead>
                <tr style="background-color: #1e40af; color: white;">
                  <th style="padding: 10px; text-align: left; border: 1px solid #1e40af; font-family: Arial, sans-serif;">Panel Number</th>
                  <th style="padding: 10px; text-align: left; border: 1px solid #1e40af; font-family: Arial, sans-serif;">Material</th>
                  <th style="padding: 10px; text-align: left; border: 1px solid #1e40af; font-family: Arial, sans-serif;">Quantity</th>
                  <th style="padding: 10px; text-align: left; border: 1px solid #1e40af; font-family: Arial, sans-serif;">Side</th>
                </tr>
              </thead>
              <tbody>
                ${panelsHtml}
              </tbody>
            </table>            ${request.notes ? `
              <h3 style="color: #1e40af; margin-top: 25px; font-family: Arial, sans-serif;">Additional Notes</h3>
              <div style="background-color: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; font-family: Arial, sans-serif;">
                ${request.notes}
              </div>
            ` : ''}
          </div>
            <div style="background-color: #1e293b; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; font-family: Arial, sans-serif;">
            <p style="margin: 0;">This is an automated notification from ${this.COMPANY_NAME}</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Please do not reply to this email</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate plain text content for new request email
   */
  private static generateNewRequestEmailText(request: DamageRequest): string {
    const panelsText = request.panels.map(panel => 
      `- Panel: ${panel.panelNumber}, Material: ${panel.material}, Quantity: ${panel.quantity}, Side: ${panel.side}`
    ).join('\n');    return `
NEW DAMAGE RECUT REQUEST - ${this.COMPANY_NAME}

Request Details:
- Glider Name: ${request.gliderName}
- Order Number: ${request.orderNumber}
- Requested by: ${request.requestedBy || 'Not specified'}
- Reason: ${request.reason}
- Status: ${request.status}
- Submitted: ${new Date(request.submittedAt).toLocaleString()}

Panel Information:
${panelsText}

${request.notes ? `Additional Notes:\n${request.notes}` : ''}

---
This is an automated notification from ${this.COMPANY_NAME}
Please do not reply to this email
    `.trim();
  }

  /**
   * Generate HTML content for status update email
   */
  private static generateStatusUpdateEmailHTML(request: DamageRequest): string {
    const statusColor = request.status === 'Done' ? '#10b981' : 
                       request.status === 'In Progress' ? '#f59e0b' : '#6b7280';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Status Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Request Status Update</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${this.COMPANY_NAME}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusColor};">
              <h2 style="margin-top: 0; color: #1e40af;">
                ${request.gliderName} - ${request.orderNumber}
              </h2>
              <p style="font-size: 18px; margin: 10px 0;">
                Status: <strong style="color: ${statusColor};">${request.status}</strong>
              </p>
              <p style="color: #64748b; margin: 0;">
                Updated: ${new Date(request.updatedAt).toLocaleString()}
              </p>
            </div>

            ${request.notes ? `
              <h3 style="color: #1e40af; margin-top: 25px;">Notes</h3>
              <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                ${request.notes}
              </div>
            ` : ''}
          </div>
          
          <div style="background: #1e293b; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">This is an automated notification from ${this.COMPANY_NAME}</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate plain text content for status update email
   */
  private static generateStatusUpdateEmailText(request: DamageRequest): string {
    return `
STATUS UPDATE - ${this.COMPANY_NAME}

${request.gliderName} - ${request.orderNumber}
Status: ${request.status}
Updated: ${new Date(request.updatedAt).toLocaleString()}

${request.notes ? `Notes:\n${request.notes}` : ''}

---
This is an automated notification from ${this.COMPANY_NAME}
    `.trim();
  }
}
