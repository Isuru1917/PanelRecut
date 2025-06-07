// Google Apps Script Email Service
// Modern and Professional Email Service using Google Apps Script

export interface GoogleAppsScriptEmailConfig {
  scriptUrl: string; // The deployed Google Apps Script web app URL
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

export class GoogleAppsScriptEmailService {
  private config: GoogleAppsScriptEmailConfig;

  constructor(config: GoogleAppsScriptEmailConfig) {
    this.config = config;
  }

  // Send email using Google Apps Script web app
  async sendEmail(recipients: EmailRecipients, content: EmailContent): Promise<boolean> {
    try {
      if (!this.config.scriptUrl) {
        throw new Error('Google Apps Script URL is not configured');
      }

      const response = await fetch(this.config.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom_email',
          recipients: recipients,
          content: content,
          companyName: this.config.companyName
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Apps Script response error:', errorText);
        throw new Error(`Apps Script API responded with status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Unknown error from Google Apps Script');
      }

      console.log('Email sent successfully via Google Apps Script:', result);
      return true;
    } catch (error) {
      console.error('Error sending email via Google Apps Script:', error);
      return false;
    }
  }

  // Test connection to Google Apps Script
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (!this.config.scriptUrl) {
        return {
          success: false,
          message: 'Google Apps Script URL is not configured'
        };
      }

      const response = await fetch(this.config.scriptUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Connection failed: HTTP ${response.status}`,
          details: await response.text()
        };
      }

      const result = await response.json();
      return {
        success: true,
        message: 'Connected to Google Apps Script successfully',
        details: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection error: ${error.message}`,
        details: error
      };
    }
  }

  // Send new damage request notification with improved template
  async sendNewRequestNotification(request: any, recipients: EmailRecipients): Promise<boolean> {
    try {
      if (!this.config.scriptUrl) {
        throw new Error('Google Apps Script URL is not configured');
      }

      const response = await fetch(this.config.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_request',
          request: request,
          recipients: recipients,
          companyName: this.config.companyName
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Apps Script response error:', errorText);
        throw new Error(`Apps Script API responded with status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Unknown error from Google Apps Script');
      }

      console.log('New request notification sent successfully via Google Apps Script');
      return true;
    } catch (error) {
      console.error('Error sending new request notification via Google Apps Script:', error);
      return false;
    }
  }

  // Send status update notification
  async sendStatusUpdateNotification(request: any, newStatus: string, recipients: EmailRecipients): Promise<boolean> {
    try {
      if (!this.config.scriptUrl) {
        throw new Error('Google Apps Script URL is not configured');
      }

      // Update the request object with the new status
      const updatedRequest = { ...request, status: newStatus };

      const response = await fetch(this.config.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'status_update',
          request: updatedRequest,
          recipients: recipients,
          companyName: this.config.companyName
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Apps Script response error:', errorText);
        throw new Error(`Apps Script API responded with status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Unknown error from Google Apps Script');
      }

      console.log('Status update notification sent successfully via Google Apps Script');
      return true;
    } catch (error) {
      console.error('Error sending status update notification via Google Apps Script:', error);
      return false;
    }
  }
}

// Create and export a configured instance
export const createGoogleAppsScriptEmailService = (config: GoogleAppsScriptEmailConfig): GoogleAppsScriptEmailService => {
  return new GoogleAppsScriptEmailService(config);
};