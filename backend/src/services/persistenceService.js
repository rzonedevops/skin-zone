import fs from 'fs/promises';
import path from 'path';

/**
 * Persistence Service - AtomSpace persistence with optional Redis support
 * 
 * This service provides persistence capabilities for OpenCog AtomSpace data:
 * - File-based persistence (always available)
 * - Redis caching (optional, if Redis is available)
 * - Snapshot management
 * - Incremental updates
 * 
 * Features:
 * - Automatic fallback to file-based storage if Redis unavailable
 * - Efficient serialization/deserialization
 * - Transaction-like snapshot management
 * - Configurable persistence strategies
 */

class PersistenceService {
  constructor() {
    this.redisClient = null;
    this.redisAvailable = false;
    this.persistenceDir = '/tmp/atomspace_snapshots';
    this.config = {
      enableRedis: process.env.REDIS_ENABLED === 'true',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      snapshotInterval: 60000, // 1 minute
      compressionEnabled: false
    };
    this.lastSnapshot = new Map();
  }

  /**
   * Initialize persistence service
   */
  async initialize() {
    // Create persistence directory
    try {
      await fs.mkdir(this.persistenceDir, { recursive: true });
      console.log(`✓ Persistence directory: ${this.persistenceDir}`);
    } catch (error) {
      console.warn('Could not create persistence directory:', error.message);
    }

    // Try to initialize Redis if enabled
    if (this.config.enableRedis) {
      await this._initializeRedis();
    }

    console.log('Persistence Service initialized');
    console.log(`  - Redis: ${this.redisAvailable ? 'ENABLED' : 'DISABLED'}`);
    console.log(`  - File storage: ENABLED`);
  }

  /**
   * Initialize Redis connection (optional)
   */
  async _initializeRedis() {
    try {
      // Note: In production, use 'redis' package: const redis = require('redis');
      // For now, this is a placeholder that logs the intention
      console.log('Redis support: Install redis package for production use');
      console.log('npm install redis');
      
      // Placeholder for actual Redis client initialization
      // this.redisClient = redis.createClient({ url: this.config.redisUrl });
      // await this.redisClient.connect();
      // this.redisAvailable = true;
      
      this.redisAvailable = false; // Disabled by default
    } catch (error) {
      console.warn('Redis connection failed, using file-based persistence:', error.message);
      this.redisAvailable = false;
    }
  }

  /**
   * Save AtomSpace to persistent storage
   */
  async saveAtomSpace(tenantId, atomSpace) {
    const snapshot = this._serializeAtomSpace(atomSpace);
    
    // Save to Redis if available
    if (this.redisAvailable && this.redisClient) {
      await this._saveToRedis(tenantId, snapshot);
    }
    
    // Always save to file system as backup
    await this._saveToFile(tenantId, snapshot);
    
    this.lastSnapshot.set(tenantId, Date.now());
    
    return {
      tenantId,
      timestamp: Date.now(),
      atomCount: atomSpace.atoms.size,
      linkCount: atomSpace.links.size
    };
  }

  /**
   * Load AtomSpace from persistent storage
   */
  async loadAtomSpace(tenantId) {
    let snapshot = null;

    // Try Redis first if available
    if (this.redisAvailable && this.redisClient) {
      snapshot = await this._loadFromRedis(tenantId);
    }

    // Fallback to file system
    if (!snapshot) {
      snapshot = await this._loadFromFile(tenantId);
    }

    if (!snapshot) {
      return null;
    }

    return this._deserializeAtomSpace(snapshot);
  }

  /**
   * Serialize AtomSpace to JSON
   */
  _serializeAtomSpace(atomSpace) {
    const serialized = {
      atoms: {},
      links: {},
      metadata: {
        timestamp: Date.now(),
        version: '1.0'
      }
    };

    // Convert Map to plain object for serialization
    for (const [id, atom] of atomSpace.atoms.entries()) {
      serialized.atoms[id] = atom;
    }

    for (const [id, link] of atomSpace.links.entries()) {
      serialized.links[id] = link;
    }

    return serialized;
  }

  /**
   * Deserialize AtomSpace from JSON
   */
  _deserializeAtomSpace(snapshot) {
    const atomSpace = {
      atoms: new Map(),
      links: new Map(),
      attentionFocus: []
    };

    // Convert plain object back to Map
    if (snapshot.atoms) {
      for (const [id, atom] of Object.entries(snapshot.atoms)) {
        atomSpace.atoms.set(id, atom);
      }
    }

    if (snapshot.links) {
      for (const [id, link] of Object.entries(snapshot.links)) {
        atomSpace.links.set(id, link);
      }
    }

    return atomSpace;
  }

