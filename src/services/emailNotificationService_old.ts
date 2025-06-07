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
   */  private static generateNewRequestEmailHTML(request: DamageRequest): string {
    const panelsHtml = request.panels.map(panel => `
      <div style="border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f9fafb;">
        <div style="font-weight: 600; font-size: 16px; color: #1f2937; margin-bottom: 8px;">Panel ${panel.panelNumber}</div>
        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">MATERIAL</div>
        <div style="color: #374151; margin-bottom: 12px;">${panel.material}</div>
        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">SIDE</div>
        <div style="color: #374151; margin-bottom: 12px;">${panel.side}</div>
        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">QUANTITY</div>
        <div style="color: #374151;">${panel.quantity}</div>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Panel Recut Request Submitted</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 32px 24px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Aqua Dynamics</h1>
          </div>
          
          <!-- Main Content -->
          <div style="background: white; padding: 24px;">
            <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Panel Recut Request Submitted</h2>
            <p style="color: #6b7280; margin: 0 0 32px 0; font-size: 16px;">A new panel recut request has been submitted and requires your attention.</p>
              <!-- Request Information Section -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Request Information</h3>
              
              <div style="margin-bottom: 16px;">
                <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Glider:</div>
                <div style="color: #1f2937; font-size: 16px;">${request.gliderName}</div>
              </div>
              
              <div style="margin-bottom: 16px;">
                <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Order Number:</div>
                <div style="color: #1f2937; font-size: 16px;">${request.orderNumber}</div>
              </div>
              
              ${request.requestedBy ? `
              <div style="margin-bottom: 16px;">
                <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Requested by:</div>
                <div style="color: #1f2937; font-size: 16px;">${request.requestedBy}</div>
              </div>
              ` : ''}
              
              <div style="margin-bottom: 16px;">
                <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Submitted:</div>
                <div style="color: #1f2937; font-size: 16px;">${new Date(request.submittedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>
            
            <!-- Reason for Recut Section -->
            <div style="background: #fef7f0; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #92400e; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Reason for Recut</h3>
              <p style="color: #1f2937; margin: 0; font-size: 16px; line-height: 1.6;">${request.reason}</p>
            </div>
            
            <!-- Panels Required Section -->
            <div style="margin-bottom: 24px;">
              <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Panels Required</h3>
              ${panelsHtml}
            </div>
            
            ${request.notes ? `
            <!-- Additional Notes Section -->
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #0369a1; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Additional Notes</h3>
              <p style="color: #1f2937; margin: 0; font-size: 16px; line-height: 1.6;">${request.notes}</p>
            </div>
            ` : ''}
            
            <!-- Call to Action -->
            <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin-top: 32px;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">Please review this request and process accordingly.</p>
            </div>
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
${request.requestedBy ? `- Requested by: ${request.requestedBy}` : ''}
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
