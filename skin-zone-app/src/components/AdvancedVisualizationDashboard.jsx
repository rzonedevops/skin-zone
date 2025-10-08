import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap, Cell } from 'recharts';
import * as d3 from 'd3';
import * as anime from 'animejs';

const AdvancedVisualizationDashboard = ({ 
  selfOrgData, 
  emergentData, 
  marketIntelligence, 
  onSystemInteraction 
}) => {
  const [visualizationMode, setVisualizationMode] = useState('membrane_hierarchy');
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [showActivationFlows, setShowActivationFlows] = useState(true);
  
  const membraneRef = useRef();
  const patternNetworkRef = useRef();
  const activationFlowRef = useRef();

  // JAX CEO neural computation theme colors
  const themeColors = {
    primary: '#4f46e5',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    success: '#10b981',
    neural: '#8b5cf6',
    cognitive: '#ec4899',
    background: '#0a0a0f',
    surface: '#1a1a2e',
    warning: '#ef4444',
    membrane: '#2dd4bf',
    pattern: '#f472b6',
    activation: '#fbbf24'
  };

  // Process visualization data
  const processedVisualizationData = React.useMemo(() => {
    if (!selfOrgData) return { membranes: [], patterns: [], activations: [] };

    const membranes = selfOrgData.visualization_data?.membrane_hierarchy || {};
    const patterns = selfOrgData.visualization_data?.pattern_network?.nodes || [];
    const activations = selfOrgData.visualization_data?.activation_flows || [];

    return { membranes, patterns, activations };
  }, [selfOrgData]);

  // Membrane hierarchy visualization
  useEffect(() => {
    if (!membraneRef.current || !processedVisualizationData.membranes || visualizationMode !== 'membrane_hierarchy') return;

    const svg = d3.select(membraneRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    svg.attr('width', width).attr('height', height);

    // Create hierarchical layout
    const membraneData = Object.entries(processedVisualizationData.membranes).map(([id, data]) => ({
      id,
      ...data
    }));

    // Build hierarchy
    const root = d3.stratify()
      .id(d => d.id)
      .parentId(d => d.parent)
      (membraneData.filter(d => d.id !== 'root').concat([{ id: 'root', parent: null }]));

    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    // Create links
    svg.append('g')
      .selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr('d', d3.linkVertical()
        .x(d => d.x + 50)
        .y(d => d.y + 50))
      .attr('fill', 'none')
      .attr('stroke', themeColors.membrane)
      .attr('stroke-width', 2)
      .attr('opacity', 0.7);

    // Create membrane nodes
    const membraneNodes = svg.append('g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x + 50}, ${d.y + 50})`);

    // Membrane circles
    membraneNodes.append('circle')
      .attr('r', d => {
        const membrane = processedVisualizationData.membranes[d.id];
        return membrane ? Math.max(15, Math.min(30, 15 + (membrane.object_count || 0) * 2)) : 15;
      })
      .attr('fill', d => {
        const membrane = processedVisualizationData.membranes[d.id];
        return membrane?.active ? themeColors.membrane : themeColors.surface;
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        if (onSystemInteraction) {
          onSystemInteraction({ type: 'membrane_click', membrane_id: d.id });
        }
        
        // Animate click
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', function() { return +d3.select(this).attr('r') * 1.2; })
          .transition()
          .duration(200)
          .attr('r', function() { return +d3.select(this).attr('r') / 1.2; });
      });

    // Membrane labels
    membraneNodes.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', -35)
      .attr('font-size', 10)
      .attr('fill', '#fff')
      .attr('font-weight', 'bold');

    // Priority indicators
    membraneNodes.append('text')
      .text(d => {
        const membrane = processedVisualizationData.membranes[d.id];
        return membrane ? `P:${membrane.priority || 0}` : '';
      })
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', 8)
      .attr('fill', '#ccc');

  }, [processedVisualizationData.membranes, visualizationMode, themeColors]);

  // Pattern network visualization
  useEffect(() => {
    if (!patternNetworkRef.current || !processedVisualizationData.patterns || visualizationMode !== 'pattern_network') return;

    const svg = d3.select(patternNetworkRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    svg.attr('width', width).attr('height', height);

    const patterns = processedVisualizationData.patterns;
    if (patterns.length === 0) return;

    // Create force simulation
    const simulation = d3.forceSimulation(patterns)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25));

    // Create pattern nodes
    const patternNodes = svg.append('g')
      .selectAll('g')
      .data(patterns)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', function(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', function(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', function(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Pattern circles with activation-based sizing
    patternNodes.append('circle')
      .attr('r', d => Math.max(8, 8 + d.activation * 15))
      .attr('fill', d => d.color || themeColors.pattern)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', d => 0.7 + d.activation * 0.3)
      .on('click', function(event, d) {
        setSelectedPattern(d);
        if (onSystemInteraction) {
          onSystemInteraction({ type: 'pattern_click', pattern: d });
        }
      });

    // Pattern symbols
    patternNodes.append('text')
      .text(d => d.symbol || '●')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', d => Math.max(12, 12 + d.activation * 8))
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    // Pattern labels
    patternNodes.append('text')
      .text(d => d.id.substring(0, 8))
      .attr('text-anchor', 'middle')
      .attr('dy', -20)
      .attr('font-size', 8)
      .attr('fill', '#ccc')
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      patternNodes.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

  }, [processedVisualizationData.patterns, visualizationMode, themeColors]);

  // Activation flow visualization
  useEffect(() => {
    if (!activationFlowRef.current || !showActivationFlows || visualizationMode !== 'activation_flows') return;

    const svg = d3.select(activationFlowRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    svg.attr('width', width).attr('height', height);

    const activations = processedVisualizationData.activations;
    if (activations.length === 0) return;

    // Create timeline visualization
    const timeScale = d3.scaleTime()
      .domain(d3.extent(activations, d => new Date(d.timestamp)))
      .range([50, width - 50]);

    const activationScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height - 50, 50]);

    // Create activation flow lines
    const line = d3.line()
      .x(d => timeScale(new Date(d.timestamp)))
      .y(d => activationScale(d.activation))
      .curve(d3.curveMonotoneX);

    // Group activations by source
    const activationsBySource = d3.group(activations, d => d.source);

    activationsBySource.forEach((sourceActivations, source) => {
      svg.append('path')
        .datum(sourceActivations)
        .attr('fill', 'none')
        .attr('stroke', themeColors.activation)
        .attr('stroke-width', 2)
        .attr('opacity', 0.7)
        .attr('d', line);

      // Add activation points
      svg.selectAll(`.activation-point-${source}`)
        .data(sourceActivations)
        .enter()
        .append('circle')
        .attr('class', `activation-point-${source}`)
        .attr('cx', d => timeScale(new Date(d.timestamp)))
        .attr('cy', d => activationScale(d.activation))
        .attr('r', 4)
        .attr('fill', themeColors.activation)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
    });

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0, ${height - 50})`)
      .call(d3.axisBottom(timeScale).tickFormat(d3.timeFormat('%H:%M')))
      .selectAll('text')
      .attr('fill', '#ccc')
      .attr('font-size', 10);

    svg.append('g')
      .attr('transform', 'translate(50, 0)')
      .call(d3.axisLeft(activationScale))
      .selectAll('text')
      .attr('fill', '#ccc')
      .attr('font-size', 10);

  }, [processedVisualizationData.activations, showActivationFlows, visualizationMode, themeColors]);

  // Animation effects
  useEffect(() => {
    const visualElements = document.querySelectorAll('.viz-element');
    if (visualElements.length > 0) {
      anime.default({
        targets: visualElements,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800 / animationSpeed,
        easing: 'easeOutElastic(1, .8)',
        delay: anime.stagger(100 / animationSpeed)
      });
    }
  }, [visualizationMode, animationSpeed]);

  // System metrics calculation
  const systemMetrics = React.useMemo(() => {
    if (!selfOrgData) return {};

    const totalMembranes = Object.keys(processedVisualizationData.membranes).length;
    const activeMembranes = Object.values(processedVisualizationData.membranes)
      .filter(m => m.active).length;
    const totalPatterns = processedVisualizationData.patterns.length;
    const activePatterns = processedVisualizationData.patterns
      .filter(p => p.activation > 0.5).length;

    return {
      membraneActivity: totalMembranes > 0 ? activeMembranes / totalMembranes : 0,
      patternActivity: totalPatterns > 0 ? activePatterns / totalPatterns : 0,
      systemCoherence: selfOrgData.meta_cognitive_reflection?.system_coherence || 0,
      evolutionStep: selfOrgData.evolution_report?.step || 0
    };
  }, [selfOrgData, processedVisualizationData]);

  return (
    <div style={{
      background: `linear-gradient(135deg, ${themeColors.background} 0%, ${themeColors.surface} 100%)`,
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${themeColors.primary}`,
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🌌 Advanced Cognitive Visualization
        </h2>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={visualizationMode}
            onChange={(e) => setVisualizationMode(e.target.value)}
            style={{
              background: themeColors.surface,
              border: `1px solid ${themeColors.secondary}`,
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            <option value="membrane_hierarchy">Membrane Hierarchy</option>
            <option value="pattern_network">Pattern Network</option>
            <option value="activation_flows">Activation Flows</option>
            <option value="system_overview">System Overview</option>
          </select>
          
          <label style={{ fontSize: '12px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Speed:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
          
          <label style={{ fontSize: '12px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              checked={showActivationFlows}
              onChange={(e) => setShowActivationFlows(e.target.checked)}
            />
            Flows
          </label>
        </div>
      </div>

      {/* System Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {[
          { key: 'membraneActivity', label: 'Membrane Activity', icon: '🧠', color: themeColors.membrane },
          { key: 'patternActivity', label: 'Pattern Activity', icon: '🎭', color: themeColors.pattern },
          { key: 'systemCoherence', label: 'System Coherence', icon: '🌀', color: themeColors.cognitive },
          { key: 'evolutionStep', label: 'Evolution Step', icon: '⚡', color: themeColors.accent }
        ].map((metric) => {
          const value = systemMetrics[metric.key] || 0;
          const displayValue = metric.key === 'evolutionStep' ? value : `${(value * 100).toFixed(1)}%`;
          
          return (
            <div key={metric.key} className="viz-element" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${metric.color}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{metric.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: metric.color }}>
                {displayValue}
              </div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main Visualization Area */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${themeColors.secondary}`,
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>
          {visualizationMode === 'membrane_hierarchy' && '🧠 Deep Tree Echo Membrane Hierarchy'}
          {visualizationMode === 'pattern_network' && '🎭 Christopher Alexander Pattern Network'}
          {visualizationMode === 'activation_flows' && '⚡ Neural Activation Flows'}
          {visualizationMode === 'system_overview' && '🌌 Cognitive System Overview'}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          {visualizationMode === 'membrane_hierarchy' && (
            <svg ref={membraneRef} style={{ border: '1px solid rgba(255,255,255,0.1)' }}></svg>
          )}
          
          {visualizationMode === 'pattern_network' && (
            <svg ref={patternNetworkRef} style={{ border: '1px solid rgba(255,255,255,0.1)' }}></svg>
          )}
          
          {visualizationMode === 'activation_flows' && (
            <svg ref={activationFlowRef} style={{ border: '1px solid rgba(255,255,255,0.1)' }}></svg>
          )}
          
          {visualizationMode === 'system_overview' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px',
              width: '100%',
              maxWidth: '600px'
            }}>
              {/* System State Summary */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: themeColors.cognitive }}>System State</h4>
                <div style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.6' }}>
                  <div>Total Patterns: {processedVisualizationData.patterns.length}</div>
                  <div>Active Membranes: {Object.values(processedVisualizationData.membranes).filter(m => m.active).length}</div>
                  <div>Evolution Steps: {systemMetrics.evolutionStep}</div>
                  <div>System Coherence: {(systemMetrics.systemCoherence * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              {/* Recent Activations */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: themeColors.activation }}>Recent Activations</h4>
                <div style={{ fontSize: '12px', color: '#ccc', maxHeight: '120px', overflowY: 'auto' }}>
                  {processedVisualizationData.activations.slice(-5).map((activation, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      {activation.source}: {(activation.activation * 100).toFixed(1)}%
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Pattern Details */}
      {selectedPattern && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${themeColors.pattern}`,
          marginTop: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '12px'
          }}>
            <h4 style={{ margin: 0, color: themeColors.pattern, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedPattern.symbol} Selected Pattern: {selectedPattern.id}
            </h4>
            <button
              onClick={() => setSelectedPattern(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '12px',
            fontSize: '12px'
          }}>
            <div>
              <strong>Activation Level:</strong> {(selectedPattern.activation * 100).toFixed(1)}%
            </div>
            <div>
              <strong>Color Code:</strong> 
              <span style={{ 
                display: 'inline-block', 
                width: '12px', 
                height: '12px', 
                backgroundColor: selectedPattern.color,
                marginLeft: '6px',
                borderRadius: '2px'
              }}></span>
            </div>
            <div>
              <strong>Position:</strong> ({selectedPattern.x?.toFixed(1) || 0}, {selectedPattern.y?.toFixed(1) || 0})
            </div>
          </div>
        </div>
      )}

      {/* Interaction Controls */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => {
            if (onSystemInteraction) {
              onSystemInteraction({ type: 'reset_system' });
            }
          }}
          style={{
            background: themeColors.warning,
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🔄 Reset System
        </button>
        
        <button
          onClick={() => {
            if (onSystemInteraction) {
              onSystemInteraction({ type: 'evolve_step' });
            }
          }}
          style={{
            background: themeColors.success,
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          ⚡ Evolve Step
        </button>
        
        <button
          onClick={() => {
            if (onSystemInteraction) {
              onSystemInteraction({ type: 'save_state' });
            }
          }}
          style={{
            background: themeColors.secondary,
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          💾 Save State
        </button>
      </div>
    </div>
  );
};

export default AdvancedVisualizationDashboard;
