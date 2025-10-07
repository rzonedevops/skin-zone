import os
from supabase import create_client, Client

# Get Supabase credentials from environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# SQL to create tables
create_nodes_table_sql = """
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    type TEXT,
    name TEXT
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

response = supabase.rpc("exec", {"sql": create_nodes_table_sql}).execute()
print("Create nodes table response:", response)

response = supabase.rpc("exec", {"sql": create_edges_table_sql}).execute()
print("Create edges table response:", response)

print("Supabase table creation script finished.")

