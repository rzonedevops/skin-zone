import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import openCogService from '../src/services/openCogService.js';
import knowledgeTransferService from '../src/services/knowledgeTransferService.js';
import persistenceService from '../src/services/persistenceService.js';
import dataService from '../src/services/dataService.js';

describe('Enhanced OpenCog Features', () => {
  before(async () => {
    await dataService.initialize();
    await openCogService.initialize();
  });

  describe('Persistence Service', () => {
    it('should initialize persistence service', async () => {
      const stats = persistenceService.getStatistics();
      assert.ok(stats, 'Should return statistics');
      assert.ok(stats.persistenceDir, 'Should have persistence directory');
      assert.strictEqual(typeof stats.redisAvailable, 'boolean', 'Should have Redis availability status');
    });

    it('should save and load AtomSpace', async () => {
      const testTenantId = 'test_persistence_tenant';
      
      // Create a test AtomSpace
      await openCogService.findPattern({ nodeType: 'ingredient' }, testTenantId);
      
      // Save it
      const saveResult = await openCogService.persistAtomSpace(testTenantId);
      assert.ok(saveResult, 'Should return save result');
      assert.strictEqual(saveResult.tenantId, testTenantId);
      assert.ok(saveResult.timestamp, 'Should have timestamp');
      
      // Load it back
      const loadedAtomSpace = await persistenceService.loadAtomSpace(testTenantId);
      assert.ok(loadedAtomSpace, 'Should load AtomSpace');
      assert.ok(loadedAtomSpace.atoms, 'Should have atoms');
    });

    it('should create snapshot of all AtomSpaces', async () => {
      const snapshot = await openCogService.persistAllAtomSpaces();
      assert.ok(snapshot, 'Should return snapshot');
      assert.ok(snapshot.snapshotId, 'Should have snapshot ID');
      assert.ok(snapshot.timestamp, 'Should have timestamp');
      assert.ok(snapshot.tenantCount >= 0, 'Should have tenant count');
    });

    it('should list persisted AtomSpaces', async () => {
      const tenantIds = await persistenceService.listPersistedAtomSpaces();
      assert.ok(Array.isArray(tenantIds), 'Should return array');
    });
  });

  describe('Knowledge Transfer Service', () => {
    it('should initialize knowledge transfer service', () => {
      const stats = knowledgeTransferService.getStatistics();
      assert.ok(stats, 'Should return statistics');
      assert.ok(stats.totalTransfers >= 0, 'Should have transfer count');
      assert.ok(stats.activePolicies >= 0, 'Should have policy count');
    });

    it('should set transfer policy', () => {
      const policy = {
        minConfidence: 0.9,
        minOccurrences: 5,
        excludePatterns: ['private_*'],
        allowedTypes: ['ingredient', 'product']
      };
      
      knowledgeTransferService.setTransferPolicy('test_tenant', policy);
      assert.ok(true, 'Should set policy without error');
    });

    it('should extract transferable knowledge', () => {
      const atomSpace = openCogService._getAtomSpace('default');
      const transferable = knowledgeTransferService.extractTransferableKnowledge(
        atomSpace,
        'default'
      );
      
      assert.ok(Array.isArray(transferable), 'Should return array');
    });

    it('should perform federated learning', async () => {
      // Create some test tenants
      const tenant1 = 'test_federated_1';
      const tenant2 = 'test_federated_2';
      
      // Ensure they have some data
      await openCogService.findPattern({ nodeType: 'ingredient' }, tenant1);
      await openCogService.findPattern({ nodeType: 'ingredient' }, tenant2);
      
      // Perform federated learning
      const result = await openCogService.performFederatedLearning([tenant1, tenant2]);
      
      assert.ok(result, 'Should return result');
      assert.ok(typeof result.aggregatedPatterns === 'number', 'Should have pattern count');
      assert.ok(result.tenantUpdates, 'Should have tenant updates');
      assert.ok(result.timestamp, 'Should have timestamp');
    });
  });

  describe('Advanced Reasoning', () => {
    it('should perform advanced multi-step reasoning', async () => {
      const query = {
        pattern: { nodeType: 'ingredient' }
      };
      
      const result = await openCogService.advancedReasoning(query, 'default', {
        maxDepth: 2,
        minConfidence: 0.5
      });
      
      assert.ok(result, 'Should return result');
      assert.ok(Array.isArray(result.steps), 'Should have steps');
      assert.ok(Array.isArray(result.conclusions), 'Should have conclusions');
      assert.ok(typeof result.confidence === 'number', 'Should have confidence');
      assert.ok(result.query, 'Should have query');
    });

    it('should explain reasoning for an atom', async () => {
      // Find an atom first
      const patterns = await openCogService.findPattern({ nodeType: 'ingredient' }, 'default');
      
      if (patterns.length > 0) {
        const atomId = patterns[0].id;
        const explanation = openCogService.explainReasoning(atomId, 'default');
        
        assert.ok(explanation, 'Should return explanation');
        assert.ok(explanation.atom, 'Should have atom');
        assert.ok(explanation.truthValue, 'Should have truth value');
        assert.ok(explanation.attentionValue, 'Should have attention value');
        assert.ok(Array.isArray(explanation.relatedLinks), 'Should have related links');
      }
    });

    it('should generate explainable recommendations', async () => {
      const recommendations = await openCogService.getExplainableRecommendations(
        'test_customer_001',
        JSON.stringify({ type: 'treatment' }),
        'default',
        { limit: 3 }
      );
      
      assert.ok(Array.isArray(recommendations), 'Should return array');
      
      if (recommendations.length > 0) {
        const rec = recommendations[0];
        assert.ok(rec.detailedExplanation, 'Should have detailed explanation');
        assert.ok(rec.detailedExplanation.atom, 'Explanation should have atom');
      }
    });
  });

  describe('Enhanced Statistics', () => {
    it('should get enhanced statistics', () => {
      const stats = openCogService.getEnhancedStatistics();
      
      assert.ok(stats, 'Should return statistics');
      assert.ok(typeof stats.atomCount === 'number', 'Should have atom count');
      assert.ok(typeof stats.linkCount === 'number', 'Should have link count');
      assert.ok(stats.persistence, 'Should have persistence stats');
      assert.ok(stats.knowledgeTransfer, 'Should have knowledge transfer stats');
      assert.strictEqual(stats.enhancedFeaturesEnabled, true, 'Enhanced features should be enabled');
    });

    it('should include persistence statistics', () => {
      const stats = openCogService.getEnhancedStatistics();
      
      assert.ok(stats.persistence, 'Should have persistence stats');
      assert.ok(typeof stats.persistence.redisAvailable === 'boolean');
      assert.ok(stats.persistence.persistenceDir);
    });

    it('should include knowledge transfer statistics', () => {
      const stats = openCogService.getEnhancedStatistics();
      
      assert.ok(stats.knowledgeTransfer, 'Should have knowledge transfer stats');
      assert.ok(typeof stats.knowledgeTransfer.totalTransfers === 'number');
      assert.ok(typeof stats.knowledgeTransfer.activePolicies === 'number');
    });
  });

  describe('Integration Tests', () => {
    it('should persist and restore with federated learning', async () => {
      const tenant1 = 'integration_test_1';
      const tenant2 = 'integration_test_2';
      
      // Step 1: Create knowledge in tenants
      await openCogService.findPattern({ nodeType: 'ingredient' }, tenant1);
      await openCogService.findPattern({ nodeType: 'ingredient' }, tenant2);
      
      // Step 2: Perform federated learning
      const learningResult = await openCogService.performFederatedLearning([tenant1, tenant2]);
      assert.ok(learningResult.aggregatedPatterns >= 0);
      
      // Step 3: Persist atomspaces
      await openCogService.persistAtomSpace(tenant1);
      await openCogService.persistAtomSpace(tenant2);
      
      // Step 4: Verify persistence
      const tenant1Data = await persistenceService.loadAtomSpace(tenant1);
      assert.ok(tenant1Data, 'Should load tenant1 data');
      
      const tenant2Data = await persistenceService.loadAtomSpace(tenant2);
      assert.ok(tenant2Data, 'Should load tenant2 data');
    });

    it('should combine reasoning with knowledge transfer', async () => {
      const tenant = 'reasoning_transfer_test';
      
      // Create some knowledge
      await openCogService.findPattern({ nodeType: 'treatment' }, tenant);
      
      // Perform reasoning
      const reasoning = await openCogService.advancedReasoning(
        { pattern: { nodeType: 'treatment' } },
        tenant,
        { maxDepth: 2 }
      );
      
      assert.ok(reasoning.steps.length > 0, 'Should have reasoning steps');
      
      // Extract transferable knowledge
      const atomSpace = openCogService._getAtomSpace(tenant);
      const transferable = knowledgeTransferService.extractTransferableKnowledge(
        atomSpace,
        tenant
      );
      
      assert.ok(Array.isArray(transferable), 'Should extract knowledge');
    });
  });
});
