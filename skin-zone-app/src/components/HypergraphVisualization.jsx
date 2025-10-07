import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Network, Zap, Brain, TrendingUp } from 'lucide-react'

const HypergraphVisualization = ({ data, onNodeSelect }) => {
  const svgRef = useRef()
  const [selectedNode, setSelectedNode] = useState(null)
  const [networkMetrics, setNetworkMetrics] = useState({
    totalNodes: 0,
    totalEdges: 0,
    clusterCoefficient: 0,
    networkDensity: 0
  })

  useEffect(() => {
    if (!data || !data.nodes || !data.edges) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 600
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    svg.attr("width", width).attr("height", height)

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30))

    // Color scale for different node types
    const colorScale = d3.scaleOrdinal()
      .domain(["supplier", "ingredient", "salon", "service", "category"])
      .range(["#8B5CF6", "#06B6D4", "#F59E0B", "#EF4444", "#10B981"])

    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.edges)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)

    // Create nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => {
        const connections = data.edges.filter(e => e.source === d.id || e.target === d.id).length
        return Math.max(8, Math.min(25, 8 + connections * 2))
      })
      .attr("fill", d => colorScale(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d)
        if (onNodeSelect) onNodeSelect(d)
        
        // Highlight connected nodes
        const connectedNodes = new Set()
        data.edges.forEach(edge => {
          if (edge.source === d.id || edge.source.id === d.id) {
            connectedNodes.add(edge.target.id || edge.target)
          }
          if (edge.target === d.id || edge.target.id === d.id) {
            connectedNodes.add(edge.source.id || edge.source)
          }
        })
        
        node.selectAll("circle")
          .style("opacity", n => n.id === d.id || connectedNodes.has(n.id) ? 1 : 0.3)
        
        link.style("opacity", e => 
          (e.source.id === d.id || e.target.id === d.id) ? 1 : 0.1
        )
      })
      .on("mouseover", (event, d) => {
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("opacity", 0)

        tooltip.transition().duration(200).style("opacity", 1)
        tooltip.html(`<strong>${d.name}</strong><br/>Type: ${d.type}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
      })
      .on("mouseout", () => {
        d3.selectAll(".tooltip").remove()
      })

    // Add labels to nodes
    node.append("text")
      .text(d => d.name.length > 15 ? d.name.substring(0, 12) + "..." : d.name)
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "500")
      .style("fill", "#374151")

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

      node.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Calculate network metrics
    const totalNodes = data.nodes.length
    const totalEdges = data.edges.length
    const maxPossibleEdges = (totalNodes * (totalNodes - 1)) / 2
    const networkDensity = totalEdges / maxPossibleEdges

    setNetworkMetrics({
      totalNodes,
      totalEdges,
      clusterCoefficient: Math.random() * 0.5 + 0.3, // Placeholder calculation
      networkDensity: networkDensity
    })

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [data, onNodeSelect])

  const resetVisualization = () => {
    setSelectedNode(null)
    const svg = d3.select(svgRef.current)
    svg.selectAll("circle").style("opacity", 1)
    svg.selectAll("line").style("opacity", 0.6)
  }

  return (
    <div className="space-y-6">
      {/* Network Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-600" />
              Total Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{networkMetrics.totalNodes}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{networkMetrics.totalEdges}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              Clustering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {(networkMetrics.clusterCoefficient * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Density
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {(networkMetrics.networkDensity * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Container */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Supply Chain Network Hypergraph</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetVisualization}>
                Reset View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {/* SVG Visualization */}
            <div className="flex-1">
              <svg ref={svgRef} className="border rounded-lg bg-gray-50"></svg>
            </div>

            {/* Node Details Panel */}
            {selectedNode && (
              <div className="w-80">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedNode.name}</CardTitle>
                    <Badge variant="secondary">{selectedNode.type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Node Properties</h4>
                      <div className="space-y-1 text-sm">
                        <div>ID: {selectedNode.id}</div>
                        <div>Type: {selectedNode.type}</div>
                        {selectedNode.properties && Object.entries(selectedNode.properties).map(([key, value]) => (
                          <div key={key}>
                            {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Connections</h4>
                      <div className="text-sm text-gray-500">
                        {data.edges.filter(e => 
                          e.source === selectedNode.id || 
                          e.target === selectedNode.id ||
                          e.source.id === selectedNode.id || 
                          e.target.id === selectedNode.id
                        ).length} direct connections
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm">Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
              <span className="text-sm">Ingredients</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-sm">Salons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Categories</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HypergraphVisualization
