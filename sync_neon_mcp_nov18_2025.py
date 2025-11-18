#!/usr/bin/env python3
"""
Sync Skin Zone hypergraph data to Neon database via MCP CLI
November 18, 2025 update
"""

import json
import subprocess
import sys

PROJECT_ID = "damp-brook-31747632"
DATABASE_NAME = "neondb"

def run_mcp_command(tool_name, params):
    """Execute MCP CLI command and return result"""
    cmd = [
        'manus-mcp-cli', 'tool', 'call', tool_name,
        '--server', 'neon',
        '--input', json.dumps({"params": params})
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error executing {tool_name}: {e.stderr}")
        return None

def load_hypergraph():
    """Load hypergraph data"""
    with open('/home/ubuntu/skin-zone/hypergraph_data.json', 'r') as f:
        return json.load(f)

def sync_to_neon():
    """Sync hypergraph data to Neon"""
    
    print("Loading hypergraph data...")
    data = load_hypergraph()
    
    print(f"Nodes: {len(data['nodes'])}")
    print(f"Edges: {len(data['edges'])}")
    print(f"Version: {data['metadata']['version']}")
    
    # Check if tables exist
    print("\nChecking database tables...")
    tables_result = run_mcp_command('get_database_tables', {
        'projectId': PROJECT_ID,
        'databaseName': DATABASE_NAME
    })
    
    if not tables_result:
        print("Failed to get database tables")
        return False
    
    print("✓ Connected to Neon database")
    
    # Clear existing data
    print("\nClearing existing data...")
    
    # Delete edges first (foreign key constraints)
    delete_edges_sql = "DELETE FROM edges;"
    run_mcp_command('run_sql', {
        'projectId': PROJECT_ID,
        'databaseName': DATABASE_NAME,
        'sql': delete_edges_sql
    })
    
    # Delete nodes
    delete_nodes_sql = "DELETE FROM nodes;"
    run_mcp_command('run_sql', {
        'projectId': PROJECT_ID,
        'databaseName': DATABASE_NAME,
        'sql': delete_nodes_sql
    })
    
    print("✓ Existing data cleared")
    
    # Insert nodes in batches
    print(f"\nInserting {len(data['nodes'])} nodes...")
    BATCH_SIZE = 50
    nodes_inserted = 0
    
    for i in range(0, len(data['nodes']), BATCH_SIZE):
        batch = data['nodes'][i:i+BATCH_SIZE]
        
        # Build INSERT statement
        values = []
        for node in batch:
            # Extract metadata (everything except id, type, name)
            metadata = {k: v for k, v in node.items() if k not in ['id', 'type', 'name']}
            metadata_json = json.dumps(metadata).replace("'", "''")
            
            node_id = node['id'].replace("'", "''")
            node_type = node['type'].replace("'", "''")
            node_name = node['name'].replace("'", "''")
            
            values.append(f"('{node_id}', '{node_type}', '{node_name}', '{metadata_json}'::jsonb)")
        
        insert_sql = f"""
        INSERT INTO nodes (id, type, name, metadata)
        VALUES {', '.join(values)};
        """
        
        result = run_mcp_command('run_sql', {
            'projectId': PROJECT_ID,
            'databaseName': DATABASE_NAME,
            'sql': insert_sql
        })
        
        if result:
            nodes_inserted += len(batch)
            print(f"  ✓ Batch {i//BATCH_SIZE + 1}/{(len(data['nodes']) + BATCH_SIZE - 1)//BATCH_SIZE} ({nodes_inserted} nodes)")
        else:
            print(f"  ✗ Failed to insert batch {i//BATCH_SIZE + 1}")
            return False
    
    print(f"✓ All {nodes_inserted} nodes inserted")
    
    # Insert edges in batches
    print(f"\nInserting {len(data['edges'])} edges...")
    edges_inserted = 0
    
    for i in range(0, len(data['edges']), BATCH_SIZE):
        batch = data['edges'][i:i+BATCH_SIZE]
        
        # Build INSERT statement
        values = []
        for edge in batch:
            source = edge['source'].replace("'", "''")
            target = edge['target'].replace("'", "''")
            edge_type = edge['type'].replace("'", "''")
            metadata = json.dumps(edge.get('metadata', {})).replace("'", "''")
            weight = edge.get('weight', 1.0)
            
            values.append(f"('{source}', '{target}', '{edge_type}', '{metadata}'::jsonb, {weight})")
        
        insert_sql = f"""
        INSERT INTO edges (source, target, type, metadata, weight)
        VALUES {', '.join(values)};
        """
        
        result = run_mcp_command('run_sql', {
            'projectId': PROJECT_ID,
            'databaseName': DATABASE_NAME,
            'sql': insert_sql
        })
        
        if result:
            edges_inserted += len(batch)
            print(f"  ✓ Batch {i//BATCH_SIZE + 1}/{(len(data['edges']) + BATCH_SIZE - 1)//BATCH_SIZE} ({edges_inserted} edges)")
        else:
            print(f"  ✗ Failed to insert batch {i//BATCH_SIZE + 1}")
            return False
    
    print(f"✓ All {edges_inserted} edges inserted")
    
    # Verify counts
    print("\nVerifying data...")
    
    count_nodes_sql = "SELECT COUNT(*) as count FROM nodes;"
    count_edges_sql = "SELECT COUNT(*) as count FROM edges;"
    
    run_mcp_command('run_sql', {
        'projectId': PROJECT_ID,
        'databaseName': DATABASE_NAME,
        'sql': count_nodes_sql
    })
    
    run_mcp_command('run_sql', {
        'projectId': PROJECT_ID,
        'databaseName': DATABASE_NAME,
        'sql': count_edges_sql
    })
    
    print("\n" + "="*60)
    print("NEON DATABASE SYNC COMPLETE")
    print("="*60)
    print(f"Project: skin-zone-hypergraph ({PROJECT_ID})")
    print(f"Database: {DATABASE_NAME}")
    print(f"Nodes inserted: {nodes_inserted}")
    print(f"Edges inserted: {edges_inserted}")
    print(f"Hypergraph version: {data['metadata']['version']}")
    print(f"Last updated: {data['metadata']['last_updated']}")
    print("="*60)
    
    return True

if __name__ == '__main__':
    success = sync_to_neon()
    sys.exit(0 if success else 1)
