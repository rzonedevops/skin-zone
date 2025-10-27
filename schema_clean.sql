CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
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
    location GEOGRAPHY(POINT, 4326),
    rating NUMERIC(3, 2),
    review_count INTEGER
);
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    category TEXT,
    duration_minutes INTEGER,
    price_range_usd TEXT,
    frequency TEXT,
    skill_level_required TEXT
);
CREATE TABLE IF NOT EXISTS professionals (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    services_offered TEXT[],
    certifications_required BOOLEAN DEFAULT FALSE,
    license_required BOOLEAN DEFAULT FALSE,
    average_service_price_usd NUMERIC(10, 2)
);
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    description TEXT
);
CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
    description TEXT,
    issuing_organization TEXT,
    validity_period_months INTEGER
);
CREATE TABLE IF NOT EXISTS supplier_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE CASCADE,
    ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,
    price_per_kg_usd NUMERIC(10, 2),
    availability TEXT,
    minimum_order_kg NUMERIC(10, 2),
    lead_time_days INTEGER,
    featured BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS service_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_per_treatment_grams NUMERIC(10, 2)
);
CREATE TABLE IF NOT EXISTS salon_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    salon_id TEXT REFERENCES salons(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    price_usd NUMERIC(10, 2),
    duration_minutes INTEGER,
    available BOOLEAN DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS salon_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    salon_id TEXT REFERENCES salons(id) ON DELETE CASCADE,
    platform_id TEXT REFERENCES platforms(id) ON DELETE CASCADE,
    subscription_tier TEXT,
    monthly_cost_usd NUMERIC(10, 2),
    active BOOLEAN DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS salon_suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    salon_id TEXT REFERENCES salons(id) ON DELETE CASCADE,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE CASCADE,
    frequency TEXT,
    preference TEXT,
    monthly_spend_usd NUMERIC(10, 2)
);
CREATE TABLE IF NOT EXISTS professional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    professional_id TEXT REFERENCES professionals(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    experience_years INTEGER,
    certification_level TEXT
);
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
CREATE INDEX IF NOT EXISTS idx_hypergraph_metrics_calculated ON hypergraph_metrics(calculated_at);
CREATE TABLE IF NOT EXISTS network_analysis_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_type TEXT NOT NULL,
    parameters JSONB DEFAULT '{}',
    results JSONB DEFAULT '{}',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(analysis_type, parameters)
);
CREATE INDEX IF NOT EXISTS idx_network_analysis_type ON network_analysis_cache(analysis_type);
CREATE INDEX IF NOT EXISTS idx_network_analysis_expires ON network_analysis_cache(expires_at);
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_node_id TEXT REFERENCES nodes(id) ON DELETE CASCADE,
    target_node_id TEXT REFERENCES nodes(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    score NUMERIC(5, 4),
    reasoning JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_recommendations_source ON recommendations(source_node_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_target ON recommendations(target_node_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_recommendations_score ON recommendations(score DESC);
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE CASCADE,
    ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,
    price_per_kg_usd NUMERIC(10, 2),
    availability TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_price_history_supplier ON price_history(supplier_id);
CREATE INDEX IF NOT EXISTS idx_price_history_ingredient ON price_history(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded ON price_history(recorded_at);
CREATE TABLE IF NOT EXISTS availability_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE CASCADE,
    ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,
    availability TEXT NOT NULL,
    lead_time_days INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_availability_supplier ON availability_tracking(supplier_id);
CREATE INDEX IF NOT EXISTS idx_availability_ingredient ON availability_tracking(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_availability_recorded ON availability_tracking(recorded_at);
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed ON audit_log(changed_at);
CREATE OR REPLACE VIEW v_supplier_catalog AS
SELECT 
    s.id AS supplier_id,
    s.name AS supplier_name,
    s.website,
    s.location,
    i.id AS ingredient_id,
    i.name AS ingredient_name,
    i.category,
    si.price_per_kg_usd,
    si.availability,
    si.minimum_order_kg,
    si.lead_time_days,
    si.featured
FROM suppliers s
JOIN supplier_ingredients si ON s.id = si.supplier_id
JOIN ingredients i ON si.ingredient_id = i.id;
CREATE OR REPLACE VIEW v_service_requirements AS
SELECT 
    sv.id AS service_id,
    sv.name AS service_name,
    sv.category AS service_category,
    i.id AS ingredient_id,
    i.name AS ingredient_name,
    i.category AS ingredient_category,
    si.quantity_per_treatment_grams,
    i.price_per_kg_usd
FROM services sv
JOIN service_ingredients si ON sv.id = si.service_id
JOIN ingredients i ON si.ingredient_id = i.id;
CREATE OR REPLACE VIEW v_salon_ecosystem AS
SELECT 
    sa.id AS salon_id,
    sa.name AS salon_name,
    sa.business_type,
    sa.specialization,
    p.id AS platform_id,
    p.name AS platform_name,
    sp.subscription_tier,
    sp.monthly_cost_usd AS platform_cost,
    su.id AS supplier_id,
    su.name AS supplier_name,
    ss.frequency AS purchase_frequency,
    ss.monthly_spend_usd AS supplier_spend
FROM salons sa
LEFT JOIN salon_platforms sp ON sa.id = sp.salon_id
LEFT JOIN platforms p ON sp.platform_id = p.id
LEFT JOIN salon_suppliers ss ON sa.id = ss.salon_id
LEFT JOIN suppliers su ON ss.supplier_id = su.id;
CREATE OR REPLACE VIEW v_professional_services AS
SELECT 
    pr.id AS professional_id,
    pr.name AS professional_name,
    s.id AS service_id,
    s.name AS service_name,
    s.category,
    s.duration_minutes,
    s.price_range_usd,
    ps.experience_years,
    ps.certification_level
FROM professionals pr
JOIN professional_services ps ON pr.id = ps.professional_id
JOIN services s ON ps.service_id = s.id;
CREATE OR REPLACE VIEW v_network_density AS
SELECT 
    n.type AS node_type,
    COUNT(DISTINCT n.id) AS node_count,
    COUNT(DISTINCT e.id) AS edge_count,
    ROUND(COUNT(DISTINCT e.id)::NUMERIC / NULLIF(COUNT(DISTINCT n.id), 0), 2) AS avg_edges_per_node
FROM nodes n
LEFT JOIN edges e ON n.id = e.source OR n.id = e.target
GROUP BY n.type;
CREATE OR REPLACE FUNCTION calculate_node_centrality(node_id_param TEXT)
RETURNS NUMERIC AS $$
DECLARE
    in_degree INTEGER;
    out_degree INTEGER;
    total_nodes INTEGER;
    centrality NUMERIC;
BEGIN
    -- Count incoming edges
    SELECT COUNT(*) INTO in_degree
    FROM edges
    WHERE target = node_id_param;
    
    -- Count outgoing edges
    SELECT COUNT(*) INTO out_degree
    FROM edges
    WHERE source = node_id_param;
    
    -- Count total nodes
    SELECT COUNT(*) INTO total_nodes
    FROM nodes;
    
    -- Calculate normalized centrality
    centrality := (in_degree + out_degree)::NUMERIC / NULLIF(total_nodes - 1, 0);
    
    RETURN COALESCE(centrality, 0);
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION calculate_cognitive_synergy(node_id_param TEXT)
RETURNS NUMERIC AS $$
DECLARE
    centrality NUMERIC;
    neighbor_diversity INTEGER;
    edge_weight_sum NUMERIC;
    synergy_score NUMERIC;
BEGIN
    -- Get centrality
    centrality := calculate_node_centrality(node_id_param);
    
    -- Count unique neighbor types
    SELECT COUNT(DISTINCT n.type) INTO neighbor_diversity
    FROM edges e
    JOIN nodes n ON (e.target = n.id OR e.source = n.id)
    WHERE (e.source = node_id_param OR e.target = node_id_param)
    AND n.id != node_id_param;
    
    -- Sum edge weights
    SELECT COALESCE(SUM(weight), 0) INTO edge_weight_sum
    FROM edges
    WHERE source = node_id_param OR target = node_id_param;
    
    -- Calculate synergy score (weighted combination)
    synergy_score := (centrality * 0.4) + (neighbor_diversity * 0.3) + (edge_weight_sum * 0.3);
    
    RETURN COALESCE(synergy_score, 0);
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION find_shortest_path(source_id TEXT, target_id TEXT)
RETURNS TABLE(path TEXT[], path_length INTEGER) AS $$
BEGIN
    -- This is a simplified version; for production, use pgRouting extension
    RETURN QUERY
    WITH RECURSIVE path_search AS (
        SELECT 
            ARRAY[source_id] AS path,
            source_id AS current_node,
            0 AS depth
        UNION ALL
        SELECT 
            ps.path || e.target,
            e.target,
            ps.depth + 1
        FROM path_search ps
        JOIN edges e ON ps.current_node = e.source
        WHERE NOT e.target = ANY(ps.path)
        AND ps.depth < 10
    )
    SELECT ps.path, ps.depth
    FROM path_search ps
    WHERE ps.current_node = target_id
    ORDER BY ps.depth
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER nodes_update_timestamp
BEFORE UPDATE ON nodes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER edges_update_timestamp
BEFORE UPDATE ON edges
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_data)
        VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'INSERT', row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data)
        VALUES (TG_TABLE_NAME, OLD.id::TEXT, 'DELETE', row_to_json(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON nodes
    FOR SELECT
    USING (true);
CREATE POLICY "Public read access" ON edges
    FOR SELECT
    USING (true);
