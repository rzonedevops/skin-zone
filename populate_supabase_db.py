#!/usr/bin/env python3.11
"""
Populate Supabase database with Skin Zone hypergraph data
"""

import json
import os
import sys
from supabase import create_client, Client

def get_supabase_client():
    """Initialize Supabase client"""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_KEY environment variables must be set")
        sys.exit(1)
    
    return create_client(url, key)

def create_tables(supabase: Client):
    """Create database tables using Supabase SQL"""
    print("Creating database tables in Supabase...")
    
    # Read the schema file
    with open('neon_schema_init.sql', 'r') as f:
        schema_sql = f.read()
    
    try:
        # Execute the schema SQL
        # Note: Supabase doesn't have a direct SQL execution API in Python client
        # We'll need to use the REST API or create tables via dashboard
        print("✓ Schema ready (execute via Supabase dashboard or SQL editor)")
        print("  SQL file: neon_schema_init.sql")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

def insert_nodes(supabase: Client, nodes):
    """Insert nodes into Supabase"""
    print(f"Inserting {len(nodes)} nodes into Supabase...")
    
    # Prepare nodes data
    nodes_data = []
    for node in nodes:
        node_id = node['id']
        node_type = node['type']
        node_name = node['name']
        
        # Put all other fields in metadata
        metadata = {k: v for k, v in node.items() if k not in ['id', 'type', 'name']}
        
        nodes_data.append({
            'id': node_id,
            'type': node_type,
            'name': node_name,
            'metadata': metadata
        })
    
    try:
        # Insert in batches of 100
        batch_size = 100
        for i in range(0, len(nodes_data), batch_size):
            batch = nodes_data[i:i+batch_size]
            result = supabase.table('nodes').upsert(batch).execute()
            print(f"  Inserted batch {i//batch_size + 1} ({len(batch)} nodes)...")
        
        print(f"✓ Inserted {len(nodes)} nodes successfully")
        return True
    except Exception as e:
        print(f"Error inserting nodes: {e}")
        print("Note: You may need to create the tables first via Supabase dashboard")
        return False

def insert_edges(supabase: Client, edges):
    """Insert edges into Supabase"""
    print(f"Inserting {len(edges)} edges into Supabase...")
    
    # Prepare edges data
    edges_data = []
    for edge in edges:
        source = edge['source']
        target = edge['target']
        edge_type = edge['type']
        
        # Put all other fields in metadata
        metadata = {k: v for k, v in edge.items() if k not in ['source', 'target', 'type']}
        
        edges_data.append({
            'source': source,
            'target': target,
            'type': edge_type,
            'metadata': metadata,
            'weight': 1.0
        })
    
    try:
        # Insert in batches of 100
        batch_size = 100
        for i in range(0, len(edges_data), batch_size):
            batch = edges_data[i:i+batch_size]
            result = supabase.table('edges').insert(batch).execute()
            print(f"  Inserted batch {i//batch_size + 1} ({len(batch)} edges)...")
        
        print(f"✓ Inserted {len(edges)} edges successfully")
        return True
    except Exception as e:
        print(f"Error inserting edges: {e}")
        print("Note: You may need to create the tables first via Supabase dashboard")
        return False

def main():
    # Initialize Supabase client
    print("Initializing Supabase client...")
    supabase = get_supabase_client()
    print("✓ Connected to Supabase")
    
    # Load hypergraph data
    print("\nLoading hypergraph data...")
    with open('hypergraph_data.json', 'r') as f:
        data = json.load(f)
    
    nodes = data['nodes']
    edges = data['edges']
    
    print(f"Loaded {len(nodes)} nodes and {len(edges)} edges")
    
    # Create tables (instructions only)
    print("\n" + "="*60)
    print("IMPORTANT: Before proceeding, execute the following SQL in Supabase:")
    print("="*60)
    print("1. Go to Supabase Dashboard > SQL Editor")
    print("2. Execute the contents of: neon_schema_init.sql")
    print("3. Press Enter here to continue after tables are created...")
    print("="*60)
    
    input("Press Enter to continue...")
    
    # Insert nodes
    print("\n")
    if not insert_nodes(supabase, nodes):
        print("Failed to insert nodes")
        sys.exit(1)
    
    # Insert edges
    if not insert_edges(supabase, edges):
        print("Failed to insert edges")
        sys.exit(1)
    
    print("\n✓ Supabase database population complete!")
    print(f"  Total nodes: {len(nodes)}")
    print(f"  Total edges: {len(edges)}")

if __name__ == "__main__":
    main()

