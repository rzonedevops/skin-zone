-- Skin Zone Hypergraph Database Schema - Initial Setup for Neon
-- Version: 2.0
-- Last Updated: 2025-10-27

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core nodes table
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(type);
CREATE INDEX IF NOT EXISTS idx_nodes_name ON nodes(name);
CREATE INDEX IF NOT EXISTS idx_nodes_metadata ON nodes USING GIN (metadata);

-- Core edges table
CREATE TABLE IF NOT EXISTS edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    target TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source);
CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target);
CREATE INDEX IF NOT EXISTS idx_edges_type ON edges(type);
CREATE INDEX IF NOT EXISTS idx_edges_metadata ON edges USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_edges_source_target ON edges(source, target);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    website TEXT,
    location TEXT,
    catalog_size TEXT,
    certifications TEXT[],
    founded INTEGER,
    processing_time_days INTEGER,
    currencies TEXT[],
    special_features TEXT[]
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    category TEXT,
    function TEXT,
    purity_range TEXT,
    price_per_kg_usd NUMERIC(10, 2),
    availability TEXT,
    cas_number TEXT,
    inci_name TEXT
);

-- Platforms table
CREATE TABLE IF NOT EXISTS platforms (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    website TEXT,
    platform_type TEXT,
    pricing_start_usd NUMERIC(10, 2),
    pricing_tiers TEXT[],
    features_count TEXT,
    payment_processing_rate NUMERIC(5, 4),
    free_trial_days INTEGER,
    user_base TEXT,
    professionals TEXT,
    marketplace_fee NUMERIC(5, 4),
    geographic_coverage TEXT[]
);

-- Salons table
CREATE TABLE IF NOT EXISTS salons (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    business_type TEXT,
    specialization TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    phone TEXT,
    email TEXT,
    rating NUMERIC(3, 2),
    review_count INTEGER
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    category TEXT,
    duration_minutes INTEGER,
    price_range_usd TEXT,
    frequency TEXT,
    skill_level_required TEXT
);

-- Professionals table
CREATE TABLE IF NOT EXISTS professionals (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    services_offered TEXT[],
    certifications_required BOOLEAN DEFAULT FALSE,
    license_required BOOLEAN DEFAULT FALSE,
    average_service_price_usd NUMERIC(10, 2)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    description TEXT
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    description TEXT,
    issuing_organization TEXT,
    validity_period_months INTEGER
);

-- Hypergraph metrics table
CREATE TABLE IF NOT EXISTS hypergraph_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC(20, 6),
    node_id TEXT REFERENCES nodes(id) ON DELETE CASCADE,
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_hypergraph_metrics_name ON hypergraph_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_hypergraph_metrics_node ON hypergraph_metrics(node_id);

-- Trigger function: Update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
CREATE TRIGGER nodes_update_timestamp
BEFORE UPDATE ON nodes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER edges_update_timestamp
BEFORE UPDATE ON edges
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

