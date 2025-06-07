-- Check if requested_by column exists in damage_requests table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'damage_requests' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check the table structure
\d damage_requests

-- Sample query to test if we can select the column
SELECT id, glider_name, order_number, reason, requested_by, status 
FROM damage_requests 
LIMIT 1;
