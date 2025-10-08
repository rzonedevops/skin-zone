import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import anime from 'animejs';

const EnhancedHypergraphVisualization = ({ data, ceoMetrics, onNodeSelect }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [animationState, setAnimationState] = useState('idle');

  // JAX CEO theme colors inspired by neural computation
  const themeColors = {
    background: '#0a0a0f',
    primary: '#4f46e5',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neural: '#8b5cf6',
    cognitive: '#ec4899'
  };

  const nodeTypeColors = {
    supplier: themeColors.primary,
    ingredient: themeColors.secondary,
    salon: themeColors.success,
    service: themeColors.accent,
    category: themeColors.neural
  };

  useEffect(() => {
    if (!data || !data.nodes || !data.edges) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    svg
      .attr('width', width)
      .attr('height', height)
      .style('background', themeColors.background);

    // Create gradient definitions for neural-inspired effects
    const defs = svg.append('defs');
    
    const gradient = defs.append('radialGradient')
      .attr('id', 'neuralGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', themeColors.neural)
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', themeColors.neural)
      .attr('stop-opacity', 0.1);

    // Create glow filter for cognitive effects
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create container group
    const container = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create links
    const links = container.append('g')
      .selectAll('line')
      .data(data.edges)
      .enter()
      .append('line')
      .attr('stroke', themeColors.secondary)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)');

    // Create nodes
    const nodes = container.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => {
        const baseRadius = 15;
        if (d.properties && d.properties.price_per_kg) {
          return baseRadius + Math.log(d.properties.price_per_kg) * 2;
        }
        return baseRadius;
      })
      .attr('fill', d => nodeTypeColors[d.type] || themeColors.primary)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', handleNodeClick)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Add labels
    const labels = container.append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('font-size', 12)
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .style('pointer-events', 'none');

    // CEO Metrics Display
    if (ceoMetrics) {
      const metricsGroup = svg.append('g')
        .attr('transform', `translate(${width - 200}, 20)`);

      metricsGroup.append('rect')
        .attr('width', 180)
        .attr('height', 120)
        .attr('fill', themeColors.background)
        .attr('stroke', themeColors.primary)
        .attr('stroke-width', 1)
        .attr('rx', 5);

      metricsGroup.append('text')
        .attr('x', 10)
        .attr('y', 20)
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .text('CEO Metrics');

      const metrics = [
        { label: 'Network Strength', value: ceoMetrics.network_strength },
        { label: 'Adaptive Capacity', value: ceoMetrics.adaptive_capacity },
        { label: 'Emergent Intelligence', value: ceoMetrics.emergent_intelligence },
        { label: 'System Coherence', value: ceoMetrics.system_coherence }
      ];

      metrics.forEach((metric, i) => {
        const y = 40 + i * 20;
        
        metricsGroup.append('text')
          .attr('x', 10)
          .attr('y', y)
          .attr('fill', '#ccc')
          .attr('font-size', 10)
          .text(metric.label);

        metricsGroup.append('rect')
          .attr('x', 10)
          .attr('y', y + 5)
          .attr('width', 100)
          .attr('height', 8)
          .attr('fill', themeColors.background)
          .attr('stroke', themeColors.secondary)
          .attr('stroke-width', 1);

        metricsGroup.append('rect')
          .attr('x', 10)
          .attr('y', y + 5)
          .attr('width', metric.value * 100)
          .attr('height', 8)
          .attr('fill', themeColors.cognitive);

        metricsGroup.append('text')
          .attr('x', 120)
          .attr('y', y + 12)
          .attr('fill', '#fff')
          .attr('font-size', 10)
          .text((metric.value * 100).toFixed(1) + '%');
      });
    }

    // Animation functions
    function handleNodeClick(event, d) {
      setSelectedNode(d);
      if (onNodeSelect) onNodeSelect(d);
      
      // Animate selection with anime.js
      setAnimationState('selecting');
      
      anime({
        targets: event.target,
        r: [event.target.getAttribute('r'), parseFloat(event.target.getAttribute('r')) * 1.5],
        duration: 300,
        easing: 'easeOutElastic(1, .8)',
        complete: () => setAnimationState('selected')
      });

      // Highlight connected nodes
      const connectedNodeIds = new Set();
      data.edges.forEach(edge => {
        if (edge.source.id === d.id) connectedNodeIds.add(edge.target.id);
        if (edge.target.id === d.id) connectedNodeIds.add(edge.source.id);
      });

      nodes.style('opacity', node => 
        node.id === d.id || connectedNodeIds.has(node.id) ? 1 : 0.3
      );

      links.style('opacity', edge => 
        edge.source.id === d.id || edge.target.id === d.id ? 1 : 0.1
      );
    }

    function handleMouseOver(event, d) {
      if (animationState === 'idle') {
        anime({
          targets: event.target,
          r: [event.target.getAttribute('r'), parseFloat(event.target.getAttribute('r')) * 1.2],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }

    function handleMouseOut(event, d) {
      if (animationState === 'idle') {
        anime({
          targets: event.target,
          r: [event.target.getAttribute('r'), parseFloat(event.target.getAttribute('r')) / 1.2],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Neural pulse animation
    const pulseAnimation = () => {
      anime({
        targets: nodes.nodes(),
        r: function(el) {
          const currentR = parseFloat(el.getAttribute('r'));
          return [currentR, currentR * 1.1, currentR];
        },
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true,
        delay: anime.stagger(200)
      });
    };

    // Start neural pulse animation
    setTimeout(pulseAnimation, 1000);

  }, [data, ceoMetrics, animationState]);

  return (
    <div className="enhanced-hypergraph-container" style={{ 
      background: themeColors.background,
      borderRadius: '8px',
      padding: '20px',
      border: `1px solid ${themeColors.primary}`
    }}>
      <div style={{ 
        color: '#fff', 
        marginBottom: '10px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        🧠 CEO Neural Network Visualization
      </div>
      
      <svg ref={svgRef}></svg>
      
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: themeColors.background,
          border: `1px solid ${themeColors.secondary}`,
          borderRadius: '5px',
          padding: '10px',
          color: '#fff',
          fontSize: '12px',
          maxWidth: '200px'
        }}>
          <strong>{selectedNode.name}</strong>
          <br />
          Type: {selectedNode.type}
          {selectedNode.properties && (
            <div>
              {Object.entries(selectedNode.properties).map(([key, value]) => (
                <div key={key}>
                  {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedHypergraphVisualization;
