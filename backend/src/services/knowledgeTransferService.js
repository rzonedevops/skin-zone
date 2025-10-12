/**
 * Knowledge Transfer Service - Cross-tenant knowledge sharing for OpenCog
 * 
 * This service enables secure knowledge transfer between tenants while
 * preserving privacy and maintaining data isolation.
 * 
 * Features:
 * - Privacy-preserving knowledge aggregation
 * - Pattern extraction from multiple tenants
 * - Federated learning-style updates
 * - Configurable sharing policies
 */

class KnowledgeTransferService {
  constructor() {
    // Track shared patterns across tenants
    this.sharedPatterns = new Map();
    
    // Knowledge transfer policies
    this.transferPolicies = new Map();
    
    // Aggregated statistics
    this.aggregatedStats = {
      totalTransfers: 0,
      successfulTransfers: 0,
      failedTransfers: 0,
      lastTransferTime: null
    };
  }

  /**
   * Initialize knowledge transfer service
   */
  initialize() {
    // Set default transfer policies
    this._setDefaultPolicies();
    console.log('Knowledge Transfer Service initialized');
  }

  /**
   * Set default transfer policies
   */
  _setDefaultPolicies() {
    // Default policy: Share patterns with high confidence
    this.setTransferPolicy('default', {
      minConfidence: 0.85,
      minOccurrences: 3,
      excludePatterns: ['customer_*', 'order_*'], // Privacy-sensitive patterns
      allowedTypes: ['ingredient', 'treatment', 'product'],
      aggregationMethod: 'weighted_average'
    });
  }

  /**
   * Set transfer policy for a tenant
   */
  setTransferPolicy(tenantId, policy) {
    this.transferPolicies.set(tenantId, {
      ...this._getDefaultPolicy(),
      ...policy
    });
  }

  /**
   * Get transfer policy for a tenant
   */
  _getDefaultPolicy() {
    return {
      minConfidence: 0.85,
      minOccurrences: 3,
      excludePatterns: [],
      allowedTypes: [],
      aggregationMethod: 'weighted_average'
    };
  }

  /**
   * Extract transferable knowledge from a tenant's AtomSpace
   */
  extractTransferableKnowledge(atomSpace, tenantId) {
    const policy = this.transferPolicies.get(tenantId) || this._getDefaultPolicy();
    const transferableAtoms = [];

    for (const [id, atom] of atomSpace.atoms.entries()) {
      // Check if atom meets transfer criteria
      if (this._meetsTransferCriteria(atom, policy)) {
        // Anonymize and prepare for transfer
        const anonymizedAtom = this._anonymizeAtom(atom);
        transferableAtoms.push(anonymizedAtom);
      }
    }

    return transferableAtoms;
  }

