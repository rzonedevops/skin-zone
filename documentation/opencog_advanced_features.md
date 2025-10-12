# OpenCog Advanced Features Documentation

## Overview

This document describes the advanced OpenCog cognitive architecture features integrated into the Skin Zone HyperGraphQL API. These features extend the basic OpenCog implementation with sophisticated reasoning, learning, and optimization capabilities.

## Table of Contents

1. [Advanced Pattern Matching](#advanced-pattern-matching)
2. [Unified Rule Engine (URE)](#unified-rule-engine-ure)
3. [Economic Attention Networks (ECAN)](#economic-attention-networks-ecan)
4. [Incremental Learning](#incremental-learning)
5. [Hypergraph Traversal](#hypergraph-traversal)
6. [Performance Benchmarking](#performance-benchmarking)

---

## Advanced Pattern Matching

### BindLink Pattern Matching

BindLink allows you to match complex patterns with variable bindings, similar to OpenCog's native BindLink queries.

#### Example: Find Products with High-Quality Ingredients

```javascript
const bindLink = {
  variables: [],
  pattern: {
    nodeType: 'product',
    conditions: [
      {
        type: 'greaterThan',
        left: { property: 'rating' },
        right: 4.5
      }
    ]
  },
  result: {
    productId: { variable: 'id' },
    rating: { property: 'rating' }
  }
};

const results = await openCogService.bindPattern(bindLink, 'tenant_salon_a');
```

#### GraphQL Query

```graphql
query {
  bindPattern(
    bindLink: "{\"pattern\":{\"nodeType\":\"product\"},\"result\":{}}"
    tenantId: "tenant_salon_a"
  ) {
    bindings
    matches {
      id
      name
    }
  }
}
```

### Complex Pattern Matching

Support for logical combinations (AND, OR, NOT) in pattern queries.

#### AND Pattern

```javascript
const pattern = {
  and: [
    { nodeType: 'ingredient' },
    { properties: { certified: true } }
  ]
};

const results = await openCogService.findComplexPattern(pattern);
```

#### OR Pattern

```javascript
const pattern = {
  or: [
    { nodeType: 'ingredient', properties: { organic: true } },
    { nodeType: 'ingredient', properties: { certified: true } }
  ]
};

const results = await openCogService.findComplexPattern(pattern);
```

#### NOT Pattern

```javascript
const pattern = {
  not: {
    properties: { allergen: true }
  }
};

const results = await openCogService.findComplexPattern(pattern);
```

#### GraphQL Query

```graphql
query {
  findComplexPattern(
    pattern: "{\"and\":[{\"nodeType\":\"ingredient\"},{\"properties\":{\"certified\":true}}]}"
    tenantId: "default"
  ) {
    id
    name
    truthValue {
      strength
      confidence
    }
  }
}
```

---

## Unified Rule Engine (URE)

The URE enables automated inference and reasoning through rule-based logic.

### Adding Inference Rules

```javascript
openCogService.addURERRule({
  id: 'quality-from-ingredients',
  description: 'Infer product quality from ingredient quality',
  condition: (context, atomSpace) => {
    return context.type === 'quality-inference';
  },
  action: async (context, atomSpace) => {
    // Inference logic
    const highQualityIngredients = /* find high quality ingredients */;
    
    return {
      newAtoms: [
        /* new inferred atoms */
      ],
      conclusions: [
        'Product likely has high quality based on ingredients'
      ]
    };
  },
  confidence: 0.85,
  priority: 8
});
```

### Applying Inference Rules

```javascript
const context = {
  type: 'quality-inference',
  productId: 'prod_123'
};

const inferences = await openCogService.applyInferenceRules(context, 'tenant_id');

// Results contain:
// - rule: The rule that was applied
// - description: Rule description
// - confidence: Inference confidence
// - newAtoms: New atoms added to AtomSpace
// - conclusions: Inferred conclusions
```

### GraphQL Query

```graphql
mutation {
  applyInferenceRules(
    context: "{\"type\":\"quality-inference\",\"productId\":\"prod_123\"}"
    tenantId: "tenant_salon_a"
  ) {
    rule
    description
    confidence
    conclusions
  }
}
```

### Common URE Use Cases

1. **Safety Inference**: Infer product safety from ingredient profiles
2. **Quality Prediction**: Predict product quality from supply chain data
3. **Relationship Discovery**: Discover hidden relationships between entities
4. **Recommendation Enhancement**: Improve recommendations through reasoning

---

## Economic Attention Networks (ECAN)

ECAN implements attention allocation to prioritize important atoms in the AtomSpace.

### Attention Value Structure

Each atom has attention values:
- **STI (Short-Term Importance)**: Current importance (0-1000)
- **LTI (Long-Term Importance)**: Historical importance
- **VLTI (Very Long-Term Importance)**: Persistent importance

### Updating Attention

```javascript
// Update attention values across the AtomSpace
const attentionMap = openCogService.updateAttention('tenant_id');

// Attention is calculated based on:
// - Node connectivity (highly connected = more important)
// - Age decay (older atoms lose attention over time)
// - Usage frequency
```

### Getting High Attention Atoms

```javascript
const topAtoms = openCogService.getHighAttentionAtoms('tenant_id', 10);

// Returns:
// [
//   {
//     atom: { id, name, type, properties },
//     attention: 850
//   },
//   ...
// ]
```

### GraphQL Query

```graphql
query {
  getHighAttentionAtoms(tenantId: "tenant_salon_a", limit: 5) {
    atom {
      id
      name
      type
    }
    attention
  }
}

mutation {
  updateAttention(tenantId: "tenant_salon_a") {
    atomId
    attentionValue
  }
}
```

### Use Cases

1. **Query Optimization**: Cache high-attention atoms for faster access
2. **Recommendation Prioritization**: Prioritize high-attention products
3. **Resource Management**: Focus computational resources on important atoms
4. **Trend Detection**: High attention indicates trending items

---

## Incremental Learning

The system learns from interactions to improve recommendations and predictions over time.

### Learning from Interactions

```javascript
const interaction = {
  type: 'recommendation-feedback',
  data: {
    userId: 'customer_456',
    itemId: 'product_789',
    rating: 0.9,  // 0-1 scale
    feedback: 'positive'
  }
};

const result = await openCogService.learnFromInteraction(interaction, 'tenant_id');

// Updates:
// - Truth values (strength and confidence)
// - Attention values
// - Learning history
```

### Supported Interaction Types

#### 1. Recommendation Feedback

```javascript
{
  type: 'recommendation-feedback',
  data: {
    userId: 'user_123',
    itemId: 'item_456',
    rating: 0.8,
    feedback: 'helpful'
  }
}
```

#### 2. Product Rating

```javascript
{
  type: 'product-rating',
  data: {
    productId: 'prod_123',
    rating: 4.5  // 0-5 scale
  }
}
```

#### 3. Supplier Verification

```javascript
{
  type: 'supplier-verification',
  data: {
    supplierId: 'supplier_123',
    verified: true,
    certifications: ['organic', 'fair-trade']
  }
}
```

### Learning Statistics

```javascript
const stats = openCogService.getLearningStatistics('tenant_id');

// Returns:
// {
//   totalInteractions: 1523,
//   interactionTypes: {
//     'recommendation-feedback': 890,
//     'product-rating': 523,
//     'supplier-verification': 110
//   },
//   averageTruthValue: 0.78,
//   highConfidenceAtoms: 245,
//   recentLearning: [...]
// }
```

### GraphQL Mutation

```graphql
mutation {
  learnFromInteraction(
    interaction: "{\"type\":\"recommendation-feedback\",\"data\":{\"userId\":\"user_123\",\"itemId\":\"prod_456\",\"rating\":0.9}}"
    tenantId: "tenant_salon_a"
  ) {
    learned
    affectedAtoms
    confidence
  }
}

query {
  getLearningStatistics(tenantId: "tenant_salon_a") {
    totalInteractions
    interactionTypes
    averageTruthValue
    highConfidenceAtoms
  }
}
```

---

## Hypergraph Traversal

Navigate complex multi-hop relationships in the hypergraph.

### Basic Traversal

```javascript
const paths = await openCogService.traverseHypergraph(
  'ingredient_hyaluronic_acid',
  {
    maxDepth: 3,
    relationTypes: ['CONTAINS', 'SUPPLIES']  // Optional filter
  },
  'tenant_id'
);

// Returns array of paths:
// [
//   {
//     length: 3,
//     nodes: [Node1, Node2, Node3],
//     score: 0.85
//   },
//   ...
// ]
```

### Path Scoring

Paths are automatically scored based on:
- **Path length**: Shorter paths score higher
- **Attention values**: High-attention nodes boost score
- **Truth values**: High confidence relationships score higher

### GraphQL Query

```graphql
query {
  traverseHypergraph(
    startNodeId: "ingredient_hyaluronic_acid"
    options: "{\"maxDepth\":3,\"relationTypes\":[\"CONTAINS\",\"SUPPLIES\"]}"
    tenantId: "tenant_salon_a"
  ) {
    length
    score
    nodes {
      id
      name
      type
    }
  }
}
```

### Use Cases

1. **Supply Chain Tracing**: Follow ingredients from source to product
2. **Influence Analysis**: Find indirect relationships between entities
3. **Recommendation Expansion**: Discover related products through multi-hop paths
4. **Network Analysis**: Analyze network structure and connectivity

---

## Performance Benchmarking

### Using the Benchmark Utility

```javascript
import benchmarkUtil from '../src/utils/benchmark.js';

// Benchmark a single operation
const { result, metric } = await benchmarkUtil.benchmark('operation-name', async () => {
  return await someOperation();
});

console.log(`Duration: ${metric.duration}ms`);
console.log(`Memory delta: ${metric.memoryDelta} bytes`);
```

### Operation Statistics

```javascript
// Get statistics for a specific operation
const stats = benchmarkUtil.getOperationStats('pattern-matching');

// Returns:
// {
//   operation: 'pattern-matching',
//   count: 150,
//   avgDuration: 2.34,
//   minDuration: 1.12,
//   maxDuration: 15.67,
//   p95Duration: 5.23,
//   p99Duration: 12.45,
//   avgMemoryDelta: 4096
// }
```

### Performance Suite

```javascript
const suite = {
  name: 'OpenCog Operations',
  tests: [
    {
      name: 'Pattern Matching',
      iterations: 100,
      fn: async () => {
        return await openCogService.findPattern({ nodeType: 'ingredient' });
      }
    },
    {
      name: 'Attention Update',
      iterations: 50,
      fn: async () => {
        return openCogService.updateAttention('default');
      }
    }
  ]
};

const results = await benchmarkUtil.runSuite(suite);

// Outputs:
// === Running Performance Suite: OpenCog Operations ===
// Running: Pattern Matching...
//   ✓ Pattern Matching: 2.34ms avg (427 ops/sec)
// Running: Attention Update...
//   ✓ Attention Update: 8.91ms avg (112 ops/sec)
```

### Performance Report

```javascript
const report = benchmarkUtil.generateReport();

// Contains:
// - timestamp
// - summary (total operations, unique operations, time range)
// - operations (statistics for each operation)
// - recentHistory (last 20 operations)
```

---

## Best Practices

### 1. Pattern Matching

- Use specific patterns to reduce search space
- Cache frequently used patterns
- Use complex patterns (AND/OR/NOT) for precise queries

### 2. URE Rules

- Keep rules focused on single responsibilities
- Set appropriate confidence values
- Use priority to control rule execution order
- Test rules with various contexts

### 3. Attention Management

- Update attention periodically (e.g., every 5 minutes)
- Use high-attention atoms for caching decisions
- Monitor attention distribution across tenants

### 4. Incremental Learning

- Process feedback asynchronously
- Batch learning updates for performance
- Monitor learning statistics
- Validate learned patterns periodically

### 5. Performance

- Use benchmarking in development/staging
- Set up performance monitoring
- Profile slow operations
- Cache expensive computations

---

## Integration Examples

### Complete Workflow Example

```javascript
// 1. Initialize services
await openCogService.initialize();

// 2. Add custom URE rules
openCogService.addURERRule({
  id: 'custom-safety-rule',
  description: 'Check ingredient interactions',
  condition: (context) => context.type === 'safety-check',
  action: async (context, atomSpace) => {
    // Custom safety logic
    return { conclusions: ['Safe to use together'] };
  },
  confidence: 0.9
});

// 3. Perform pattern matching
const ingredients = await openCogService.findPattern({
  nodeType: 'ingredient',
  properties: { organic: true }
});

// 4. Update attention based on usage
openCogService.updateAttention('tenant_id');

// 5. Get high-priority items
const important = openCogService.getHighAttentionAtoms('tenant_id', 10);

// 6. Learn from user interaction
await openCogService.learnFromInteraction({
  type: 'recommendation-feedback',
  data: { userId: 'user_1', itemId: important[0].atom.id, rating: 0.9 }
});

// 7. Generate performance report
const report = benchmarkUtil.generateReport();
console.log(report);
```

---

## Testing

Run the comprehensive test suite:

```bash
cd backend
npm test
```

Expected output:
- 43 total tests
- All OpenCog features tested
- Performance benchmarks included

---

## Monitoring and Metrics

### Key Metrics to Track

1. **Pattern Matching**
   - Query latency (p50, p95, p99)
   - Cache hit rate
   - Result set size

2. **URE Performance**
   - Rules applied per query
   - Inference confidence distribution
   - New atoms generated

3. **Attention System**
   - Attention distribution
   - High-attention atom count
   - Decay rate effectiveness

4. **Learning System**
   - Interactions per hour
   - Truth value convergence
   - Learning accuracy

### Example Monitoring Query

```graphql
query PerformanceMetrics {
  getLearningStatistics(tenantId: "tenant_salon_a") {
    totalInteractions
    averageTruthValue
    highConfidenceAtoms
  }
  
  getHighAttentionAtoms(tenantId: "tenant_salon_a", limit: 10) {
    attention
  }
}
```

---

## Troubleshooting

### Common Issues

1. **Slow Pattern Matching**
   - Solution: Add more specific conditions, use caching

2. **Memory Growth**
   - Solution: Clear pattern cache periodically, limit history size

3. **Low Inference Confidence**
   - Solution: Review rule conditions, collect more training data

4. **Attention Imbalance**
   - Solution: Adjust decay rates, review connection patterns

---

## Future Enhancements

Planned features:
- [ ] Distributed AtomSpace for horizontal scaling
- [ ] Advanced PLN (Probabilistic Logic Networks) reasoning
- [ ] Neural-symbolic integration
- [ ] Real-time learning pipelines
- [ ] Cross-tenant knowledge transfer
- [ ] Automated rule discovery

---

## References

- [OpenCog Framework](https://opencog.org/)
- [AtomSpace Documentation](https://wiki.opencog.org/w/AtomSpace)
- [PLN Theory](https://wiki.opencog.org/w/Probabilistic_Logic_Networks)
- [ECAN Architecture](https://wiki.opencog.org/w/ECAN)

---

## Support

For questions or issues:
- Check the [main documentation](../OPENCOG_IMPLEMENTATION.md)
- Review [architecture diagrams](../architecture/opencog_integration.md)
- Run test suite for examples
- Contact the development team
