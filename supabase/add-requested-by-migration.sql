-- Migration to add requested_by column to existing damage_requests table
-- Run this script if you have an existing database

-- Add the requested_by column
ALTER TABLE damage_requests 
ADD COLUMN requested_by VARCHAR(255);

-- Update existing records with a default value (you may want to update these manually)
UPDATE damage_requests 
SET requested_by = 'Migration - Unknown' 
WHERE requested_by IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE damage_requests 
ALTER COLUMN requested_by SET NOT NULL;

-- Optional: Update the sample data with proper requested_by values
UPDATE damage_requests 
SET requested_by = 'John Smith'
WHERE order_number = 'ORD-2024-001';

UPDATE damage_requests 
SET requested_by = 'Sarah Johnson'
WHERE order_number = 'ORD-2024-002';

UPDATE damage_requests 
SET requested_by = 'Mike Wilson'
WHERE order_number = 'ORD-2024-003';
