-- ========================================
-- BACB FIELDWORK TRACKING - DATABASE SCHEMA
-- ========================================

-- Create the fieldwork_hours table
CREATE TABLE IF NOT EXISTS fieldwork_hours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TEXT,
    unrestricted NUMERIC(5,2) DEFAULT 0 CHECK (unrestricted >= 0),
    restricted NUMERIC(5,2) DEFAULT 0 CHECK (restricted >= 0),
    supervision NUMERIC(5,2) DEFAULT 0 CHECK (supervision >= 0),
    supervisor_name TEXT,
    unrestricted_desc TEXT,
    restricted_desc TEXT,
    signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_fieldwork_hours_user_id ON fieldwork_hours(user_id);
CREATE INDEX idx_fieldwork_hours_date ON fieldwork_hours(date);
CREATE INDEX idx_fieldwork_hours_user_date ON fieldwork_hours(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE fieldwork_hours ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own entries
CREATE POLICY "Users can view their own fieldwork hours"
    ON fieldwork_hours
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert their own entries
CREATE POLICY "Users can insert their own fieldwork hours"
    ON fieldwork_hours
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own entries
CREATE POLICY "Users can update their own fieldwork hours"
    ON fieldwork_hours
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own entries
CREATE POLICY "Users can delete their own fieldwork hours"
    ON fieldwork_hours
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_fieldwork_hours_updated_at
    BEFORE UPDATE ON fieldwork_hours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE fieldwork_hours;

-- ========================================
-- INSTRUCTIONS TO RUN THIS SCHEMA:
-- ========================================
-- 1. Go to https://supabase.com/dashboard/project/pydjyurvukyhfyojrhpu
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this entire file content
-- 5. Click "Run" button
-- 6. Verify the table was created by checking "Table Editor"
-- ========================================
