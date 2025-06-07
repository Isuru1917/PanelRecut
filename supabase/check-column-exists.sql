-- Check if the requested_by column exists in the damage_requests table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'damage_requests' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check the current structure of the table
\d damage_requests;
