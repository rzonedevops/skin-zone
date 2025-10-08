"""
Market Intelligence Engine with Adaptive Learning
Advanced AI system for market analysis, trend prediction, and adaptive decision making
"""

import jax
import jax.numpy as jnp
from jax import random, grad, jit, vmap
import numpy as np
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
from functools import partial
import json
from datetime import datetime, timedelta

@dataclass
class MarketTrend:
    """Represents a market trend with confidence metrics"""
    trend_id: str
    category: str
    direction: str  # 'rising', 'falling', 'stable'
    strength: float  # 0.0 to 1.0
    confidence: float  # 0.0 to 1.0
    time_horizon: str  # 'short', 'medium', 'long'
    supporting_factors: List[str]

@dataclass
class PriceSignal:
    """Price signal with temporal and contextual information"""
    ingredient_id: str
    current_price: float
    predicted_price: float
    volatility: float
    trend_direction: str
    confidence: float
    timestamp: datetime

class AdaptiveLearningCore:
    """JAX-based adaptive learning system for market intelligence"""
    
    def __init__(self, learning_rate: float = 0.01, memory_size: int = 1000):
        self.learning_rate = learning_rate
        self.memory_size = memory_size
        self.key = random.PRNGKey(123)
        
        # Neural network parameters for trend prediction
        self.trend_net_params = self._initialize_trend_network()
        self.price_net_params = self._initialize_price_network()
        
        # Experience replay buffer
        self.experience_buffer = []
        
        # Adaptive parameters
        self.adaptation_rate = 0.1
        self.exploration_factor = 0.2
        
    def _initialize_trend_network(self) -> Dict[str, jnp.ndarray]:
        """Initialize neural network for trend analysis"""
        self.key, *subkeys = random.split(self.key, 4)
        
        return {
            'w1': random.normal(subkeys[0], (10, 32)),  # Input features to hidden
            'b1': jnp.zeros(32),
            'w2': random.normal(subkeys[1], (32, 16)),  # Hidden to hidden
            'b2': jnp.zeros(16),
            'w3': random.normal(subkeys[2], (16, 3)),   # Hidden to output (3 trend directions)
            'b3': jnp.zeros(3)
        }
    
    def _initialize_price_network(self) -> Dict[str, jnp.ndarray]:
        """Initialize neural network for price prediction"""
        self.key, *subkeys = random.split(self.key, 4)
        
        return {
            'w1': random.normal(subkeys[0], (8, 24)),   # Price features to hidden
            'b1': jnp.zeros(24),
            'w2': random.normal(subkeys[1], (24, 12)),  # Hidden to hidden
            'b2': jnp.zeros(12),
            'w3': random.normal(subkeys[2], (12, 1)),   # Hidden to price output
            'b3': jnp.zeros(1)
        }
    
    @partial(jit, static_argnums=(0,))
    def trend_forward(self, params: Dict[str, jnp.ndarray], x: jnp.ndarray) -> jnp.ndarray:
        """Forward pass for trend prediction network"""
        h1 = jnp.tanh(jnp.dot(x, params['w1']) + params['b1'])
        h2 = jnp.tanh(jnp.dot(h1, params['w2']) + params['b2'])
        output = jax.nn.softmax(jnp.dot(h2, params['w3']) + params['b3'])
        return output
    
    @partial(jit, static_argnums=(0,))
    def price_forward(self, params: Dict[str, jnp.ndarray], x: jnp.ndarray) -> jnp.ndarray:
        """Forward pass for price prediction network"""
        h1 = jnp.tanh(jnp.dot(x, params['w1']) + params['b1'])
        h2 = jnp.tanh(jnp.dot(h1, params['w2']) + params['b2'])
        output = jnp.dot(h2, params['w3']) + params['b3']
        return output
    
    def extract_market_features(self, market_data: Dict[str, Any]) -> jnp.ndarray:
        """Extract features from market data for neural network input"""
        features = []
        
        # Basic market metrics
        features.extend([
            len(market_data.get('suppliers', [])),
            len(market_data.get('ingredients', [])),
            len(market_data.get('salons', [])),
        ])
        
        # Price statistics
        prices = []
        for ingredient in market_data.get('ingredients', []):
            if 'properties' in ingredient and 'price_per_kg' in ingredient['properties']:
                prices.append(ingredient['properties']['price_per_kg'])
        
        if prices:
            features.extend([
                np.mean(prices),
                np.std(prices),
                np.min(prices),
                np.max(prices)
            ])
        else:
            features.extend([0, 0, 0, 0])
        
        # Network connectivity
        edges = market_data.get('edges', [])
        features.extend([
            len(edges),
            len(edges) / max(1, len(market_data.get('nodes', []))),  # Density
            0  # Placeholder for clustering coefficient
        ])
        
        return jnp.array(features[:10])  # Ensure fixed size
    
    def predict_trends(self, market_data: Dict[str, Any]) -> List[MarketTrend]:
        """Predict market trends using adaptive learning"""
        features = self.extract_market_features(market_data)
        trend_probs = self.trend_forward(self.trend_net_params, features)
        
        trends = []
        trend_directions = ['falling', 'stable', 'rising']
        
        for i, direction in enumerate(trend_directions):
            if trend_probs[i] > 0.3:  # Threshold for significant trends
                trends.append(MarketTrend(
                    trend_id=f"trend_{direction}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                    category="market_general",
                    direction=direction,
                    strength=float(trend_probs[i]),
                    confidence=float(trend_probs[i] * 0.8),  # Slightly lower confidence
                    time_horizon="medium",
                    supporting_factors=[
                        f"Neural network prediction with {trend_probs[i]:.2f} probability",
                        f"Based on {len(market_data.get('nodes', []))} market entities"
                    ]
                ))
        
        return trends
    
    def adapt_to_feedback(self, prediction: Dict[str, Any], actual_outcome: Dict[str, Any]):
        """Adapt learning parameters based on prediction accuracy"""
        # Calculate prediction error
        error = abs(prediction.get('confidence', 0) - actual_outcome.get('accuracy', 0))
        
        # Adjust learning rate based on error
        if error > 0.3:
            self.learning_rate = min(0.1, self.learning_rate * 1.1)  # Increase learning rate
        else:
            self.learning_rate = max(0.001, self.learning_rate * 0.95)  # Decrease learning rate
        
        # Store experience for replay
        experience = {
            'prediction': prediction,
            'outcome': actual_outcome,
            'error': error,
            'timestamp': datetime.now()
        }
        
        self.experience_buffer.append(experience)
        if len(self.experience_buffer) > self.memory_size:
            self.experience_buffer.pop(0)

