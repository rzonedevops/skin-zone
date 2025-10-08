import React, { useState, useEffect, useCallback } from 'react';
import anime from 'animejs';

const RealTimeDataPipeline = ({ onDataUpdate, ceoSubsystem }) => {
  const [pipelineStatus, setPipelineStatus] = useState('idle');
  const [dataFlow, setDataFlow] = useState([]);
  const [metrics, setMetrics] = useState({
    throughput: 0,
    latency: 0,
    errorRate: 0,
    activeConnections: 0
  });

  // Simulate real-time data sources
  const dataSources = [
    { id: 'supplier_api', name: 'Supplier API', status: 'active', color: '#4f46e5' },
    { id: 'pricing_feed', name: 'Pricing Feed', status: 'active', color: '#06b6d4' },
    { id: 'inventory_sync', name: 'Inventory Sync', status: 'active', color: '#10b981' },
    { id: 'market_intel', name: 'Market Intelligence', status: 'active', color: '#f59e0b' },
    { id: 'ceo_neural', name: 'CEO Neural Network', status: 'active', color: '#8b5cf6' }
  ];

  // Simulate data processing pipeline
  const processDataBatch = useCallback(async (sourceId) => {
    const timestamp = Date.now();
    const batchId = `batch_${timestamp}_${sourceId}`;
    
    // Simulate data processing stages
    const stages = ['ingestion', 'validation', 'transformation', 'ceo_analysis', 'storage'];
    
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      
      setDataFlow(prev => [...prev, {
        id: `${batchId}_${stage}`,
        batchId,
        sourceId,
        stage,
        timestamp: Date.now(),
        status: 'processing'
      }]);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
      
      // Update stage status
      setDataFlow(prev => prev.map(item => 
        item.id === `${batchId}_${stage}` 
          ? { ...item, status: 'completed', completedAt: Date.now() }
          : item
      ));

      // CEO analysis stage
      if (stage === 'ceo_analysis' && ceoSubsystem) {
        try {
          // Simulate CEO subsystem processing
          const mockNetworkData = {
            nodes: [
              { id: `node_${timestamp}`, type: 'ingredient', name: `Dynamic Ingredient ${timestamp}` }
            ],
            edges: []
          };
          
          // This would call the actual CEO subsystem in a real implementation
          const ceoResult = {
            metrics: {
              network_strength: Math.random(),
              adaptive_capacity: Math.random(),
              emergent_intelligence: Math.random(),
              system_coherence: Math.random()
            },
            patterns: [],
            inferences: []
          };
          
          if (onDataUpdate) {
            onDataUpdate({
              type: 'ceo_analysis',
              data: ceoResult,
              timestamp
            });
          }
        } catch (error) {
          console.error('CEO analysis error:', error);
        }
      }
    }

    // Clean up old flow items (keep last 20)
    setDataFlow(prev => prev.slice(-20));
    
  }, [ceoSubsystem, onDataUpdate]);

  // Start data pipeline
  useEffect(() => {
    if (pipelineStatus === 'active') {
      const intervals = dataSources.map(source => {
        return setInterval(() => {
          processDataBatch(source.id);
        }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
      });

      return () => {
        intervals.forEach(clearInterval);
      };
    }
  }, [pipelineStatus, processDataBatch]);

  // Update metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const completedItems = dataFlow.filter(item => item.status === 'completed');
      const processingItems = dataFlow.filter(item => item.status === 'processing');
      
      setMetrics(prev => ({
        throughput: completedItems.length,
        latency: completedItems.length > 0 
          ? completedItems.reduce((sum, item) => sum + (item.completedAt - item.timestamp), 0) / completedItems.length
          : 0,
        errorRate: 0, // Simulate low error rate
        activeConnections: dataSources.filter(s => s.status === 'active').length
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [dataFlow]);

  // Animation effects
  useEffect(() => {
    const flowElements = document.querySelectorAll('.data-flow-item');
    if (flowElements.length > 0) {
      anime({
        targets: flowElements,
        translateX: [50, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad',
        delay: anime.stagger(100)
      });
    }
  }, [dataFlow]);

  const togglePipeline = () => {
    setPipelineStatus(prev => prev === 'active' ? 'idle' : 'active');
    
    // Animate status change
    anime({
      targets: '.pipeline-status',
      scale: [1, 1.2, 1],
      duration: 300,
      easing: 'easeOutElastic(1, .8)'
    });
  };

  return (
    <div className="real-time-pipeline" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #4f46e5',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#fff' }}>
          🔄 Real-Time Data Pipeline
        </h3>
        
        <button
          onClick={togglePipeline}
          className="pipeline-status"
          style={{
            background: pipelineStatus === 'active' ? '#10b981' : '#6b7280',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {pipelineStatus === 'active' ? '⏸ Pause' : '▶ Start'} Pipeline
        </button>
      </div>

      {/* Metrics Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {[
          { label: 'Throughput', value: metrics.throughput, unit: 'items/min', color: '#06b6d4' },
          { label: 'Avg Latency', value: Math.round(metrics.latency), unit: 'ms', color: '#f59e0b' },
          { label: 'Error Rate', value: metrics.errorRate.toFixed(2), unit: '%', color: '#ef4444' },
          { label: 'Connections', value: metrics.activeConnections, unit: 'active', color: '#10b981' }
        ].map((metric, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '12px',
            border: `1px solid ${metric.color}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: metric.color }}>
              {metric.value}
            </div>
            <div style={{ fontSize: '12px', color: '#ccc', marginTop: '4px' }}>
              {metric.label}
            </div>
            <div style={{ fontSize: '10px', color: '#888' }}>
              {metric.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Data Sources Status */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ccc' }}>Data Sources</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {dataSources.map(source => (
            <div key={source.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '6px 12px',
              border: `1px solid ${source.color}`,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: source.status === 'active' ? source.color : '#6b7280'
              }}></div>
              {source.name}
            </div>
          ))}
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ccc' }}>Live Data Flow</h4>
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '15px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {dataFlow.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
              {pipelineStatus === 'active' ? 'Waiting for data...' : 'Pipeline is paused'}
            </div>
          ) : (
            dataFlow.slice(-10).reverse().map(item => (
              <div key={item.id} className="data-flow-item" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: item.status === 'completed' ? '#10b981' : '#f59e0b'
                  }}></div>
                  <span>{item.sourceId}</span>
                  <span style={{ color: '#888' }}>→</span>
                  <span style={{ color: '#06b6d4' }}>{item.stage}</span>
                </div>
                <div style={{ color: '#888' }}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pipeline Architecture Diagram */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#ccc' }}>Pipeline Architecture</h4>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '15px',
          fontSize: '12px'
        }}>
          {['Ingestion', 'Validation', 'Transform', 'CEO Analysis', 'Storage'].map((stage, index) => (
            <React.Fragment key={stage}>
              <div style={{
                background: 'rgba(79, 70, 229, 0.2)',
                border: '1px solid #4f46e5',
                borderRadius: '6px',
                padding: '8px 12px',
                textAlign: 'center',
                minWidth: '80px'
              }}>
                {stage}
              </div>
              {index < 4 && (
                <div style={{ color: '#4f46e5', fontSize: '16px' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDataPipeline;
