-- Simple migration script for Supabase Dashboard
-- Copy and paste this SQL into your Supabase SQL Editor

-- Add the requested_by column to existing table
ALTER TABLE damage_requests 
ADD COLUMN IF NOT EXISTS requested_by VARCHAR(255);

-- Update existing records with a default value
UPDATE damage_requests 
SET requested_by = 'Unknown User' 
WHERE requested_by IS NULL OR requested_by = '';

-- Make the column NOT NULL after updating existing records
ALTER TABLE damage_requests 
ALTER COLUMN requested_by SET NOT NULL;