  /**
   * Check if atom meets transfer criteria
   */
  _meetsTransferCriteria(atom, policy) {
    // Check confidence threshold
    if (atom.truthValue.confidence < policy.minConfidence) {
      return false;
    }

    // Check if pattern is excluded (privacy)
    for (const pattern of policy.excludePatterns) {
      if (this._matchesPattern(atom.id, pattern)) {
        return false;
      }
    }

    // Check if type is allowed
    if (policy.allowedTypes.length > 0) {
      if (!policy.allowedTypes.includes(atom.data.type)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Match atom ID against pattern
   */
  _matchesPattern(id, pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(id);
  }

  /**
   * Anonymize atom for cross-tenant sharing
   */
  _anonymizeAtom(atom) {
    return {
      type: atom.type,
      dataType: atom.data.type,
      truthValue: { ...atom.truthValue },
      attentionValue: { ...atom.attentionValue },
      // Remove tenant-specific identifiers
      metadata: {
        source: 'aggregated',
        timestamp: Date.now()
      }
    };
  }

  /**
   * Aggregate knowledge from multiple tenants
   */
  aggregateKnowledge(atomSpaces, tenantIds) {
    const aggregatedKnowledge = new Map();
    this.aggregatedStats.totalTransfers++;

    try {
      for (const tenantId of tenantIds) {
        const atomSpace = atomSpaces.get(tenantId);
        if (!atomSpace) continue;

        const transferable = this.extractTransferableKnowledge(atomSpace, tenantId);
        
        // Aggregate patterns
        for (const atom of transferable) {
          const key = this._getAggregationKey(atom);
          
          if (!aggregatedKnowledge.has(key)) {
            aggregatedKnowledge.set(key, {
              count: 0,
              totalConfidence: 0,
              totalStrength: 0,
              atoms: []
            });
          }

          const agg = aggregatedKnowledge.get(key);
          agg.count++;
          agg.totalConfidence += atom.truthValue.confidence;
          agg.totalStrength += atom.truthValue.strength;
          agg.atoms.push(atom);
        }
      }

      this.aggregatedStats.successfulTransfers++;
      this.aggregatedStats.lastTransferTime = Date.now();

      return this._computeAggregatedPatterns(aggregatedKnowledge);
    } catch (error) {
      this.aggregatedStats.failedTransfers++;
      console.error('Knowledge aggregation failed:', error);
      return [];
    }
  }

  /**
   * Get aggregation key for an atom
   */
  _getAggregationKey(atom) {
    return `${atom.type}:${atom.dataType}`;
  }

  /**
   * Compute aggregated patterns from collected knowledge
   */
  _computeAggregatedPatterns(aggregatedKnowledge) {
    const patterns = [];

    for (const [key, agg] of aggregatedKnowledge.entries()) {
      // Only include patterns that occur in multiple tenants
      if (agg.count >= 2) {
        patterns.push({
          key,
          count: agg.count,
          avgConfidence: agg.totalConfidence / agg.count,
          avgStrength: agg.totalStrength / agg.count,
          pattern: {
            type: agg.atoms[0].type,
            dataType: agg.atoms[0].dataType
          }
        });
      }
    }

    return patterns;
  }

  /**
   * Transfer aggregated knowledge to a tenant
   */
  transferKnowledgeToTenant(aggregatedPatterns, atomSpace, tenantId) {
    let transferredCount = 0;

    for (const pattern of aggregatedPatterns) {
      // Create a shared knowledge atom
      const sharedAtomId = `shared_${pattern.key}_${Date.now()}`;
      
      atomSpace.atoms.set(sharedAtomId, {
        type: 'shared_knowledge',
        id: sharedAtomId,
        data: {
          type: pattern.dataType,
          source: 'aggregated',
          contributingTenants: pattern.count
        },
        truthValue: {
          strength: pattern.avgStrength,
          confidence: pattern.avgConfidence
        },
        attentionValue: {
          sti: 50, // Medium importance
          lti: 0,
          vlti: 0
        },
        timestamp: Date.now()
      });

      transferredCount++;
    }

    console.log(`Transferred ${transferredCount} knowledge patterns to tenant ${tenantId}`);
    return transferredCount;
  }

  /**
   * Perform federated learning update
   * This aggregates patterns and distributes them to participating tenants
   */
  async performFederatedUpdate(atomSpaces, participatingTenants) {
    console.log(`Starting federated update for ${participatingTenants.length} tenants`);

    // Step 1: Aggregate knowledge from all tenants
    const aggregatedPatterns = this.aggregateKnowledge(atomSpaces, participatingTenants);
    console.log(`Aggregated ${aggregatedPatterns.length} patterns`);

    // Step 2: Transfer aggregated knowledge back to each tenant
    const results = {};
    for (const tenantId of participatingTenants) {
      const atomSpace = atomSpaces.get(tenantId);
      if (atomSpace) {
        const transferred = this.transferKnowledgeToTenant(
          aggregatedPatterns,
          atomSpace,
          tenantId
        );
        results[tenantId] = transferred;
      }
    }

    return {
      aggregatedPatterns: aggregatedPatterns.length,
      tenantUpdates: results,
      timestamp: Date.now()
    };
  }

  /**
   * Get statistics about knowledge transfer
   */
  getStatistics() {
    return {
      ...this.aggregatedStats,
      sharedPatternsCount: this.sharedPatterns.size,
      activePolicies: this.transferPolicies.size
    };
  }

  /**
   * Clear shared patterns
   */
  clearSharedPatterns() {
    this.sharedPatterns.clear();
  }
}

// Export singleton instance
const knowledgeTransferService = new KnowledgeTransferService();
export default knowledgeTransferService;
