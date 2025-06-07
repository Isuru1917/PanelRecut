-- Email Settings Troubleshooting Script
-- Run this if you have issues with email settings

-- Check if email_settings table exists and its structure
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'email_settings'
ORDER BY ordinal_position;

-- Check current email settings data
SELECT * FROM email_settings ORDER BY created_at DESC;

-- If table doesn't exist or has issues, recreate it
DROP TABLE IF EXISTS email_settings CASCADE;

CREATE TABLE email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipients JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(recipients) = 'array'),
    cc_recipients JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(cc_recipients) = 'array'), 
    notifications JSONB NOT NULL DEFAULT '{"newRequest": true, "statusUpdate": true, "completion": true}' CHECK (jsonb_typeof(notifications) = 'object'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for testing
ALTER TABLE email_settings DISABLE ROW LEVEL SECURITY;

-- Insert test email settings
INSERT INTO email_settings (recipients, cc_recipients, notifications) VALUES
(
    '["test@example.com", "production@paragliderpro.com"]',
    '["manager@paragliderpro.com", "cc@example.com"]',
    '{"newRequest": true, "statusUpdate": true, "completion": false}'
);

-- Test the insert
SELECT 
    id,
    recipients,
    cc_recipients, 
    notifications,
    created_at
FROM email_settings;

-- Test JSON extraction
SELECT 
    id,
    jsonb_array_elements_text(recipients) AS recipient,
    jsonb_array_elements_text(cc_recipients) AS cc_recipient
FROM email_settings;
