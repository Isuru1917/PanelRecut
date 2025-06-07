-- Robust migration script to ensure requested_by column is properly added
-- Run this in your Supabase SQL Editor

DO $$
BEGIN
    -- Check if the column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'damage_requests' 
        AND column_name = 'requested_by'
        AND table_schema = 'public'
    ) THEN
        -- Add the column
        ALTER TABLE damage_requests ADD COLUMN requested_by VARCHAR(255);
        
        -- Update existing records with a default value
        UPDATE damage_requests 
        SET requested_by = 'Migration - Unknown' 
        WHERE requested_by IS NULL;
        
        -- Make the column NOT NULL
        ALTER TABLE damage_requests 
        ALTER COLUMN requested_by SET NOT NULL;
        
        RAISE NOTICE 'Column requested_by has been added successfully';
    ELSE
        RAISE NOTICE 'Column requested_by already exists';
        
        -- Update any NULL values that might exist
        UPDATE damage_requests 
        SET requested_by = 'Migration - Unknown' 
        WHERE requested_by IS NULL;
        
        -- Ensure column is NOT NULL
        ALTER TABLE damage_requests 
        ALTER COLUMN requested_by SET NOT NULL;
    END IF;
END $$;
