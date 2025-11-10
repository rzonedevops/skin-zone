#!/usr/bin/env python3.11
"""
Sync Skin Zone hypergraph data to Supabase - November 2025
Populates nodes and edges tables with updated data
"""

import json
import os
from supabase import create_client, Client

# Load hypergraph data
with open('/home/ubuntu/skin-zone/hypergraph_data.json', 'r') as f:
    hypergraph = json.load(f)

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    exit(1)

supabase: Client = create_client(url, key)

print(f"Loading hypergraph data...")
print(f"Nodes: {len(hypergraph['nodes'])}")
print(f"Edges: {len(hypergraph['edges'])}")

# Clear existing data
print("\nClearing existing data...")
try:
    supabase.table('edges').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    supabase.table('nodes').delete().neq('id', 'dummy').execute()
    print("✓ Existing data cleared")
except Exception as e:
    print(f"Note: {e}")

# Insert nodes in batches
BATCH_SIZE = 100
total_nodes = len(hypergraph['nodes'])
print(f"\nInserting {total_nodes} nodes in batches of {BATCH_SIZE}...")

for i in range(0, total_nodes, BATCH_SIZE):
    batch = hypergraph['nodes'][i:i+BATCH_SIZE]
    
    # Prepare node data
    node_data = []
    for node in batch:
        # Create metadata JSON excluding id, type, name
        metadata = {k: v for k, v in node.items() if k not in ['id', 'type', 'name']}
        
        node_data.append({
            'id': node['id'],
            'type': node['type'],
            'name': node['name'],
            'metadata': metadata
        })
    
    try:
        supabase.table('nodes').upsert(node_data).execute()
        print(f"✓ Inserted nodes batch {i//BATCH_SIZE + 1}/{(total_nodes + BATCH_SIZE - 1)//BATCH_SIZE}")
    except Exception as e:
        print(f"Error inserting nodes batch {i//BATCH_SIZE + 1}: {e}")
        exit(1)

print(f"✓ All {total_nodes} nodes inserted")

# Insert edges in batches
total_edges = len(hypergraph['edges'])
print(f"\nInserting {total_edges} edges in batches of {BATCH_SIZE}...")

for i in range(0, total_edges, BATCH_SIZE):
    batch = hypergraph['edges'][i:i+BATCH_SIZE]
    
    # Prepare edge data
    edge_data = []
    for edge in batch:
        edge_data.append({
            'source': edge['source'],
            'target': edge['target'],
            'type': edge['type'],
            'metadata': edge.get('metadata', {}),
            'weight': edge.get('weight', 1.0)
        })
    
    try:
        supabase.table('edges').insert(edge_data).execute()
        print(f"✓ Inserted edges batch {i//BATCH_SIZE + 1}/{(total_edges + BATCH_SIZE - 1)//BATCH_SIZE}")
    except Exception as e:
        print(f"Error inserting edges batch {i//BATCH_SIZE + 1}: {e}")
        exit(1)

print(f"✓ All {total_edges} edges inserted")

# Verify counts
print("\nVerifying data...")
try:
    node_count = supabase.table('nodes').select('id', count='exact').execute()
    edge_count = supabase.table('edges').select('id', count='exact').execute()
    
    print("\n" + "="*60)
    print("SUPABASE DATABASE SYNC COMPLETE")
    print("="*60)
    print(f"Nodes in database: {node_count.count}")
    print(f"Edges in database: {edge_count.count}")
    print(f"Hypergraph version: {hypergraph['metadata']['version']}")
    print(f"Last updated: {hypergraph['metadata']['last_updated']}")
    print("="*60)
except Exception as e:
    print(f"Verification error: {e}")
