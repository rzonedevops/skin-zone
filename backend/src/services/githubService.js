import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GitHub Integration Service
 * Maps repo folders to GraphQL structure and supports scaling utilities
 */
class GitHubService {
  constructor() {
    this.repoRoot = path.join(__dirname, '../../..');
  }

  /**
   * Map repo folder structure to hypergraph entities
   * Entities folder maps to nodes, relations can be inferred
   */
  mapRepoToGraph() {
    const entities = this.loadEntitiesFromRepo();
    const relations = this.inferRelationsFromFiles();
    
    return {
      entities,
      relations,
      structure: this.getRepoStructure()
    };
  }

  /**
   * Load entities from entities/ folder
   */
  loadEntitiesFromRepo() {
    const entitiesPath = path.join(this.repoRoot, 'entities');
    const entities = [];
    
    if (!fs.existsSync(entitiesPath)) {
      return entities;
    }
    
    const files = fs.readdirSync(entitiesPath);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(entitiesPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Parse entity type from filename
        const type = file.replace('.md', '');
        
        entities.push({
          type,
          file,
          path: filePath,
          content: content.substring(0, 500) // Preview
        });
      }
    });
    
    return entities;
  }

  /**
   * Infer relations from entity files
   */
  inferRelationsFromFiles() {
    const relationsPath = path.join(this.repoRoot, 'entities', 'relationships.md');
    const relations = [];
    
    if (fs.existsSync(relationsPath)) {
      const content = fs.readFileSync(relationsPath, 'utf8');
      
      // Parse relationships from markdown
      // This is a simple parser - could be more sophisticated
      const lines = content.split('\n');
      lines.forEach(line => {
        // Look for patterns like "A relates to B" or "A -> B"
        const match = line.match(/(\w+)\s*(?:->|relates to|connects to)\s*(\w+)/i);
        if (match) {
          relations.push({
            source: match[1].toLowerCase(),
            target: match[2].toLowerCase(),
            type: 'RELATED_TO'
          });
        }
      });
    }
    
    return relations;
  }

  /**
   * Get repository structure
   */
  getRepoStructure() {
    const structure = {
      root: this.repoRoot,
      folders: []
    };
    
    const mainFolders = ['entities', 'architecture', 'documentation'];
    
    mainFolders.forEach(folder => {
      const folderPath = path.join(this.repoRoot, folder);
      if (fs.existsSync(folderPath)) {
        structure.folders.push({
          name: folder,
          path: folderPath,
          files: fs.readdirSync(folderPath)
        });
      }
    });
    
    return structure;
  }

  /**
   * Project entities/relations to GitHub folder structure
   * For org-level repos: /orgs/{orgId}/entities/{entityType}/
   */
  projectToOrgStructure(orgId, entities, relations) {
    const orgPath = path.join(this.repoRoot, 'orgs', orgId);
    
    // Create org directory structure
    const dirs = [
      path.join(orgPath, 'entities'),
      path.join(orgPath, 'relations')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Write entities
    const entitiesFile = path.join(orgPath, 'entities', 'nodes.json');
    fs.writeFileSync(entitiesFile, JSON.stringify(entities, null, 2));
    
    // Write relations
    const relationsFile = path.join(orgPath, 'relations', 'edges.json');
    fs.writeFileSync(relationsFile, JSON.stringify(relations, null, 2));
    
    return {
      orgPath,
      entitiesFile,
      relationsFile
    };
  }

  /**
   * Compress data for storage
   * Removes embeddings and non-essential fields
   */
  compressForStorage(data) {
    return {
      nodes: data.nodes.map(n => ({
        id: n.id,
        type: n.type,
        name: n.name,
        tenantId: n.tenantId
      })),
      edges: data.edges.map(e => ({
        source: e.source,
        target: e.target,
        type: e.type,
        tenantId: e.tenantId
      }))
    };
  }

  /**
   * Expand compressed data
   * Restores full structure with default values
   */
  expandFromStorage(compressedData) {
    return {
      nodes: compressedData.nodes.map(n => ({
        ...n,
        properties: {},
        embedding: []
      })),
      edges: compressedData.edges.map(e => ({
        ...e,
        weight: 1.0,
        properties: {}
      }))
    };
  }

  /**
   * Aggregate data at org level
   * Combines data from multiple repos/folders
   */
  aggregateOrgData(orgId) {
    const orgPath = path.join(this.repoRoot, 'orgs', orgId);
    
    if (!fs.existsSync(orgPath)) {
      return null;
    }
    
    const entitiesFile = path.join(orgPath, 'entities', 'nodes.json');
    const relationsFile = path.join(orgPath, 'relations', 'edges.json');
    
    const aggregated = {
      orgId,
      entities: [],
      relations: []
    };
    
    if (fs.existsSync(entitiesFile)) {
      aggregated.entities = JSON.parse(fs.readFileSync(entitiesFile, 'utf8'));
    }
    
    if (fs.existsSync(relationsFile)) {
      aggregated.relations = JSON.parse(fs.readFileSync(relationsFile, 'utf8'));
    }
    
    return aggregated;
  }

  /**
   * Export data for GitHub sync
   */
  exportForGitHub(tenantId = null) {
    // This would export data in a format suitable for committing to GitHub
    return {
      timestamp: new Date().toISOString(),
      tenantId,
      format: 'hypergraph-json',
      version: '1.0.0'
    };
  }
}

// Singleton instance
const githubService = new GitHubService();

export default githubService;
