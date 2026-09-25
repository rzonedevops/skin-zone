# OpenCog HyperGraphQL Usage Examples

This document provides practical examples for using the OpenCog-enhanced HyperGraphQL API in the Skin Zone marketplace.

**Version 2.0 Enhanced** ✨ - Now includes persistence, federated learning, and advanced reasoning!

## Table of Contents

1. [Basic Pattern Matching](#basic-pattern-matching)
2. [Advanced Reasoning](#advanced-reasoning)
3. [Supply Chain Intelligence](#supply-chain-intelligence)
4. [Personalized Recommendations](#personalized-recommendations)
5. [Learning and Adaptation](#learning-and-adaptation)
6. [Performance Optimization](#performance-optimization)

---

## Basic Pattern Matching

### Example 1: Find Organic Ingredients

```graphql
query FindOrganicIngredients {
  findPattern(
    pattern: "{\"nodeType\":\"ingredient\",\"properties\":{\"organic\":true}}"
    tenantId: "tenant_naturals_spa"
  ) {
    id
    name
    properties {
      category
      benefits
    }
    truthValue {
      strength
      confidence
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "findPattern": [
      {
        "id": "ingredient_argan_oil",
        "name": "Argan Oil",
        "properties": {
          "category": "natural_oil",
          "benefits": ["moisturizing", "anti-aging"]
        },
        "truthValue": {
          "strength": 0.95,
          "confidence": 0.92
        }
      }
    ]
  }
}
```

### Example 2: Complex Pattern with Multiple Conditions

```graphql
query FindPremiumProducts {
  findComplexPattern(
    pattern: "{\"and\":[{\"nodeType\":\"product\"},{\"properties\":{\"certified\":true,\"rating\":{\"$gt\":4.5}}}]}"
    tenantId: "tenant_luxe_salon"
  ) {
    id
    name
    properties {
      price
      rating
    }
    attentionValue {
      sti
    }
  }
}
```

---

## Advanced Reasoning

### Example 3: Safety Check for Customer

```graphql
query SafetyCheck {
  inferRelationships(
    nodeId: "customer_sarah_123"
    depth: 2
    tenantId: "tenant_naturals_spa"
  ) {
    source
    target
    type
    confidence
    reasoning
  }
}
```

**Use Case**: Before recommending a product, check if customer has allergies that conflict with product ingredients.

### Example 4: Apply Custom Inference Rules

```javascript
// Add a custom rule
openCogService.addURERRule({
  id: 'seasonal-recommendation',
  description: 'Boost summer-appropriate products',
  condition: (context, atomSpace) => {
    const month = new Date().getMonth();
    return month >= 5 && month <= 8; // Summer months
  },
  action: async (context, atomSpace) => {
    const summerProducts = [];
    for (const [id, atom] of atomSpace.atoms.entries()) {
      if (atom.data.properties?.seasonal === 'summer') {
        atom.attentionValue.sti += 50; // Boost attention
        summerProducts.push(atom);
      }
    }
    return {
      newAtoms: [],
      conclusions: [`Boosted ${summerProducts.length} summer products`]
    };
  },
  confidence: 0.9
});
```

```graphql
mutation ApplySeasonalRules {
  applyInferenceRules(
    context: "{\"type\":\"seasonal-boost\",\"season\":\"summer\"}"
    tenantId: "tenant_beach_spa"
  ) {
    rule
    description
    confidence
    conclusions
  }
}
```

---

## Supply Chain Intelligence

### Example 5: Analyze Supply Chain Transparency

```graphql
query AnalyzeTransparency {
  analyzeSupplyChain(
    productId: "product_hydrating_serum"
    analysisType: TRANSPARENCY
    tenantId: "tenant_ethical_beauty"
  ) {
    productId
    analysisType
    score
    confidence
    insights {
      metric
      value
      impact
    }
    recommendations {
      type
      priority
      message
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "analyzeSupplyChain": {
      "productId": "product_hydrating_serum",
      "analysisType": "TRANSPARENCY",
      "score": 0.87,
      "confidence": 0.85,
      "insights": [
        {
          "metric": "Ingredient Traceability",
          "value": "95%",
          "impact": "positive"
        },
        {
          "metric": "Supplier Verification",
          "value": "100%",
          "impact": "positive"
        }
      ],
      "recommendations": [
        {
          "type": "maintain",
          "priority": "low",
          "message": "Excellent transparency - maintain current practices"
        }
      ]
    }
  }
}
```

### Example 6: Trace Product Supply Chain

```graphql
query TraceSupplyChain {
  traverseHypergraph(
    startNodeId: "product_hydrating_serum"
    options: "{\"maxDepth\":3,\"relationTypes\":[\"CONTAINS\",\"SUPPLIES\"]}"
    tenantId: "tenant_ethical_beauty"
  ) {
    length
    score
    nodes {
      id
      name
      type
      properties {
        location {
          country
        }
      }
    }
  }
}
```

**Use Case**: Trace a product from final form back through ingredients to original suppliers.

---

## Personalized Recommendations

### Example 7: Get Cognitive Recommendations

```graphql
query GetRecommendations {
  cognitiveRecommendations(
    userId: "customer_emma_456"
    context: "{\"skinType\":\"sensitive\",\"concerns\":[\"anti-aging\",\"hydration\"]}"
    tenantId: "tenant_derma_clinic"
  ) {
    id
    name
    properties {
      category
      price
      rating
    }
    cognitiveScore
    reasoning {
      rule
      impact
      reason
    }
    confidence
  }
}
```

**Response:**
```json
{
  "data": {
    "cognitiveRecommendations": [
      {
        "id": "treatment_gentle_peel",
        "name": "Gentle Enzyme Peel",
        "properties": {
          "category": "facial_treatment",
          "price": 85.00,
          "rating": 4.8
        },
        "cognitiveScore": 0.92,
        "reasoning": [
          {
            "rule": "Customer Preference",
            "impact": "+0.2",
            "reason": "Matches customer preferred treatment type"
          },
          {
            "rule": "Prioritize High Efficacy",
            "impact": "+0.1",
            "reason": "Treatment matches Prioritize High Efficacy criteria"
          }
        ],
        "confidence": 0.94
      }
    ]
  }
}
```

### Example 8: Learn from Customer Feedback

```graphql
mutation RecordFeedback {
  learnFromInteraction(
    interaction: "{\"type\":\"recommendation-feedback\",\"data\":{\"userId\":\"customer_emma_456\",\"itemId\":\"treatment_gentle_peel\",\"rating\":0.95,\"feedback\":\"excellent results\"}}"
    tenantId: "tenant_derma_clinic"
  ) {
    learned
    affectedAtoms
    confidence
  }
}
```

**Effect**: The system updates truth values and attention for the treatment, improving future recommendations.

---

## Learning and Adaptation

### Example 9: Track Learning Progress

```graphql
query LearningStats {
  getLearningStatistics(tenantId: "tenant_derma_clinic") {
    totalInteractions
    interactionTypes
    averageTruthValue
    highConfidenceAtoms
    recentLearning
  }
}
```

**Response:**
```json
{
  "data": {
    "getLearningStatistics": {
      "totalInteractions": 2847,
      "interactionTypes": "{\"recommendation-feedback\":1523,\"product-rating\":1124,\"supplier-verification\":200}",
      "averageTruthValue": 0.82,
      "highConfidenceAtoms": 456,
      "recentLearning": "[...]"
    }
  }
}
```

### Example 10: Update Product Based on Ratings

```javascript
// Backend: Process batch of ratings
const ratings = [
  { productId: 'prod_123', rating: 4.8 },
  { productId: 'prod_123', rating: 4.9 },
  { productId: 'prod_123', rating: 4.7 }
];

for (const rating of ratings) {
  await openCogService.learnFromInteraction({
    type: 'product-rating',
    data: rating
  }, 'tenant_id');
}

// Check updated statistics
const stats = openCogService.getLearningStatistics('tenant_id');
console.log(`Average truth value: ${stats.averageTruthValue}`);
```

---

## Performance Optimization

### Example 11: Prioritize Important Content

```graphql
mutation UpdateAttention {
  updateAttention(tenantId: "tenant_luxe_salon") {
    atomId
    attentionValue
  }
}

query GetTrendingProducts {
  getHighAttentionAtoms(tenantId: "tenant_luxe_salon", limit: 10) {
    atom {
      id
      name
      type
      properties {
        rating
        price
      }
    }
    attention
  }
}
```

**Use Case**: Identify trending products based on attention values for featured displays.

### Example 12: Optimize Query Performance

```javascript
// Use BindLink for precise, efficient queries
const bindLink = {
  variables: [],
  pattern: {
    nodeType: 'product',
    conditions: [
      {
        type: 'greaterThan',
        left: { property: 'rating' },
        right: 4.5
      },
      {
        type: 'contains',
        array: { property: 'tags' },
        value: 'bestseller'
      }
    ]
  },
  result: {
    id: { property: 'id' },
    name: { property: 'name' },
    rating: { property: 'rating' }
  }
};

const results = await openCogService.bindPattern(bindLink, 'tenant_id');
```

---

## Complete Workflow Examples

### Example 13: New Customer Onboarding

```javascript
// 1. Capture customer profile
const customerId = 'customer_new_789';
const profile = {
  skinType: 'combination',
  concerns: ['acne', 'scarring'],
  allergies: ['fragrance', 'parabens']
};

// 2. Find safe products (exclude allergens)
const safeProducts = await openCogService.findComplexPattern({
  and: [
    { nodeType: 'product' },
    {
      not: {
        properties: {
          ingredients: {
            $in: profile.allergies
          }
        }
      }
    }
  ]
}, 'tenant_id');

// 3. Get personalized recommendations
const recommendations = await openCogService.recommendTreatments(
  customerId,
  'tenant_id',
  { limit: 5 }
);

// 4. Apply safety reasoning
const safetyCheck = await openCogService.reason({
  type: 'safety-check',
  params: {
    customerId,
    productId: recommendations[0].id
  }
}, 'tenant_id');

console.log('Safe recommendations:', safetyCheck);
```

### Example 14: Supply Chain Audit

```javascript
// 1. Get all products for tenant
const products = await dataService.getNodes({ type: 'product' }, 100, 0);

// 2. Analyze each product's supply chain
const auditResults = [];
for (const product of products) {
  const transparency = await openCogService.analyzeSupplyChain(
    product.id,
    'TRANSPARENCY',
    'tenant_id'
  );
  
  const ethical = await openCogService.analyzeSupplyChain(
    product.id,
    'ETHICAL_SOURCING',
    'tenant_id'
  );
  
  auditResults.push({
    productId: product.id,
    productName: product.name,
    transparencyScore: transparency.score,
    ethicalScore: ethical.score,
    averageScore: (transparency.score + ethical.score) / 2
  });
}

// 3. Sort by score and identify issues
auditResults.sort((a, b) => a.averageScore - b.averageScore);
const problematicProducts = auditResults.filter(r => r.averageScore < 0.6);

console.log(`Audit complete. ${problematicProducts.length} products need attention.`);
```

### Example 15: Intelligent Inventory Management

```javascript
// 1. Update attention values
openCogService.updateAttention('tenant_id');

// 2. Get high-demand products
const trending = openCogService.getHighAttentionAtoms('tenant_id', 20);

// 3. Get learning statistics
const stats = openCogService.getLearningStatistics('tenant_id');

// 4. Apply inference to predict demand
const demandPrediction = await openCogService.applyInferenceRules({
  type: 'demand-forecast',
  products: trending.map(t => t.atom.id),
  historicalData: stats
}, 'tenant_id');

// 5. Generate restock recommendations
const restockList = trending
  .filter(t => t.attention > 500)
  .map(t => ({
    productId: t.atom.id,
    productName: t.atom.name,
    priority: t.attention,
    recommendedQuantity: Math.ceil(t.attention / 100)
  }));

console.log('Restock recommendations:', restockList);
```

---

## GraphQL Query Patterns

### Pattern 1: Nested Cognitive Query

```graphql
query ComprehensiveProductAnalysis {
  node(id: "product_vitamin_c_serum") {
    id
    name
    properties {
      rating
      price
    }
  }
  
  getRelations(nodeId: "product_vitamin_c_serum") {
    source
    target
    type
    weight
  }
  
  analyzeSupplyChain(
    productId: "product_vitamin_c_serum"
    analysisType: TRANSPARENCY
  ) {
    score
    insights {
      metric
      value
    }
  }
  
  cognitiveInsights(
    context: "{\"type\":\"product-analysis\",\"productId\":\"product_vitamin_c_serum\"}"
  ) {
    confidence
    explanations
  }
}
```

### Pattern 2: Multi-Tenant Comparison

```graphql
query CompareTenantPerformance {
  tenantA: getLearningStatistics(tenantId: "tenant_salon_a") {
    totalInteractions
    averageTruthValue
    highConfidenceAtoms
  }
  
  tenantB: getLearningStatistics(tenantId: "tenant_salon_b") {
    totalInteractions
    averageTruthValue
    highConfidenceAtoms
  }
}
```

### Pattern 3: Real-Time Recommendation Pipeline

```graphql
query RealtimeRecommendations($userId: ID!, $context: String!) {
  # Get user's current state
  user: node(id: $userId) {
    id
    properties {
      skinType
    }
  }
  
  # Get cognitive recommendations
  recommendations: cognitiveRecommendations(
    userId: $userId
    context: $context
  ) {
    id
    name
    cognitiveScore
    reasoning {
      rule
      reason
    }
  }
  
  # Get high-attention trending items
  trending: getHighAttentionAtoms(limit: 5) {
    atom {
      id
      name
    }
    attention
  }
}
```

---

## Best Practices

### 1. Query Optimization
- Use specific patterns to reduce result sets
- Cache frequently accessed data
- Batch similar queries together

### 2. Learning Integration
- Process feedback asynchronously
- Update attention periodically
- Monitor learning statistics

### 3. Error Handling
```javascript
try {
  const results = await openCogService.findPattern(pattern, tenantId);
  if (results.length === 0) {
    console.log('No results found, trying broader pattern...');
    // Fallback to broader query
  }
} catch (error) {
  console.error('Pattern matching failed:', error);
  // Handle error gracefully
}
```

### 4. Performance Monitoring
```javascript
import benchmarkUtil from '../utils/benchmark.js';

const { result, metric } = await benchmarkUtil.benchmark(
  'complex-query',
  async () => {
    return await openCogService.findComplexPattern(complexPattern);
  }
);

console.log(`Query took ${metric.duration}ms`);
```

---

## Enhanced Features (v2) - NEW! ✨

### Example 15: Persistence - Save and Restore AtomSpace

```graphql
# Save current state
mutation {
  persistAtomSpace(tenantId: "my_spa") {
    tenantId
    timestamp
    atomCount
    linkCount
  }
}

# Create full system snapshot
mutation {
  persistAllAtomSpaces {
    snapshotId
    timestamp
    tenantCount
    tenants {
      tenantId
      atomCount
    }
  }
}
```

**Restoration is automatic on service restart!**

### Example 16: Federated Learning - Share Knowledge Across Tenants

```graphql
# Step 1: Configure what can be shared
mutation {
  setTransferPolicy(
    tenantId: "spa_luxury"
    policy: "{
      \"minConfidence\": 0.9,
      \"minOccurrences\": 5,
      \"excludePatterns\": [\"customer_*\", \"order_*\"],
      \"allowedTypes\": [\"treatment\", \"ingredient\"]
    }"
  )
}

# Step 2: Perform federated learning
mutation {
  performFederatedLearning(
    tenantIds: ["spa_luxury", "spa_wellness", "spa_organic"]
  ) {
    aggregatedPatterns
    tenantUpdates
    timestamp
  }
}
```

**Result:** Each spa benefits from patterns learned by others while maintaining privacy.

### Example 17: Advanced Multi-Step Reasoning

```graphql
query {
  advancedReasoning(
    query: "{
      \"pattern\": {
        \"nodeType\": \"treatment\",
        \"properties\": {\"category\": \"facial\"}
      }
    }"
    tenantId: "beauty_clinic"
    options: "{\"maxDepth\": 3, \"minConfidence\": 0.7}"
  ) {
    query
    steps {
      step
      operation
      matches
      inferences
      confidence
    }
    conclusions
    confidence
  }
}
```

**Response:**
```json
{
  "steps": [
    {
      "step": 1,
      "operation": "pattern_matching",
      "matches": 12,
      "confidence": 0.9
    },
    {
      "step": 2,
      "operation": "inference",
      "inferences": 5,
      "avgConfidence": 0.85
    }
  ],
  "conclusions": [
    "Facial treatments with organic ingredients show 20% higher satisfaction",
    "Premium ingredients correlate with improved customer retention"
  ],
  "confidence": 0.875
}
```

### Example 18: Explain Why a Recommendation Was Made

```graphql
query {
  explainReasoning(
    atomId: "treatment_hydrating_facial"
    tenantId: "spa_wellness"
  ) {
    atom {
      id
      name
      type
    }
    truthValue {
      strength
      confidence
    }
    inferredFrom {
      source
      type
      strength
    }
    supports {
      target
      type
      strength
    }
  }
}
```

**Result:** Full reasoning chain showing why this treatment was recommended.

### Example 19: Get Recommendations with Full Explanations

```graphql
query {
  getExplainableRecommendations(
    userId: "customer_jane_doe"
    context: "{
      \"skinType\": \"combination\",
      \"concerns\": [\"anti-aging\", \"hydration\"],
      \"budget\": \"premium\",
      \"previousTreatments\": [\"basic_facial\"]
    }"
    tenantId: "luxury_spa"
    options: "{\"limit\": 3}"
  ) {
    id
    name
    cognitiveScore
    confidence
    reasoning {
      rule
      impact
      reason
    }
    detailedExplanation {
      atom {
        id
        name
      }
      truthValue {
        strength
        confidence
      }
      inferredFrom {
        source
        type
        strength
      }
    }
  }
}
```

**Response:**
```json
{
  "id": "treatment_premium_anti_aging",
  "name": "Premium Anti-Aging Facial",
  "cognitiveScore": 0.92,
  "confidence": 0.88,
  "reasoning": [
    {
      "rule": "customer_history_match",
      "impact": 0.85,
      "reason": "Customer previously enjoyed facial treatments"
    },
    {
      "rule": "concern_alignment",
      "impact": 0.95,
      "reason": "Treatment directly addresses anti-aging concern"
    }
  ],
  "detailedExplanation": {
    "inferredFrom": [
      {
        "source": "customer_jane_doe",
        "type": "HAS_CONCERN",
        "strength": 0.9
      },
      {
        "source": "ingredient_retinol",
        "type": "ADDRESSES",
        "strength": 0.95
      }
    ]
  }
}
```

### Example 20: Monitor Enhanced Statistics

```graphql
query {
  getEnhancedStatistics {
    # Core stats
    atomCount
    linkCount
    rulesCount
    
    # Persistence
    persistence {
      redisAvailable
      lastSnapshotTimes
      persistenceDir
    }
    
    # Knowledge transfer
    knowledgeTransfer {
      totalTransfers
      successfulTransfers
      sharedPatternsCount
      activePolicies
    }
    
    enhancedFeaturesEnabled
  }
}
```

---

## Next Steps

1. Explore [Enhanced Features v2 Documentation](opencog_enhanced_features_v2.md) - NEW! ✨
2. Review [Advanced Features Documentation](opencog_advanced_features.md)
3. Check [Architecture Guide](../architecture/opencog_integration.md)
4. Read [Implementation Summary](../OPENCOG_IMPLEMENTATION.md)
5. Run test suite: `cd backend && npm test`

---

## Support Resources

- **Test Examples**: See `backend/tests/openCogService.test.js`
- **Benchmark Examples**: See `backend/tests/benchmark.test.js`
- **Schema Reference**: See `backend/src/schema/typeDefs.js`
- **Resolver Reference**: See `backend/src/resolvers/index.js`
