import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * DataService - Manages hypergraph data from JSON files and entity folders
 * Supports org-aware data management and GitHub repo structure mapping
 */
class DataService {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.hyperedges = new Map();
    this.organizations = new Map();
    this.initialized = false;
  }

  /**
   * Initialize data from hypergraph_data.json and entity files
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Load main hypergraph data
      const dataPath = path.join(__dirname, '../../../hypergraph_data.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Load nodes
      data.nodes.forEach(node => {
        this.nodes.set(node.id, {
          ...node,
          properties: this._extractNodeProperties(node),
          tenantId: node.tenantId || 'default',
          embedding: node.embedding || []
        });
      });
      
      // Load edges
      data.edges.forEach((edge, index) => {
        const edgeId = `edge_${index}`;
        this.edges.set(edgeId, {
          id: edgeId,
          source: edge.source,
          target: edge.target,
          type: edge.type || 'RELATED_TO',
          weight: edge.weight || 1.0,
          properties: edge.properties || {},
          tenantId: edge.tenantId || 'default'
        });
      });
      
      // Load entity files from entities/ directory (if exist)
      await this._loadEntityFiles();
      
      this.initialized = true;
      console.log(`Data initialized: ${this.nodes.size} nodes, ${this.edges.size} edges`);
    } catch (error) {
      console.error('Error initializing data:', error);
      throw error;
    }
  }

  /**
   * Extract node properties from node data
   */
  _extractNodeProperties(node) {
    const properties = { ...node };
    delete properties.id;
    delete properties.type;
    delete properties.name;
    delete properties.tenantId;
    delete properties.embedding;
    return properties;
  }

  /**
   * Load entity files from entities/ directory
   * Maps GitHub repo folders to hypergraph structure
   */
  async _loadEntityFiles() {
    const entitiesPath = path.join(__dirname, '../../../entities');
    if (!fs.existsSync(entitiesPath)) return;
    
    const files = fs.readdirSync(entitiesPath);
    // Entity files are markdown - can be parsed for additional data
    // For now, we just log that they exist
    console.log(`Found ${files.length} entity files`);
  }

  /**
   * Get node by ID
   */
  getNode(id) {
    return this.nodes.get(id);
  }

  /**
   * Get nodes with filtering
   */
  getNodes(filter = {}, limit = 100, offset = 0) {
    let nodes = Array.from(this.nodes.values());
    
    // Apply filters
    if (filter.type) {
      nodes = nodes.filter(n => n.type === filter.type);
    }
    if (filter.name) {
      nodes = nodes.filter(n => n.name.toLowerCase().includes(filter.name.toLowerCase()));
    }
    if (filter.tenantId) {
      nodes = nodes.filter(n => n.tenantId === filter.tenantId);
    }
    if (filter.category) {
      nodes = nodes.filter(n => n.properties?.category === filter.category);
    }
    
    // Apply pagination
    return nodes.slice(offset, offset + limit);
  }

  /**
   * Get edge by ID
   */
  getEdge(id) {
    return this.edges.get(id);
  }

  /**
   * Get edges with filtering
   */
  getEdges(filter = {}, limit = 100, offset = 0) {
    let edges = Array.from(this.edges.values());
    
    // Apply filters
    if (filter.type) {
      edges = edges.filter(e => e.type === filter.type);
    }
    if (filter.source) {
      edges = edges.filter(e => e.source === filter.source);
    }
    if (filter.target) {
      edges = edges.filter(e => e.target === filter.target);
    }
    if (filter.tenantId) {
      edges = edges.filter(e => e.tenantId === filter.tenantId);
    }
    
    // Apply pagination
    return edges.slice(offset, offset + limit);
  }

  /**
   * Get hyperedge by ID
   */
  getHyperedge(id) {
    return this.hyperedges.get(id);
  }

  /**
   * Get hyperedges with filtering
   */
  getHyperedges(filter = {}, limit = 100, offset = 0) {
    let hyperedges = Array.from(this.hyperedges.values());
    
    if (filter.type) {
      hyperedges = hyperedges.filter(h => h.type === filter.type);
    }
    if (filter.tenantId) {
      hyperedges = hyperedges.filter(h => h.tenantId === filter.tenantId);
    }
    
    return hyperedges.slice(offset, offset + limit);
  }

  /**
   * Get all relations (edges) for a node
   */
  getRelations(nodeId, tenantId = null) {
    let edges = Array.from(this.edges.values()).filter(
      e => e.source === nodeId || e.target === nodeId
    );
    
    if (tenantId) {
      edges = edges.filter(e => e.tenantId === tenantId);
    }
    
    return edges;
  }

  /**
   * Get neighbor nodes
   */
  getNeighbors(nodeId, tenantId = null) {
    const relations = this.getRelations(nodeId, tenantId);
    const neighborIds = new Set();
    
    relations.forEach(edge => {
      if (edge.source === nodeId) neighborIds.add(edge.target);
      if (edge.target === nodeId) neighborIds.add(edge.source);
    });
    
    return Array.from(neighborIds)
      .map(id => this.getNode(id))
      .filter(node => node !== undefined);
  }

  /**
   * Traverse graph from starting node
   */
  traverse(startNodeId, maxDepth = 3, tenantId = null) {
    const visited = new Set();
    const result = [];
    
    const dfs = (nodeId, depth) => {
      if (depth > maxDepth || visited.has(nodeId)) return;
      
      visited.add(nodeId);
      const node = this.getNode(nodeId);
      if (node && (!tenantId || node.tenantId === tenantId)) {
        result.push(node);
      }
      
      const neighbors = this.getNeighbors(nodeId, tenantId);
      neighbors.forEach(neighbor => {
        dfs(neighbor.id, depth + 1);
      });
    };
    
    dfs(startNodeId, 0);
    return result;
  }

  /**
   * Find paths between two nodes using BFS
   */
  findPaths(sourceId, targetId, maxLength = 5, tenantId = null) {
    const paths = [];
    const queue = [[sourceId, [sourceId], []]];
    const visited = new Set();
    
    while (queue.length > 0) {
      const [currentId, nodePath, edgePath] = queue.shift();
      
      if (nodePath.length > maxLength) continue;
      if (currentId === targetId) {
        const nodes = nodePath.map(id => this.getNode(id)).filter(n => n);
        paths.push({
          nodes,
          edges: edgePath,
          length: nodePath.length - 1,
          score: 1.0 / nodePath.length
        });
        continue;
      }
      
      const stateKey = `${currentId}_${nodePath.length}`;
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);
      
      const relations = this.getRelations(currentId, tenantId);
      relations.forEach(edge => {
        const nextId = edge.source === currentId ? edge.target : edge.source;
        if (!nodePath.includes(nextId)) {
          queue.push([nextId, [...nodePath, nextId], [...edgePath, edge]]);
        }
      });
    }
    
    return paths.slice(0, 10); // Return top 10 paths
  }

  /**
   * Trace supply chain for a product
   */
  traceSupplyChain(productId, tenantId = null) {
    const product = this.getNode(productId);
    if (!product) return null;
    
    const ingredients = [];
    const suppliers = [];
    const allNodes = [];
    
    // Find ingredients
    const productEdges = this.getRelations(productId, tenantId);
    productEdges.forEach(edge => {
      const relatedId = edge.source === productId ? edge.target : edge.source;
      const relatedNode = this.getNode(relatedId);
      
      if (relatedNode?.type === 'ingredient') {
        ingredients.push(relatedNode);
        allNodes.push(relatedNode);
        
        // Find suppliers for this ingredient
        const ingredientEdges = this.getRelations(relatedId, tenantId);
        ingredientEdges.forEach(ie => {
          const supplierId = ie.source === relatedId ? ie.target : ie.source;
          const supplierNode = this.getNode(supplierId);
          if (supplierNode?.type === 'supplier') {
            suppliers.push(supplierNode);
            allNodes.push(supplierNode);
          }
        });
      }
    });
    
    return {
      product,
      ingredients,
      suppliers,
      path: {
        nodes: [product, ...allNodes],
        edges: productEdges,
        length: allNodes.length,
        score: 1.0
      }
    };
  }

  /**
   * Create a new node
   */
  createNode(id, type, name, tenantId = 'default') {
    const node = {
      id,
      type,
      name,
      properties: {},
      tenantId,
      embedding: []
    };
    this.nodes.set(id, node);
    return node;
  }

  /**
   * Create a new edge
   */
  createEdge(source, target, type, tenantId = 'default') {
    const edgeId = `edge_${this.edges.size}`;
    const edge = {
      id: edgeId,
      source,
      target,
      type,
      weight: 1.0,
      properties: {},
      tenantId
    };
    this.edges.set(edgeId, edge);
    return edge;
  }

  /**
   * Get organization data
   */
  getOrganization(id) {
    // Get all entities for this org
    const entities = this.getNodes({ tenantId: id });
    const relations = this.getEdges({ tenantId: id });
    const hyperedges = this.getHyperedges({ tenantId: id });
    
    return {
      id,
      name: id,
      type: 'organization',
      entities,
      relations,
      hyperedges
    };
  }

  /**
   * Get all organizations
   */
  getOrganizations(limit = 100, offset = 0) {
    const tenantIds = new Set();
    this.nodes.forEach(node => tenantIds.add(node.tenantId));
    
    return Array.from(tenantIds)
      .slice(offset, offset + limit)
      .map(id => this.getOrganization(id));
  }
}

// Singleton instance
const dataService = new DataService();

export default dataService;
