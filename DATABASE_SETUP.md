# Skin Zone Database Setup Guide

## Overview

The Skin Zone hypergraph is synchronized across two PostgreSQL databases:
- **Neon**: Serverless PostgreSQL for development and testing
- **Supabase**: PostgreSQL with real-time capabilities and authentication

## Database Architecture

### Core Tables

#### `nodes`
Stores all hypergraph nodes (suppliers, ingredients, platforms, salons, services, professionals, categories, certifications).

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key, unique identifier |
| type | TEXT | Node type (supplier, ingredient, platform, etc.) |
| name | TEXT | Human-readable name |
| metadata | JSONB | Additional attributes specific to node type |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `edges`
Stores all relationships between nodes.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| source | TEXT | Source node ID (foreign key to nodes) |
| target | TEXT | Target node ID (foreign key to nodes) |
| type | TEXT | Edge type (supplies, uses_ingredient, offers_service, etc.) |
| metadata | JSONB | Additional relationship attributes |
| weight | FLOAT | Edge weight for graph algorithms |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Specialized Tables

- **suppliers**: Extended attributes for supplier nodes
- **ingredients**: Extended attributes for ingredient nodes
- **platforms**: Extended attributes for platform nodes
- **salons**: Extended attributes for salon nodes
- **services**: Extended attributes for service nodes
- **professionals**: Extended attributes for professional nodes
- **categories**: Extended attributes for category nodes
- **certifications**: Extended attributes for certification nodes

### Analytics Tables

- **hypergraph_metrics**: Stores calculated metrics (centrality, synergy scores, etc.)

## Neon Database

### Connection Details

- **Project**: skin-zone-hypergraph
- **Project ID**: damp-brook-31747632
- **Branch**: main (br-long-dew-af1mt5j4)
- **Database**: neondb
- **Connection String**: See `neon_connection.txt`

### Status

✅ **Populated**: 75 nodes, 127 edges

### Schema

The full schema is defined in `database_schema.sql` (588 lines).
A simplified initialization schema is in `neon_schema_init.sql`.

### Population Script

```bash
python3.11 populate_neon_db.py
```

This script:
1. Creates core tables (nodes, edges)
2. Inserts all nodes from `hypergraph_data.json`
3. Inserts all edges from `hypergraph_data.json`

### Accessing Neon Database

Via MCP CLI:
```bash
# List tables
manus-mcp-cli tool call get_database_tables --server neon \
  --input '{"params":{"projectId":"damp-brook-31747632"}}'

# Run SQL query
manus-mcp-cli tool call run_sql --server neon \
  --input '{"params":{"sql":"SELECT COUNT(*) FROM nodes","projectId":"damp-brook-31747632"}}'
```

Via psql:
```bash
psql "postgresql://neondb_owner:npg_M8f5aNPYqUbl@ep-rapid-fire-afvjd8xb-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
```

## Supabase Database

### Connection Details

- **URL**: `$SUPABASE_URL` (environment variable)
- **API Key**: `$SUPABASE_KEY` (environment variable)

### Setup Instructions

1. **Create Tables**:
   - Go to Supabase Dashboard → SQL Editor
   - Execute the contents of `neon_schema_init.sql`
   - This creates the core tables and indexes

2. **Populate Data**:
   ```bash
   python3.11 populate_supabase_db.py
   ```
   
   This script:
   - Connects to Supabase using environment variables
   - Inserts nodes in batches of 100
   - Inserts edges in batches of 100

### Accessing Supabase Database

Via Python:
```python
from supabase import create_client
import os

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

# Query nodes
result = supabase.table('nodes').select('*').eq('type', 'supplier').execute()

# Query edges
result = supabase.table('edges').select('*').eq('type', 'supplies').execute()
```

Via Supabase Dashboard:
- Navigate to Table Editor
- Browse and query tables visually

## Hypergraph Data

### Source File

`hypergraph_data.json` - The master data file containing all nodes and edges.

### Statistics

- **Version**: 2.0
- **Last Updated**: 2025-10-27
- **Total Nodes**: 75
- **Total Edges**: 127

### Node Types

| Type | Count | Description |
|------|-------|-------------|
| supplier | 8 | Ingredient suppliers (Making Cosmetics, Lotion Crafter, etc.) |
| ingredient | 29 | Skincare ingredients (Hyaluronic Acid, Vitamin C, etc.) |
| platform | 6 | Salon/spa management platforms (GlossGenius, Vagaro, etc.) |
| salon | 3 | Example salons/spas |
| service | 13 | Services offered (facials, haircuts, massage, etc.) |
| professional | 8 | Professional types (esthetician, hair stylist, etc.) |
| category | 10 | Ingredient categories (humectant, antioxidant, etc.) |
| certification | 5 | Certifications (ISO, FDA, USDA Organic, etc.) |

### Edge Types

| Type | Count | Description |
|------|-------|-------------|
| supplies | 25 | Supplier → Ingredient relationships with pricing |
| belongs_to | 18 | Ingredient → Category classifications |
| uses_ingredient | 6 | Service → Ingredient requirements |
| offers_service | 6 | Salon → Service offerings |
| serves_professional | 23 | Platform → Professional type support |
| supports_service | 21 | Platform → Service type support |
| performs_service | 13 | Professional → Service capabilities |
| certified_by | 6 | Supplier/Platform → Certification |
| purchases_from | 5 | Salon → Supplier relationships |
| uses_platform | 3 | Salon → Platform usage |
| provides_space | 4 | Platform → Professional space rental |

