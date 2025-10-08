import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import * as anime from 'animejs';

const AdaptiveLearningDashboard = ({ marketIntelligence, onLearningUpdate }) => {
  const [learningMetrics, setLearningMetrics] = useState({
    adaptationRate: 0.75,
    predictionAccuracy: 0.82,
    knowledgeGrowth: 0.68,
    systemConfidence: 0.71
  });

  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [activeInsights, setActiveInsights] = useState([]);
  const [learningState, setLearningState] = useState('active');

  // Theme colors matching the JAX CEO neural computation theme
  const themeColors = {
    primary: '#4f46e5',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    success: '#10b981',
    neural: '#8b5cf6',
    cognitive: '#ec4899',
    background: '#0a0a0f',
    surface: '#1a1a2e'
  };

  // Simulate learning performance data
  useEffect(() => {
    const generatePerformanceData = () => {
      const now = new Date();
      const data = [];
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          accuracy: 0.7 + Math.random() * 0.25,
          confidence: 0.6 + Math.random() * 0.3,
          adaptationRate: 0.5 + Math.random() * 0.4,
          learningSpeed: 0.4 + Math.random() * 0.5
        });
      }
      
      setPerformanceHistory(data);
    };

    generatePerformanceData();
    const interval = setInterval(generatePerformanceData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate adaptive insights
  useEffect(() => {
    if (marketIntelligence) {
      const insights = generateAdaptiveInsights(marketIntelligence);
      setActiveInsights(insights);
    }
  }, [marketIntelligence]);

  // Animation effects
  useEffect(() => {
    const metricElements = document.querySelectorAll('.learning-metric');
    if (metricElements.length > 0) {
      anime.default({
        targets: metricElements,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .8)',
        delay: anime.stagger(200)
      });
    }
  }, [learningMetrics]);

  const generateAdaptiveInsights = (intelligence) => {
    const insights = [];
    
    if (intelligence.market_health_score < 0.5) {
      insights.push({
        id: 'market_health_low',
        type: 'warning',
        title: 'Market Health Declining',
        description: 'Adaptive algorithms detected declining market conditions. Adjusting risk parameters.',
        confidence: 0.85,
        action: 'Implementing conservative learning strategies'
      });
    }

    if (intelligence.opportunities && intelligence.opportunities.length > 0) {
      insights.push({
        id: 'opportunities_detected',
        type: 'opportunity',
        title: 'Learning Opportunities Identified',
        description: `${intelligence.opportunities.length} new learning opportunities detected in market data.`,
        confidence: 0.78,
        action: 'Expanding knowledge base with new patterns'
      });
    }

    if (intelligence.supplier_intelligence) {
      const highPerformers = Object.values(intelligence.supplier_intelligence)
        .filter(s => s.overall_score > 0.8).length;
      
      if (highPerformers > 0) {
        insights.push({
          id: 'high_performers',
          type: 'success',
          title: 'High-Performance Patterns Learned',
          description: `Identified ${highPerformers} high-performing supplier patterns for future predictions.`,
          confidence: 0.92,
          action: 'Reinforcing successful prediction models'
        });
      }
    }

    return insights;
  };

  const radarData = [
    { subject: 'Pattern Recognition', A: learningMetrics.predictionAccuracy * 100, fullMark: 100 },
    { subject: 'Adaptation Speed', A: learningMetrics.adaptationRate * 100, fullMark: 100 },
    { subject: 'Knowledge Retention', A: learningMetrics.knowledgeGrowth * 100, fullMark: 100 },
    { subject: 'System Confidence', A: learningMetrics.systemConfidence * 100, fullMark: 100 },
    { subject: 'Prediction Accuracy', A: (learningMetrics.predictionAccuracy + 0.1) * 100, fullMark: 100 },
    { subject: 'Learning Efficiency', A: learningMetrics.adaptationRate * 90, fullMark: 100 }
  ];

  const handleLearningAdjustment = (metric, value) => {
    setLearningMetrics(prev => ({
      ...prev,
      [metric]: Math.max(0, Math.min(1, value))
    }));

    if (onLearningUpdate) {
      onLearningUpdate({ metric, value });
    }

    // Animate the adjustment
    anime.default({
      targets: `.metric-${metric}`,
      scale: [1, 1.1, 1],
      duration: 400,
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
          🧠 Adaptive Learning Dashboard
        </h2>
        
        <div style={{
          background: learningState === 'active' ? themeColors.success : themeColors.accent,
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {learningState === 'active' ? '🟢 Learning Active' : '🟡 Learning Paused'}
        </div>
      </div>

      {/* Learning Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { key: 'adaptationRate', label: 'Adaptation Rate', icon: '⚡', color: themeColors.neural },
          { key: 'predictionAccuracy', label: 'Prediction Accuracy', icon: '🎯', color: themeColors.success },
          { key: 'knowledgeGrowth', label: 'Knowledge Growth', icon: '📈', color: themeColors.secondary },
          { key: 'systemConfidence', label: 'System Confidence', icon: '🛡️', color: themeColors.cognitive }
        ].map((metric) => (
          <div key={metric.key} className={`learning-metric metric-${metric.key}`} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${metric.color}`,
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => handleLearningAdjustment(metric.key, learningMetrics[metric.key] + 0.05)}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{metric.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: metric.color, marginBottom: '4px' }}>
              {(learningMetrics[metric.key] * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: '12px', color: '#ccc' }}>{metric.label}</div>
            
            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${learningMetrics[metric.key] * 100}%`,
                height: '100%',
                background: metric.color,
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Performance History Chart */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${themeColors.secondary}`
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Learning Performance History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#ccc" fontSize={10} />
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
              <Line type="monotone" dataKey="accuracy" stroke={themeColors.success} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="confidence" stroke={themeColors.neural} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="adaptationRate" stroke={themeColors.cognitive} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Capabilities Radar */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${themeColors.neural}`
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Learning Capabilities</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#ccc' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
              <Radar
                name="Capabilities"
                dataKey="A"
                stroke={themeColors.neural}
                fill={themeColors.neural}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Adaptive Insights */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${themeColors.accent}`
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>🔍 Adaptive Insights</h3>
        
        {activeInsights.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#888', 
            padding: '20px',
            fontStyle: 'italic'
          }}>
            Learning system is analyzing patterns... New insights will appear here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeInsights.map((insight) => (
              <div key={insight.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
                border: `1px solid ${
                  insight.type === 'warning' ? '#ef4444' :
                  insight.type === 'opportunity' ? themeColors.accent :
                  themeColors.success
                }`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>
                      {insight.type === 'warning' ? '⚠️' : 
                       insight.type === 'opportunity' ? '💡' : '✅'}
                    </span>
                    <strong style={{ color: '#fff' }}>{insight.title}</strong>
                  </div>
                  
                  <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
                    {insight.description}
                  </div>
                  
                  <div style={{ 
                    color: themeColors.secondary, 
                    fontSize: '12px',
                    fontStyle: 'italic'
                  }}>
                    Action: {insight.action}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '4px 8px',
                  fontSize: '10px',
                  color: '#fff',
                  marginLeft: '16px'
                }}>
                  {(insight.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Controls */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => setLearningState(prev => prev === 'active' ? 'paused' : 'active')}
          style={{
            background: learningState === 'active' ? themeColors.accent : themeColors.success,
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {learningState === 'active' ? '⏸ Pause Learning' : '▶ Resume Learning'}
        </button>
        
        <button
          onClick={() => {
            // Reset learning metrics
            setLearningMetrics({
              adaptationRate: 0.5,
              predictionAccuracy: 0.5,
              knowledgeGrowth: 0.5,
              systemConfidence: 0.5
            });
            
            anime.default({
              targets: '.learning-metric',
              scale: [1, 0.9, 1],
              duration: 600,
              easing: 'easeOutElastic(1, .8)',
              delay: anime.stagger(100)
            });
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${themeColors.primary}`,
            borderRadius: '8px',
            padding: '10px 20px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Reset Learning
        </button>
      </div>
    </div>
  );
};

export default AdaptiveLearningDashboard;
