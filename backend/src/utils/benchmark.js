/**
 * Performance Benchmarking Utilities for OpenCog Operations
 * 
 * Provides timing, memory usage, and throughput metrics for HyperGraphQL operations
 */

class BenchmarkUtil {
  constructor() {
    this.metrics = new Map();
    this.operationHistory = [];
  }

  /**
   * Start timing an operation
   */
  startTimer(operationName) {
    return {
      operationName,
      startTime: process.hrtime.bigint(),
      startMemory: process.memoryUsage()
    };
  }

  /**
   * End timing and record metrics
   */
  endTimer(timer) {
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const duration = Number(endTime - timer.startTime) / 1e6; // Convert to milliseconds
    const memoryDelta = endMemory.heapUsed - timer.startMemory.heapUsed;

    const metric = {
      operation: timer.operationName,
      duration,
      memoryDelta,
      timestamp: Date.now()
    };

    // Store metrics
    if (!this.metrics.has(timer.operationName)) {
      this.metrics.set(timer.operationName, []);
    }
    this.metrics.get(timer.operationName).push(metric);
    this.operationHistory.push(metric);

    // Keep only last 1000 operations
    if (this.operationHistory.length > 1000) {
      this.operationHistory.shift();
    }

    return metric;
  }

  /**
   * Benchmark a function
   */
  async benchmark(operationName, fn) {
    const timer = this.startTimer(operationName);
    try {
      const result = await fn();
      const metric = this.endTimer(timer);
      return { result, metric };
    } catch (error) {
      this.endTimer(timer);
      throw error;
    }
  }

  /**
   * Get statistics for an operation
   */
  getOperationStats(operationName) {
    const metrics = this.metrics.get(operationName) || [];
    
    if (metrics.length === 0) {
      return null;
    }

    const durations = metrics.map(m => m.duration);
    const memoryDeltas = metrics.map(m => m.memoryDelta);

    return {
      operation: operationName,
      count: metrics.length,
      avgDuration: this._average(durations),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      p95Duration: this._percentile(durations, 0.95),
      p99Duration: this._percentile(durations, 0.99),
      avgMemoryDelta: this._average(memoryDeltas),
      totalMemoryDelta: memoryDeltas.reduce((sum, val) => sum + val, 0)
    };
  }

  /**
   * Get all operation statistics
   */
  getAllStats() {
    const stats = {};
    for (const operationName of this.metrics.keys()) {
      stats[operationName] = this.getOperationStats(operationName);
    }
    return stats;
  }

  /**
   * Get recent operation history
   */
  getRecentHistory(limit = 100) {
    return this.operationHistory.slice(-limit);
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
    this.operationHistory = [];
  }

  /**
   * Calculate average
   */
  _average(values) {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  /**
   * Calculate percentile
   */
  _percentile(values, p) {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const stats = this.getAllStats();
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalOperations: this.operationHistory.length,
        uniqueOperations: this.metrics.size,
        timeRange: this._getTimeRange()
      },
      operations: stats,
      recentHistory: this.getRecentHistory(20)
    };

    return report;
  }

  /**
   * Get time range of collected metrics
   */
  _getTimeRange() {
    if (this.operationHistory.length === 0) {
      return null;
    }

    const timestamps = this.operationHistory.map(m => m.timestamp);
    return {
      start: Math.min(...timestamps),
      end: Math.max(...timestamps),
      duration: Math.max(...timestamps) - Math.min(...timestamps)
    };
  }

  /**
   * Run a performance suite
   */
  async runSuite(suite) {
    const results = [];
    
    console.log(`\n=== Running Performance Suite: ${suite.name} ===\n`);
    
    for (const test of suite.tests) {
      console.log(`Running: ${test.name}...`);
      
      const iterations = test.iterations || 100;
      const metrics = [];

      for (let i = 0; i < iterations; i++) {
        const { metric } = await this.benchmark(test.name, test.fn);
        metrics.push(metric);
      }

      const durations = metrics.map(m => m.duration);
      const result = {
        name: test.name,
        iterations,
        avgDuration: this._average(durations),
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        p95Duration: this._percentile(durations, 0.95),
        throughput: 1000 / this._average(durations) // ops per second
      };

      console.log(`  ✓ ${test.name}: ${result.avgDuration.toFixed(2)}ms avg (${result.throughput.toFixed(0)} ops/sec)`);
      results.push(result);
    }

    console.log(`\n=== Suite Complete ===\n`);
    
    return {
      suite: suite.name,
      results,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
const benchmarkUtil = new BenchmarkUtil();
export default benchmarkUtil;
