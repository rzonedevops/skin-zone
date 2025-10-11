import { buildSchema } from 'graphql';

/**
 * HyperGraphQL Schema for Skin Zone HGNN
 * Maps HyperGNN entities to GraphQL types with org-aware support
 */
export const typeDefs = buildSchema(`
  # Core node types in the hypergraph
  
  type Node {
    id: ID!
    type: String!
    name: String!
    properties: NodeProperties
    tenantId: String
    embedding: [Float]
  }
  
  type NodeProperties {
    scientificName: String
    category: String
    description: String
    benefits: [String]
    price: Float
    rating: Float
    location: Location
    availability: String
    imageUrl: String
  }
  
  type Location {
    latitude: Float
    longitude: Float
    address: String
    city: String
    country: String
  }
  
  # Edge types for relationships
  
  type Edge {
    id: ID!
    source: String!
    target: String!
    type: String!
    weight: Float
    properties: EdgeProperties
    tenantId: String
  }
  
  type EdgeProperties {
    bookingDate: String
    status: String
    quantity: Float
    reliability: Float
  }
  
  # Hyperedge types for multi-way relationships
  
  type Hyperedge {
    id: ID!
    type: String!
    nodes: [HyperedgeNode!]!
    attributes: HyperedgeAttributes
    tenantId: String
    embedding: [Float]
  }
  
  type HyperedgeNode {
    nodeId: String!
    role: String!
    quantity: String
  }
  
  type HyperedgeAttributes {
    datetime: String
    duration: Int
    price: Float
    outcomeRating: Float
    eventType: String
    qualityCheck: String
  }
  
  # Organization/Tenant management
  
  type Organization {
    id: ID!
    name: String!
    type: String!
    entities: [Node!]
    relations: [Edge!]
    hyperedges: [Hyperedge!]
  }
  
  # Query paths and navigation
  
  type Path {
    nodes: [Node!]!
    edges: [Edge!]!
    length: Int!
    score: Float
  }
  
  type SupplyChainTrace {
    product: Node!
    ingredients: [Node!]!
    suppliers: [Node!]!
    path: Path!
  }
  
  # Input types for queries
  
  input NodeFilter {
    type: String
    name: String
    tenantId: String
    category: String
  }
  
  input EdgeFilter {
    type: String
    source: String
    target: String
    tenantId: String
  }
  
  input HyperedgeFilter {
    type: String
    tenantId: String
  }
  
  # Queries
  
  type Query {
    # Entity queries
    node(id: ID!): Node
    nodes(filter: NodeFilter, limit: Int, offset: Int): [Node!]!
    
    edge(id: ID!): Edge
    edges(filter: EdgeFilter, limit: Int, offset: Int): [Edge!]!
    
    hyperedge(id: ID!): Hyperedge
    hyperedges(filter: HyperedgeFilter, limit: Int, offset: Int): [Hyperedge!]!
    
    # Relation queries
    getRelations(nodeId: ID!, tenantId: String): [Edge!]!
    getNeighbors(nodeId: ID!, tenantId: String): [Node!]!
    
    # Hypergraph navigation
    traverse(startNodeId: ID!, maxDepth: Int, tenantId: String): [Node!]!
    findPaths(sourceId: ID!, targetId: ID!, maxLength: Int, tenantId: String): [Path!]!
    
    # Supply chain queries
    traceSupplyChain(productId: ID!, tenantId: String): SupplyChainTrace
    recommendTreatments(customerId: ID!, tenantId: String): [Node!]!
    
    # Organization queries
    organization(id: ID!): Organization
    organizations(limit: Int, offset: Int): [Organization!]!
  }
  
  # Mutations for data management
  
  type Mutation {
    # Entity management
    createNode(id: ID!, type: String!, name: String!, tenantId: String): Node!
    updateNode(id: ID!, properties: String): Node!
    deleteNode(id: ID!): Boolean!
    
    createEdge(source: String!, target: String!, type: String!, tenantId: String): Edge!
    deleteEdge(id: ID!): Boolean!
    
    createHyperedge(type: String!, nodes: String!, tenantId: String): Hyperedge!
    deleteHyperedge(id: ID!): Boolean!
    
    # Organization management
    createOrganization(id: ID!, name: String!, type: String!): Organization!
    deleteOrganization(id: ID!): Boolean!
  }
`);