## Query Examples

### Node Queries

```sql
-- Get all suppliers
SELECT * FROM nodes WHERE type = 'supplier';

-- Get all ingredients with pricing
SELECT 
    n.id, 
    n.name, 
    n.metadata->>'category' AS category,
    n.metadata->>'price_per_kg_usd' AS price
FROM nodes n
WHERE n.type = 'ingredient'
ORDER BY (n.metadata->>'price_per_kg_usd')::NUMERIC DESC;

-- Get all platforms
SELECT * FROM nodes WHERE type = 'platform';
```

### Edge Queries

```sql
-- Get all supplier-ingredient relationships with pricing
SELECT 
    n1.name AS supplier,
    n2.name AS ingredient,
    e.metadata->>'price_per_kg_usd' AS price,
    e.metadata->>'availability' AS availability
FROM edges e
JOIN nodes n1 ON e.source = n1.id
JOIN nodes n2 ON e.target = n2.id
WHERE e.type = 'supplies'
ORDER BY (e.metadata->>'price_per_kg_usd')::NUMERIC DESC;

-- Get all services and their required ingredients
SELECT 
    n1.name AS service,
    n2.name AS ingredient,
    e.metadata->>'quantity_per_treatment_grams' AS quantity
FROM edges e
JOIN nodes n1 ON e.source = n1.id
JOIN nodes n2 ON e.target = n2.id
WHERE e.type = 'uses_ingredient';

-- Get platform capabilities
SELECT 
    n1.name AS platform,
    n2.name AS professional_type
FROM edges e
JOIN nodes n1 ON e.source = n1.id
JOIN nodes n2 ON e.target = n2.id
WHERE e.type = 'serves_professional';
```

### Graph Analysis Queries

```sql
-- Node degree centrality (count of connections)
SELECT 
    n.id,
    n.name,
    n.type,
    COUNT(DISTINCT e1.id) + COUNT(DISTINCT e2.id) AS degree
FROM nodes n
LEFT JOIN edges e1 ON n.id = e1.source
LEFT JOIN edges e2 ON n.id = e2.target
GROUP BY n.id, n.name, n.type
ORDER BY degree DESC
LIMIT 20;

-- Most connected suppliers
SELECT 
    n.name AS supplier,
    COUNT(e.id) AS ingredient_count
FROM nodes n
JOIN edges e ON n.id = e.source
WHERE n.type = 'supplier' AND e.type = 'supplies'
GROUP BY n.name
ORDER BY ingredient_count DESC;

-- Platform market coverage
SELECT 
    n.name AS platform,
    COUNT(DISTINCT e.target) AS professional_types_supported
FROM nodes n
JOIN edges e ON n.id = e.source
WHERE n.type = 'platform' AND e.type = 'serves_professional'
GROUP BY n.name
ORDER BY professional_types_supported DESC;
```

## Synchronization

### Keeping Databases in Sync

When updating the hypergraph:

1. **Update `hypergraph_data.json`**
2. **Sync to Neon**:
   ```bash
   python3.11 populate_neon_db.py
   ```
3. **Sync to Supabase**:
   ```bash
   python3.11 populate_supabase_db.py
   ```

### Backup Strategy

- **Neon**: Automatic backups via Neon platform
- **Supabase**: Automatic backups via Supabase platform
- **Git**: `hypergraph_data.json` is version controlled

## Future Enhancements

### Planned Features

1. **Real-time Sync**: Implement webhooks to keep databases synchronized
2. **Cognitive Metrics**: Calculate and store hypergraph metrics
3. **Recommendation Engine**: Build recommendation tables
4. **Price Tracking**: Historical price data for ingredients
5. **Geographic Features**: Add PostGIS support for salon locations
6. **Full-Text Search**: Add search indexes for names and descriptions

### Schema Extensions

- Add `supplier_ingredients` table for detailed pricing history
- Add `service_ingredients` table for formulation tracking
- Add `salon_services` table for service pricing
- Add `recommendations` table for AI-driven suggestions
- Add `hypergraph_metrics` table for network analysis

## Troubleshooting

### Common Issues

**Issue**: "relation 'nodes' does not exist"
- **Solution**: Run the schema creation SQL first

**Issue**: "foreign key constraint violation"
- **Solution**: Insert nodes before edges

**Issue**: "Supabase connection failed"
- **Solution**: Check `SUPABASE_URL` and `SUPABASE_KEY` environment variables

**Issue**: "Neon MCP authentication failed"
- **Solution**: Re-authenticate MCP server via OAuth flow

### Verification Queries

```sql
-- Check node counts by type
SELECT type, COUNT(*) FROM nodes GROUP BY type;

-- Check edge counts by type
SELECT type, COUNT(*) FROM edges GROUP BY type;

-- Check for orphaned edges (edges with missing nodes)
SELECT e.* FROM edges e
LEFT JOIN nodes n1 ON e.source = n1.id
LEFT JOIN nodes n2 ON e.target = n2.id
WHERE n1.id IS NULL OR n2.id IS NULL;
```

## Contact

For database issues or questions, refer to the main project README or contact the development team.

---

**Last Updated**: 2025-10-27  
**Version**: 2.0  
**Maintainer**: Skin Zone Development Team

