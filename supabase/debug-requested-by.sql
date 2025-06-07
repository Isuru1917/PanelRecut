-- Debug script to check the current state of the damage_requests table
-- Run this in your Supabase SQL Editor

-- 1. Check if the table exists and show its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'damage_requests' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Show the actual table structure (if PostgreSQL specific commands work)
-- \d damage_requests

-- 3. Check if there are any existing records
SELECT COUNT(*) as total_records FROM damage_requests;

-- 4. Try to select including the requested_by column (this will fail if column doesn't exist)
SELECT 
    id, 
    glider_name, 
    order_number, 
    reason,
    requested_by,  -- This line will cause an error if column doesn't exist
    status,
    created_at
FROM damage_requests 
LIMIT 3;

-- 5. If the above fails, try without requested_by
-- SELECT 
--     id, 
--     glider_name, 
--     order_number, 
--     reason,
--     status,
--     created_at
-- FROM damage_requests 
-- LIMIT 3;
