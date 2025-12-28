-- ============================================
-- CareTechMobile Chat Leads Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Create chat_leads table
CREATE TABLE IF NOT EXISTS chat_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name VARCHAR(255),
    business_name VARCHAR(255),
    business_city VARCHAR(255),
    country VARCHAR(10) DEFAULT 'IN',
    industry VARCHAR(255),
    service_requested VARCHAR(255),
    lead_priority VARCHAR(20) CHECK (lead_priority IN ('HIGH', 'MEDIUM', 'LOW')),
    lead_status VARCHAR(50) DEFAULT 'NEW' CHECK (lead_status IN ('NEW', 'INTERESTED', 'DEMO_REQUESTED', 'HUMAN_REQUIRED', 'CONFIRMED', 'CLOSED')),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    source VARCHAR(50) DEFAULT 'chat_widget',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (allows anonymous chat widget to insert)
CREATE POLICY "Allow public insert" ON chat_leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy for authenticated read (admins can read all)
CREATE POLICY "Allow authenticated read" ON chat_leads
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for authenticated update (admins can update)
CREATE POLICY "Allow authenticated update" ON chat_leads
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_leads_updated_at
    BEFORE UPDATE ON chat_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_chat_leads_priority ON chat_leads(lead_priority);
CREATE INDEX idx_chat_leads_status ON chat_leads(lead_status);
CREATE INDEX idx_chat_leads_created ON chat_leads(created_at DESC);
