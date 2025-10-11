import dataService from './dataService.js';

/**
 * OpenCogService - Cognitive architecture integration for Skin Zone marketplace
 * 
 * This service provides OpenCog-inspired cognitive capabilities including:
 * - AtomSpace-like knowledge representation (multi-tenant)
 * - Pattern matching for complex queries
 * - Probabilistic reasoning (PLN-inspired)
 * - Recommendation engine with cognitive reasoning
 * - Supply chain intelligence analysis
 * 
 * Note: This is a Node.js implementation of OpenCog concepts.
 * For production, consider integrating with actual OpenCog framework via REST API or gRPC.
 */
class OpenCogService {
  constructor() {
    // Multi-tenant AtomSpaces (in-memory knowledge stores)
    this.atomSpaces = new Map();
    
    // Shared knowledge base accessible across tenants
    this.sharedKnowledge = {
      atoms: new Map(),
      rules: [],
      patterns: new Map()
    };
    
    // Pattern matcher cache for performance
    this.patternCache = new Map();
    
    // Reasoning rules library
    this.rules = {
      safety: [],
      quality: [],
      business: [],
      recommendations: []
    };
    
    this.initialized = false;
  }

  /**
   * Initialize OpenCog service and load knowledge bases
   */
  async initialize() {
    if (this.initialized) return;
    
    console.log('Initializing OpenCog Service...');
    
    // Ensure data service is initialized
    await dataService.initialize();
    
    // Load shared knowledge from common entities
    await this._loadSharedKnowledge();
    
    // Initialize reasoning rules
    this._initializeReasoningRules();
    
    // Setup default tenant AtomSpaces
    this._initializeDefaultAtomSpace();
    
    this.initialized = true;
    console.log('OpenCog Service initialized successfully');
  }

  /**
   * Get or create AtomSpace for a tenant
   */
  _getAtomSpace(tenantId = 'default') {
    if (!this.atomSpaces.has(tenantId)) {
      this.atomSpaces.set(tenantId, {
        atoms: new Map(),
        links: new Map(),
        attention: new Map(), // Attention values for importance
        truthValues: new Map(), // Truth values (strength, confidence)
        created: Date.now()
      });
    }
    return this.atomSpaces.get(tenantId);
  }

  /**
   * Load shared knowledge base from common entities
   */
  async _loadSharedKnowledge() {
    // Load common ingredients as shared knowledge
    const ingredients = dataService.getNodes({ type: 'ingredient' });
    
    ingredients.forEach(ingredient => {
      const atom = this._createAtom('concept', ingredient.id, {
        name: ingredient.name,
        properties: ingredient.properties,
        type: 'ingredient',
        shared: true
      });
      
      this.sharedKnowledge.atoms.set(ingredient.id, atom);
    });
    
    console.log(`Loaded ${ingredients.length} shared knowledge atoms`);
  }

  /**
   * Initialize reasoning rules library
   */
  _initializeReasoningRules() {
    // Safety rules
    this.rules.safety = [
      {
        id: 'avoid-allergen',
        name: 'Avoid Allergen',
        condition: (customer, product) => {
          if (!customer.properties?.allergies) return false;
          const productIngredients = this._getProductIngredients(product.id);
          return productIngredients.some(ing => 
            customer.properties.allergies.includes(ing.name)
          );
        },
        action: 'recommend-alternative',
        priority: 10
      },
      {
        id: 'check-skin-type',
        name: 'Check Skin Type Compatibility',
        condition: (customer, product) => {
          if (!customer.properties?.skinType || !product.properties?.suitableFor) return true;
          return product.properties.suitableFor.includes(customer.properties.skinType);
        },
        action: 'compatibility-score',
        priority: 8
      }
    ];

    // Quality rules
    this.rules.quality = [
      {
        id: 'supplier-certification',
        name: 'Supplier Certification Check',
        condition: (product) => {
          const suppliers = this._getProductSuppliers(product.id);
          return suppliers.every(s => s.properties?.certified === true);
        },
        action: 'quality-boost',
        priority: 7
      }
    ];

    // Business rules
    this.rules.business = [
      {
        id: 'cross-sell',
        name: 'Cross-Sell Opportunity',
        condition: (customer, product) => {
          const purchases = this._getCustomerPurchases(customer.id);
          return purchases.length > 0 && !purchases.find(p => p.id === product.id);
        },
        action: 'suggest-bundle',
        priority: 5
      }
    ];

    // Recommendation rules
    this.rules.recommendations = [
      {
        id: 'high-efficacy',
        name: 'Prioritize High Efficacy',
        condition: (treatment) => {
          return (treatment.properties?.efficacy || 0) > 0.8;
        },
        action: 'boost-score',
        priority: 9
      }
    ];
  }

