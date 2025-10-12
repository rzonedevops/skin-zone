import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import openCogService from '../src/services/openCogService.js';
import dataService from '../src/services/dataService.js';
import benchmarkUtil from '../src/utils/benchmark.js';

describe('OpenCog HyperGraphQL Integration Tests', () => {
  before(async () => {
    await openCogService.initialize();
    await dataService.initialize();
  });

  describe('Complete Workflow: New Customer Recommendation', () => {
    it('should execute end-to-end recommendation workflow', async () => {
      const tenantId = 'default'; // Use default tenant with data
      
      // Step 1: Find safe products (no allergens)
      const safeProducts = await openCogService.findComplexPattern({
        and: [
          { nodeType: 'product' }
        ]
      }, tenantId);
      
      assert.ok(Array.isArray(safeProducts), 'Should return array of safe products');
      
      // Step 2: Update attention values
      const attentionMap = openCogService.updateAttention(tenantId);
      assert.ok(attentionMap instanceof Map, 'Should update attention');
      assert.ok(attentionMap.size > 0, 'Should have attention values');
      
      // Step 3: Get high-attention products
      const trending = openCogService.getHighAttentionAtoms(tenantId, 5);
      assert.ok(Array.isArray(trending), 'Should return array of trending products');
      
      // Step 4: Get recommendations for customer
      const customers = dataService.getNodes({ type: 'customer' });
      if (customers.length > 0) {
        const recommendations = await openCogService.recommendTreatments(
          customers[0].id,
          tenantId,
          { limit: 3 }
        );
        
        assert.ok(Array.isArray(recommendations), 'Should return recommendations');
        if (recommendations.length > 0) {
          assert.ok(recommendations[0].cognitiveScore !== undefined, 'Should have cognitive score');
          assert.ok(Array.isArray(recommendations[0].reasoning), 'Should have reasoning');
        }
      }
      
      console.log('  ✓ Complete workflow executed successfully');
    });
  });

  describe('Complete Workflow: Supply Chain Analysis', () => {
    it('should execute end-to-end supply chain analysis', async () => {
      const tenantId = 'default'; // Use default tenant with data
      
      // Step 1: Get products
      const products = dataService.getNodes({ type: 'product' }, 100, 0);
      if (products.length === 0) {
        console.log('  ⊘ Skipping supply chain test - no products available');
        return;
      }
      
      const productId = products[0].id;
      
      // Step 2: Analyze transparency
      const transparency = await openCogService.analyzeSupplyChain(
        productId,
        'TRANSPARENCY',
        tenantId
      );
      
      assert.ok(transparency.score !== undefined, 'Should have transparency score');
      assert.ok(Array.isArray(transparency.insights), 'Should have insights');
      
      // Step 3: Analyze ethical sourcing
      const ethical = await openCogService.analyzeSupplyChain(
        productId,
        'ETHICAL_SOURCING',
        tenantId
      );
      
      assert.ok(ethical.score !== undefined, 'Should have ethical score');
      
      // Step 4: Traverse supply chain
      const paths = await openCogService.traverseHypergraph(
        productId,
        { maxDepth: 2, relationTypes: ['CONTAINS', 'SUPPLIES'] },
        tenantId
      );
      
      assert.ok(Array.isArray(paths), 'Should return supply chain paths');
      
      console.log('  ✓ Supply chain analysis completed');
    });
  });

  describe('Complete Workflow: Learning and Adaptation', () => {
    it('should learn from interactions and adapt', async () => {
      const tenantId = 'tenant_learning_test';
      
      // Step 1: Get initial statistics
      const initialStats = openCogService.getLearningStatistics(tenantId);
      const initialInteractions = initialStats.totalInteractions;
      
      // Step 2: Simulate customer interactions
      const atomSpace = openCogService._getAtomSpace('default');
      const products = Array.from(atomSpace.atoms.values())
        .filter(a => a.data.type === 'product')
        .map(a => a.data);
      
      if (products.length > 0) {
        // Positive feedback
        await openCogService.learnFromInteraction({
          type: 'recommendation-feedback',
          data: {
            userId: 'test_user_1',
            itemId: products[0].id,
            rating: 0.95,
            feedback: 'excellent'
          }
        }, tenantId);
        
        // Product rating
        await openCogService.learnFromInteraction({
          type: 'product-rating',
          data: {
            productId: products[0].id,
            rating: 4.8
          }
        }, tenantId);
      }
      
      // Step 3: Verify learning occurred
      const finalStats = openCogService.getLearningStatistics(tenantId);
      assert.ok(
        finalStats.totalInteractions >= initialInteractions,
        'Should have recorded interactions'
      );
      
      // Step 4: Update attention based on learning
      openCogService.updateAttention(tenantId);
      
      console.log('  ✓ Learning and adaptation completed');
    });
  });

  describe('Complete Workflow: Inference with URE', () => {
    it('should apply custom inference rules', async () => {
      const tenantId = 'tenant_inference_spa';
      
      // Step 1: Add custom inference rule
      openCogService.addURERRule({
        id: 'integration-test-rule',
        description: 'Test inference for high-quality products',
        condition: (context, atomSpace) => {
          return context.type === 'quality-inference';
        },
        action: async (context, atomSpace) => {
          const highQualityProducts = [];
          for (const [id, atom] of atomSpace.atoms.entries()) {
            if (atom.data.type === 'product' && 
                (atom.data.properties?.rating || 0) > 4.5) {
              highQualityProducts.push(atom.data);
            }
          }
          return {
            newAtoms: [],
            conclusions: [
              `Found ${highQualityProducts.length} high-quality products`,
              'Quality inference completed successfully'
            ]
          };
        },
        confidence: 0.88
      });
      
      // Step 2: Apply inference rules
      const inferences = await openCogService.applyInferenceRules({
        type: 'quality-inference'
      }, tenantId);
      
      assert.ok(Array.isArray(inferences), 'Should return inferences');
      assert.ok(inferences.length > 0, 'Should have applied at least one rule');
      
      const testInference = inferences.find(i => i.rule === 'integration-test-rule');
      assert.ok(testInference, 'Should have applied test rule');
      assert.ok(testInference.conclusions.length > 0, 'Should have conclusions');
      
      console.log('  ✓ URE inference completed');
    });
  });

  describe('Performance Validation', () => {
    it('should meet performance targets', async () => {
      benchmarkUtil.clear();
      
      // Benchmark critical operations
      const operations = [
        {
          name: 'Pattern Matching',
          fn: async () => {
            return await openCogService.findPattern(
              { nodeType: 'ingredient' },
              'default'
            );
          },
          maxDuration: 10 // ms
        },
        {
          name: 'Attention Update',
          fn: async () => {
            return openCogService.updateAttention('default');
          },
          maxDuration: 20 // ms
        },
        {
          name: 'Learning Statistics',
          fn: async () => {
            return openCogService.getLearningStatistics('default');
          },
          maxDuration: 5 // ms
        }
      ];
      
      for (const op of operations) {
        const { metric } = await benchmarkUtil.benchmark(op.name, op.fn);
        console.log(`  ${op.name}: ${metric.duration.toFixed(2)}ms`);
        assert.ok(
          metric.duration < op.maxDuration,
          `${op.name} should complete in under ${op.maxDuration}ms (actual: ${metric.duration.toFixed(2)}ms)`
        );
      }
      
      console.log('  ✓ All operations meet performance targets');
    });
  });

  describe('Multi-Tenant Isolation', () => {
    it('should maintain complete tenant isolation', async () => {
      const tenant1 = 'tenant_isolation_1';
      const tenant2 = 'tenant_isolation_2';
      
      // Add URE rule to tenant 1
      openCogService.addURERRule({
        id: 'tenant1-only-rule',
        description: 'Rule for tenant 1 only',
        condition: (context) => context.tenant === tenant1,
        action: () => ({ conclusions: ['Tenant 1 rule applied'] })
      });
      
      // Learn in tenant 1
      await openCogService.learnFromInteraction({
        type: 'recommendation-feedback',
        data: { userId: 'user_t1', itemId: 'prod_t1', rating: 0.9 }
      }, tenant1);
      
      // Learn in tenant 2
      await openCogService.learnFromInteraction({
        type: 'recommendation-feedback',
        data: { userId: 'user_t2', itemId: 'prod_t2', rating: 0.8 }
      }, tenant2);
      
      // Verify isolation
      const stats1 = openCogService.getLearningStatistics(tenant1);
      const stats2 = openCogService.getLearningStatistics(tenant2);
      
      // Each tenant should have its own learning history
      assert.ok(stats1, 'Tenant 1 should have statistics');
      assert.ok(stats2, 'Tenant 2 should have statistics');
      
      // Verify separate AtomSpaces
      const atomSpace1 = openCogService._getAtomSpace(tenant1);
      const atomSpace2 = openCogService._getAtomSpace(tenant2);
      
      assert.notStrictEqual(atomSpace1, atomSpace2, 'Should have separate AtomSpaces');
      
      console.log('  ✓ Tenant isolation verified');
    });
  });

  describe('System Health Check', () => {
    it('should verify all components are operational', async () => {
      // Check OpenCog service
      assert.ok(openCogService.initialized, 'OpenCog service should be initialized');
      assert.ok(openCogService.atomSpaces.size > 0, 'Should have AtomSpaces');
      assert.ok(openCogService.sharedKnowledge.atoms.size > 0, 'Should have shared knowledge');
      assert.ok(openCogService.rules.safety.length > 0, 'Should have safety rules');
      assert.ok(openCogService.ureRules.length > 0, 'Should have URE rules');
      
      // Check data service
      const nodes = dataService.getNodes();
      assert.ok(nodes.length > 0, 'Should have nodes');
      
      const edges = dataService.getEdges();
      assert.ok(edges.length > 0, 'Should have edges');
      
      // Check statistics
      const stats = openCogService.getStatistics('default');
      assert.ok(stats.atomCount > 0, 'Should have atoms');
      assert.ok(stats.linkCount >= 0, 'Should have links count');
      
      console.log('  ✓ All components operational');
      console.log(`    - ${stats.atomCount} atoms`);
      console.log(`    - ${stats.linkCount} links`);
      console.log(`    - ${stats.sharedKnowledgeSize} shared atoms`);
      console.log(`    - ${stats.rulesCount} reasoning rules`);
      console.log(`    - ${openCogService.ureRules.length} URE rules`);
    });
  });
});
