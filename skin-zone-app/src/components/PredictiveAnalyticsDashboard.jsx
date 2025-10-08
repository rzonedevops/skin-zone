import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell, Sankey } from 'recharts';
import * as d3 from 'd3';
import * as anime from 'animejs';

const PredictiveAnalyticsDashboard = ({ emergentData, onPredictionSelect }) => {
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [timeHorizon, setTimeHorizon] = useState('medium_term');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.6);
  const [analyticsMode, setAnalyticsMode] = useState('relationships');
  const networkRef = useRef();

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
    warning: '#ef4444'
  };

  // Process emergent data for visualization
  const processedData = React.useMemo(() => {
    if (!emergentData) return { relationships: [], predictions: [], synergyMetrics: {} };

    const relationships = emergentData.emergent_relationships || [];
    const predictions = emergentData.predictions || [];
    const synergyMetrics = emergentData.synergy_metrics || {};

    // Filter by confidence threshold
    const filteredRelationships = relationships.filter(rel => rel.confidence >= confidenceThreshold);
    const filteredPredictions = predictions.filter(pred => pred.confidence >= confidenceThreshold);

    // Group by time horizon
    const predictionsByHorizon = filteredPredictions.reduce((acc, pred) => {
      const horizon = pred.time_horizon || 'unknown';
      if (!acc[horizon]) acc[horizon] = [];
      acc[horizon].push(pred);
      return acc;
    }, {});

    return {
      relationships: filteredRelationships,
      predictions: filteredPredictions,
      predictionsByHorizon,
      synergyMetrics
    };
  }, [emergentData, confidenceThreshold]);

  // Generate relationship strength distribution data
  const relationshipStrengthData = React.useMemo(() => {
    if (!processedData.relationships.length) return [];

    const strengthBins = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    const distribution = strengthBins.slice(0, -1).map((bin, index) => {
      const nextBin = strengthBins[index + 1];
      const count = processedData.relationships.filter(
        rel => rel.strength >= bin && rel.strength < nextBin
      ).length;

      return {
        range: `${(bin * 100).toFixed(0)}-${(nextBin * 100).toFixed(0)}%`,
        count,
        strength: bin
      };
    });

    return distribution;
  }, [processedData.relationships]);

  // Generate prediction confidence timeline
  const predictionTimeline = React.useMemo(() => {
    if (!processedData.predictions.length) return [];

    const timeHorizons = ['short_term', 'medium_term', 'long_term'];
    return timeHorizons.map(horizon => {
      const predictions = processedData.predictionsByHorizon[horizon] || [];
      const avgConfidence = predictions.length > 0 
        ? predictions.reduce((sum, pred) => sum + pred.confidence, 0) / predictions.length
        : 0;

      return {
        horizon,
        count: predictions.length,
        avgConfidence: avgConfidence * 100,
        opportunities: predictions.filter(p => p.type === 'market_opportunity').length,
        evolutions: predictions.filter(p => p.type === 'relationship_evolution').length
      };
    });
  }, [processedData.predictionsByHorizon]);

  // Relationship network visualization
  useEffect(() => {
    if (!networkRef.current || !processedData.relationships.length) return;

    const svg = d3.select(networkRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    svg.attr('width', width).attr('height', height);

    // Create nodes from relationships
    const nodeMap = new Map();
    processedData.relationships.forEach(rel => {
      if (!nodeMap.has(rel.source_entity)) {
        nodeMap.set(rel.source_entity, { id: rel.source_entity, type: 'entity' });
      }
      if (!nodeMap.has(rel.target_entity)) {
        nodeMap.set(rel.target_entity, { id: rel.target_entity, type: 'entity' });
      }
    });

    const nodes = Array.from(nodeMap.values());
    const links = processedData.relationships.map(rel => ({
      source: rel.source_entity,
      target: rel.target_entity,
      strength: rel.strength,
      type: rel.relationship_type
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', themeColors.secondary)
      .attr('stroke-opacity', d => d.strength)
      .attr('stroke-width', d => Math.max(1, d.strength * 3));

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 8)
      .attr('fill', themeColors.neural)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.id.substring(0, 8))
      .attr('font-size', 8)
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('dy', -12);

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

  }, [processedData.relationships, themeColors]);

  // Animation effects
  useEffect(() => {
    const cards = document.querySelectorAll('.prediction-card');
    if (cards.length > 0) {
      anime.default({
        targets: cards,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad',
        delay: anime.stagger(100)
      });
    }
  }, [processedData.predictions, analyticsMode]);

  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction);
    if (onPredictionSelect) onPredictionSelect(prediction);

    // Animate selection
    anime.default({
      targets: `.prediction-${prediction.prediction_id}`,
      scale: [1, 1.05, 1],
      duration: 300,
      easing: 'easeOutElastic(1, .8)'
    });
  };

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
          🔮 Predictive Analytics Dashboard
        </h2>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={analyticsMode}
            onChange={(e) => setAnalyticsMode(e.target.value)}
            style={{
              background: themeColors.surface,
              border: `1px solid ${themeColors.secondary}`,
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            <option value="relationships">Relationships</option>
            <option value="predictions">Predictions</option>
            <option value="synergy">Synergy</option>
          </select>
          
          <div style={{ fontSize: '12px', color: '#ccc' }}>
            Confidence: {(confidenceThreshold * 100).toFixed(0)}%
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            style={{ width: '80px' }}
          />
        </div>
      </div>

      {/* Synergy Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {[
          { key: 'network_coherence', label: 'Network Coherence', icon: '🕸️', color: themeColors.primary },
          { key: 'emergent_complexity', label: 'Emergent Complexity', icon: '🌀', color: themeColors.neural },
          { key: 'adaptive_resonance', label: 'Adaptive Resonance', icon: '📡', color: themeColors.secondary },
          { key: 'predictive_accuracy', label: 'Predictive Accuracy', icon: '🎯', color: themeColors.success },
          { key: 'system_intelligence', label: 'System Intelligence', icon: '🧠', color: themeColors.cognitive }
        ].map((metric) => {
          const value = processedData.synergyMetrics[metric.key] || 0;
          return (
            <div key={metric.key} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${metric.color}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{metric.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: metric.color }}>
                {(value * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: analyticsMode === 'relationships' ? '1fr 1fr' : '2fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Left Panel */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${themeColors.secondary}`
        }}>
          {analyticsMode === 'relationships' && (
            <>
              <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Relationship Strength Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <ScatterChart data={relationshipStrengthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="range" stroke="#ccc" fontSize={10} />
                  <YAxis stroke="#ccc" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      background: themeColors.surface, 
                      border: `1px solid ${themeColors.primary}`,
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Scatter dataKey="count" fill={themeColors.neural} />
                </ScatterChart>
              </ResponsiveContainer>
            </>
          )}

          {analyticsMode === 'predictions' && (
            <>
              <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Prediction Timeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={predictionTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="horizon" stroke="#ccc" fontSize={10} />
                  <YAxis stroke="#ccc" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      background: themeColors.surface, 
                      border: `1px solid ${themeColors.primary}`,
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="avgConfidence" stroke={themeColors.success} strokeWidth={2} />
                  <Line type="monotone" dataKey="count" stroke={themeColors.accent} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          {analyticsMode === 'synergy' && (
            <>
              <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Cognitive Synergy Evolution</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                height: '200px',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: '#ccc' }}>
                  Deep Tree Echo ↔ Marduk Interaction
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    background: themeColors.neural,
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    Novelty<br/>Discovery
                  </div>
                  
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: `linear-gradient(90deg, ${themeColors.neural}, ${themeColors.cognitive})`,
                    margin: '0 20px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: themeColors.accent,
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}>
                      AAR
                    </div>
                  </div>
                  
                  <div style={{
                    background: themeColors.cognitive,
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    Structured<br/>Analysis
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${themeColors.neural}`
        }}>
          {analyticsMode === 'relationships' && (
            <>
              <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Relationship Network</h3>
              <svg ref={networkRef}></svg>
            </>
          )}

          {(analyticsMode === 'predictions' || analyticsMode === 'synergy') && (
            <>
              <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Key Insights</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {processedData.predictions.slice(0, 5).map((prediction, index) => (
                  <div 
                    key={prediction.prediction_id}
                    className={`prediction-card prediction-${prediction.prediction_id}`}
                    onClick={() => handlePredictionClick(prediction)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      padding: '8px',
                      border: `1px solid ${
                        prediction.type === 'market_opportunity' ? themeColors.success : themeColors.accent
                      }`,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {prediction.type === 'market_opportunity' ? '💡' : '📈'} {prediction.type.replace('_', ' ')}
                    </div>
                    <div style={{ color: '#ccc' }}>
                      {prediction.description.substring(0, 60)}...
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginTop: '4px',
                      fontSize: '10px'
                    }}>
                      <span>{prediction.time_horizon}</span>
                      <span>{(prediction.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Prediction Details */}
      {selectedPrediction && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${themeColors.accent}`,
          marginTop: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '12px'
          }}>
            <h4 style={{ margin: 0, color: themeColors.accent }}>
              Selected Prediction: {selectedPrediction.type.replace('_', ' ')}
            </h4>
            <button
              onClick={() => setSelectedPrediction(null)}
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
          
          <div style={{ color: '#fff', marginBottom: '8px' }}>
            {selectedPrediction.description}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '12px',
            fontSize: '12px'
          }}>
            <div>
              <strong>Confidence:</strong> {(selectedPrediction.confidence * 100).toFixed(1)}%
            </div>
            <div>
              <strong>Time Horizon:</strong> {selectedPrediction.time_horizon}
            </div>
            <div>
              <strong>ID:</strong> {selectedPrediction.prediction_id.substring(0, 12)}...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalyticsDashboard;
