import express from 'express';
import dataService from '../services/dataService.js';

const router = express.Router();

/**
 * REST API endpoints for GitHub sync and org management
 */

// GET /api/health - Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HyperGraphQL API',
    version: '1.0.0'
  });
});

// GET /api/entities - Get all entities
router.get('/entities', (req, res) => {
  const { type, tenantId, limit = 100, offset = 0 } = req.query;
  const filter = {};
  
  if (type) filter.type = type;
  if (tenantId) filter.tenantId = tenantId;
  
  const entities = dataService.getNodes(filter, parseInt(limit), parseInt(offset));
  res.json({
    data: entities,
    count: entities.length,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// GET /api/entities/:id - Get entity by ID
router.get('/entities/:id', (req, res) => {
  const entity = dataService.getNode(req.params.id);
  if (!entity) {
    return res.status(404).json({ error: 'Entity not found' });
  }
  res.json(entity);
});

// POST /api/entities - Create entity
router.post('/entities', express.json(), (req, res) => {
  const { id, type, name, tenantId } = req.body;
  
  if (!id || !type || !name) {
    return res.status(400).json({ error: 'Missing required fields: id, type, name' });
  }
  
  const entity = dataService.createNode(id, type, name, tenantId);
  res.status(201).json(entity);
});

// GET /api/relations - Get all relations
router.get('/relations', (req, res) => {
  const { source, target, tenantId, limit = 100, offset = 0 } = req.query;
  const filter = {};
  
  if (source) filter.source = source;
  if (target) filter.target = target;
  if (tenantId) filter.tenantId = tenantId;
  
  const relations = dataService.getEdges(filter, parseInt(limit), parseInt(offset));
  res.json({
    data: relations,
    count: relations.length,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// POST /api/relations - Create relation
router.post('/relations', express.json(), (req, res) => {
  const { source, target, type, tenantId } = req.body;
  
  if (!source || !target || !type) {
    return res.status(400).json({ error: 'Missing required fields: source, target, type' });
  }
  
  const relation = dataService.createEdge(source, target, type, tenantId);
  res.status(201).json(relation);
});

// GET /api/orgs - Get all organizations
router.get('/orgs', (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const orgs = dataService.getOrganizations(parseInt(limit), parseInt(offset));
  res.json({
    data: orgs,
    count: orgs.length,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// GET /api/orgs/:id - Get organization by ID
router.get('/orgs/:id', (req, res) => {
  const org = dataService.getOrganization(req.params.id);
  res.json(org);
});

// POST /api/sync - Sync data from GitHub (placeholder)
router.post('/sync', express.json(), (req, res) => {
  // This would integrate with GitHub API to sync repo structure
  // For now, just reload the data
  dataService.initialize()
    .then(() => {
      res.json({
        status: 'success',
        message: 'Data synchronized',
        nodes: dataService.nodes.size,
        edges: dataService.edges.size
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    });
});

// GET /api/trace/:productId - Trace supply chain
router.get('/trace/:productId', (req, res) => {
  const { tenantId } = req.query;
  const trace = dataService.traceSupplyChain(req.params.productId, tenantId);
  
  if (!trace) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(trace);
});

export default router;
