# Quick Start Guide - HyperGraphQL API

Get the HyperGraphQL API up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

## 1. Start the Backend API

```bash
cd backend
npm install
npm start
```

You should see:
```
Found 7 entity files
Data initialized: 32 nodes, 30 edges
Data service initialized successfully
🚀 HyperGraphQL API server running on http://localhost:4000
📊 GraphQL endpoint: http://localhost:4000/graphql
🔧 GraphiQL interface: http://localhost:4000/graphql
🌐 REST API: http://localhost:4000/api
```

## 2. Test the API

### Option A: Use GraphiQL (Recommended for first-time users)

1. Open your browser
2. Navigate to `http://localhost:4000/graphql`
3. Try this query:

```graphql
{
  nodes(limit: 5) {
    id
    type
    name
  }
}
```

### Option B: Use cURL

```bash
# Health check
curl http://localhost:4000/api/health

# Get ingredients via REST
curl http://localhost:4000/api/entities?type=ingredient

# GraphQL query
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ nodes(limit: 5) { id type name } }"}'
```

## 3. Try Common Queries

### Get all ingredients

```graphql
{
  nodes(filter: { type: "ingredient" }) {
    id
    name
    properties {
      category
    }
  }
}
```

### Find related entities

```graphql
{
  getNeighbors(nodeId: "hyaluronic_acid") {
    id
    type
    name
  }
}
```

### Trace supply chain

```graphql
{
  traceSupplyChain(productId: "hyaluronic_acid") {
    product {
      id
      name
    }
    ingredients {
      name
    }
    suppliers {
      name
    }
  }
}
```

## 4. Start the Frontend (Optional)

In a new terminal:

```bash
cd skin-zone-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 5. Use in Your Own Code

### JavaScript/Node.js

```javascript
// Install fetch if using Node.js < 18
// npm install node-fetch

const response = await fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: '{ nodes(limit: 5) { id name } }'
  })
});

const { data } = await response.json();
console.log(data.nodes);
```

### React

```jsx
import hypergraphApi from './services/hypergraphApi';

function MyComponent() {
  const [ingredients, setIngredients] = useState([]);
  
  useEffect(() => {
    hypergraphApi.getNodesByType('ingredient')
      .then(setIngredients);
  }, []);
  
  return (
    <div>
      {ingredients.map(ing => (
        <div key={ing.id}>{ing.name}</div>
      ))}
    </div>
  );
}
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:4000/graphql',
    json={'query': '{ nodes(limit: 5) { id name } }'}
)

data = response.json()
print(data['data']['nodes'])
```

## Common Tasks

### Add a new ingredient

```graphql
mutation {
  createNode(
    id: "peptide_complex"
    type: "ingredient"
    name: "Peptide Complex"
    tenantId: "default"
  ) {
    id
    name
  }
}
```

### Create a relationship

```graphql
mutation {
  createEdge(
    source: "supplier_123"
    target: "peptide_complex"
    type: "SUPPLIES"
  ) {
    id
    source
    target
  }
}
```

### Get organization data

```graphql
{
  organization(id: "default") {
    id
    name
    entities {
      id
      type
      name
    }
  }
}
```

## Troubleshooting

### Port 4000 already in use

```bash
# Find and kill the process
lsof -i :4000
kill <PID>

# Or use a different port
PORT=4001 npm start
```

### Data not loading

Make sure `hypergraph_data.json` exists in the project root:

```bash
ls -la ../hypergraph_data.json
```

### GraphQL errors

Check the server logs in your terminal. Common issues:
- Missing required fields in queries
- Invalid node IDs
- Syntax errors in GraphQL

## Next Steps

- 📚 Read the [API Documentation](documentation/hypergraphql_api.md)
- 💡 Check [Usage Examples](documentation/hypergraphql_usage_examples.md)
- 🔧 Review the [Backend README](backend/README.md)
- 🎨 Explore the [HypergraphDemo component](skin-zone-app/src/components/HypergraphDemo.jsx)

## Getting Help

If you encounter issues:

1. Check the server logs in your terminal
2. Verify the data loaded correctly (look for "Data initialized: X nodes, Y edges")
3. Test with cURL to isolate frontend vs backend issues
4. Review the API documentation for query syntax

## API Endpoints Reference

| Endpoint | Type | Description |
|----------|------|-------------|
| `/graphql` | GraphQL | Main query endpoint |
| `/api/health` | REST | Health check |
| `/api/entities` | REST | Get/create entities |
| `/api/relations` | REST | Get/create relations |
| `/api/orgs` | REST | Organization management |
| `/api/sync` | REST | Sync data from GitHub |
| `/api/trace/:id` | REST | Trace supply chain |

Happy querying! 🚀
