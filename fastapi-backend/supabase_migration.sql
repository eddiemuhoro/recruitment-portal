-- Add advanced inquiry management fields to employer_inquiries table
-- Execute this in your Supabase SQL editor

-- Create the enums first
DO $$ BEGIN
    CREATE TYPE inquirystatus AS ENUM ('new', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to employer_inquiries table
ALTER TABLE employer_inquiries 
ADD COLUMN IF NOT EXISTS status inquirystatus NOT NULL DEFAULT 'new',
ADD COLUMN IF NOT EXISTS priority priority NOT NULL DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS admin_response TEXT,
ADD COLUMN IF NOT EXISTS assigned_to VARCHAR,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_employer_inquiries_updated_at ON employer_inquiries;
CREATE TRIGGER update_employer_inquiries_updated_at
    BEFORE UPDATE ON employer_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'employer_inquiries' 
ORDER BY ordinal_position;
