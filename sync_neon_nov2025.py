#!/usr/bin/env python3.11
"""
Sync Skin Zone hypergraph data to Neon database - November 2025
Populates nodes and edges tables with updated data
"""

import json
import subprocess

# Load hypergraph data
with open('/home/ubuntu/skin-zone/hypergraph_data.json', 'r') as f:
    hypergraph = json.load(f)

PROJECT_ID = "damp-brook-31747632"

print(f"Loading hypergraph data...")
print(f"Nodes: {len(hypergraph['nodes'])}")
print(f"Edges: {len(hypergraph['edges'])}")

# Clear existing data
print("\nClearing existing data...")
clear_sql = """
DELETE FROM edges;
DELETE FROM nodes;
"""

result = subprocess.run([
    'manus-mcp-cli', 'tool', 'call', 'run_sql_transaction', 
    '--server', 'neon',
    '--input', json.dumps({
        "params": {
            "sqlStatements": [
                "DELETE FROM edges;",
                "DELETE FROM nodes;"
            ],
            "projectId": PROJECT_ID
        }
    })
], capture_output=True, text=True)

if result.returncode != 0:
    print(f"Error clearing data: {result.stderr}")
    exit(1)

print("✓ Existing data cleared")

# Insert nodes in batches
BATCH_SIZE = 50
total_nodes = len(hypergraph['nodes'])
print(f"\nInserting {total_nodes} nodes in batches of {BATCH_SIZE}...")

for i in range(0, total_nodes, BATCH_SIZE):
    batch = hypergraph['nodes'][i:i+BATCH_SIZE]
    insert_statements = []
    
    for node in batch:
        node_id = node['id'].replace("'", "''")
        node_type = node['type'].replace("'", "''")
        node_name = node['name'].replace("'", "''")
        
        # Create metadata JSON excluding id, type, name
        metadata = {k: v for k, v in node.items() if k not in ['id', 'type', 'name']}
        metadata_json = json.dumps(metadata).replace("'", "''")
        
        sql = f"""
INSERT INTO nodes (id, type, name, metadata) 
VALUES ('{node_id}', '{node_type}', '{node_name}', '{metadata_json}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET type = EXCLUDED.type, 
    name = EXCLUDED.name, 
    metadata = EXCLUDED.metadata,
    updated_at = NOW();
"""
        insert_statements.append(sql.strip())
    
    result = subprocess.run([
        'manus-mcp-cli', 'tool', 'call', 'run_sql_transaction',
        '--server', 'neon',
        '--input', json.dumps({
            "params": {
                "sqlStatements": insert_statements,
                "projectId": PROJECT_ID
            }
        })
    ], capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error inserting nodes batch {i//BATCH_SIZE + 1}: {result.stderr}")
        exit(1)
    
    print(f"✓ Inserted nodes batch {i//BATCH_SIZE + 1}/{(total_nodes + BATCH_SIZE - 1)//BATCH_SIZE}")

print(f"✓ All {total_nodes} nodes inserted")

# Insert edges in batches
total_edges = len(hypergraph['edges'])
print(f"\nInserting {total_edges} edges in batches of {BATCH_SIZE}...")

for i in range(0, total_edges, BATCH_SIZE):
    batch = hypergraph['edges'][i:i+BATCH_SIZE]
    insert_statements = []
    
    for edge in batch:
        source = edge['source'].replace("'", "''")
        target = edge['target'].replace("'", "''")
        edge_type = edge['type'].replace("'", "''")
        weight = edge.get('weight', 1.0)
        
        # Create metadata JSON
        metadata = edge.get('metadata', {})
        metadata_json = json.dumps(metadata).replace("'", "''")
        
        sql = f"""
INSERT INTO edges (source, target, type, metadata, weight) 
VALUES ('{source}', '{target}', '{edge_type}', '{metadata_json}'::jsonb, {weight});
"""
        insert_statements.append(sql.strip())
    
    result = subprocess.run([
        'manus-mcp-cli', 'tool', 'call', 'run_sql_transaction',
        '--server', 'neon',
        '--input', json.dumps({
            "params": {
                "sqlStatements": insert_statements,
                "projectId": PROJECT_ID
            }
        })
    ], capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error inserting edges batch {i//BATCH_SIZE + 1}: {result.stderr}")
        exit(1)
    
    print(f"✓ Inserted edges batch {i//BATCH_SIZE + 1}/{(total_edges + BATCH_SIZE - 1)//BATCH_SIZE}")

print(f"✓ All {total_edges} edges inserted")

# Verify counts
print("\nVerifying data...")
result = subprocess.run([
    'manus-mcp-cli', 'tool', 'call', 'run_sql',
    '--server', 'neon',
    '--input', json.dumps({
        "params": {
            "sql": "SELECT COUNT(*) as node_count FROM nodes;",
            "projectId": PROJECT_ID
        }
    })
], capture_output=True, text=True)

print("\n" + "="*60)
print("NEON DATABASE SYNC COMPLETE")
print("="*60)
print(f"Project ID: {PROJECT_ID}")
print(f"Nodes inserted: {total_nodes}")
print(f"Edges inserted: {total_edges}")
print(f"Hypergraph version: {hypergraph['metadata']['version']}")
print(f"Last updated: {hypergraph['metadata']['last_updated']}")
print("="*60)