  /**
   * Save to Redis (placeholder for actual implementation)
   */
  async _saveToRedis(tenantId, snapshot) {
    if (!this.redisClient) return;

    const key = `atomspace:${tenantId}`;
    const value = JSON.stringify(snapshot);
    
    // Placeholder: await this.redisClient.set(key, value);
    // Placeholder: await this.redisClient.expire(key, 3600); // 1 hour TTL
  }

  /**
   * Load from Redis (placeholder for actual implementation)
   */
  async _loadFromRedis(tenantId) {
    if (!this.redisClient) return null;

    const key = `atomspace:${tenantId}`;
    
    // Placeholder: const value = await this.redisClient.get(key);
    // Placeholder: return value ? JSON.parse(value) : null;
    
    return null;
  }

  /**
   * Save to file system
   */
  async _saveToFile(tenantId, snapshot) {
    const filename = path.join(this.persistenceDir, `${tenantId}.json`);
    const data = JSON.stringify(snapshot, null, 2);
    
    try {
      await fs.writeFile(filename, data, 'utf8');
    } catch (error) {
      console.error(`Failed to save AtomSpace for tenant ${tenantId}:`, error.message);
      throw error;
    }
  }

  /**
   * Load from file system
   */
  async _loadFromFile(tenantId) {
    const filename = path.join(this.persistenceDir, `${tenantId}.json`);
    
    try {
      const data = await fs.readFile(filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Failed to load AtomSpace for tenant ${tenantId}:`, error.message);
      }
      return null;
    }
  }

  /**
   * List all persisted AtomSpaces
   */
  async listPersistedAtomSpaces() {
    try {
      const files = await fs.readdir(this.persistenceDir);
      return files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
    } catch (error) {
      console.error('Failed to list persisted AtomSpaces:', error.message);
      return [];
    }
  }

  /**
   * Delete persisted AtomSpace
   */
  async deleteAtomSpace(tenantId) {
    // Delete from Redis if available
    if (this.redisAvailable && this.redisClient) {
      const key = `atomspace:${tenantId}`;
      // Placeholder: await this.redisClient.del(key);
    }

    // Delete from file system
    const filename = path.join(this.persistenceDir, `${tenantId}.json`);
    try {
      await fs.unlink(filename);
      this.lastSnapshot.delete(tenantId);
      return true;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Failed to delete AtomSpace for tenant ${tenantId}:`, error.message);
      }
      return false;
    }
  }

  /**
   * Create a snapshot of all AtomSpaces
   */
  async createSnapshot(atomSpaces) {
    const snapshotId = `snapshot_${Date.now()}`;
    const results = [];

    for (const [tenantId, atomSpace] of atomSpaces.entries()) {
      try {
        const result = await this.saveAtomSpace(tenantId, atomSpace);
        results.push(result);
      } catch (error) {
        console.error(`Failed to snapshot tenant ${tenantId}:`, error.message);
      }
    }

    return {
      snapshotId,
      timestamp: Date.now(),
      tenantCount: results.length,
      tenants: results
    };
  }

  /**
   * Get persistence statistics
   */
  getStatistics() {
    return {
      redisAvailable: this.redisAvailable,
      lastSnapshotTimes: Object.fromEntries(this.lastSnapshot),
      persistenceDir: this.persistenceDir,
      config: {
        enableRedis: this.config.enableRedis,
        snapshotInterval: this.config.snapshotInterval
      }
    };
  }

  /**
   * Cleanup old snapshots
   */
  async cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days default
    try {
      const files = await fs.readdir(this.persistenceDir);
      const now = Date.now();
      let deletedCount = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filepath = path.join(this.persistenceDir, file);
        const stats = await fs.stat(filepath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          await fs.unlink(filepath);
          deletedCount++;
        }
      }

      return { deletedCount, maxAge };
    } catch (error) {
      console.error('Cleanup failed:', error.message);
      return { deletedCount: 0, error: error.message };
    }
  }

  /**
   * Close connections and cleanup
   */
  async close() {
    if (this.redisClient) {
      // Placeholder: await this.redisClient.quit();
    }
  }
}

// Export singleton instance
const persistenceService = new PersistenceService();
export default persistenceService;
