/**
 * HyperGraphQL API Client
 * Frontend service for interacting with the HyperGraphQL backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;
const REST_ENDPOINT = `${API_BASE_URL}/api`;

/**
 * Execute a GraphQL query
 */
async function graphqlQuery(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }
    
    return result.data;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    throw error;
  }
}

/**
 * REST API helper
 */
async function restRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${REST_ENDPOINT}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('REST request failed:', error);
    throw error;
  }
}

// Entity Queries

export async function getNodes(filter = {}, limit = 100, offset = 0) {
  const query = `
    query GetNodes($filter: NodeFilter, $limit: Int, $offset: Int) {
      nodes(filter: $filter, limit: $limit, offset: $offset) {
        id
        type
        name
        properties {
          category
          description
          price
          rating
          availability
          imageUrl
        }
        tenantId
      }
    }
  `;
  
  const data = await graphqlQuery(query, { filter, limit, offset });
  return data.nodes;
}

export async function getNode(id) {
  const query = `
    query GetNode($id: ID!) {
      node(id: $id) {
        id
        type
        name
        properties {
          scientificName
          category
          description
          benefits
          price
          rating
          availability
          imageUrl
        }
        tenantId
      }
    }
  `;
  
  const data = await graphqlQuery(query, { id });
  return data.node;
}

export async function getNodesByType(type, tenantId = null) {
  return getNodes({ type, tenantId });
}

// Relation Queries

export async function getRelations(nodeId, tenantId = null) {
  const query = `
    query GetRelations($nodeId: ID!, $tenantId: String) {
      getRelations(nodeId: $nodeId, tenantId: $tenantId) {
        id
        source
        target
        type
        weight
      }
    }
  `;
  
  const data = await graphqlQuery(query, { nodeId, tenantId });
  return data.getRelations;
}

export async function getNeighbors(nodeId, tenantId = null) {
  const query = `
    query GetNeighbors($nodeId: ID!, $tenantId: String) {
      getNeighbors(nodeId: $nodeId, tenantId: $tenantId) {
        id
        type
        name
        properties {
          category
          description
        }
      }
    }
  `;
  
  const data = await graphqlQuery(query, { nodeId, tenantId });
  return data.getNeighbors;
}

// Hypergraph Navigation

export async function traverse(startNodeId, maxDepth = 3, tenantId = null) {
  const query = `
    query Traverse($startNodeId: ID!, $maxDepth: Int, $tenantId: String) {
      traverse(startNodeId: $startNodeId, maxDepth: $maxDepth, tenantId: $tenantId) {
        id
        type
        name
      }
    }
  `;
  
  const data = await graphqlQuery(query, { startNodeId, maxDepth, tenantId });
  return data.traverse;
}

export async function findPaths(sourceId, targetId, maxLength = 5, tenantId = null) {
  const query = `
    query FindPaths($sourceId: ID!, $targetId: ID!, $maxLength: Int, $tenantId: String) {
      findPaths(sourceId: $sourceId, targetId: $targetId, maxLength: $maxLength, tenantId: $tenantId) {
        nodes {
          id
          type
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
  `;
  
  const data = await graphqlQuery(query, { sourceId, targetId, maxLength, tenantId });
  return data.findPaths;
}

// Supply Chain Queries

export async function traceSupplyChain(productId, tenantId = null) {
  const query = `
    query TraceSupplyChain($productId: ID!, $tenantId: String) {
      traceSupplyChain(productId: $productId, tenantId: $tenantId) {
        product {
          id
          type
          name
        }
        ingredients {
          id
          type
          name
        }
        suppliers {
          id
          type
          name
        }
        path {
          length
          score
        }
      }
    }
  `;
  
  const data = await graphqlQuery(query, { productId, tenantId });
  return data.traceSupplyChain;
}

export async function recommendTreatments(customerId, tenantId = null) {
  const query = `
    query RecommendTreatments($customerId: ID!, $tenantId: String) {
      recommendTreatments(customerId: $customerId, tenantId: $tenantId) {
        id
        type
        name
        properties {
          description
          price
          rating
        }
      }
    }
  `;
  
  const data = await graphqlQuery(query, { customerId, tenantId });
  return data.recommendTreatments;
}

// Organization Queries

export async function getOrganization(id) {
  const query = `
    query GetOrganization($id: ID!) {
      organization(id: $id) {
        id
        name
        type
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
  `;
  
  const data = await graphqlQuery(query, { id });
  return data.organization;
}

export async function getOrganizations(limit = 100, offset = 0) {
  const query = `
    query GetOrganizations($limit: Int, $offset: Int) {
      organizations(limit: $limit, offset: $offset) {
        id
        name
        type
      }
    }
  `;
  
  const data = await graphqlQuery(query, { limit, offset });
  return data.organizations;
}

// REST API Methods

export async function getEntities(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return restRequest(`/entities?${queryString}`);
}

export async function getEntityById(id) {
  return restRequest(`/entities/${id}`);
}

export async function createEntity(entity) {
  return restRequest('/entities', {
    method: 'POST',
    body: JSON.stringify(entity),
  });
}

export async function syncData() {
  return restRequest('/sync', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getHealthStatus() {
  return restRequest('/health');
}

// Export all methods
export default {
  // Entity queries
  getNodes,
  getNode,
  getNodesByType,
  
  // Relation queries
  getRelations,
  getNeighbors,
  
  // Navigation
  traverse,
  findPaths,
  
  // Supply chain
  traceSupplyChain,
  recommendTreatments,
  
  // Organizations
  getOrganization,
  getOrganizations,
  
  // REST API
  getEntities,
  getEntityById,
  createEntity,
  syncData,
  getHealthStatus,
};
