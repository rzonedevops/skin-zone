import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import dataService from '../src/services/dataService.js';

describe('DataService', () => {
  before(async () => {
    // Initialize data service before tests
    await dataService.initialize();
  });

  describe('Node Operations', () => {
    it('should load nodes from hypergraph_data.json', () => {
      const nodes = dataService.getNodes();
      assert.ok(nodes.length > 0, 'Should have loaded nodes');
      assert.ok(nodes[0].id, 'Nodes should have IDs');
      assert.ok(nodes[0].type, 'Nodes should have types');
      assert.ok(nodes[0].name, 'Nodes should have names');
    });

    it('should get node by ID', () => {
      const node = dataService.getNode('hyaluronic_acid');
      assert.ok(node, 'Should find the node');
      assert.strictEqual(node.id, 'hyaluronic_acid');
      assert.strictEqual(node.type, 'ingredient');
    });

    it('should filter nodes by type', () => {
      const ingredients = dataService.getNodes({ type: 'ingredient' });
      assert.ok(ingredients.length > 0, 'Should have ingredients');
      ingredients.forEach(node => {
        assert.strictEqual(node.type, 'ingredient');
      });
    });

    it('should filter nodes by name', () => {
      const results = dataService.getNodes({ name: 'acid' });
      assert.ok(results.length > 0, 'Should find nodes with "acid" in name');
      results.forEach(node => {
        assert.ok(node.name.toLowerCase().includes('acid'));
      });
    });

    it('should create a new node', () => {
      const newNode = dataService.createNode('test_123', 'ingredient', 'Test Ingredient');
      assert.ok(newNode, 'Should create node');
      assert.strictEqual(newNode.id, 'test_123');
      assert.strictEqual(newNode.type, 'ingredient');
      assert.strictEqual(newNode.name, 'Test Ingredient');
      
      // Clean up
      dataService.nodes.delete('test_123');
    });
  });

  describe('Edge Operations', () => {
    it('should load edges from hypergraph_data.json', () => {
      const edges = dataService.getEdges();
      assert.ok(edges.length > 0, 'Should have loaded edges');
      assert.ok(edges[0].source, 'Edges should have source');
      assert.ok(edges[0].target, 'Edges should have target');
    });

    it('should get relations for a node', () => {
      const relations = dataService.getRelations('hyaluronic_acid');
      assert.ok(relations.length > 0, 'Should have relations');
      relations.forEach(edge => {
        assert.ok(
          edge.source === 'hyaluronic_acid' || edge.target === 'hyaluronic_acid',
          'Relations should involve the specified node'
        );
      });
    });

    it('should create a new edge', () => {
      const newEdge = dataService.createEdge('test_source', 'test_target', 'TEST_RELATION');
      assert.ok(newEdge, 'Should create edge');
      assert.strictEqual(newEdge.source, 'test_source');
      assert.strictEqual(newEdge.target, 'test_target');
      assert.strictEqual(newEdge.type, 'TEST_RELATION');
      
      // Clean up
      dataService.edges.delete(newEdge.id);
    });
  });

  describe('Graph Navigation', () => {
    it('should get neighbors of a node', () => {
      const neighbors = dataService.getNeighbors('hyaluronic_acid');
      assert.ok(neighbors.length > 0, 'Should have neighbors');
      neighbors.forEach(neighbor => {
        assert.ok(neighbor.id, 'Neighbors should have IDs');
        assert.ok(neighbor.type, 'Neighbors should have types');
      });
    });

    it('should traverse graph from starting node', () => {
      const visited = dataService.traverse('hyaluronic_acid', 2);
      assert.ok(visited.length > 0, 'Should visit nodes');
      assert.ok(
        visited.some(n => n.id === 'hyaluronic_acid'),
        'Should include starting node'
      );
    });

    it('should find paths between nodes', () => {
      const paths = dataService.findPaths('hyaluronic_acid', 'humectant', 3);
      assert.ok(paths.length > 0, 'Should find at least one path');
      paths.forEach(path => {
        assert.ok(path.nodes.length >= 2, 'Path should have at least 2 nodes');
        assert.strictEqual(path.nodes[0].id, 'hyaluronic_acid', 'Path should start at source');
        assert.strictEqual(
          path.nodes[path.nodes.length - 1].id,
          'humectant',
          'Path should end at target'
        );
      });
    });
  });

  describe('Organization Support', () => {
    it('should filter by tenantId', () => {
      // Create test nodes with different tenants
      dataService.createNode('tenant1_node', 'test', 'Tenant 1', 'tenant_1');
      dataService.createNode('tenant2_node', 'test', 'Tenant 2', 'tenant_2');
      
      const tenant1Nodes = dataService.getNodes({ tenantId: 'tenant_1' });
      assert.ok(
        tenant1Nodes.every(n => n.tenantId === 'tenant_1'),
        'Should only return tenant_1 nodes'
      );
      
      // Clean up
      dataService.nodes.delete('tenant1_node');
      dataService.nodes.delete('tenant2_node');
    });

    it('should get organization data', () => {
      const org = dataService.getOrganization('default');
      assert.ok(org, 'Should return organization');
      assert.strictEqual(org.id, 'default');
      assert.ok(Array.isArray(org.entities), 'Should have entities array');
      assert.ok(Array.isArray(org.relations), 'Should have relations array');
    });
  });
});
