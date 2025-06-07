import { DamageRequest } from '../types/types';

export interface EmailNotificationOptions {
  to: string[];
  cc?: string[];
  damageRequest: DamageRequest;
  type: 'new_request' | 'status_update' | 'completion';
}

export class VercelEmailService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

  /**
   * Send email notification via Vercel API
   */
  static async sendEmailNotification(options: EmailNotificationOptions): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('Email sent successfully via Vercel API:', result.messageId);
      return true;

    } catch (error) {
      console.error('Failed to send email notification via Vercel API:', error);
      return false;
    }
  }

  /**
   * Send email notification for a new damage request
   */
  static async sendNewRequestNotification(options: EmailNotificationOptions): Promise<boolean> {
    return this.sendEmailNotification({
      ...options,
      type: 'new_request'
    });
  }

  /**
   * Send email notification for a status update
   */
  static async sendStatusUpdateNotification(options: EmailNotificationOptions): Promise<boolean> {
    return this.sendEmailNotification({
      ...options,
      type: 'status_update'
    });
  }

  /**
   * Send email notification for completion
   */
  static async sendCompletionNotification(options: EmailNotificationOptions): Promise<boolean> {
    return this.sendEmailNotification({
      ...options,
      type: 'completion'
    });
  }

  /**
   * Test the email API connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/send-email`, {
        method: 'OPTIONS',
      });
      return response.ok;
    } catch (error) {
      console.error('Email API connection test failed:', error);
      return false;
    }
  }
}
