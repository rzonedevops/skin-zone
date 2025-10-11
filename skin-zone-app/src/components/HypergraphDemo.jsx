import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import hypergraphApi from '../services/hypergraphApi';

/**
 * Demo component showing HyperGraphQL API integration
 */
export default function HypergraphDemo() {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial nodes
  useEffect(() => {
    loadNodes();
  }, []);

  async function loadNodes() {
    setLoading(true);
    setError(null);
    try {
      const data = await hypergraphApi.getNodes({}, 10);
      setNodes(data);
    } catch (err) {
      setError('Failed to load nodes: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function selectNode(node) {
    setSelectedNode(node);
    setLoading(true);
    setError(null);
    try {
      const neighborData = await hypergraphApi.getNeighbors(node.id);
      setNeighbors(neighborData);
    } catch (err) {
      setError('Failed to load neighbors: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      ingredient: 'bg-blue-100 text-blue-700',
      supplier: 'bg-green-100 text-green-700',
      product: 'bg-purple-100 text-purple-700',
      salon: 'bg-pink-100 text-pink-700',
      category: 'bg-yellow-100 text-yellow-700',
      service: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>HyperGraph Explorer</CardTitle>
          <CardDescription>
            Navigate the beauty marketplace hypergraph using the HyperGraphQL API
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nodes List */}
            <div>
              <h3 className="font-semibold mb-3">Entities</h3>
              {loading && !selectedNode ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {nodes.map(node => (
                    <div
                      key={node.id}
                      className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                        selectedNode?.id === node.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => selectNode(node)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{node.name}</span>
                        <Badge className={getTypeColor(node.type)}>
                          {node.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Neighbors */}
            <div>
              <h3 className="font-semibold mb-3">
                {selectedNode ? `Neighbors of ${selectedNode.name}` : 'Select an entity'}
              </h3>
              {selectedNode && (
                <div className="space-y-2">
                  {loading ? (
                    <div className="text-gray-500">Loading neighbors...</div>
                  ) : neighbors.length > 0 ? (
                    neighbors.map(neighbor => (
                      <div
                        key={neighbor.id}
                        className="p-3 border rounded hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{neighbor.name}</span>
                          <Badge className={getTypeColor(neighbor.type)}>
                            {neighbor.type}
                          </Badge>
                        </div>
                        {neighbor.properties?.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {neighbor.properties.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No neighbors found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
