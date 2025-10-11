# HyperGraphQL Usage Examples

This document provides practical examples of using the HyperGraphQL API for common use cases.

## Table of Contents

1. [Setup](#setup)
2. [Basic Queries](#basic-queries)
3. [Organization-Aware Queries](#organization-aware-queries)
4. [Supply Chain Use Cases](#supply-chain-use-cases)
5. [React Integration](#react-integration)
6. [Advanced Patterns](#advanced-patterns)

## Setup

### Backend Setup

1. Start the backend server:

```bash
cd backend
npm install
npm start
```

The server will start at `http://localhost:4000`

### Frontend Setup

The frontend already has the API client configured. Just import it:

```javascript
import hypergraphApi from './services/hypergraphApi';
```

## Basic Queries

### Get All Ingredients

**GraphQL:**
```graphql
{
  nodes(filter: { type: "ingredient" }, limit: 20) {
    id
    name
    properties {
      category
      description
    }
  }
}
```

**JavaScript:**
```javascript
const ingredients = await hypergraphApi.getNodesByType('ingredient');
console.log(ingredients);
```

**cURL:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ nodes(filter: { type: \"ingredient\" }) { id name } }"
  }'
```

### Get Specific Entity Details

**GraphQL:**
```graphql
{
  node(id: "hyaluronic_acid") {
    id
    type
    name
    properties {
      scientificName
      category
      description
      benefits
    }
  }
}
```

**JavaScript:**
```javascript
const ingredient = await hypergraphApi.getNode('hyaluronic_acid');
console.log(ingredient.name);
console.log(ingredient.properties.description);
```

### Find Related Entities

**GraphQL:**
```graphql
{
  getNeighbors(nodeId: "hyaluronic_acid") {
    id
    type
    name
    properties {
      category
    }
  }
}
```

**JavaScript:**
```javascript
const neighbors = await hypergraphApi.getNeighbors('hyaluronic_acid');
console.log('Related entities:', neighbors.map(n => n.name));
```

## Organization-Aware Queries

### Get Entities for a Specific Salon

**GraphQL:**
```graphql
{
  nodes(filter: { tenantId: "luxe_skin_studio" }) {
    id
    type
    name
  }
}
```

**JavaScript:**
```javascript
const salonEntities = await hypergraphApi.getNodes({ 
  tenantId: 'luxe_skin_studio' 
});
```

### Get Organization Overview

**GraphQL:**
```graphql
{
  organization(id: "luxe_skin_studio") {
    id
    name
    entities {
      id
      type
      name
    }
    relations {
      source
      target
      type
    }
  }
}
```

**JavaScript:**
```javascript
const orgData = await hypergraphApi.getOrganization('luxe_skin_studio');
console.log(`${orgData.name} has ${orgData.entities.length} entities`);
```

### List All Organizations

**JavaScript:**
```javascript
const orgs = await hypergraphApi.getOrganizations();
console.log('Organizations:', orgs.map(o => o.id));
```

## Supply Chain Use Cases

### Trace Product to Ingredients and Suppliers

**GraphQL:**
```graphql
{
  traceSupplyChain(productId: "product_123") {
    product {
      id
      name
    }
    ingredients {
      id
      name
    }
    suppliers {
      id
      name
    }
    path {
      length
    }
  }
}
```

**JavaScript:**
```javascript
const trace = await hypergraphApi.traceSupplyChain('product_123');
console.log('Product:', trace.product.name);
console.log('Ingredients:', trace.ingredients.map(i => i.name));
console.log('Suppliers:', trace.suppliers.map(s => s.name));
```

### Find All Suppliers for an Ingredient

```javascript
const ingredient = await hypergraphApi.getNode('hyaluronic_acid');
const neighbors = await hypergraphApi.getNeighbors('hyaluronic_acid');
const suppliers = neighbors.filter(n => n.type === 'supplier');
console.log('Suppliers:', suppliers.map(s => s.name));
```

### Find Ingredient Sources

**GraphQL:**
```graphql
{
  getRelations(nodeId: "hyaluronic_acid") {
    source
    target
    type
  }
  
  getNeighbors(nodeId: "hyaluronic_acid") {
    id
    type
    name
  }
}
```

## React Integration

### Display Ingredients List

```jsx
import { useState, useEffect } from 'react';
import hypergraphApi from './services/hypergraphApi';

function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await hypergraphApi.getNodesByType('ingredient');
        setIngredients(data);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      } finally {
        setLoading(false);
      }
    }
    loadIngredients();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ingredients.map(ing => (
        <div key={ing.id} className="border rounded p-4">
          <h3 className="font-bold">{ing.name}</h3>
          <p className="text-sm text-gray-600">
            {ing.properties?.category}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Interactive Supply Chain Visualization

```jsx
import { useState } from 'react';
import hypergraphApi from './services/hypergraphApi';

function SupplyChainViewer() {
  const [productId, setProductId] = useState('');
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(false);

  async function traceProduct() {
    setLoading(true);
    try {
      const data = await hypergraphApi.traceSupplyChain(productId);
      setTrace(data);
    } catch (error) {
      console.error('Failed to trace supply chain:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={productId}
          onChange={e => setProductId(e.target.value)}
          placeholder="Enter product ID"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={traceProduct}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Trace
        </button>
      </div>

      {trace && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">Product</h3>
            <p>{trace.product.name}</p>
          </div>
          
          <div>
            <h3 className="font-bold">Ingredients</h3>
            <ul>
              {trace.ingredients.map(ing => (
                <li key={ing.id}>{ing.name}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold">Suppliers</h3>
            <ul>
              {trace.suppliers.map(sup => (
                <li key={sup.id}>{sup.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Organization-Aware Component

```jsx
import { useState, useEffect } from 'react';
import hypergraphApi from './services/hypergraphApi';

function OrganizationDashboard({ orgId }) {
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    async function loadOrgData() {
      const data = await hypergraphApi.getOrganization(orgId);
      setOrgData(data);
    }
    loadOrgData();
  }, [orgId]);

  if (!orgData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{orgData.name}</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="text-3xl font-bold">{orgData.entities.length}</div>
          <div className="text-gray-600">Entities</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-3xl font-bold">{orgData.relations.length}</div>
          <div className="text-gray-600">Relations</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-3xl font-bold">{orgData.hyperedges.length}</div>
          <div className="text-gray-600">Hyperedges</div>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">Recent Entities</h3>
        <div className="space-y-2">
          {orgData.entities.slice(0, 5).map(entity => (
            <div key={entity.id} className="border rounded p-2">
              <span className="font-medium">{entity.name}</span>
              <span className="text-sm text-gray-600 ml-2">
                ({entity.type})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Advanced Patterns

### Find Shortest Path Between Entities

```javascript
const paths = await hypergraphApi.findPaths(
  'hyaluronic_acid',
  'luxe_skin_studio',
  5  // max length
);

// Get shortest path
const shortestPath = paths.reduce((min, path) => 
  path.length < min.length ? path : min
);

console.log('Shortest path:', shortestPath.nodes.map(n => n.name).join(' -> '));
```

### Traverse Graph with Depth Limit

```javascript
const visited = await hypergraphApi.traverse('hyaluronic_acid', 2);
console.log('Entities within 2 hops:', visited.map(n => n.name));
```

### Get Treatment Recommendations

```javascript
const recommendations = await hypergraphApi.recommendTreatments(
  'customer_123',
  'luxe_skin_studio'  // tenant ID
);

console.log('Recommended treatments:', 
  recommendations.map(t => t.name)
);
```

### Batch Operations with REST API

```javascript
// Create multiple entities
const newIngredients = [
  { id: 'peptide_1', type: 'ingredient', name: 'Peptide Complex', tenantId: 'default' },
  { id: 'ceramide_1', type: 'ingredient', name: 'Ceramide NP', tenantId: 'default' }
];

for (const ingredient of newIngredients) {
  await hypergraphApi.createEntity(ingredient);
}

// Verify
const ingredients = await hypergraphApi.getEntities({ type: 'ingredient' });
console.log(`Total ingredients: ${ingredients.data.length}`);
```

### Sync Data from GitHub

```javascript
// Trigger sync
const result = await hypergraphApi.syncData();
console.log(`Synced: ${result.nodes} nodes, ${result.edges} edges`);
```

## Error Handling Patterns

### Graceful Degradation

```javascript
async function loadDataWithFallback() {
  try {
    const data = await hypergraphApi.getNodes();
    return data;
  } catch (error) {
    console.error('API error:', error);
    // Return cached or default data
    return getCachedData();
  }
}
```

### Retry Logic

```javascript
async function fetchWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Usage
const data = await fetchWithRetry(() => 
  hypergraphApi.getNodes()
);
```

### Loading States

```javascript
function useHypergraphQuery(queryFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await queryFn();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading, error };
}

// Usage
const { data: ingredients, loading, error } = useHypergraphQuery(
  () => hypergraphApi.getNodesByType('ingredient')
);
```

## Performance Optimization

### Pagination

```javascript
// Load data in pages
async function loadAllIngredientsInPages() {
  const allIngredients = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const page = await hypergraphApi.getNodes(
      { type: 'ingredient' },
      limit,
      offset
    );
    
    allIngredients.push(...page);
    
    if (page.length < limit) break;
    offset += limit;
  }
  
  return allIngredients;
}
```

### Caching

```javascript
const cache = new Map();

async function getCachedNode(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const node = await hypergraphApi.getNode(id);
  cache.set(id, node);
  return node;
}
```

### Debounced Search

```javascript
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function SearchIngredients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      hypergraphApi.getNodes({ name: debouncedSearch })
        .then(setResults);
    }
  }, [debouncedSearch]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search ingredients..."
      />
      {/* Render results */}
    </div>
  );
}
```

## Testing

### Mock API Responses

```javascript
// __mocks__/hypergraphApi.js
export default {
  getNodes: jest.fn(() => Promise.resolve([
    { id: '1', type: 'ingredient', name: 'Test Ingredient' }
  ])),
  getNode: jest.fn((id) => Promise.resolve(
    { id, type: 'ingredient', name: 'Test Ingredient' }
  )),
  // ... other mocked methods
};
```

### Integration Tests

```javascript
import hypergraphApi from './services/hypergraphApi';

async function testSupplyChain() {
  console.log('Testing supply chain tracing...');
  
  const trace = await hypergraphApi.traceSupplyChain('product_123');
  console.assert(trace.product, 'Should have product');
  console.assert(trace.ingredients.length > 0, 'Should have ingredients');
  
  console.log('✓ Supply chain test passed');
}
```

## Next Steps

- Explore the [API Documentation](./hypergraphql_api.md)
- Check the [Backend README](../backend/README.md)
- Review the [HypergraphDemo component](../skin-zone-app/src/components/HypergraphDemo.jsx)