class SupplierIntelligenceAnalyzer:
    """Specialized analyzer for supplier market intelligence"""
    
    def __init__(self):
        self.supplier_profiles = {}
        self.performance_metrics = {}
        
    def analyze_supplier_performance(self, supplier_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze supplier performance and reliability"""
        supplier_id = supplier_data.get('id', 'unknown')
        
        # Performance scoring
        reliability_score = self._calculate_reliability_score(supplier_data)
        innovation_score = self._calculate_innovation_score(supplier_data)
        cost_efficiency = self._calculate_cost_efficiency(supplier_data)
        
        performance = {
            'supplier_id': supplier_id,
            'reliability_score': reliability_score,
            'innovation_score': innovation_score,
            'cost_efficiency': cost_efficiency,
            'overall_score': (reliability_score + innovation_score + cost_efficiency) / 3,
            'risk_level': self._assess_risk_level(reliability_score, innovation_score),
            'recommendations': self._generate_supplier_recommendations(
                reliability_score, innovation_score, cost_efficiency
            )
        }
        
        self.performance_metrics[supplier_id] = performance
        return performance
    
    def _calculate_reliability_score(self, supplier_data: Dict[str, Any]) -> float:
        """Calculate supplier reliability score"""
        # Simulate reliability based on supplier properties
        properties = supplier_data.get('properties', {})
        specialty = properties.get('specialty', '')
        tier = properties.get('tier', 'standard')
        
        base_score = 0.7
        
        # Tier-based adjustments
        tier_bonuses = {
            'premium': 0.2,
            'specialty': 0.15,
            'bulk': 0.1,
            'distributor': 0.05
        }
        
        reliability_score = base_score + tier_bonuses.get(tier, 0)
        
        # Specialty-based adjustments
        if 'organic' in specialty:
            reliability_score += 0.1
        if 'professional' in specialty:
            reliability_score += 0.05
        
        return min(1.0, reliability_score)
    
    def _calculate_innovation_score(self, supplier_data: Dict[str, Any]) -> float:
        """Calculate supplier innovation score"""
        properties = supplier_data.get('properties', {})
        specialty = properties.get('specialty', '')
        
        base_score = 0.5
        
        # Innovation indicators
        if 'bioactive' in specialty or 'advanced' in specialty:
            base_score += 0.3
        if 'organic' in specialty or 'natural' in specialty:
            base_score += 0.2
        if 'professional' in specialty:
            base_score += 0.1
        
        return min(1.0, base_score)
    
    def _calculate_cost_efficiency(self, supplier_data: Dict[str, Any]) -> float:
        """Calculate supplier cost efficiency"""
        properties = supplier_data.get('properties', {})
        tier = properties.get('tier', 'standard')
        
        # Cost efficiency based on tier
        efficiency_scores = {
            'bulk': 0.9,
            'distributor': 0.8,
            'specialty': 0.6,
            'premium': 0.5
        }
        
        return efficiency_scores.get(tier, 0.7)
    
    def _assess_risk_level(self, reliability: float, innovation: float) -> str:
        """Assess supplier risk level"""
        combined_score = (reliability + innovation) / 2
        
        if combined_score >= 0.8:
            return 'low'
        elif combined_score >= 0.6:
            return 'medium'
        else:
            return 'high'
    
    def _generate_supplier_recommendations(self, reliability: float, 
                                         innovation: float, cost_efficiency: float) -> List[str]:
        """Generate recommendations for supplier management"""
        recommendations = []
        
        if reliability < 0.6:
            recommendations.append("Consider implementing supplier monitoring and backup options")
        
        if innovation < 0.5:
            recommendations.append("Explore partnerships with more innovative suppliers")
        
        if cost_efficiency < 0.6:
            recommendations.append("Negotiate better pricing or consider alternative suppliers")
        
        if reliability > 0.8 and innovation > 0.7:
            recommendations.append("Consider strategic partnership or preferred supplier status")
        
        return recommendations

class MarketIntelligenceEngine:
    """Main market intelligence engine coordinating all analysis components"""
    
    def __init__(self):
        self.adaptive_core = AdaptiveLearningCore()
        self.supplier_analyzer = SupplierIntelligenceAnalyzer()
        self.market_state = {}
        self.intelligence_cache = {}
        
    def analyze_market(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Comprehensive market analysis"""
        
        # Trend prediction
        trends = self.adaptive_core.predict_trends(market_data)
        
        # Supplier analysis
        supplier_intelligence = {}
        for node in market_data.get('nodes', []):
            if node.get('type') == 'supplier':
                supplier_intelligence[node['id']] = self.supplier_analyzer.analyze_supplier_performance(node)
        
        # Price analysis
        price_signals = self._analyze_price_signals(market_data)
        
        # Market opportunities
        opportunities = self._identify_opportunities(market_data, trends, supplier_intelligence)
        
        # Risk assessment
        risks = self._assess_market_risks(market_data, trends, supplier_intelligence)
        
        intelligence_report = {
            'timestamp': datetime.now().isoformat(),
            'market_trends': [trend.__dict__ for trend in trends],
            'supplier_intelligence': supplier_intelligence,
            'price_signals': [signal.__dict__ for signal in price_signals],
            'opportunities': opportunities,
            'risks': risks,
            'market_health_score': self._calculate_market_health(trends, supplier_intelligence),
            'recommendations': self._generate_strategic_recommendations(
                trends, supplier_intelligence, opportunities, risks
            )
        }
        
        self.intelligence_cache[datetime.now().isoformat()] = intelligence_report
        return intelligence_report
    
    def _analyze_price_signals(self, market_data: Dict[str, Any]) -> List[PriceSignal]:
        """Analyze price signals and predictions"""
        signals = []
        
        for node in market_data.get('nodes', []):
            if node.get('type') == 'ingredient' and 'properties' in node:
                properties = node['properties']
                if 'price_per_kg' in properties:
                    current_price = properties['price_per_kg']
                    
                    # Simple price prediction (in real system, use more sophisticated models)
                    volatility = min(0.3, current_price / 1000)  # Higher prices = higher volatility
                    predicted_change = np.random.normal(0, volatility * current_price)
                    predicted_price = max(0, current_price + predicted_change)
                    
                    trend_direction = 'rising' if predicted_price > current_price else 'falling'
                    if abs(predicted_price - current_price) / current_price < 0.05:
                        trend_direction = 'stable'
                    
                    signals.append(PriceSignal(
                        ingredient_id=node['id'],
                        current_price=current_price,
                        predicted_price=predicted_price,
                        volatility=volatility,
                        trend_direction=trend_direction,
                        confidence=0.7,  # Moderate confidence for demo
                        timestamp=datetime.now()
                    ))
        
        return signals
    
    def _identify_opportunities(self, market_data: Dict[str, Any], 
                             trends: List[MarketTrend], 
                             supplier_intel: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify market opportunities"""
        opportunities = []
        
        # High-performing supplier opportunities
        for supplier_id, intel in supplier_intel.items():
            if intel['overall_score'] > 0.8 and intel['risk_level'] == 'low':
                opportunities.append({
                    'type': 'strategic_partnership',
                    'description': f"Strategic partnership opportunity with high-performing supplier {supplier_id}",
                    'potential_value': 'high',
                    'confidence': intel['overall_score'],
                    'timeline': 'medium_term'
                })
        
        # Market trend opportunities
        for trend in trends:
            if trend.direction == 'rising' and trend.confidence > 0.7:
                opportunities.append({
                    'type': 'market_expansion',
                    'description': f"Market expansion opportunity in {trend.category}",
                    'potential_value': 'medium',
                    'confidence': trend.confidence,
                    'timeline': trend.time_horizon
                })
        
        return opportunities
    
    def _assess_market_risks(self, market_data: Dict[str, Any], 
                           trends: List[MarketTrend], 
                           supplier_intel: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Assess market risks"""
        risks = []
        
        # Supplier concentration risk
        high_risk_suppliers = [s_id for s_id, intel in supplier_intel.items() 
                              if intel['risk_level'] == 'high']
        
        if len(high_risk_suppliers) > len(supplier_intel) * 0.3:
            risks.append({
                'type': 'supplier_concentration',
                'description': 'High concentration of risky suppliers',
                'severity': 'high',
                'mitigation': 'Diversify supplier base and implement risk monitoring'
            })
        
        # Market volatility risk
        falling_trends = [t for t in trends if t.direction == 'falling' and t.confidence > 0.6]
        if len(falling_trends) > 1:
            risks.append({
                'type': 'market_volatility',
                'description': 'Multiple negative market trends detected',
                'severity': 'medium',
                'mitigation': 'Implement hedging strategies and flexible sourcing'
            })
        
        return risks
    
    def _calculate_market_health(self, trends: List[MarketTrend], 
                               supplier_intel: Dict[str, Any]) -> float:
        """Calculate overall market health score"""
        if not trends and not supplier_intel:
            return 0.5  # Neutral score
        
        # Trend health
        trend_health = 0.5
        if trends:
            positive_trends = sum(1 for t in trends if t.direction == 'rising')
            trend_health = positive_trends / len(trends)
        
        # Supplier health
        supplier_health = 0.5
        if supplier_intel:
            avg_supplier_score = sum(s['overall_score'] for s in supplier_intel.values()) / len(supplier_intel)
            supplier_health = avg_supplier_score
        
        return (trend_health + supplier_health) / 2
    
    def _generate_strategic_recommendations(self, trends: List[MarketTrend], 
                                         supplier_intel: Dict[str, Any],
                                         opportunities: List[Dict[str, Any]], 
                                         risks: List[Dict[str, Any]]) -> List[str]:
        """Generate strategic recommendations"""
        recommendations = []
        
        # Opportunity-based recommendations
        high_value_opportunities = [o for o in opportunities if o.get('potential_value') == 'high']
        if high_value_opportunities:
            recommendations.append("Prioritize high-value strategic partnerships with top-performing suppliers")
        
        # Risk-based recommendations
        high_severity_risks = [r for r in risks if r.get('severity') == 'high']
        if high_severity_risks:
            recommendations.append("Implement immediate risk mitigation strategies for high-severity risks")
        
        # Trend-based recommendations
        rising_trends = [t for t in trends if t.direction == 'rising']
        if rising_trends:
            recommendations.append("Capitalize on rising market trends through strategic positioning")
        
        return recommendations

# Example usage and testing
def test_market_intelligence():
    """Test the market intelligence engine"""
    
    # Load sample market data
    with open('hypergraph_data_updated.json', 'r') as f:
        market_data = json.load(f)
    
    # Initialize engine
    engine = MarketIntelligenceEngine()
    
    # Analyze market
    intelligence_report = engine.analyze_market(market_data)
    
    print("Market Intelligence Report:")
    print(f"Market Health Score: {intelligence_report['market_health_score']:.2f}")
    print(f"Trends Identified: {len(intelligence_report['market_trends'])}")
    print(f"Opportunities: {len(intelligence_report['opportunities'])}")
    print(f"Risks: {len(intelligence_report['risks'])}")
    print(f"Strategic Recommendations: {len(intelligence_report['recommendations'])}")
    
    return intelligence_report

if __name__ == "__main__":
    test_market_intelligence()