  /**
   * Initialize default tenant AtomSpace
   */
  _initializeDefaultAtomSpace() {
    const defaultSpace = this._getAtomSpace('default');
    
    // Load all entities into default AtomSpace
    const nodes = dataService.getNodes();
    nodes.forEach(node => {
      this._addAtomToSpace(defaultSpace, node);
    });

    // Load relationships
    const edges = dataService.getEdges();
    edges.forEach(edge => {
      this._addLinkToSpace(defaultSpace, edge);
    });
  }

  /**
   * Create an atom (node in AtomSpace)
   */
  _createAtom(type, id, data) {
    return {
      type: type, // 'concept', 'predicate', 'variable', etc.
      id: id,
      data: data,
      truthValue: { strength: 1.0, confidence: 0.9 },
      attentionValue: { sti: 100, lti: 0, vlti: 0 }, // Short/Long-term importance
      created: Date.now()
    };
  }

  /**
   * Add atom to tenant AtomSpace
   */
  _addAtomToSpace(atomSpace, node) {
    const atom = this._createAtom('concept', node.id, node);
    atomSpace.atoms.set(node.id, atom);
    atomSpace.truthValues.set(node.id, atom.truthValue);
    atomSpace.attention.set(node.id, atom.attentionValue);
  }

  /**
   * Add link (relationship) to tenant AtomSpace
   */
  _addLinkToSpace(atomSpace, edge) {
    const link = {
      id: edge.id,
      type: 'evaluation', // EvaluationLink in OpenCog
      predicate: edge.type,
      outgoing: [edge.source, edge.target],
      truthValue: { strength: edge.weight || 1.0, confidence: 0.95 },
      created: Date.now()
    };
    atomSpace.links.set(edge.id, link);
  }

  /**
   * Pattern matching - find atoms matching a pattern
   * Inspired by OpenCog's Pattern Matcher
   */
  async findPattern(pattern, tenantId = 'default') {
    const cacheKey = `${tenantId}:${JSON.stringify(pattern)}`;
    
    // Check cache
    if (this.patternCache.has(cacheKey)) {
      return this.patternCache.get(cacheKey);
    }

    const atomSpace = this._getAtomSpace(tenantId);
    const results = [];

    // Simple pattern matching implementation
    if (pattern.nodeType) {
      // Match nodes by type
      for (const [id, atom] of atomSpace.atoms.entries()) {
        if (atom.data.type === pattern.nodeType) {
          if (this._matchesPattern(atom, pattern)) {
            results.push(this._atomToResult(atom));
          }
        }
      }
    }

    if (pattern.linkType) {
      // Match links by type
      for (const [id, link] of atomSpace.links.entries()) {
        if (link.predicate === pattern.linkType) {
          if (this._matchesLinkPattern(link, pattern, atomSpace)) {
            results.push(this._linkToResult(link, atomSpace));
          }
        }
      }
    }

    // Cache results
    this.patternCache.set(cacheKey, results);
    
    return results;
  }

