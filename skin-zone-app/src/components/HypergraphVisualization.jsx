import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Node type color mapping (defined outside component to avoid re-creation)
const nodeColors = {
  supplier: '#3b82f6',      // blue
  ingredient: '#10b981',    // green
  platform: '#8b5cf6',      // purple
  salon: '#f59e0b',         // amber
  service: '#ec4899',       // pink
  professional: '#06b6d4',  // cyan
  certification: '#84cc16', // lime
  category: '#6366f1'       // indigo
};

const HypergraphVisualization = ({ data }) => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create container group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare graph data
    const nodes = data.nodes.map(d => ({ ...d }));
    const links = data.edges.map(d => ({
      source: d.source,
      target: d.target,
      type: d.type,
      ...d
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(100)
        .strength(0.5))
      .force('charge', d3.forceManyBody()
        .strength(-300)
        .distanceMax(400))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create link elements
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight || 1));

    // Create node elements
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', d => nodeColors[d.type] || '#6b7280')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(drag(simulation))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 12)
          .attr('stroke-width', 3);
        
        // Highlight connected links
        link.attr('stroke-opacity', l => 
          (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1
        );
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('stroke-width', 2);
        
        link.attr('stroke-opacity', 0.6);
      });

    // Add labels
    const label = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.name || d.id)
      .attr('font-size', 10)
      .attr('dx', 12)
      .attr('dy', 4)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Drag behavior
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  const resetView = () => {
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(750)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity
      );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hypergraph Network Visualization</CardTitle>
              <CardDescription>
                Interactive exploration of the Skin Zone cognitive marketplace network
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetView} variant="outline" size="sm">
                Reset View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4 flex-wrap">
            {Object.entries(nodeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-slate-50">
            <svg ref={svgRef} />
          </div>

          {data && (
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.nodes.length}</div>
                <div className="text-gray-600">Total Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.edges.length}</div>
                <div className="text-gray-600">Total Edges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(data.nodes.map(n => n.type)).size}
                </div>
                <div className="text-gray-600">Node Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {(data.edges.length / data.nodes.length).toFixed(2)}
                </div>
                <div className="text-gray-600">Avg Degree</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: nodeColors[selectedNode.type] || '#6b7280' }}
              />
              {selectedNode.name || selectedNode.id}
              <Badge variant="outline" className="ml-2">
                {selectedNode.type}
              </Badge>
            </CardTitle>
            <CardDescription>Node Details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">ID:</div>
                <div>{selectedNode.id}</div>
                
                {selectedNode.website && (
                  <>
                    <div className="font-semibold">Website:</div>
                    <div>
                      <a 
                        href={selectedNode.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedNode.website}
                      </a>
                    </div>
                  </>
                )}

                {selectedNode.category && (
                  <>
                    <div className="font-semibold">Category:</div>
                    <div>{selectedNode.category}</div>
                  </>
                )}

                {selectedNode.function && (
                  <>
                    <div className="font-semibold">Function:</div>
                    <div>{selectedNode.function.replace(/_/g, ' ')}</div>
                  </>
                )}

                {selectedNode.price_per_kg_usd && (
                  <>
                    <div className="font-semibold">Price (per kg):</div>
                    <div>${selectedNode.price_per_kg_usd.toFixed(2)}</div>
                  </>
                )}

                {selectedNode.availability && (
                  <>
                    <div className="font-semibold">Availability:</div>
                    <div>
                      <Badge variant={selectedNode.availability === 'in_stock' ? 'default' : 'destructive'}>
                        {selectedNode.availability.replace('_', ' ')}
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                <div className="mt-4">
                  <div className="font-semibold text-sm mb-2">Additional Metadata:</div>
                  <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(selectedNode.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HypergraphVisualization;
