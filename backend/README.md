# HyperGraphQL API Backend

Backend API for the Skin Zone HyperGNN, providing GraphQL and REST endpoints for org-aware hypergraph queries.

## Features

- **GraphQL API** - Query hypergraph entities, relations, and hyperedges
- **REST API** - Manage entities, relations, and organizations
- **Org-Aware Queries** - Multi-tenant support with tenant-based filtering
- **GitHub Integration** - Map repo folder structure to hypergraph
- **Supply Chain Tracing** - Trace products through the supply chain
- **Path Finding** - Find paths between nodes in the hypergraph
- **Compression/Expansion** - Scale data for storage and retrieval

## Quick Start

### Installation

```bash
cd backend
npm install
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:4000`

## API Endpoints

### GraphQL Endpoint

**URL**: `/graphql`

**GraphiQL Interface**: Open `http://localhost:4000/graphql` in your browser for the interactive GraphQL interface.

### Example Queries

#### Get all nodes

```graphql
{
  nodes(limit: 10) {
    id
    type
    name
    tenantId
  }
}
```

#### Get nodes by type

```graphql
{
  nodes(filter: { type: "ingredient" }) {
    id
    name
    properties {
      category
      description
    }
  }
}
```

#### Get org-specific entities

```graphql
{
  nodes(filter: { tenantId: "luxe_skin_studio" }) {
    id
    type
    name
  }
}
```

#### Find neighbors

```graphql
{
  getNeighbors(nodeId: "hyaluronic_acid") {
    id
    type
    name
  }
}
```

#### Find paths between nodes

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
    length
    score
  }
}
```

#### Trace supply chain

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
  }
}
```

#### Get organization data

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
    relations {
      source
      target
      type
    }
  }
}
```

### REST API Endpoints

#### Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "service": "HyperGraphQL API",
  "version": "1.0.0"
}
```

#### Get Entities

```http
GET /api/entities?type=ingredient&tenantId=default&limit=10
```

#### Get Entity by ID

```http
GET /api/entities/:id
```

#### Create Entity

```http
POST /api/entities
Content-Type: application/json

{
  "id": "new_ingredient",
  "type": "ingredient",
  "name": "New Ingredient",
  "tenantId": "default"
}
```

#### Get Relations

```http
GET /api/relations?source=hyaluronic_acid&tenantId=default
```

#### Create Relation

```http
POST /api/relations
Content-Type: application/json

{
  "source": "supplier_id",
  "target": "ingredient_id",
  "type": "SUPPLIES",
  "tenantId": "default"
}
```

#### Get Organizations

```http
GET /api/orgs
```

#### Get Organization by ID

```http
GET /api/orgs/:id
```

#### Sync Data

```http
POST /api/sync
Content-Type: application/json

{}
```

#### Trace Supply Chain

```http
GET /api/trace/:productId?tenantId=default
```

## GitHub Integration

### Folder Structure Mapping

The API maps the repository structure to hypergraph entities:

- `/entities/*.md` → Node types
- `/entities/relationships.md` → Edge definitions
- `/orgs/{orgId}/entities/` → Org-specific entities
- `/orgs/{orgId}/relations/` → Org-specific relations

### Scaling Utilities

#### Compression

Compress data for storage (removes embeddings and non-essential fields):

```javascript
import githubService from './services/githubService.js';

const compressed = githubService.compressForStorage(data);
```

#### Expansion

Expand compressed data back to full structure:

```javascript
const expanded = githubService.expandFromStorage(compressed);
```

#### Org-Level Aggregation

Aggregate data from multiple repos/folders at the organization level:

```javascript
const orgData = githubService.aggregateOrgData('org_id');
```

## Multi-Tenant Support

All queries support tenant-based filtering through the `tenantId` parameter:

```graphql
{
  nodes(filter: { tenantId: "salon_123" }) {
    id
    name
  }
}
```

```http
GET /api/entities?tenantId=salon_123
```

## Data Model

### Node

- `id`: Unique identifier
- `type`: Entity type (ingredient, product, supplier, salon, etc.)
- `name`: Display name
- `properties`: Type-specific properties
- `tenantId`: Organization/tenant identifier
- `embedding`: Vector embedding for ML

### Edge

- `id`: Unique identifier
- `source`: Source node ID
- `target`: Target node ID
- `type`: Relationship type
- `weight`: Edge weight/strength
- `properties`: Relationship-specific properties
- `tenantId`: Organization/tenant identifier

### Hyperedge

- `id`: Unique identifier
- `type`: Hyperedge type (TREATMENT_INSTANCE, SUPPLY_CHAIN_EVENT, etc.)
- `nodes`: List of connected nodes with roles
- `attributes`: Hyperedge-specific attributes
- `tenantId`: Organization/tenant identifier
- `embedding`: Vector embedding

## Development

### Project Structure

```
backend/
├── src/
│   ├── schema/
│   │   └── typeDefs.js      # GraphQL schema definitions
│   ├── resolvers/
│   │   └── index.js         # GraphQL resolvers
│   ├── services/
│   │   ├── dataService.js   # Data management
│   │   └── githubService.js # GitHub integration
│   ├── routes/
│   │   └── api.js           # REST API routes
│   └── server.js            # Main server file
├── tests/                   # Test files
├── package.json
└── README.md
```

### Adding New Entity Types

1. Data will automatically be loaded from `hypergraph_data.json`
2. Add entity type definitions to GraphQL schema if needed
3. Implement type-specific resolvers if required

### Adding New Query Types

1. Add query definition to `schema/typeDefs.js`
2. Implement resolver in `resolvers/index.js`
3. Add corresponding logic to `dataService.js`

## Testing

Run tests:

```bash
npm test
```

## Environment Variables

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)

## License

MIT
