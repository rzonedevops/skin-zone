# HyperGraphQL API Documentation

## Overview

The HyperGraphQL API provides a GraphQL and REST interface to the Skin Zone HyperGNN (Hyper-Graph Neural Network) database. It enables org-aware repository management, hypergraph navigation, and supply chain tracing.

## Architecture

### Components

1. **GraphQL Schema** - Type definitions for entities, relations, and hypergraph structures
2. **Resolvers** - Query and mutation handlers
3. **Data Service** - Manages hypergraph data from JSON files and entity folders
4. **GitHub Service** - Maps repo folder structure to hypergraph
5. **REST API** - Alternative HTTP endpoints for entity management

### Organization-Aware Design

The API supports multi-tenancy through `tenantId` filtering:

- Each entity (node, edge, hyperedge) has a `tenantId` field
- Queries can filter by `tenantId` to get org-specific data
- GitHub repo structure can map organizations to folders

## GraphQL API

### Core Types

#### Node

Represents an entity in the hypergraph (Ingredient, Product, Supplier, Salon, etc.)

```graphql
type Node {
  id: ID!
  type: String!              # Entity type
  name: String!              # Display name
  properties: NodeProperties # Type-specific properties
  tenantId: String           # Organization identifier
  embedding: [Float]         # Vector embedding for ML
}
```

#### Edge

Represents a relationship between two nodes

```graphql
type Edge {
  id: ID!
  source: String!            # Source node ID
  target: String!            # Target node ID
  type: String!              # Relationship type
  weight: Float              # Edge weight/strength
  properties: EdgeProperties # Relationship properties
  tenantId: String           # Organization identifier
}
```

#### Hyperedge

Represents a multi-way relationship connecting multiple nodes

```graphql
type Hyperedge {
  id: ID!
  type: String!                      # Hyperedge type
  nodes: [HyperedgeNode!]!           # Connected nodes with roles
  attributes: HyperedgeAttributes    # Event-specific attributes
  tenantId: String                   # Organization identifier
  embedding: [Float]                 # Vector embedding
}
```

### Query Examples

#### Basic Entity Queries

Get all ingredients:

```graphql
{
  nodes(filter: { type: "ingredient" }, limit: 10) {
    id
    name
    properties {
      category
      description
    }
  }
}
```

Get a specific entity:

```graphql
{
  node(id: "hyaluronic_acid") {
    id
    type
    name
    properties {
      scientificName
      category
      benefits
    }
  }
}
```

#### Organization-Aware Queries

Get entities for a specific organization:

```graphql
{
  nodes(filter: { type: "salon", tenantId: "luxe_skin_studio" }) {
    id
    name
    properties {
      location {
        city
        address
      }
    }
  }
}
```

Get all entities in an organization:

```graphql
{
  organization(id: "salon_123") {
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

#### Relation Queries

Get all relations for a node:

```graphql
{
  getRelations(nodeId: "hyaluronic_acid") {
    source
    target
    type
    weight
  }
}
```

Get neighbor nodes:

```graphql
{
  getNeighbors(nodeId: "making_cosmetics", tenantId: "default") {
    id
    type
    name
  }
}
```

#### Hypergraph Navigation

Traverse the graph from a starting node:

```graphql
{
  traverse(
    startNodeId: "luxe_skin_studio"
    maxDepth: 2
    tenantId: "default"
  ) {
    id
    type
    name
  }
}
```

Find paths between two nodes:

```graphql
{
  findPaths(
    sourceId: "hyaluronic_acid"
    targetId: "luxe_skin_studio"
    maxLength: 5
  ) {
    nodes {
      id
      name
    }
    edges {
      source
      target
      type
    }
    length
    score
  }
}
```

#### Supply Chain Queries

Trace a product through the supply chain:

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
      nodes {
        id
        type
        name
      }
      length
    }
  }
}
```

Recommend treatments for a customer:

```graphql
{
  recommendTreatments(customerId: "cust_456", tenantId: "default") {
    id
    name
    properties {
      description
      price
      rating
    }
  }
}
```

### Mutations

Create a new entity:

```graphql
mutation {
  createNode(
    id: "new_ingredient"
    type: "ingredient"
    name: "Peptide Complex"
    tenantId: "default"
  ) {
    id
    type
    name
  }
}
```

Create a relationship:

```graphql
mutation {
  createEdge(
    source: "supplier_123"
    target: "ingredient_456"
    type: "SUPPLIES"
    tenantId: "default"
  ) {
    id
    source
    target
    type
  }
}
```

## REST API

### Entity Management

#### GET /api/entities

Get entities with filtering

**Query Parameters:**
- `type` - Filter by entity type
- `tenantId` - Filter by organization
- `limit` - Number of results (default: 100)
- `offset` - Pagination offset

**Example:**
```bash
curl "http://localhost:4000/api/entities?type=ingredient&limit=10"
```

#### GET /api/entities/:id

Get a specific entity

**Example:**
```bash
curl "http://localhost:4000/api/entities/hyaluronic_acid"
```

#### POST /api/entities

Create a new entity

**Example:**
```bash
curl -X POST http://localhost:4000/api/entities \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new_ingredient",
    "type": "ingredient",
    "name": "New Ingredient",
    "tenantId": "default"
  }'
```

### Relation Management

#### GET /api/relations

Get relations with filtering

**Query Parameters:**
- `source` - Filter by source node
- `target` - Filter by target node
- `tenantId` - Filter by organization
- `limit` - Number of results
- `offset` - Pagination offset