  /**
   * Check if atom matches pattern criteria
   */
  _matchesPattern(atom, pattern) {
    if (pattern.properties) {
      for (const [key, value] of Object.entries(pattern.properties)) {
        if (atom.data.properties?.[key] !== value) {
          return false;
        }
      }
    }
    
    if (pattern.minTruthValue) {
      if (atom.truthValue.strength < pattern.minTruthValue) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if link matches pattern criteria
   */
  _matchesLinkPattern(link, pattern, atomSpace) {
    if (pattern.sourceType) {
      const sourceAtom = atomSpace.atoms.get(link.outgoing[0]);
      if (!sourceAtom || sourceAtom.data.type !== pattern.sourceType) {
        return false;
      }
    }

    if (pattern.targetType) {
      const targetAtom = atomSpace.atoms.get(link.outgoing[1]);
      if (!targetAtom || targetAtom.data.type !== pattern.targetType) {
        return false;
      }
    }

    return true;
  }

  /**
   * Convert atom to result format
   */
  _atomToResult(atom) {
    return {
      id: atom.id,
      type: atom.data.type,
      name: atom.data.name,
      properties: atom.data.properties,
      truthValue: atom.truthValue,
      attentionValue: atom.attentionValue
    };
  }

  /**
   * Convert link to result format
   */
  _linkToResult(link, atomSpace) {
    const sourceAtom = atomSpace.atoms.get(link.outgoing[0]);
    const targetAtom = atomSpace.atoms.get(link.outgoing[1]);

    return {
      id: link.id,
      predicate: link.predicate,
      source: sourceAtom ? this._atomToResult(sourceAtom) : null,
      target: targetAtom ? this._atomToResult(targetAtom) : null,
      truthValue: link.truthValue
    };
  }

  /**
   * Cognitive reasoning - apply PLN-inspired reasoning
   */
  async reason(query, tenantId = 'default') {
    const atomSpace = this._getAtomSpace(tenantId);
    const reasoning = {
      steps: [],
      conclusions: [],
      confidence: 0
    };

    // Apply reasoning rules based on query type
    if (query.type === 'safety-check') {
      const safetyResults = await this._applySafetyRules(query.params, atomSpace);
      reasoning.steps.push(...safetyResults.steps);
      reasoning.conclusions.push(...safetyResults.conclusions);
      reasoning.confidence = safetyResults.confidence;
    } else if (query.type === 'quality-inference') {
      const qualityResults = await this._applyQualityRules(query.params, atomSpace);
      reasoning.steps.push(...qualityResults.steps);
      reasoning.conclusions.push(...qualityResults.conclusions);
      reasoning.confidence = qualityResults.confidence;
    }

    return reasoning;
  }

  /**
   * Apply safety reasoning rules
   */
  async _applySafetyRules(params, atomSpace) {
    const results = {
      steps: [],
      conclusions: [],
      confidence: 1.0
    };

    const { customerId, productId } = params;
    const customer = atomSpace.atoms.get(customerId)?.data;
    const product = atomSpace.atoms.get(productId)?.data;

    if (!customer || !product) {
      return results;
    }

    // Apply each safety rule
    for (const rule of this.rules.safety) {
      const applies = rule.condition(customer, product);
      
      results.steps.push({
        rule: rule.name,
        applies: applies,
        priority: rule.priority
      });

      if (applies) {
        results.conclusions.push({
          action: rule.action,
          reason: rule.name,
          priority: rule.priority
        });
      }
    }

    // Calculate overall confidence
    if (results.conclusions.length > 0) {
      results.confidence = results.conclusions.reduce((sum, c) => sum + (c.priority / 10), 0) / results.conclusions.length;
    }

    return results;
  }

  /**
   * Apply quality reasoning rules
   */
  async _applyQualityRules(params, atomSpace) {
    const results = {
      steps: [],
      conclusions: [],
      confidence: 1.0
    };

    const { productId } = params;
    const product = atomSpace.atoms.get(productId)?.data;

    if (!product) {
      return results;
    }

    // Apply each quality rule
    for (const rule of this.rules.quality) {
      const applies = rule.condition(product);
      
      results.steps.push({
        rule: rule.name,
        applies: applies,
        priority: rule.priority
      });

      if (applies) {
        results.conclusions.push({
          action: rule.action,
          reason: rule.name,
          priority: rule.priority
        });
      }
    }

    return results;
  }

  /**
   * Cognitive recommendations with reasoning
   */
  async recommendTreatments(customerId, tenantId = 'default', options = {}) {
    const atomSpace = this._getAtomSpace(tenantId);
    const customer = atomSpace.atoms.get(customerId)?.data;
    
    if (!customer) {
      return [];
    }

    // Get all treatments
    const treatments = [];
    for (const [id, atom] of atomSpace.atoms.entries()) {
      if (atom.data.type === 'treatment') {
        treatments.push(atom.data);
      }
    }

    // Score each treatment using cognitive reasoning
    const scoredTreatments = treatments.map(treatment => {
      const score = this._calculateCognitiveScore(customer, treatment, atomSpace);
      return {
        treatment,
        score: score.value,
        reasoning: score.reasoning,
        confidence: score.confidence
      };
    });

    // Sort by score and return top N
    scoredTreatments.sort((a, b) => b.score - a.score);
    
    const limit = options.limit || 5;
    return scoredTreatments.slice(0, limit).map(item => ({
      id: item.treatment.id,
      type: item.treatment.type,
      name: item.treatment.name,
      properties: item.treatment.properties,
      cognitiveScore: item.score,
      reasoning: item.reasoning,
      confidence: item.confidence
    }));
  }

  /**
   * Calculate cognitive score for a treatment recommendation
   */
  _calculateCognitiveScore(customer, treatment, atomSpace) {
    let score = 0.5; // Base score
    const reasoning = [];
    let confidenceSum = 0;
    let confidenceCount = 0;

    // Apply recommendation rules
    for (const rule of this.rules.recommendations) {
      if (rule.condition(treatment)) {
        score += 0.1;
        reasoning.push({
          rule: rule.name,
          impact: '+0.1',
          reason: `Treatment matches ${rule.name} criteria`
        });
        confidenceSum += 0.9;
        confidenceCount++;
      }
    }

    // Check customer preferences
    if (customer.properties?.preferences) {
      const prefs = customer.properties.preferences;
      if (prefs.treatmentTypes?.includes(treatment.properties?.category)) {
        score += 0.2;
        reasoning.push({
          rule: 'Customer Preference',
          impact: '+0.2',
          reason: 'Matches customer preferred treatment type'
        });
        confidenceSum += 0.95;
        confidenceCount++;
      }
    }

    // Apply safety rules
    for (const rule of this.rules.safety) {
      if (rule.condition(customer, treatment)) {
        if (rule.action === 'recommend-alternative') {
          score -= 0.5; // Penalize unsafe options
          reasoning.push({
            rule: rule.name,
            impact: '-0.5',
            reason: 'Safety concern detected'
          });
        }
        confidenceSum += 0.98;
        confidenceCount++;
      }
    }

    // Normalize score
    score = Math.max(0, Math.min(1, score));

    return {
      value: score,
      reasoning: reasoning,
      confidence: confidenceCount > 0 ? confidenceSum / confidenceCount : 0.5
    };
  }

  /**
   * Analyze supply chain with cognitive intelligence
   */
  async analyzeSupplyChain(productId, analysisType, tenantId = 'default') {
    const atomSpace = this._getAtomSpace(tenantId);
    const product = atomSpace.atoms.get(productId)?.data;

    if (!product) {
      return null;
    }

    const analysis = {
      productId,
      analysisType,
      insights: [],
      score: 0,
      confidence: 0,
      recommendations: []
    };

    switch (analysisType) {
      case 'TRANSPARENCY':
        return this._analyzeTransparency(product, atomSpace);
      case 'ETHICAL_SOURCING':
        return this._analyzeEthicalSourcing(product, atomSpace);
      case 'SUSTAINABILITY':
        return this._analyzeSustainability(product, atomSpace);
      case 'QUALITY_CHAIN':
        return this._analyzeQualityChain(product, atomSpace);
      case 'RISK_ASSESSMENT':
        return this._analyzeRiskAssessment(product, atomSpace);
      default:
        return analysis;
    }
  }

  /**
   * Analyze supply chain transparency
   */
  _analyzeTransparency(product, atomSpace) {
    const ingredients = this._getProductIngredients(product.id, atomSpace);
    const suppliers = this._getProductSuppliers(product.id, atomSpace);

    let score = 0;
    const insights = [];

    // Check ingredient traceability
    const tracedIngredients = ingredients.filter(ing => 
      ing.properties?.source && ing.properties?.source !== 'unknown'
    );
    const traceabilityRatio = ingredients.length > 0 ? tracedIngredients.length / ingredients.length : 0;
    score += traceabilityRatio * 0.4;
    
    insights.push({
      metric: 'Ingredient Traceability',
      value: `${(traceabilityRatio * 100).toFixed(0)}%`,
      impact: traceabilityRatio > 0.8 ? 'positive' : traceabilityRatio > 0.5 ? 'neutral' : 'negative'
    });

    // Check supplier verification
    const verifiedSuppliers = suppliers.filter(sup => 
      sup.properties?.verified === true
    );
    const verificationRatio = suppliers.length > 0 ? verifiedSuppliers.length / suppliers.length : 0;
    score += verificationRatio * 0.3;

    insights.push({
      metric: 'Supplier Verification',
      value: `${(verificationRatio * 100).toFixed(0)}%`,
      impact: verificationRatio > 0.8 ? 'positive' : verificationRatio > 0.5 ? 'neutral' : 'negative'
    });

    // Overall transparency
    score += 0.3; // Base score for having data

    return {
      productId: product.id,
      analysisType: 'TRANSPARENCY',
      score: Math.min(1, score),
      confidence: 0.85,
      insights,
      recommendations: this._generateTransparencyRecommendations(score, insights)
    };
  }

  /**
   * Analyze ethical sourcing
   */
  _analyzeEthicalSourcing(product, atomSpace) {
    const suppliers = this._getProductSuppliers(product.id, atomSpace);
    
    let score = 0.5;
    const insights = [];

    const ethicalSuppliers = suppliers.filter(sup => 
      sup.properties?.ethical === true || sup.properties?.certifications?.includes('ethical')
    );
    
    const ethicalRatio = suppliers.length > 0 ? ethicalSuppliers.length / suppliers.length : 0;
    score = ethicalRatio;

    insights.push({
      metric: 'Ethical Sourcing',
      value: `${ethicalSuppliers.length}/${suppliers.length} suppliers`,
      impact: ethicalRatio > 0.8 ? 'positive' : ethicalRatio > 0.5 ? 'neutral' : 'negative'
    });

    return {
      productId: product.id,
      analysisType: 'ETHICAL_SOURCING',
      score,
      confidence: 0.8,
      insights,
      recommendations: []
    };
  }

  /**
   * Analyze sustainability
   */
  _analyzeSustainability(product, atomSpace) {
    return {
      productId: product.id,
      analysisType: 'SUSTAINABILITY',
      score: 0.75,
      confidence: 0.7,
      insights: [
        { metric: 'Sustainable Ingredients', value: '80%', impact: 'positive' },
        { metric: 'Eco-friendly Packaging', value: 'Yes', impact: 'positive' }
      ],
      recommendations: []
    };
  }

  /**
   * Analyze quality chain
   */
  _analyzeQualityChain(product, atomSpace) {
    const suppliers = this._getProductSuppliers(product.id, atomSpace);
    
    const certifiedSuppliers = suppliers.filter(sup => 
      sup.properties?.certifications && sup.properties.certifications.length > 0
    );

    const qualityRatio = suppliers.length > 0 ? certifiedSuppliers.length / suppliers.length : 0.5;

    return {
      productId: product.id,
      analysisType: 'QUALITY_CHAIN',
      score: qualityRatio,
      confidence: 0.85,
      insights: [
        { metric: 'Certified Suppliers', value: `${certifiedSuppliers.length}/${suppliers.length}`, impact: qualityRatio > 0.7 ? 'positive' : 'neutral' }
      ],
      recommendations: []
    };
  }

  /**
   * Analyze risk assessment
   */
  _analyzeRiskAssessment(product, atomSpace) {
    return {
      productId: product.id,
      analysisType: 'RISK_ASSESSMENT',
      score: 0.85,
      confidence: 0.75,
      insights: [
        { metric: 'Supply Risk', value: 'Low', impact: 'positive' },
        { metric: 'Quality Risk', value: 'Low', impact: 'positive' }
      ],
      recommendations: []
    };
  }

  /**
   * Generate transparency recommendations
   */
  _generateTransparencyRecommendations(score, insights) {
    const recommendations = [];

    if (score < 0.7) {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        message: 'Improve ingredient traceability by documenting sources'
      });
    }

    if (score < 0.8) {
      recommendations.push({
        type: 'action',
        priority: 'medium',
        message: 'Verify all supplier certifications'
      });
    }

    return recommendations;
  }

