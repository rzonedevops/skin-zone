#!/bin/bash

# Start script for HyperGraphQL API backend

echo "🚀 Starting HyperGraphQL API Backend..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Check if hypergraph_data.json exists
if [ ! -f "../hypergraph_data.json" ]; then
  echo "⚠️  Warning: hypergraph_data.json not found!"
  echo "The API will not have any data to serve."
  echo ""
fi

# Start the server
echo "🌐 Starting server on port 4000..."
echo "📊 GraphQL endpoint: http://localhost:4000/graphql"
echo "🔧 GraphiQL interface: http://localhost:4000/graphql"
echo "🌐 REST API: http://localhost:4000/api"
echo ""

npm start
