-- Emergency fix: Add the requested_by column if it doesn't exist
-- Run this ONLY if the debug script shows the column is missing

DO $$ 
BEGIN
    -- Check if column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'damage_requests' 
        AND column_name = 'requested_by'
        AND table_schema = 'public'
    ) THEN
        -- Add the column
        ALTER TABLE damage_requests 
        ADD COLUMN requested_by VARCHAR(255) NOT NULL DEFAULT 'Unknown';
        
        -- Update any existing records to have a default value
        UPDATE damage_requests 
        SET requested_by = 'Legacy Request' 
        WHERE requested_by = 'Unknown';
        
        RAISE NOTICE 'Column requested_by added successfully';
    ELSE
        RAISE NOTICE 'Column requested_by already exists';
    END IF;
END $$;