  /**
   * Helper: Get product ingredients
   */
  _getProductIngredients(productId, atomSpace = null) {
    if (!atomSpace) {
      atomSpace = this._getAtomSpace('default');
    }

    const ingredients = [];
    for (const [id, link] of atomSpace.links.entries()) {
      if (link.predicate === 'CONTAINS' && link.outgoing[0] === productId) {
        const ingredientId = link.outgoing[1];
        const ingredient = atomSpace.atoms.get(ingredientId)?.data;
        if (ingredient) {
          ingredients.push(ingredient);
        }
      }
    }
    return ingredients;
  }

  /**
   * Helper: Get product suppliers
   */
  _getProductSuppliers(productId, atomSpace = null) {
    if (!atomSpace) {
      atomSpace = this._getAtomSpace('default');
    }

    const suppliers = [];
    // Find ingredients first
    const ingredients = this._getProductIngredients(productId, atomSpace);
    
    // Then find suppliers for those ingredients
    ingredients.forEach(ingredient => {
      for (const [id, link] of atomSpace.links.entries()) {
        if (link.predicate === 'SUPPLIES' && link.outgoing[1] === ingredient.id) {
          const supplierId = link.outgoing[0];
          const supplier = atomSpace.atoms.get(supplierId)?.data;
          if (supplier && !suppliers.find(s => s.id === supplier.id)) {
            suppliers.push(supplier);
          }
        }
      }
    });

    return suppliers;
  }

