import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { calculateCognitiveMetrics } from '@/lib/supabase';

const RealTimeCognitiveMetrics = ({ nodes, edges }) => {
  const [metrics, setMetrics] = useState({
    networkStrength: 0,
    adaptiveCapacity: 0,
    emergentIntelligence: 0,
    systemCoherence: 0,
    stats: {}
  });

  useEffect(() => {
    if (nodes && edges) {
      const calculatedMetrics = calculateCognitiveMetrics(nodes, edges);
      setMetrics(calculatedMetrics);
    }
  }, [nodes, edges]);

  const getMetricColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (value) => {
    if (value >= 80) return 'bg-green-600';
    if (value >= 60) return 'bg-blue-600';
    if (value >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const metricDescriptions = {
    networkStrength: 'Measures overall connectivity and robustness of the hypergraph network',
    adaptiveCapacity: 'Ability to respond to market changes through diverse node types and connections',
    emergentIntelligence: 'Novel patterns arising from cross-domain interactions between different entity types',
    systemCoherence: 'Integration and alignment across all cognitive subsystems'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            Real-Time Cognitive Synergy Metrics
          </CardTitle>
          <CardDescription>
            Live calculations from hypergraph topology • {metrics.stats.nodeCount} nodes • {metrics.stats.edgeCount} edges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Network Strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Network Strength</span>
                  <Badge variant="outline" className="text-xs">
                    Deep Tree Echo
                  </Badge>
                </div>
                <span className={`text-2xl font-bold ${getMetricColor(metrics.networkStrength)}`}>
                  {metrics.networkStrength}%
                </span>
              </div>
              <Progress 
                value={metrics.networkStrength} 
                className="h-2"
              />
              <p className="text-sm text-gray-600">
                {metricDescriptions.networkStrength}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Network Density: {metrics.stats.networkDensity}</div>
                <div>Average Degree: {metrics.stats.avgDegree}</div>
              </div>
            </div>

            {/* Adaptive Capacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Adaptive Capacity</span>
                  <Badge variant="outline" className="text-xs">
                    Marduk
                  </Badge>
                </div>
                <span className={`text-2xl font-bold ${getMetricColor(metrics.adaptiveCapacity)}`}>
                  {metrics.adaptiveCapacity}%
                </span>
              </div>
              <Progress 
                value={metrics.adaptiveCapacity} 
                className="h-2"
              />
              <p className="text-sm text-gray-600">
                {metricDescriptions.adaptiveCapacity}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Node Types: {metrics.stats.typeCount}</div>
                <div>Diversity Index: {((metrics.stats.typeCount / metrics.stats.nodeCount) * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Emergent Intelligence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Emergent Intelligence</span>
                  <Badge variant="outline" className="text-xs">
                    JAX CEO
                  </Badge>
                </div>
                <span className={`text-2xl font-bold ${getMetricColor(metrics.emergentIntelligence)}`}>
                  {metrics.emergentIntelligence}%
                </span>
              </div>
              <Progress 
                value={metrics.emergentIntelligence} 
                className="h-2"
              />
              <p className="text-sm text-gray-600">
                {metricDescriptions.emergentIntelligence}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Cross-Type Ratio: {metrics.stats.crossTypeRatio}</div>
                <div>Pattern Complexity: {(metrics.emergentIntelligence / 10).toFixed(1)}/10</div>
              </div>
            </div>

            {/* System Coherence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">System Coherence</span>
                  <Badge variant="outline" className="text-xs">
                    AAR Core
                  </Badge>
                </div>
                <span className={`text-2xl font-bold ${getMetricColor(metrics.systemCoherence)}`}>
                  {metrics.systemCoherence}%
                </span>
              </div>
              <Progress 
                value={metrics.systemCoherence} 
                className="h-2"
              />
              <p className="text-sm text-gray-600">
                {metricDescriptions.systemCoherence}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Integration Score: {(metrics.systemCoherence / 100).toFixed(2)}</div>
                <div>Alignment: {metrics.systemCoherence >= 80 ? 'Optimal' : metrics.systemCoherence >= 60 ? 'Good' : 'Improving'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Architecture Status */}
      <Card>
        <CardHeader>
          <CardTitle>Cognitive Architecture Status</CardTitle>
          <CardDescription>
            Real-time status of dual-hemisphere cognitive processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                <div>
                  <div className="font-semibold">Deep Tree Echo</div>
                  <div className="text-xs text-gray-600">Right Hemisphere</div>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Novelty Detection:</span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pattern Recognition:</span>
                  <Badge variant="outline" className="text-xs">Operational</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Exploration:</span>
                  <Badge variant="outline" className="text-xs">Enabled</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-semibold">Marduk</div>
                  <div className="text-xs text-gray-600">Left Hemisphere</div>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Optimization:</span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Logic Processing:</span>
                  <Badge variant="outline" className="text-xs">Operational</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Production:</span>
                  <Badge variant="outline" className="text-xs">Ready</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-semibold">JAX CEO</div>
                  <div className="text-xs text-gray-600">Neural Orchestration</div>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Neural Compute:</span>
                  <Badge variant="outline" className="text-xs">Ready</Badge>
                </div>
                <div className="flex justify-between">
                  <span>AutoDiff:</span>
                  <Badge variant="outline" className="text-xs">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Optimization:</span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hypergraph Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Hypergraph Network Statistics</CardTitle>
          <CardDescription>
            Detailed topology metrics and graph properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{metrics.stats.nodeCount}</div>
              <div className="text-sm text-gray-600 mt-1">Total Nodes</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">{metrics.stats.edgeCount}</div>
              <div className="text-sm text-gray-600 mt-1">Total Edges</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">{metrics.stats.typeCount}</div>
              <div className="text-sm text-gray-600 mt-1">Node Types</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-amber-600">{metrics.stats.avgDegree}</div>
              <div className="text-sm text-gray-600 mt-1">Avg Degree</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeCognitiveMetrics;
