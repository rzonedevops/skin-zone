import os
import json
from supabase import create_client, Client

# Get Supabase credentials from environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Load hypergraph data from JSON file
with open("/home/ubuntu/skin-zone/hypergraph_data.json", "r") as f:
    hypergraph_data = json.load(f)

# Upsert nodes
for node in hypergraph_data["nodes"]:
    supabase.table("nodes").upsert(node).execute()

# Upsert edges
for edge in hypergraph_data["edges"]:
    supabase.table("edges").upsert(edge).execute()

print("Supabase sync completed successfully.")
