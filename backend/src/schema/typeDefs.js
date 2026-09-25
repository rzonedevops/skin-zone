import { buildSchema } from 'graphql';

/**
 * HyperGraphQL Schema for Skin Zone HGNN
 * Maps HyperGNN entities to GraphQL types with org-aware support
 */
export const typeDefs = buildSchema(`
  # Core node types in the hypergraph
  
  type Node {
    id: ID!
    type: String!
    name: String!
    properties: NodeProperties
    tenantId: String
    embedding: [Float]
  }
  
  type NodeProperties {
    scientificName: String
    category: String
    description: String
    benefits: [String]
    price: Float
    rating: Float
    location: Location
    availability: String
    imageUrl: String
  }
  
  type Location {
    latitude: Float
    longitude: Float
    address: String
    city: String
    country: String
  }
  
  # Edge types for relationships
  
  type Edge {
    id: ID!
    source: String!
    target: String!
    type: String!
    weight: Float
    properties: EdgeProperties
    tenantId: String
  }
  
  type EdgeProperties {
    bookingDate: String
    status: String
    quantity: Float
    reliability: Float
  }
  
  # Hyperedge types for multi-way relationships
  
  type Hyperedge {
    id: ID!
    type: String!
    nodes: [HyperedgeNode!]!
    attributes: HyperedgeAttributes
    tenantId: String
    embedding: [Float]
  }
  
  type HyperedgeNode {
    nodeId: String!
    role: String!
    quantity: String
  }
  
  type HyperedgeAttributes {
    datetime: String
    duration: Int
    price: Float
    outcomeRating: Float
    eventType: String
    qualityCheck: String
  }
  
  # Organization/Tenant management
  
  type Organization {
    id: ID!
    name: String!
    type: String!
    entities: [Node!]
    relations: [Edge!]
    hyperedges: [Hyperedge!]
  }
  
  # Query paths and navigation
  
  type Path {
    nodes: [Node!]!
    edges: [Edge!]!
    length: Int!
    score: Float
  }
  
  type SupplyChainTrace {
    product: Node!
    ingredients: [Node!]!
    suppliers: [Node!]!
    path: Path!
  }

  # OpenCog Cognitive Types

  type PatternMatch {
    id: ID!
    type: String!
    name: String!
    properties: NodeProperties
    truthValue: TruthValue
    attentionValue: AttentionValue
  }

  type TruthValue {
    strength: Float!
    confidence: Float!
  }

  type AttentionValue {
    sti: Int!
    lti: Int!
    vlti: Int!
  }

  type InferredRelationship {
    source: String!
    target: String!
    type: String!
    confidence: Float!
    reasoning: String!
  }

  type CognitiveInsights {
    reasoning: [ReasoningStep!]!
    confidence: Float!
    explanations: [String!]!
    alternatives: [Alternative!]!
  }

  type ReasoningStep {
    rule: String!
    applies: Boolean!
    priority: Int!
  }

  type Alternative {
    id: ID!
    name: String!
    score: Float!
    reason: String!
  }

  type SupplyChainAnalysis {
    productId: ID!
    analysisType: String!
    score: Float!
    confidence: Float!
    insights: [Insight!]!
    recommendations: [Recommendation!]!
  }

  type Insight {
    metric: String!
    value: String!
    impact: String!
  }

  type Recommendation {
    type: String!
    priority: String!
    message: String!
  }

  type CognitiveRecommendation {
    id: ID!
    type: String!
    name: String!
    properties: NodeProperties
    cognitiveScore: Float!
    reasoning: [ReasoningEvidence!]!
    confidence: Float!
  }

  type ReasoningEvidence {
    rule: String!
    impact: String!
    reason: String!
  }

  type TrainingResult {
    success: Boolean!
    modelType: String!
    message: String!
    estimatedTime: Int!
  }

  type Rule {
    id: ID!
    name: String!
    category: String!
    active: Boolean!
  }

  type Knowledge {
    id: ID!
    type: String!
    data: String!
    updated: Boolean!
  }

  enum SupplyChainAnalysisType {
    TRANSPARENCY
    ETHICAL_SOURCING
    SUSTAINABILITY
    QUALITY_CHAIN
    RISK_ASSESSMENT
  }

  enum ModelType {
    RECOMMENDATION
    SUPPLY_CHAIN
    QUALITY_PREDICTION
    DEMAND_FORECAST
  }
  
  # Input types for queries
  
  input NodeFilter {
    type: String
    name: String
    tenantId: String
    category: String
  }
  
  input EdgeFilter {
    type: String
    source: String
    target: String
    tenantId: String
  }
  
  input HyperedgeFilter {
    type: String
    tenantId: String
  }
  
  # Queries
  
  type Query {
    # Entity queries
    node(id: ID!): Node
    nodes(filter: NodeFilter, limit: Int, offset: Int): [Node!]!
    
    edge(id: ID!): Edge
    edges(filter: EdgeFilter, limit: Int, offset: Int): [Edge!]!
    
    hyperedge(id: ID!): Hyperedge
    hyperedges(filter: HyperedgeFilter, limit: Int, offset: Int): [Hyperedge!]!
    
    # Relation queries
    getRelations(nodeId: ID!, tenantId: String): [Edge!]!
    getNeighbors(nodeId: ID!, tenantId: String): [Node!]!
    
    # Hypergraph navigation
    traverse(startNodeId: ID!, maxDepth: Int, tenantId: String): [Node!]!
    findPaths(sourceId: ID!, targetId: ID!, maxLength: Int, tenantId: String): [Path!]!
    
    # Supply chain queries
    traceSupplyChain(productId: ID!, tenantId: String): SupplyChainTrace
    recommendTreatments(customerId: ID!, tenantId: String): [Node!]!
    
    # Organization queries
    organization(id: ID!): Organization
    organizations(limit: Int, offset: Int): [Organization!]!

    # OpenCog cognitive queries
    findPattern(pattern: String!, tenantId: String): [PatternMatch!]!
    inferRelationships(nodeId: ID!, depth: Int, tenantId: String): [InferredRelationship!]!
    cognitiveInsights(context: String!, tenantId: String): CognitiveInsights!
    analyzeSupplyChain(productId: ID!, analysisType: SupplyChainAnalysisType!, tenantId: String): SupplyChainAnalysis
    cognitiveRecommendations(userId: ID!, context: String!, tenantId: String): [CognitiveRecommendation!]!

    # Advanced OpenCog operations
    bindPattern(bindLink: String!, tenantId: String): [BindResult!]!
    applyInferenceRules(context: String!, tenantId: String): [InferenceResult!]!
    getHighAttentionAtoms(tenantId: String, limit: Int): [AttentionAtom!]!
    traverseHypergraph(startNodeId: ID!, options: String, tenantId: String): [HypergraphPath!]!
    
    # Enhanced OpenCog operations (v2)
    advancedReasoning(query: String!, tenantId: String, options: String): AdvancedReasoningResult!
    explainReasoning(atomId: ID!, tenantId: String): ReasoningExplanation!
    getExplainableRecommendations(userId: ID!, context: String!, tenantId: String, options: String): [ExplainableRecommendation!]!
    getEnhancedStatistics(tenantId: String): EnhancedStatistics!
    findComplexPattern(pattern: String!, tenantId: String): [PatternMatch!]!
    getLearningStatistics(tenantId: String): LearningStatistics!
  }
  
  # Mutations for data management
  
  type Mutation {
    # Entity management
    createNode(id: ID!, type: String!, name: String!, tenantId: String): Node!
    updateNode(id: ID!, properties: String): Node!
    deleteNode(id: ID!): Boolean!
    
    createEdge(source: String!, target: String!, type: String!, tenantId: String): Edge!
    deleteEdge(id: ID!): Boolean!
    
    createHyperedge(type: String!, nodes: String!, tenantId: String): Hyperedge!
    deleteHyperedge(id: ID!): Boolean!
    
    # Organization management
    createOrganization(id: ID!, name: String!, type: String!): Organization!
    deleteOrganization(id: ID!): Boolean!

    # OpenCog cognitive mutations
    trainModel(modelType: ModelType!, tenantId: String): TrainingResult!
    addReasoningRule(rule: String!, tenantId: String): Rule!
    updateKnowledge(knowledge: String!, tenantId: String): Knowledge!

    # Advanced OpenCog mutations
    updateAttention(tenantId: String): [AttentionUpdate!]!
    learnFromInteraction(interaction: String!, tenantId: String): LearningResult!
    
    # Enhanced OpenCog mutations (v2)
    persistAtomSpace(tenantId: String): PersistenceResult!
    persistAllAtomSpaces: SnapshotResult!
    performFederatedLearning(tenantIds: [String!]): FederatedLearningResult!
    setTransferPolicy(tenantId: String!, policy: String!): Boolean!
  }

  # Advanced OpenCog types
  
  type BindResult {
    bindings: String!
    matches: [PatternMatch!]!
  }

  type InferenceResult {
    rule: String!
    description: String!
    confidence: Float!
    newAtoms: [Node!]!
    conclusions: [String!]!
  }

  type AttentionAtom {
    atom: PatternMatch!
    attention: Float!
  }

  type AttentionUpdate {
    atomId: ID!
    attentionValue: Float!
  }

  type HypergraphPath {
    length: Int!
    nodes: [Node!]!
    score: Float!
  }

  type LearningStatistics {
    totalInteractions: Int!
    interactionTypes: String!
    averageTruthValue: Float!
    highConfidenceAtoms: Int!
    recentLearning: String!
  }

  type LearningResult {
    learned: Boolean!
    affectedAtoms: [String!]!
    confidence: Float!
  }

  # Enhanced OpenCog types (v2)
  
  type AdvancedReasoningResult {
    query: String!
    steps: [ReasoningStepDetail!]!
    conclusions: [String!]!
    confidence: Float!
  }

  type ReasoningStepDetail {
    step: Int!
    operation: String!
    matches: Int
    inferences: Int
    confidence: Float
    avgConfidence: Float
  }

  type ReasoningExplanation {
    atom: PatternMatch!
    truthValue: TruthValue!
    attentionValue: AttentionValue!
    relatedLinks: [RelatedLink!]!
    inferredFrom: [InferenceSource!]!
    supports: [InferenceTarget!]!
  }

  type RelatedLink {
    id: ID!
    type: String!
    source: ID!
    target: ID!
    strength: Float!
  }

  type InferenceSource {
    source: ID!
    type: String!
    strength: Float!
  }

  type InferenceTarget {
    target: ID!
    type: String!
    strength: Float!
  }

  type ExplainableRecommendation {
    id: ID!
    name: String!
    type: String!
    cognitiveScore: Float!
    confidence: Float!
    reasoning: [ReasoningDetail!]!
    detailedExplanation: ReasoningExplanation!
  }

  type ReasoningDetail {
    rule: String!
    impact: Float!
    reason: String!
  }

  type EnhancedStatistics {
    atomCount: Int!
    linkCount: Int!
    sharedKnowledgeSize: Int!
    cacheSize: Int!
    rulesCount: Int!
    persistence: PersistenceStats!
    knowledgeTransfer: KnowledgeTransferStats!
    enhancedFeaturesEnabled: Boolean!
  }

  type PersistenceStats {
    redisAvailable: Boolean!
    lastSnapshotTimes: String!
    persistenceDir: String!
  }

  type KnowledgeTransferStats {
    totalTransfers: Int!
    successfulTransfers: Int!
    failedTransfers: Int!
    sharedPatternsCount: Int!
    activePolicies: Int!
  }

  type PersistenceResult {
    tenantId: String!
    timestamp: Float!
    atomCount: Int!
    linkCount: Int!
  }

  type SnapshotResult {
    snapshotId: String!
    timestamp: Float!
    tenantCount: Int!
    tenants: [PersistenceResult!]!
  }

  type FederatedLearningResult {
    aggregatedPatterns: Int!
    tenantUpdates: String!
    timestamp: Float!
  }
`);