#### POST /api/relations

Create a new relation

```bash
curl -X POST http://localhost:4000/api/relations \
  -H "Content-Type: application/json" \
  -d '{
    "source": "supplier_123",
    "target": "ingredient_456",
    "type": "SUPPLIES",
    "tenantId": "default"
  }'
```

### Organization Management

#### GET /api/orgs

Get all organizations

#### GET /api/orgs/:id

Get organization by ID with all entities and relations

### GitHub Sync

#### POST /api/sync

Synchronize data from GitHub repository

```bash
curl -X POST http://localhost:4000/api/sync
```

### Supply Chain

#### GET /api/trace/:productId

Trace product supply chain

**Example:**
```bash
curl "http://localhost:4000/api/trace/product_123?tenantId=default"
```

## GitHub Integration

### Folder Structure Mapping

The API maps the GitHub repository structure to hypergraph data:

```
skin-zone/
├── entities/              → Node types
│   ├── ingredients.md
│   ├── products.md
│   ├── suppliers.md
│   └── relationships.md   → Edge definitions
├── orgs/                  → Organization data
│   ├── org_1/
│   │   ├── entities/      → Org-specific nodes
│   │   │   └── nodes.json
│   │   └── relations/     → Org-specific edges
│   │       └── edges.json
│   └── org_2/
│       └── ...
└── hypergraph_data.json   → Main graph data
```

### Scaling Utilities

#### Compression

Compress data for storage (removes embeddings and non-essential fields):

```javascript
import githubService from './services/githubService.js';

const compressed = githubService.compressForStorage({
  nodes: [...],
  edges: [...]
});
```

#### Expansion

Expand compressed data back to full structure:

```javascript
const expanded = githubService.expandFromStorage(compressed);
```

#### Org-Level Projection

Project entities and relations to org-specific folders:

```javascript
const result = githubService.projectToOrgStructure(
  'org_123',
  entities,
  relations
);
// Creates: /orgs/org_123/entities/nodes.json
//          /orgs/org_123/relations/edges.json
```

#### Org-Level Aggregation

Aggregate data from multiple repos/folders:

```javascript
const orgData = githubService.aggregateOrgData('org_123');
// Returns: { orgId, entities, relations }
```

## Frontend Integration

### Using the API Client

Import the client in your React components:

```javascript
import hypergraphApi from './services/hypergraphApi';

// Get entities
const ingredients = await hypergraphApi.getNodesByType('ingredient');

// Trace supply chain
const trace = await hypergraphApi.traceSupplyChain('product_123');

// Find paths
const paths = await hypergraphApi.findPaths('node1', 'node2');

// Org-aware query
const orgData = await hypergraphApi.getOrganization('salon_123');
```

### Example React Component

```jsx
import { useState, useEffect } from 'react';
import hypergraphApi from './services/hypergraphApi';

function IngredientsList({ tenantId }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await hypergraphApi.getNodesByType('ingredient', tenantId);
        setIngredients(data);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadIngredients();
  }, [tenantId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {ingredients.map(ing => (
        <div key={ing.id}>
          <h3>{ing.name}</h3>
          <p>{ing.properties?.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Data Model

### Entity Types

- `ingredient` - Raw ingredients
- `product` - Finished products
- `supplier` - Ingredient suppliers
- `brand` - Product brands
- `salon` - Beauty salons/spas
- `treatment` - Salon treatments
- `therapist` - Salon professionals
- `service` - Salon services
- `customer` - End customers
- `marketplace` - Booking platforms

### Relationship Types

- `SUPPLIES` - Supplier → Ingredient
- `CONTAINS` - Product → Ingredient
- `MANUFACTURES` - Brand → Product
- `OFFERS` - Salon → Treatment
- `USES` - Treatment → Product
- `PERFORMS` - Therapist → Treatment
- `WORKS_AT` - Therapist → Salon
- `BOOKS` - Customer → Treatment
- `RELATED_TO` - Generic relationship

### Hyperedge Types

- `TREATMENT_INSTANCE` - A treatment session with customer, therapist, salon, products
- `SUPPLY_CHAIN_EVENT` - Supply chain transaction with multiple parties
- `CUSTOMER_JOURNEY` - Customer interactions across multiple touchpoints

## Performance Considerations

- Use `limit` and `offset` for pagination
- Filter by `tenantId` to reduce result sets
- Specify only needed fields in GraphQL queries
- Use path finding sparingly (computationally expensive)
- Cache frequently accessed data on the frontend

## Error Handling

All API errors follow this format:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Handle errors in frontend:

```javascript
try {
  const data = await hypergraphApi.getNodes();
} catch (error) {
  console.error('API error:', error.message);
  // Show user-friendly error message
}
```

## Development

### Running the Server

```bash
cd backend
npm install
npm run dev
```

### Testing Queries

Use the GraphiQL interface at `http://localhost:4000/graphql`

### Environment Variables

Create `.env` file in backend:

```env
PORT=4000
NODE_ENV=development
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:4000
```

## Future Enhancements

- [ ] Real-time subscriptions for data changes
- [ ] Advanced recommendation algorithms
- [ ] ML-based path optimization
- [ ] Batch operations support
- [ ] Graph visualization endpoints
- [ ] Export to various formats (Neo4j, GraphML, etc.)
- [ ] Authentication and authorization
- [ ] Rate limiting and API quotas
