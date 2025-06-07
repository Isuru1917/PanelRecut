import { supabase } from '@/integrations/supabase/client';
import { EmailSettings } from '@/types/types';

export interface CreateEmailSettingsData {
  recipients: string[];
  ccRecipients: string[];
  notifications: {
    newRequest: boolean;
    statusUpdate: boolean;
    completion: boolean;
  };
}

export const emailSettingsService = {  // Get email settings (returns the first/default settings record)
  async getEmailSettings(): Promise<EmailSettings | null> {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(`Failed to fetch email settings: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return null; // No settings found
    }

    const record = data[0];

    return {
      recipients: record.recipients as string[],
      ccRecipients: record.cc_recipients as string[],
      notifications: record.notifications as {
        newRequest: boolean;
        statusUpdate: boolean;
        completion: boolean;
      }
    };  },
  // Create or update email settings
  async saveEmailSettings(settings: CreateEmailSettingsData): Promise<EmailSettings> {
    // First, delete all existing settings to avoid conflicts
    await supabase
      .from('email_settings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    // Create new settings record
    const { data, error } = await supabase
      .from('email_settings')
      .insert({
        recipients: settings.recipients,
        cc_recipients: settings.ccRecipients,
        notifications: settings.notifications,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()      .single();

    if (error) {
      throw new Error(`Failed to save email settings: ${error.message}`);
    }

    return {
      recipients: data.recipients as string[],
      ccRecipients: data.cc_recipients as string[],
      notifications: data.notifications as EmailSettings['notifications']
    };
  },

  // Delete all email settings
  async deleteEmailSettings(): Promise<void> {
    const { error } = await supabase
      .from('email_settings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      throw new Error(`Failed to delete email settings: ${error.message}`);
    }
  }
};
