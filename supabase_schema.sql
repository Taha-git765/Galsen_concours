-- Enable the "uuid-ossp" extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the "concours" table
CREATE TABLE IF NOT EXISTS public.concours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    acronym TEXT,
    description TEXT,
    target_series TEXT[] DEFAULT '{}',
    registration_deadline DATE,
    exam_date DATE,
    registration_link TEXT,
    registration_steps TEXT,
    past_exams_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.concours ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone
CREATE POLICY "Allow public read access" ON public.concours
    FOR SELECT
    USING (true);

-- We can add policies for Admin write access later.
