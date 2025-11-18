import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// In production, these should be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hypergraph data fetching functions
export const fetchNodes = async () => {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return null;
  }
};

export const fetchEdges = async () => {
  try {
    const { data, error } = await supabase
      .from('edges')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching edges:', error);
    return null;
  }
};

export const fetchHypergraphData = async () => {
  try {
    const [nodes, edges] = await Promise.all([
      fetchNodes(),
      fetchEdges()
    ]);

    if (!nodes || !edges) {
      throw new Error('Failed to fetch hypergraph data');
    }

    return {
      metadata: {
        version: '3.0',
        last_updated: new Date().toISOString(),
        description: 'Live hypergraph data from Supabase',
        node_count: nodes.length,
        edge_count: edges.length
      },
      nodes,
      edges
    };
  } catch (error) {
    console.error('Error fetching hypergraph data:', error);
    return null;
  }
};

// Real-time subscription to hypergraph changes
export const subscribeToHypergraphChanges = (onNodesChange, onEdgesChange) => {
  const nodesSubscription = supabase
    .channel('nodes-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'nodes' },
      (payload) => {
        console.log('Nodes changed:', payload);
        if (onNodesChange) onNodesChange(payload);
      }
    )
    .subscribe();

  const edgesSubscription = supabase
    .channel('edges-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'edges' },
      (payload) => {
        console.log('Edges changed:', payload);
        if (onEdgesChange) onEdgesChange(payload);
      }
    )
    .subscribe();

  return () => {
    nodesSubscription.unsubscribe();
    edgesSubscription.unsubscribe();
  };
};

// Insert new node
export const insertNode = async (node) => {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .insert([node])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting node:', error);
    return null;
  }
};

// Insert new edge
export const insertEdge = async (edge) => {
  try {
    const { data, error } = await supabase
      .from('edges')
      .insert([edge])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting edge:', error);
    return null;
  }
};

// Update node
export const updateNode = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating node:', error);
    return null;
  }
};

// Calculate cognitive metrics from hypergraph
export const calculateCognitiveMetrics = (nodes, edges) => {
  if (!nodes || !edges || nodes.length === 0) {
    return {
      networkStrength: 0,
      adaptiveCapacity: 0,
      emergentIntelligence: 0,
      systemCoherence: 0
    };
  }

  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  
  // Calculate network density
  const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
  const networkDensity = maxEdges > 0 ? edgeCount / maxEdges : 0;
  
  // Calculate average degree
  const avgDegree = nodeCount > 0 ? (2 * edgeCount) / nodeCount : 0;
  
  // Count node types
  const typeCount = new Set(nodes.map(n => n.type)).size;
  
  // Calculate cross-type connections
  const crossTypeEdges = edges.filter(e => {
    const sourceNode = nodes.find(n => n.id === e.source);
    const targetNode = nodes.find(n => n.id === e.target);
    return sourceNode && targetNode && sourceNode.type !== targetNode.type;
  }).length;
  
  const crossTypeRatio = edgeCount > 0 ? crossTypeEdges / edgeCount : 0;
  
  // Calculate metrics
  const networkStrength = Math.min(100, (networkDensity * 1000 + avgDegree * 10) * 2);
  const adaptiveCapacity = Math.min(100, (typeCount / 10) * 100 + (avgDegree / 5) * 20);
  const emergentIntelligence = Math.min(100, crossTypeRatio * 100 + typeCount * 5);
  const systemCoherence = Math.min(100, (avgDegree / 10) * 50 + (networkDensity * 1000) + 40);
  
  return {
    networkStrength: Math.round(networkStrength),
    adaptiveCapacity: Math.round(adaptiveCapacity),
    emergentIntelligence: Math.round(emergentIntelligence),
    systemCoherence: Math.round(systemCoherence),
    stats: {
      nodeCount,
      edgeCount,
      networkDensity: networkDensity.toFixed(4),
      avgDegree: avgDegree.toFixed(2),
      typeCount,
      crossTypeRatio: crossTypeRatio.toFixed(2)
    }
  };
};
