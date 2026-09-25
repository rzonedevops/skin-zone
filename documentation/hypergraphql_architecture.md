# HyperGraphQL API Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                        │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────────┐  │
│  │  entities/   │  │ hypergraph_   │  │  orgs/{orgId}/     │  │
│  │  *.md files  │  │ data.json     │  │  entities/         │  │
│  └──────────────┘  └───────────────┘  │  relations/        │  │
│                                        └────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ GitHub Service
                              │ loads & maps
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Server                          │
│                     (Node.js + Express)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Data Service                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐           │ │
│  │  │  Nodes   │  │  Edges   │  │  Hyperedges    │           │ │
│  │  │  Map     │  │  Map     │  │  Map           │           │ │
│  │  └──────────┘  └──────────┘  └────────────────┘           │ │
│  │                                                              │ │
│  │  Methods:                                                    │ │
│  │  • getNodes(filter)      • getRelations(nodeId)             │ │
│  │  • getNeighbors(nodeId)  • traverse(startId, depth)         │ │
│  │  • findPaths(src, tgt)   • traceSupplyChain(productId)      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│         ┌────────────────────┴────────────────────┐             │
│         ▼                                          ▼             │
│  ┌─────────────────┐                    ┌──────────────────┐   │
│  │  GraphQL API    │                    │   REST API       │   │
│  │  /graphql       │                    │   /api/*         │   │
│  │                 │                    │                  │   │
│  │  • Schema       │                    │  • /entities     │   │
│  │  • Resolvers    │                    │  • /relations    │   │
│  │  • GraphiQL     │                    │  • /orgs         │   │
│  └─────────────────┘                    │  • /sync         │   │
│                                          │  • /trace/:id    │   │
│                                          └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                                          │
         │                                          │
         │                                          │
         ▼                                          ▼
┌─────────────────────┐                  ┌──────────────────────┐
│  GraphQL Clients    │                  │  REST Clients        │
│                     │                  │                      │
│  • Web browsers     │                  │  • curl              │
│  • React apps       │                  │  • Python scripts    │
│  • Mobile apps      │                  │  • CI/CD pipelines   │
│  • GraphiQL UI      │                  │  • Monitoring tools  │
└─────────────────────┘                  └──────────────────────┘
```

## Data Flow

### Query Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. GraphQL Query
     │    { nodes(filter: { type: "ingredient" }) { id name } }
     ▼
┌────────────────┐
│  GraphQL       │
│  Endpoint      │
└────┬───────────┘
     │
     │ 2. Parse & Validate Query
     ▼
┌────────────────┐
│  Resolvers     │
└────┬───────────┘
     │
     │ 3. Call Data Service
     ▼
┌────────────────┐
│  Data Service  │
│                │
│  • Filter data │
│  • Apply       │
│    tenantId    │
│  • Paginate    │
└────┬───────────┘
     │
     │ 4. Return filtered results
     ▼
┌────────────────┐
│  Resolvers     │
└────┬───────────┘
     │
     │ 5. Format response
     ▼
┌────────────────┐
│  Client        │
└────────────────┘
```

### Supply Chain Tracing Flow

```
Client: traceSupplyChain(productId: "product_123")
   │
   ▼
GraphQL Resolver
   │
   ▼
Data Service:
   ├─ 1. Get product node
   │
   ├─ 2. Find related edges (CONTAINS, USES)
   │
   ├─ 3. Get ingredient nodes
   │     │
   │     └─ Find edges (SUPPLIES)
   │         │
   │         └─ Get supplier nodes
   │
   └─ 4. Build trace result:
        {
          product: { ... },
          ingredients: [ ... ],
          suppliers: [ ... ],
          path: { nodes, edges, length }
        }
```

## Component Architecture

### Backend Components

```
backend/
├── src/
│   ├── server.js                 # Main server, Express setup
│   │   └─ Initializes: Data Service, Routes, GraphQL
│   │
│   ├── schema/
│   │   └── typeDefs.js          # GraphQL type definitions
│   │       ├─ Node
│   │       ├─ Edge
│   │       ├─ Hyperedge
│   │       ├─ Organization
│   │       └─ Query/Mutation types
│   │
│   ├── resolvers/
│   │   └── index.js             # GraphQL resolvers
│   │       ├─ Entity queries (node, nodes, edges)
│   │       ├─ Relation queries (getRelations, getNeighbors)
│   │       ├─ Navigation (traverse, findPaths)
│   │       └─ Mutations (createNode, createEdge)
│   │
│   ├── services/
│   │   ├── dataService.js       # Core data management
│   │   │   ├─ Node operations
│   │   │   ├─ Edge operations
│   │   │   ├─ Graph navigation
│   │   │   └─ Organization support
│   │   │
│   │   └── githubService.js     # GitHub integration
│   │       ├─ Repo structure mapping
│   │       ├─ Entity file loading
│   │       ├─ Compression/expansion
│   │       └─ Org-level aggregation
│   │
│   └── routes/
│       └── api.js               # REST endpoints
│           ├─ /entities
│           ├─ /relations
│           ├─ /orgs
│           ├─ /sync
│           └─ /trace
│
└── tests/
    └── dataService.test.js      # Unit tests
```

### Frontend Components

```
skin-zone-app/
└── src/
    ├── services/
    │   └── hypergraphApi.js        # API client
    │       ├─ GraphQL queries
    │       ├─ REST requests
    │       └─ Error handling
    │
    └── components/
        └── HypergraphDemo.jsx      # Demo component
            ├─ Node selection
            ├─ Neighbor discovery
            └─ Interactive exploration
```

## Data Model

### In-Memory Structure

```javascript
DataService {
  nodes: Map<string, Node>
    ├─ "hyaluronic_acid" → { id, type, name, properties, tenantId, embedding }
    ├─ "making_cosmetics" → { ... }
    └─ ...

  edges: Map<string, Edge>
    ├─ "edge_0" → { id, source, target, type, weight, tenantId }
    ├─ "edge_1" → { ... }
    └─ ...

  hyperedges: Map<string, Hyperedge>
    ├─ "hyperedge_0" → { id, type, nodes, attributes, tenantId }
    └─ ...
}
```

### Node Structure

```javascript
{
  id: "hyaluronic_acid",
  type: "ingredient",
  name: "Hyaluronic Acid",
  properties: {
    category: "humectant",
    description: "...",
    benefits: ["hydration", "..."]
  },
  tenantId: "default",
  embedding: [0.1, 0.2, ...]
}
```

### Edge Structure

```javascript
{
  id: "edge_0",
  source: "making_cosmetics",
  target: "hyaluronic_acid",
  type: "SUPPLIES",
  weight: 1.0,
  properties: {
    reliability: 0.95,
    quantity: 100
  },
  tenantId: "default"
}
```

## Multi-Tenancy Support

### Tenant Isolation

```
Organization: "luxe_skin_studio"
  ├─ Nodes (tenantId: "luxe_skin_studio")
  │   ├─ Salon entity
  │   ├─ Therapists
  │   └─ Treatments
  │
  ├─ Edges (tenantId: "luxe_skin_studio")
  │   ├─ Therapist WORKS_AT Salon
  │   └─ Salon OFFERS Treatment
  │
  └─ Hyperedges (tenantId: "luxe_skin_studio")
      └─ Treatment instances
```

### Query Filtering

```graphql
# All data
{ nodes { id } }

# Org-specific data
{ nodes(filter: { tenantId: "luxe_skin_studio" }) { id } }

# Cross-org query (if permissions allow)
{
  org1: nodes(filter: { tenantId: "org1" }) { id }
  org2: nodes(filter: { tenantId: "org2" }) { id }
}
```

## GitHub Integration

### Repository Mapping

```
Repository Structure → Hypergraph Structure

/entities/             → Node types
  ingredients.md       → Ingredient metadata
  products.md          → Product metadata
  relationships.md     → Edge definitions

/hypergraph_data.json  → Main graph data
  nodes: [...]         → All nodes
  edges: [...]         → All edges

/orgs/                 → Organization data
  {orgId}/
    entities/          → Org-specific nodes
      nodes.json
    relations/         → Org-specific edges
      edges.json
```

### Scaling Operations

```
Compression (for storage):
  Full Node → Minimal Node
  { id, type, name, properties, embedding, ... }
    ↓
  { id, type, name, tenantId }

Expansion (from storage):
  Minimal Node → Full Node
  { id, type, name, tenantId }
    ↓
  { id, type, name, properties: {}, embedding: [], tenantId }

Projection (to org folders):
  Data Service State → File System
  nodes.get(orgId) → /orgs/{orgId}/entities/nodes.json
  edges.get(orgId) → /orgs/{orgId}/relations/edges.json
```

## API Patterns

### GraphQL vs REST

**Use GraphQL when:**
- Complex queries with nested data
- Specific field selection needed
- Multiple queries in one request
- Interactive exploration

**Use REST when:**
- Simple CRUD operations
- CI/CD automation
- Health checks
- File uploads/downloads

### Example Use Cases

#### GraphQL
```graphql
# Get ingredients with suppliers in one query
{
  nodes(filter: { type: "ingredient" }, limit: 10) {
    id
    name
    suppliers: getNeighbors(nodeId: id) {
      name
    }
  }
}
```

#### REST
```bash
# Quick health check in CI/CD
curl http://api.example.com/api/health

# Create entity via automation
curl -X POST http://api.example.com/api/entities \
  -H "Content-Type: application/json" \
  -d '{"id":"new_ing","type":"ingredient","name":"New Ingredient"}'
```

## Performance Characteristics

### Time Complexity

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| getNode(id) | O(1) | Map lookup |
| getNodes(filter) | O(n) | Linear scan with filtering |
| getNeighbors(id) | O(e) | Scan all edges |
| traverse(id, depth) | O(V + E) | DFS traversal |
| findPaths(src, tgt) | O(V + E) | BFS with path tracking |
| traceSupplyChain(id) | O(V + E) | Multi-hop traversal |

### Optimization Strategies

1. **Caching**: Frequently accessed nodes/paths
2. **Indexing**: Build indexes for common filters
3. **Pagination**: Limit result sets
4. **Lazy Loading**: Load related entities on demand
5. **Batch Operations**: Group multiple queries

## Security Considerations

### Current Implementation
- No authentication (development only)
- No rate limiting
- No input validation (basic)
- No API keys

### Production Requirements
- Add authentication (JWT, OAuth)
- Implement rate limiting
- Add input validation/sanitization
- Tenant-based access control
- API key management
- Audit logging
- CORS configuration
- HTTPS enforcement

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              Load Balancer                   │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│  API Server 1 │   │  API Server 2 │
│  (Node.js)    │   │  (Node.js)    │
└───────┬───────┘   └───────┬───────┘
        │                   │
        └─────────┬─────────┘
                  ▼
        ┌─────────────────┐
        │  Data Store     │
        │  (PostgreSQL/   │
        │   Neo4j)        │
        └─────────────────┘
```

## Future Enhancements

1. **Real-time Updates**: WebSocket/SSE for live data
2. **Batch Processing**: Background jobs for large operations
3. **Caching Layer**: Redis for frequently accessed data
4. **Search**: Full-text search with Elasticsearch
5. **Analytics**: Query performance monitoring
6. **Visualization**: Graph visualization endpoints
7. **Export**: Neo4j, GraphML export formats
8. **ML Integration**: Use embeddings for recommendations
