-- PostgreSQL Schema for Enterprise Company Intelligence Platform
-- Version: 1.0.0

-- Create Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Roles
INSERT INTO roles (name, description) 
VALUES 
    ('ADMIN', 'Full system access and data management'),
    ('USER', 'Standard enterprise analyst access')
ON CONFLICT (name) DO NOTHING;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    products TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    ceo_name VARCHAR(150),
    employee_count INT DEFAULT 0,
    revenue_usd NUMERIC(15, 2) DEFAULT 0.00,
    total_funding_usd NUMERIC(15, 2) DEFAULT 0.00,
    valuation_usd NUMERIC(15, 2) DEFAULT 0.00,
    country VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    founded_year INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Founders Table
CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    title VARCHAR(100) DEFAULT 'Founder',
    bio TEXT
);

-- Create Funding Rounds Table
CREATE TABLE IF NOT EXISTS funding_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    round_type VARCHAR(50) NOT NULL, -- Seed, Series A, Series B, IPO, etc.
    amount_usd NUMERIC(15, 2) NOT NULL,
    announcement_date DATE NOT NULL,
    lead_investors TEXT[] DEFAULT '{}'
);

-- Create Acquisitions Table
CREATE TABLE IF NOT EXISTS acquisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acquiring_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    target_company_name VARCHAR(255) NOT NULL,
    deal_size_usd NUMERIC(15, 2),
    acquisition_year INT NOT NULL
);

-- Create News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    published_date DATE NOT NULL,
    source_url VARCHAR(500),
    sentiment VARCHAR(20) DEFAULT 'NEUTRAL' -- POSITIVE, NEGATIVE, NEUTRAL
);

-- Create Saved AI Reports Table
CREATE TABLE IF NOT EXISTS ai_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    report_title VARCHAR(255) NOT NULL,
    summary TEXT,
    swot_analysis JSONB,
    competitor_analysis JSONB,
    technology_stack JSONB,
    pdf_filename VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for High Performance Search
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_news_company_id ON news_articles(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_company_id ON funding_rounds(company_id);
