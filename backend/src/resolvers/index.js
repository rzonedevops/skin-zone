import dataService from '../services/dataService.js';

/**
 * GraphQL Resolvers for HyperGraphQL API
 * Implements org-aware queries and hypergraph navigation
 */
export const resolvers = {
  // Entity queries
  node: ({ id }) => {
    return dataService.getNode(id);
  },

  nodes: ({ filter, limit = 100, offset = 0 }) => {
    return dataService.getNodes(filter || {}, limit, offset);
  },

  edge: ({ id }) => {
    return dataService.getEdge(id);
  },

  edges: ({ filter, limit = 100, offset = 0 }) => {
    return dataService.getEdges(filter || {}, limit, offset);
  },

  hyperedge: ({ id }) => {
    return dataService.getHyperedge(id);
  },

  hyperedges: ({ filter, limit = 100, offset = 0 }) => {
    return dataService.getHyperedges(filter || {}, limit, offset);
  },

  // Relation queries
  getRelations: ({ nodeId, tenantId }) => {
    return dataService.getRelations(nodeId, tenantId);
  },

  getNeighbors: ({ nodeId, tenantId }) => {
    return dataService.getNeighbors(nodeId, tenantId);
  },

  // Hypergraph navigation
  traverse: ({ startNodeId, maxDepth = 3, tenantId }) => {
    return dataService.traverse(startNodeId, maxDepth, tenantId);
  },

  findPaths: ({ sourceId, targetId, maxLength = 5, tenantId }) => {
    return dataService.findPaths(sourceId, targetId, maxLength, tenantId);
  },

  // Supply chain queries
  traceSupplyChain: ({ productId, tenantId }) => {
    return dataService.traceSupplyChain(productId, tenantId);
  },

  recommendTreatments: ({ customerId, tenantId }) => {
    // Simple recommendation based on neighbors
    const neighbors = dataService.getNeighbors(customerId, tenantId);
    return neighbors.filter(n => n.type === 'service' || n.type === 'treatment');
  },

  // Organization queries
  organization: ({ id }) => {
    return dataService.getOrganization(id);
  },

  organizations: ({ limit = 100, offset = 0 }) => {
    return dataService.getOrganizations(limit, offset);
  },

  // Mutations
  createNode: ({ id, type, name, tenantId }) => {
    return dataService.createNode(id, type, name, tenantId);
  },

  updateNode: ({ id, properties }) => {
    const node = dataService.getNode(id);
    if (!node) throw new Error('Node not found');
    
    // Parse properties JSON string if provided
    if (properties) {
      const props = JSON.parse(properties);
      Object.assign(node.properties, props);
    }
    return node;
  },

  deleteNode: ({ id }) => {
    return dataService.nodes.delete(id);
  },

  createEdge: ({ source, target, type, tenantId }) => {
    return dataService.createEdge(source, target, type, tenantId);
  },

  deleteEdge: ({ id }) => {
    return dataService.edges.delete(id);
  },

  createHyperedge: ({ type, nodes, tenantId }) => {
    // Parse nodes JSON string
    const nodesList = JSON.parse(nodes);
    const hyperedgeId = `hyperedge_${dataService.hyperedges.size}`;
    
    const hyperedge = {
      id: hyperedgeId,
      type,
      nodes: nodesList,
      attributes: {},
      tenantId: tenantId || 'default',
      embedding: []
    };
    
    dataService.hyperedges.set(hyperedgeId, hyperedge);
    return hyperedge;
  },

  deleteHyperedge: ({ id }) => {
    return dataService.hyperedges.delete(id);
  },

  createOrganization: ({ id, name, type }) => {
    return {
      id,
      name,
      type,
      entities: [],
      relations: [],
      hyperedges: []
    };
  },

  deleteOrganization: ({ id }) => {
    // In a real implementation, this would cascade delete all related entities
    return true;
  }
};
