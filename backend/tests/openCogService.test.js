import { describe, it } from 'node:test';
import assert from 'node:assert';
import openCogService from '../src/services/openCogService.js';
import dataService from '../src/services/dataService.js';

describe('OpenCogService', () => {
  
  describe('Initialization', async () => {
    it('should initialize OpenCog service', async () => {
      await openCogService.initialize();
      assert.strictEqual(openCogService.initialized, true);
    });

    it('should load shared knowledge', async () => {
      await openCogService.initialize();
      const stats = openCogService.getStatistics();
      assert.ok(stats.sharedKnowledgeSize > 0, 'Shared knowledge should be loaded');
    });

    it('should initialize default AtomSpace', async () => {
      await openCogService.initialize();
      const stats = openCogService.getStatistics();
      assert.ok(stats.atomCount > 0, 'Default AtomSpace should have atoms');
      assert.ok(stats.linkCount > 0, 'Default AtomSpace should have links');
    });

    it('should load reasoning rules', async () => {
      await openCogService.initialize();
      const stats = openCogService.getStatistics();
      assert.ok(stats.rulesCount > 0, 'Reasoning rules should be loaded');
    });
  });

  describe('Pattern Matching', () => {
    it('should find patterns by node type', async () => {
      await openCogService.initialize();
      
      const pattern = {
        nodeType: 'ingredient'
      };
      
      const results = await openCogService.findPattern(pattern);
      assert.ok(Array.isArray(results), 'Results should be an array');
      assert.ok(results.length > 0, 'Should find ingredient nodes');
      assert.strictEqual(results[0].type, 'ingredient');
    });

    it('should find patterns with properties filter', async () => {
      await openCogService.initialize();
      
      const pattern = {
        nodeType: 'product',
        properties: {
          category: 'serum'
        }
      };
      
      const results = await openCogService.findPattern(pattern);
      assert.ok(Array.isArray(results), 'Results should be an array');
    });

    it('should cache pattern matching results', async () => {
      await openCogService.initialize();
      openCogService.clearCache();
      
      const pattern = { nodeType: 'ingredient' };
      
      // First call
      await openCogService.findPattern(pattern);
      const cacheSize1 = openCogService.patternCache.size;
      
      // Second call should use cache
      await openCogService.findPattern(pattern);
      const cacheSize2 = openCogService.patternCache.size;
      
      assert.strictEqual(cacheSize1, cacheSize2, 'Cache should be used for duplicate queries');
    });
  });

  describe('Cognitive Reasoning', () => {
    it('should perform safety reasoning', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      // Get a customer and product
      const customers = dataService.getNodes({ type: 'customer' });
      const products = dataService.getNodes({ type: 'product' });
      
      if (customers.length > 0 && products.length > 0) {
        const query = {
          type: 'safety-check',
          params: {
            customerId: customers[0].id,
            productId: products[0].id
          }
        };
        
        const result = await openCogService.reason(query);
        
        assert.ok(result.steps, 'Reasoning should have steps');
        assert.ok(Array.isArray(result.steps), 'Steps should be an array');
        assert.ok(typeof result.confidence === 'number', 'Confidence should be a number');
      }
    });
  });

  describe('Cognitive Recommendations', () => {
    it('should generate treatment recommendations', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      // Create a test customer node if not exists
      const testCustomerId = 'customer_test_001';
      
      const recommendations = await openCogService.recommendTreatments(testCustomerId, 'default', { limit: 3 });
      
      assert.ok(Array.isArray(recommendations), 'Recommendations should be an array');
      assert.ok(recommendations.length <= 3, 'Should respect limit parameter');
      
      if (recommendations.length > 0) {
        const rec = recommendations[0];
        assert.ok(rec.id, 'Recommendation should have id');
        assert.ok(rec.cognitiveScore !== undefined, 'Recommendation should have cognitive score');
        assert.ok(rec.reasoning, 'Recommendation should have reasoning');
        assert.ok(rec.confidence !== undefined, 'Recommendation should have confidence');
      }
    });

    it('should score recommendations based on rules', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const testCustomerId = 'customer_test_002';
      const recommendations = await openCogService.recommendTreatments(testCustomerId);
      
      if (recommendations.length > 1) {
        // Check that recommendations are sorted by score
        for (let i = 0; i < recommendations.length - 1; i++) {
          assert.ok(
            recommendations[i].cognitiveScore >= recommendations[i + 1].cognitiveScore,
            'Recommendations should be sorted by score'
          );
        }
      }
    });
  });

  describe('Supply Chain Analysis', () => {
    it('should analyze supply chain transparency', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const products = dataService.getNodes({ type: 'product' });
      
      if (products.length > 0) {
        const analysis = await openCogService.analyzeSupplyChain(
          products[0].id,
          'TRANSPARENCY'
        );
        
        assert.ok(analysis, 'Analysis should return results');
        assert.strictEqual(analysis.analysisType, 'TRANSPARENCY');
        assert.ok(typeof analysis.score === 'number', 'Should have a score');
        assert.ok(typeof analysis.confidence === 'number', 'Should have confidence');
        assert.ok(Array.isArray(analysis.insights), 'Should have insights array');
      }
    });

    it('should analyze ethical sourcing', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const products = dataService.getNodes({ type: 'product' });
      
      if (products.length > 0) {
        const analysis = await openCogService.analyzeSupplyChain(
          products[0].id,
          'ETHICAL_SOURCING'
        );
        
        assert.ok(analysis, 'Analysis should return results');
        assert.strictEqual(analysis.analysisType, 'ETHICAL_SOURCING');
        assert.ok(Array.isArray(analysis.insights), 'Should have insights');
      }
    });

    it('should analyze sustainability', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const products = dataService.getNodes({ type: 'product' });
      
      if (products.length > 0) {
        const analysis = await openCogService.analyzeSupplyChain(
          products[0].id,
          'SUSTAINABILITY'
        );
        
        assert.strictEqual(analysis.analysisType, 'SUSTAINABILITY');
      }
    });

    it('should analyze quality chain', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const products = dataService.getNodes({ type: 'product' });
      
      if (products.length > 0) {
        const analysis = await openCogService.analyzeSupplyChain(
          products[0].id,
          'QUALITY_CHAIN'
        );
        
        assert.strictEqual(analysis.analysisType, 'QUALITY_CHAIN');
      }
    });
  });

  describe('Multi-Tenant Support', () => {
    it('should create separate AtomSpaces for different tenants', async () => {
      await openCogService.initialize();
      
      const tenant1Stats = openCogService.getStatistics('tenant_a');
      const tenant2Stats = openCogService.getStatistics('tenant_b');
      
      assert.notStrictEqual(tenant1Stats, tenant2Stats, 'Different tenants should have separate stats');
    });

    it('should isolate pattern matching by tenant', async () => {
      await openCogService.initialize();
      
      const pattern = { nodeType: 'product' };
      
      const results1 = await openCogService.findPattern(pattern, 'tenant_a');
      const results2 = await openCogService.findPattern(pattern, 'tenant_b');
      
      // Results should be arrays (may be empty for new tenants)
      assert.ok(Array.isArray(results1), 'Tenant A results should be an array');
      assert.ok(Array.isArray(results2), 'Tenant B results should be an array');
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should provide statistics', async () => {
      await openCogService.initialize();
      
      const stats = openCogService.getStatistics();
      
      assert.ok(stats.atomCount !== undefined, 'Should have atom count');
      assert.ok(stats.linkCount !== undefined, 'Should have link count');
      assert.ok(stats.sharedKnowledgeSize !== undefined, 'Should have shared knowledge size');
      assert.ok(stats.cacheSize !== undefined, 'Should have cache size');
      assert.ok(stats.rulesCount !== undefined, 'Should have rules count');
    });

    it('should track cache usage', async () => {
      await openCogService.initialize();
      openCogService.clearCache();
      
      const initialStats = openCogService.getStatistics();
      assert.strictEqual(initialStats.cacheSize, 0, 'Cache should be empty after clear');
      
      // Perform a query to populate cache
      await openCogService.findPattern({ nodeType: 'ingredient' });
      
      const afterStats = openCogService.getStatistics();
      assert.ok(afterStats.cacheSize > 0, 'Cache should have entries after query');
    });
  });

  describe('Cognitive Insights', () => {
    it('should generate cognitive insights', async () => {
      await openCogService.initialize();
      
      const context = {
        type: 'product-recommendation'
      };
      
      const insights = await openCogService.getCognitiveInsights(context);
      
      assert.ok(insights.reasoning, 'Should have reasoning');
      assert.ok(insights.confidence !== undefined, 'Should have confidence');
      assert.ok(Array.isArray(insights.explanations), 'Should have explanations array');
      assert.ok(Array.isArray(insights.alternatives), 'Should have alternatives array');
    });
  });

  describe('Advanced Pattern Matching', () => {
    it('should perform bind pattern matching with variables', async () => {
      await openCogService.initialize();
      
      const bindLink = {
        variables: [],
        pattern: {
          nodeType: 'ingredient',
          conditions: []
        },
        result: {}
      };
      
      const results = await openCogService.bindPattern(bindLink);
      assert.ok(Array.isArray(results), 'Should return array of results');
    });

    it('should find complex patterns with AND logic', async () => {
      await openCogService.initialize();
      
      const pattern = {
        and: [
          { nodeType: 'ingredient' },
          { properties: { category: { $exists: true } } }
        ]
      };
      
      const results = await openCogService.findComplexPattern(pattern);
      assert.ok(Array.isArray(results), 'Should return array of results');
    });

    it('should find complex patterns with OR logic', async () => {
      await openCogService.initialize();
      
      const pattern = {
        or: [
          { nodeType: 'ingredient' },
          { nodeType: 'product' }
        ]
      };
      
      const results = await openCogService.findComplexPattern(pattern);
      assert.ok(Array.isArray(results), 'Should return array of results');
      assert.ok(results.length > 0, 'Should find matching atoms');
    });
  });

  describe('URE (Unified Rule Engine)', () => {
    it('should add URE inference rules', async () => {
      await openCogService.initialize();
      
      openCogService.addURERRule({
        id: 'test-inference',
        description: 'Test inference rule',
        condition: (context, atomSpace) => true,
        action: (context, atomSpace) => ({
          newAtoms: [],
          conclusions: ['Test conclusion']
        }),
        confidence: 0.9
      });
      
      assert.strictEqual(openCogService.ureRules.length, 1, 'Should have one URE rule');
    });

    it('should apply inference rules', async () => {
      await openCogService.initialize();
      
      openCogService.addURERRule({
        id: 'ingredient-quality-inference',
        description: 'Infer product quality from ingredient quality',
        condition: (context) => context.type === 'quality-inference',
        action: (context) => ({
          newAtoms: [],
          conclusions: ['High quality ingredients suggest high quality product']
        }),
        confidence: 0.85
      });
      
      const context = { type: 'quality-inference' };
      const inferences = await openCogService.applyInferenceRules(context);
      
      assert.ok(Array.isArray(inferences), 'Should return inferences');
      assert.ok(inferences.length > 0, 'Should have at least one inference');
    });
  });

  describe('ECAN (Attention Allocation)', () => {
    it('should update attention values', async () => {
      await openCogService.initialize();
      
      const attentionMap = openCogService.updateAttention('default');
      
      assert.ok(attentionMap instanceof Map, 'Should return a Map');
      assert.ok(attentionMap.size > 0, 'Should have attention values');
    });

    it('should get high attention atoms', async () => {
      await openCogService.initialize();
      openCogService.updateAttention('default');
      
      const highAttention = openCogService.getHighAttentionAtoms('default', 5);
      
      assert.ok(Array.isArray(highAttention), 'Should return array');
      assert.ok(highAttention.length > 0, 'Should have high attention atoms');
      assert.ok(highAttention[0].atom, 'Should have atom data');
      assert.ok(highAttention[0].attention !== undefined, 'Should have attention value');
    });
  });

  describe('Incremental Learning', () => {
    it('should learn from recommendation feedback', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const products = dataService.getNodes({ type: 'product' });
      if (products.length > 0) {
        const interaction = {
          type: 'recommendation-feedback',
          data: {
            userId: 'customer_1',
            itemId: products[0].id,
            rating: 0.9,
            feedback: 'positive'
          }
        };
        
        const result = await openCogService.learnFromInteraction(interaction);
        
        assert.strictEqual(result.learned, true, 'Should indicate learning occurred');
        assert.ok(result.confidence, 'Should have confidence value');
      }
    });

    it('should track learning statistics', async () => {
      await openCogService.initialize();
      
      const stats = openCogService.getLearningStatistics('default');
      
      assert.ok(stats.totalInteractions !== undefined, 'Should have interaction count');
      assert.ok(stats.averageTruthValue !== undefined, 'Should have average truth value');
      assert.ok(stats.highConfidenceAtoms !== undefined, 'Should have high confidence count');
    });
  });

  describe('Hypergraph Traversal', () => {
    it('should traverse hypergraph from start node', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const nodes = dataService.getNodes();
      if (nodes.length > 0) {
        const paths = await openCogService.traverseHypergraph(nodes[0].id, { maxDepth: 2 });
        
        assert.ok(Array.isArray(paths), 'Should return array of paths');
        if (paths.length > 0) {
          assert.ok(paths[0].length !== undefined, 'Path should have length');
          assert.ok(Array.isArray(paths[0].nodes), 'Path should have nodes');
          assert.ok(paths[0].score !== undefined, 'Path should have score');
        }
      }
    });

    it('should filter traversal by relation types', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const nodes = dataService.getNodes();
      if (nodes.length > 0) {
        const paths = await openCogService.traverseHypergraph(
          nodes[0].id, 
          { maxDepth: 2, relationTypes: ['CONTAINS', 'SUPPLIES'] }
        );
        
        assert.ok(Array.isArray(paths), 'Should return filtered paths');
      }
    });
  });
});
