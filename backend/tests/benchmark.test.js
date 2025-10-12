import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import benchmarkUtil from '../src/utils/benchmark.js';
import openCogService from '../src/services/openCogService.js';
import dataService from '../src/services/dataService.js';

describe('Performance Benchmarks', () => {
  beforeEach(() => {
    benchmarkUtil.clear();
  });

  describe('Benchmark Utilities', () => {
    it('should measure operation duration', async () => {
      const { result, metric } = await benchmarkUtil.benchmark('test-operation', async () => {
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'done';
      });

      assert.strictEqual(result, 'done');
      assert.ok(metric.duration >= 10, 'Duration should be at least 10ms');
      assert.strictEqual(metric.operation, 'test-operation');
    });

    it('should track operation statistics', async () => {
      // Run operation multiple times
      for (let i = 0; i < 5; i++) {
        await benchmarkUtil.benchmark('repeated-op', async () => {
          return i;
        });
      }

      const stats = benchmarkUtil.getOperationStats('repeated-op');
      assert.strictEqual(stats.count, 5);
      assert.ok(stats.avgDuration >= 0);
      assert.ok(stats.minDuration >= 0);
      assert.ok(stats.maxDuration >= stats.minDuration);
    });

    it('should generate performance report', async () => {
      await benchmarkUtil.benchmark('op1', async () => 'result1');
      await benchmarkUtil.benchmark('op2', async () => 'result2');

      const report = benchmarkUtil.generateReport();
      
      assert.ok(report.timestamp);
      assert.strictEqual(report.summary.totalOperations, 2);
      assert.strictEqual(report.summary.uniqueOperations, 2);
      assert.ok(report.operations.op1);
      assert.ok(report.operations.op2);
    });
  });

  describe('OpenCog Performance', () => {
    it('should benchmark pattern matching', async () => {
      await openCogService.initialize();
      
      const { metric } = await benchmarkUtil.benchmark('pattern-matching', async () => {
        return await openCogService.findPattern({ nodeType: 'ingredient' });
      });

      assert.ok(metric.duration > 0);
      console.log(`  Pattern matching: ${metric.duration.toFixed(2)}ms`);
    });

    it('should benchmark cognitive reasoning', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const customers = dataService.getNodes({ type: 'customer' });
      const products = dataService.getNodes({ type: 'product' });

      if (customers.length > 0 && products.length > 0) {
        const { metric } = await benchmarkUtil.benchmark('cognitive-reasoning', async () => {
          return await openCogService.reason({
            type: 'safety-check',
            params: {
              customerId: customers[0].id,
              productId: products[0].id
            }
          });
        });

        assert.ok(metric.duration > 0);
        console.log(`  Cognitive reasoning: ${metric.duration.toFixed(2)}ms`);
      }
    });

    it('should benchmark supply chain analysis', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const products = dataService.getNodes({ type: 'product' });

      if (products.length > 0) {
        const { metric } = await benchmarkUtil.benchmark('supply-chain-analysis', async () => {
          return await openCogService.analyzeSupplyChain(
            products[0].id,
            'TRANSPARENCY'
          );
        });

        assert.ok(metric.duration > 0);
        console.log(`  Supply chain analysis: ${metric.duration.toFixed(2)}ms`);
      }
    });

    it('should benchmark attention update', async () => {
      await openCogService.initialize();
      
      const { metric } = await benchmarkUtil.benchmark('attention-update', async () => {
        return openCogService.updateAttention('default');
      });

      assert.ok(metric.duration > 0);
      console.log(`  Attention update: ${metric.duration.toFixed(2)}ms`);
    });

    it('should benchmark hypergraph traversal', async () => {
      await openCogService.initialize();
      await dataService.initialize();
      
      const nodes = dataService.getNodes();

      if (nodes.length > 0) {
        const { metric } = await benchmarkUtil.benchmark('hypergraph-traversal', async () => {
          return await openCogService.traverseHypergraph(nodes[0].id, { maxDepth: 2 });
        });

        assert.ok(metric.duration > 0);
        console.log(`  Hypergraph traversal: ${metric.duration.toFixed(2)}ms`);
      }
    });
  });

  describe('Performance Suite', () => {
    it('should run complete performance suite', async () => {
      await openCogService.initialize();
      await dataService.initialize();

      const suite = {
        name: 'OpenCog Operations',
        tests: [
          {
            name: 'Simple Pattern Match',
            iterations: 10,
            fn: async () => {
              return await openCogService.findPattern({ nodeType: 'ingredient' });
            }
          },
          {
            name: 'Attention Update',
            iterations: 10,
            fn: async () => {
              return openCogService.updateAttention('default');
            }
          }
        ]
      };

      const results = await benchmarkUtil.runSuite(suite);

      assert.strictEqual(results.suite, 'OpenCog Operations');
      assert.strictEqual(results.results.length, 2);
      assert.ok(results.results[0].avgDuration > 0);
      assert.ok(results.results[0].throughput > 0);
    });
  });
});
