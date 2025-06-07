-- First, drop existing tables if they exist (to clean up any partial creation)
DROP TABLE IF EXISTS damage_requests CASCADE;
DROP TABLE IF EXISTS email_settings CASCADE;

-- Create damage_requests table
CREATE TABLE damage_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    glider_name VARCHAR(255) NOT NULL,
    order_number VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    requested_by VARCHAR(255) NOT NULL,
    panels JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Done')),
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_settings table (optional for storing email configuration)
CREATE TABLE email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipients JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(recipients) = 'array'),
    cc_recipients JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(cc_recipients) = 'array'), 
    notifications JSONB NOT NULL DEFAULT '{"newRequest": true, "statusUpdate": true, "completion": true}' CHECK (jsonb_typeof(notifications) = 'object'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_damage_requests_status ON damage_requests(status);
CREATE INDEX IF NOT EXISTS idx_damage_requests_created_at ON damage_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_damage_requests_order_number ON damage_requests(order_number);

-- Enable Row Level Security (RLS) - recommended for production
ALTER TABLE damage_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for authenticated users
-- You may want to customize these policies based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON damage_requests
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON email_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous access for testing (REMOVE IN PRODUCTION)
-- These policies allow anyone to read, insert, update, and delete
CREATE POLICY "Allow anonymous access" ON damage_requests
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access" ON email_settings
    FOR ALL USING (true);

-- Insert sample data (optional)
INSERT INTO damage_requests (glider_name, order_number, reason, requested_by, panels, status, notes) VALUES
('Advance Alpha 7', 'ORD-2024-001', 'Small tear near leading edge, approximately 3cm', 'John Smith',
 '[{"panelType": "Top Surface", "panelNumber": "P-42", "material": "Dominico N20D", "quantity": 1, "side": "Left Side"}]',
 'In Progress', null),
('Ozone Rush 5', 'ORD-2024-002', 'UV damage causing discoloration and fabric weakening', 'Sarah Johnson',
 '[{"panelType": "Bottom Surface", "panelNumber": "P-15", "material": "Porcher Skytex 27", "quantity": 2, "side": "Left & Right Side"}]',
 'Pending', null),
('Gin Boomerang 12', 'ORD-2024-003', 'Complete panel replacement needed after tree landing', 'Mike Wilson',
 '[{"panelType": "Stabilizer", "panelNumber": "P-8", "material": "Porcher Skytex 38", "quantity": 1, "side": "Right Side"}, {"panelType": "Leading Edge", "panelNumber": "P-3", "material": "Dokdo 40D", "quantity": 1, "side": "Right Side"}]',
 'Done', 'Completed ahead of schedule');

-- Insert default email settings
INSERT INTO email_settings (recipients, cc_recipients, notifications) VALUES
('["production@paragliderpro.com", "quality@paragliderpro.com"]',
 '["manager@paragliderpro.com"]',
 '{"newRequest": true, "statusUpdate": true, "completion": true}');
