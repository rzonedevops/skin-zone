/**
 * Demo script for Enhanced OpenCog Features v2
 * 
 * This script demonstrates the new capabilities:
 * 1. Persistence Service
 * 2. Knowledge Transfer Service
 * 3. Advanced Reasoning
 * 4. Enhanced Statistics
 */

import openCogService from './src/services/openCogService.js';
import dataService from './src/services/dataService.js';

async function demo() {
  console.log('\n🚀 OpenCog Enhanced Features v2 Demo\n');
  console.log('=' .repeat(60));

  // Initialize services
  console.log('\n📦 Initializing services...');
  await dataService.initialize();
  await openCogService.initialize();
  console.log('✓ Services initialized\n');

  // Demo 1: Persistence
  console.log('=' .repeat(60));
  console.log('\n1️⃣  PERSISTENCE SERVICE DEMO');
  console.log('-' .repeat(60));
  
  console.log('\n→ Creating test tenant with some knowledge...');
  await openCogService.findPattern({ nodeType: 'ingredient' }, 'demo_tenant_1');
  
  console.log('→ Saving AtomSpace to persistent storage...');
  const saveResult = await openCogService.persistAtomSpace('demo_tenant_1');
  console.log(`✓ Saved: ${saveResult.atomCount} atoms, ${saveResult.linkCount} links`);
  
  console.log('\n→ Creating full system snapshot...');
  const snapshot = await openCogService.persistAllAtomSpaces();
  console.log(`✓ Snapshot: ${snapshot.tenantCount} tenants saved`);
  console.log(`  Snapshot ID: ${snapshot.snapshotId}`);

  // Demo 2: Knowledge Transfer
  console.log('\n=' .repeat(60));
  console.log('\n2️⃣  KNOWLEDGE TRANSFER SERVICE DEMO');
  console.log('-' .repeat(60));
  
  console.log('\n→ Setting up transfer policies...');
  openCogService.setTransferPolicy('demo_tenant_1', {
    minConfidence: 0.85,
    allowedTypes: ['ingredient', 'treatment']
  });
  openCogService.setTransferPolicy('demo_tenant_2', {
    minConfidence: 0.85,
    allowedTypes: ['ingredient', 'treatment']
  });
  console.log('✓ Policies configured for 2 tenants');
  
  console.log('\n→ Creating knowledge in both tenants...');
  await openCogService.findPattern({ nodeType: 'ingredient' }, 'demo_tenant_1');
  await openCogService.findPattern({ nodeType: 'treatment' }, 'demo_tenant_2');
  
  console.log('\n→ Performing federated learning...');
  const federatedResult = await openCogService.performFederatedLearning([
    'demo_tenant_1',
    'demo_tenant_2'
  ]);
  console.log(`✓ Federated learning complete`);
  console.log(`  Aggregated patterns: ${federatedResult.aggregatedPatterns}`);
  const tenantUpdateCount = typeof federatedResult.tenantUpdates === 'string' 
    ? Object.keys(JSON.parse(federatedResult.tenantUpdates)).length 
    : Object.keys(federatedResult.tenantUpdates).length;
  console.log(`  Tenants updated: ${tenantUpdateCount}`);

  // Demo 3: Advanced Reasoning
  console.log('\n=' .repeat(60));
  console.log('\n3️⃣  ADVANCED REASONING DEMO');
  console.log('-' .repeat(60));
  
  console.log('\n→ Running multi-step reasoning...');
  const reasoningResult = await openCogService.advancedReasoning(
    { pattern: { nodeType: 'ingredient' } },
    'default',
    { maxDepth: 3, minConfidence: 0.6 }
  );
  console.log(`✓ Reasoning complete with ${reasoningResult.steps.length} steps`);
  console.log(`  Overall confidence: ${reasoningResult.confidence.toFixed(3)}`);
  console.log(`  Conclusions: ${reasoningResult.conclusions.length}`);
  
  if (reasoningResult.steps.length > 0) {
    console.log('\n  Step details:');
    reasoningResult.steps.forEach(step => {
      console.log(`    ${step.step}. ${step.operation} (confidence: ${(step.confidence || step.avgConfidence || 0).toFixed(3)})`);
    });
  }
  
  console.log('\n→ Explaining reasoning for an atom...');
  const patterns = await openCogService.findPattern({ nodeType: 'ingredient' }, 'default');
  if (patterns.length > 0) {
    const explanation = openCogService.explainReasoning(patterns[0].id, 'default');
    console.log(`✓ Explanation generated for: ${explanation.atom.name}`);
    console.log(`  Truth value: strength=${explanation.truthValue.strength.toFixed(3)}, confidence=${explanation.truthValue.confidence.toFixed(3)}`);
    console.log(`  Related links: ${explanation.relatedLinks.length}`);
    console.log(`  Inferred from: ${explanation.inferredFrom.length} sources`);
    console.log(`  Supports: ${explanation.supports.length} conclusions`);
  }

  // Demo 4: Enhanced Statistics
  console.log('\n=' .repeat(60));
  console.log('\n4️⃣  ENHANCED STATISTICS DEMO');
  console.log('-' .repeat(60));
  
  const stats = openCogService.getEnhancedStatistics();
  console.log('\n✓ Enhanced statistics retrieved:\n');
  console.log('  Core OpenCog:');
  console.log(`    - Atoms: ${stats.atomCount}`);
  console.log(`    - Links: ${stats.linkCount}`);
  console.log(`    - Shared knowledge: ${stats.sharedKnowledgeSize}`);
  console.log(`    - Rules: ${stats.rulesCount}`);
  console.log(`    - Cache size: ${stats.cacheSize}`);
  
  console.log('\n  Persistence:');
  console.log(`    - Redis available: ${stats.persistence.redisAvailable}`);
  console.log(`    - Storage: ${stats.persistence.persistenceDir}`);
  
  console.log('\n  Knowledge Transfer:');
  console.log(`    - Total transfers: ${stats.knowledgeTransfer.totalTransfers}`);
  console.log(`    - Successful: ${stats.knowledgeTransfer.successfulTransfers}`);
  console.log(`    - Failed: ${stats.knowledgeTransfer.failedTransfers}`);
  console.log(`    - Active policies: ${stats.knowledgeTransfer.activePolicies}`);
  
  console.log('\n  Enhanced Features:');
  console.log(`    - Status: ${stats.enhancedFeaturesEnabled ? '✓ ENABLED' : '✗ DISABLED'}`);

  // Summary
  console.log('\n=' .repeat(60));
  console.log('\n🎉 DEMO COMPLETE\n');
  console.log('Enhanced features demonstrated:');
  console.log('  ✓ Persistence Service (file-based storage)');
  console.log('  ✓ Knowledge Transfer Service (federated learning)');
  console.log('  ✓ Advanced Reasoning (multi-step inference)');
  console.log('  ✓ Enhanced Statistics (comprehensive monitoring)');
  console.log('\n' + '=' .repeat(60) + '\n');
}

// Run demo
demo().catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
});