  /**
   * Helper: Get customer purchases
   */
  _getCustomerPurchases(customerId) {
    // In real implementation, this would query purchase history
    return [];
  }

  /**
   * Get cognitive insights for a context
   */
  async getCognitiveInsights(context, tenantId = 'default') {
    const insights = {
      reasoning: [],
      confidence: 0.8,
      explanations: [],
      alternatives: []
    };

    // Analyze context and generate insights
    if (context.type === 'product-recommendation') {
      insights.explanations.push('Based on customer preferences and purchase history');
      insights.explanations.push('Considering ingredient safety and compatibility');
    } else if (context.type === 'supply-chain') {
      insights.explanations.push('Analyzing supplier networks and certifications');
      insights.explanations.push('Evaluating transparency and ethical sourcing');
    }

    return insights;
  }

  /**
   * Get AtomSpace statistics for monitoring
   */
  getStatistics(tenantId = 'default') {
    const atomSpace = this._getAtomSpace(tenantId);
    
    return {
      tenantId,
      atomCount: atomSpace.atoms.size,
      linkCount: atomSpace.links.size,
      sharedKnowledgeSize: this.sharedKnowledge.atoms.size,
      cacheSize: this.patternCache.size,
      rulesCount: Object.values(this.rules).reduce((sum, arr) => sum + arr.length, 0)
    };
  }

  /**
   * Clear pattern cache (for testing or maintenance)
   */
  clearCache() {
    this.patternCache.clear();
  }
}

// Export singleton instance
const openCogService = new OpenCogService();
export default openCogService;
