#!/usr/bin/env python3.11
"""
Populate Neon database with Skin Zone hypergraph data
"""

import json
import subprocess
import sys

def run_mcp_sql(sql, project_id="damp-brook-31747632"):
    """Execute SQL via MCP CLI"""
    mcp_input = json.dumps({
        "params": {
            "sql": sql,
            "projectId": project_id
        }
    })
    
    result = subprocess.run(
        ["manus-mcp-cli", "tool", "call", "run_sql", "--server", "neon", "--input", mcp_input],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error executing SQL: {result.stderr}", file=sys.stderr)
        return False
    
    return True

def create_tables(project_id="damp-brook-31747632"):
    """Create database tables"""
    print("Creating database tables...")
    
    tables_sql = [
        """CREATE TABLE IF NOT EXISTS nodes (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )""",
        "CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(type)",
        "CREATE INDEX IF NOT EXISTS idx_nodes_name ON nodes(name)",
        "CREATE INDEX IF NOT EXISTS idx_nodes_metadata ON nodes USING GIN (metadata)",
        """CREATE TABLE IF NOT EXISTS edges (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            source TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
            target TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
            type TEXT NOT NULL,
            metadata JSONB DEFAULT '{}',
            weight FLOAT DEFAULT 1.0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )""",
        "CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source)",
        "CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target)",
        "CREATE INDEX IF NOT EXISTS idx_edges_type ON edges(type)",
        "CREATE INDEX IF NOT EXISTS idx_edges_metadata ON edges USING GIN (metadata)"
    ]
    
    for sql in tables_sql:
        if not run_mcp_sql(sql, project_id):
            return False
    
    print("✓ Tables created successfully")
    return True

def insert_nodes(nodes, project_id="damp-brook-31747632"):
    """Insert nodes into database"""
    print(f"Inserting {len(nodes)} nodes...")
    
    for i, node in enumerate(nodes):
        # Extract basic fields
        node_id = node['id']
        node_type = node['type']
        node_name = node['name']
        
        # Put all other fields in metadata
        metadata = {k: v for k, v in node.items() if k not in ['id', 'type', 'name']}
        metadata_json = json.dumps(metadata).replace("'", "''")
        
        sql = f"""
        INSERT INTO nodes (id, type, name, metadata)
        VALUES ('{node_id}', '{node_type}', '{node_name.replace("'", "''")}', '{metadata_json}')
        ON CONFLICT (id) DO UPDATE SET
            type = EXCLUDED.type,
            name = EXCLUDED.name,
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
        """
        
        if not run_mcp_sql(sql, project_id):
            print(f"Failed to insert node: {node_id}")
            continue
        
        if (i + 1) % 10 == 0:
            print(f"  Inserted {i + 1}/{len(nodes)} nodes...")
    
    print(f"✓ Inserted {len(nodes)} nodes successfully")
    return True

def insert_edges(edges, project_id="damp-brook-31747632"):
    """Insert edges into database"""
    print(f"Inserting {len(edges)} edges...")
    
    for i, edge in enumerate(edges):
        source = edge['source']
        target = edge['target']
        edge_type = edge['type']
        
        # Put all other fields in metadata
        metadata = {k: v for k, v in edge.items() if k not in ['source', 'target', 'type']}
        metadata_json = json.dumps(metadata).replace("'", "''")
        
        sql = f"""
        INSERT INTO edges (source, target, type, metadata)
        VALUES ('{source}', '{target}', '{edge_type}', '{metadata_json}')
        """
        
        if not run_mcp_sql(sql, project_id):
            print(f"Failed to insert edge: {source} -> {target}")
            continue
        
        if (i + 1) % 20 == 0:
            print(f"  Inserted {i + 1}/{len(edges)} edges...")
    
    print(f"✓ Inserted {len(edges)} edges successfully")
    return True

def main():
    project_id = "damp-brook-31747632"
    
    # Load hypergraph data
    print("Loading hypergraph data...")
    with open('hypergraph_data.json', 'r') as f:
        data = json.load(f)
    
    nodes = data['nodes']
    edges = data['edges']
    
    print(f"Loaded {len(nodes)} nodes and {len(edges)} edges")
    
    # Create tables
    if not create_tables(project_id):
        print("Failed to create tables")
        sys.exit(1)
    
    # Insert nodes
    if not insert_nodes(nodes, project_id):
        print("Failed to insert nodes")
        sys.exit(1)
    
    # Insert edges
    if not insert_edges(edges, project_id):
        print("Failed to insert edges")
        sys.exit(1)
    
    print("\n✓ Database population complete!")
    print(f"  Total nodes: {len(nodes)}")
    print(f"  Total edges: {len(edges)}")

if __name__ == "__main__":
    main()

