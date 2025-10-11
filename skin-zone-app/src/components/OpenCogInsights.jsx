import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, Sparkles, TrendingUp, Shield, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import hypergraphApi from '../services/hypergraphApi';

/**
 * OpenCogInsights Component
 * Displays cognitive AI insights powered by OpenCog
 */
const OpenCogInsights = ({ productId, customerId, tenantId }) => {
  const [insights, setInsights] = useState(null);
  const [supplyChainAnalysis, setSupplyChainAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCognitiveInsights();
  }, [productId, customerId, tenantId]);

  const loadCognitiveInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load cognitive insights
      const context = { type: 'product-recommendation' };
      const insightsData = await hypergraphApi.cognitiveInsights(context, tenantId);
      setInsights(insightsData);

      // Load supply chain analysis if productId provided
      if (productId) {
        const analysisData = await hypergraphApi.analyzeSupplyChain(
          productId, 
          'TRANSPARENCY', 
          tenantId
        );
        setSupplyChainAnalysis(analysisData);
      }

      // Load cognitive recommendations if customerId provided
      if (customerId) {
        const recContext = { type: 'treatment' };
        const recsData = await hypergraphApi.cognitiveRecommendations(
          customerId,
          recContext,
          tenantId
        );
        setRecommendations(recsData || []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load cognitive insights:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      case 'neutral': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return <CheckCircle2 className="h-4 w-4" />;
      case 'negative': return <AlertCircle className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
            OpenCog Cognitive Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-purple-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Analyzing with cognitive AI...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-6 w-6" />
            Error Loading Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Cognitive Insights Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            OpenCog Cognitive Insights
            <span className="ml-auto text-sm font-normal text-purple-600">
              Confidence: {(insights?.confidence * 100).toFixed(0)}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Explanations */}
          {insights?.explanations && insights.explanations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2 text-gray-700">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Reasoning
              </h4>
              <ul className="space-y-2">
                {insights.explanations.map((explanation, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{explanation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reasoning Steps */}
          {insights?.reasoning && insights.reasoning.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2 text-gray-700">
                <Zap className="h-4 w-4 text-amber-500" />
                Applied Rules
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {insights.reasoning.map((step, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg text-sm ${
                      step.applies ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.rule}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        step.applies ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {step.applies ? 'Applied' : 'Not Applied'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Priority: {step.priority}/10
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supply Chain Analysis Card */}
      {supplyChainAnalysis && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              Supply Chain Analysis
              <span className="ml-auto text-sm font-normal text-green-600">
                Score: {(supplyChainAnalysis.score * 100).toFixed(0)}/100
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Insights */}
            {supplyChainAnalysis.insights && supplyChainAnalysis.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Key Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supplyChainAnalysis.insights.map((insight, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg ${getImpactColor(insight.impact)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{insight.metric}</span>
                        {getImpactIcon(insight.impact)}
                      </div>
                      <div className="text-2xl font-bold">{insight.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {supplyChainAnalysis.recommendations && supplyChainAnalysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Recommendations</h4>
                <ul className="space-y-2">
                  {supplyChainAnalysis.recommendations.map((rec, idx) => (
                    <li 
                      key={idx}
                      className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                        rec.priority === 'high' 
                          ? 'bg-red-50 border border-red-200' 
                          : rec.priority === 'medium'
                          ? 'bg-amber-50 border border-amber-200'
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <TrendingUp className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        rec.priority === 'high' 
                          ? 'text-red-500' 
                          : rec.priority === 'medium'
                          ? 'text-amber-500'
                          : 'text-blue-500'
                      }`} />
                      <div>
                        <div className="font-medium capitalize">{rec.priority} Priority</div>
                        <div className="text-gray-700">{rec.message}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cognitive Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              Cognitive Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec, idx) => (
                <div 
                  key={rec.id}
                  className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                      {rec.properties?.description && (
                        <p className="text-sm text-gray-600 mt-1">{rec.properties.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-blue-600">
                        {(rec.cognitiveScore * 100).toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  {/* Reasoning Evidence */}
                  {rec.reasoning && rec.reasoning.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        Reasoning:
                      </div>
                      <div className="space-y-1">
                        {rec.reasoning.map((evidence, eIdx) => (
                          <div key={eIdx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className={`px-2 py-0.5 rounded ${
                              evidence.impact.startsWith('+') 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {evidence.impact}
                            </span>
                            <span className="flex-1">{evidence.reason}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Confidence: {(rec.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* OpenCog Attribution */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full">
          <Brain className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">
            Powered by OpenCog Cognitive Architecture
          </span>
        </div>
      </div>
    </div>
  );
};

export default OpenCogInsights;
