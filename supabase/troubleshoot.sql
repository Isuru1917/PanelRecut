-- Troubleshooting SQL Script
-- Run this if you encounter issues with the main setup.sql

-- Check if tables exist
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('damage_requests', 'email_settings')
ORDER BY table_name, ordinal_position;

-- If the above shows missing columns or tables, run the following:

-- Drop and recreate damage_requests table (CAREFUL: This will delete all data)
DROP TABLE IF EXISTS damage_requests CASCADE;

CREATE TABLE damage_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    glider_name TEXT NOT NULL,
    order_number TEXT NOT NULL,
    reason TEXT NOT NULL,
    panels JSONB NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Done')),
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for testing (enable it later for production)
ALTER TABLE damage_requests DISABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows everything for now
-- ALTER TABLE damage_requests ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "allow_all" ON damage_requests FOR ALL USING (true);

-- Test insert
INSERT INTO damage_requests (glider_name, order_number, reason, panels, status, notes) VALUES
('Test Glider', 'TEST-001', 'Test reason', 
 '[{"panelType": "Top Surface", "panelNumber": "P-1", "material": "Test Material", "quantity": 1, "side": "Left Side"}]',
 'Pending', 'Test note');

-- Verify the insert worked
SELECT * FROM damage_requests;
