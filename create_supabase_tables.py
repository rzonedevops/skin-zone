import os
from supabase import create_client, Client
import json

# Get Supabase credentials from environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

print(f"Supabase URL: {url}")
print(f"Supabase Key: {key}")

if not url or not key:
    print("Error: SUPABASE_URL and SUPABASE_KEY environment variables are not set.")
    exit(1)

supabase: Client = create_client(url, key)

# SQL to create tables
create_nodes_table_sql = """
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    type TEXT,
    name TEXT,
    properties JSONB
);
"""

create_edges_table_sql = """
CREATE TABLE IF NOT EXISTS edges (
    source TEXT,
    target TEXT,
    PRIMARY KEY (source, target)
);
"""

# Execute SQL to create tables
try:
    response = supabase.rpc("exec", {"sql": create_nodes_table_sql}).execute()
    print("Create nodes table response:", response)

    response = supabase.rpc("exec", {"sql": create_edges_table_sql}).execute()
    print("Create edges table response:", response)

    # Load data from hypergraph_data_updated.json
    with open('hypergraph_data_updated.json', 'r') as f:
        data = json.load(f)

    # Insert data into tables
    nodes_data = data['nodes']
    edges_data = data['edges']

    response = supabase.table('nodes').upsert(nodes_data).execute()
    print("Upsert nodes response:", response)

    response = supabase.table('edges').upsert(edges_data).execute()
    print("Upsert edges response:", response)

    print("Supabase table creation and data insertion script finished.")

except Exception as e:
    print(f"An error occurred: {e}")

