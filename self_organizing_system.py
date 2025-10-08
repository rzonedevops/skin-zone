"""
Self-Organizing System with Advanced Visualization
Implements Deep Tree Echo architecture with P-System membrane management
and self-organizing capabilities for the Skin Zone cognitive ecosystem
"""

import jax
import jax.numpy as jnp
from jax import random, grad, jit, vmap, lax
import numpy as np
from typing import Dict, List, Tuple, Any, Optional, Set
from dataclasses import dataclass, field
from functools import partial
import json
from datetime import datetime
from enum import Enum
import itertools

class MembraneType(Enum):
    """Types of membranes in the P-System architecture"""
    ROOT = "root"
    COGNITIVE = "cognitive"
    MEMORY = "memory"
    REASONING = "reasoning"
    GRAMMAR = "grammar"
    EXTENSION = "extension"
    BROWSER = "browser"
    ML = "ml"
    INTROSPECTION = "introspection"
    SECURITY = "security"
    AUTHENTICATION = "authentication"
    VALIDATION = "validation"
    EMERGENCY = "emergency"

@dataclass
class Membrane:
    """P-System membrane with self-organizing capabilities"""
    membrane_id: str
    membrane_type: MembraneType
    parent_id: Optional[str] = None
    children_ids: Set[str] = field(default_factory=set)
    objects: Dict[str, Any] = field(default_factory=dict)
    rules: List[Dict[str, Any]] = field(default_factory=list)
    priority: int = 0
    active: bool = True
    evolution_step: int = 0
    
    def add_child(self, child_id: str):
        """Add a child membrane"""
        self.children_ids.add(child_id)
    
    def remove_child(self, child_id: str):
        """Remove a child membrane"""
        self.children_ids.discard(child_id)
    
    def add_object(self, obj_id: str, obj_data: Any):
        """Add an object to the membrane"""
        self.objects[obj_id] = obj_data
    
    def remove_object(self, obj_id: str):
        """Remove an object from the membrane"""
        self.objects.pop(obj_id, None)

@dataclass
class PatternVector:
    """Pattern representation with vector symbol and color encoding"""
    pattern_id: str
    vector_symbol: str  # Unicode symbol representing the pattern
    color_code: str     # Hex color code
    semantic_embedding: jnp.ndarray
    activation_level: float = 0.0
    emergence_timestamp: datetime = field(default_factory=datetime.now)
    
class HypergraphMemorySpace:
    """
    Advanced hypergraph memory space implementing the Deep Tree Echo architecture
    Supports declarative, procedural, episodic, and intentional memory types
    """
    
    def __init__(self, embedding_dim: int = 256):
        self.embedding_dim = embedding_dim
        self.key = random.PRNGKey(42)
        
        # Memory types as per Deep Tree Echo architecture
        self.declarative_memory = {}  # Facts, concepts
        self.procedural_memory = {}   # Skills, algorithms
        self.episodic_memory = {}     # Experiences, events
        self.intentional_memory = {}  # Goals, plans
        
        # Pattern vectors with visual encoding
        self.pattern_vectors = {}
        
        # Neural networks for memory operations
        self.memory_encoder_params = self._initialize_memory_encoder()
        self.pattern_classifier_params = self._initialize_pattern_classifier()
        
        # Christopher Alexander pattern language integration (253 + 33 patterns)
        self.alexander_patterns = self._initialize_alexander_patterns()
        
    def _initialize_memory_encoder(self) -> Dict[str, jnp.ndarray]:
        """Initialize neural encoder for memory operations"""
        self.key, *subkeys = random.split(self.key, 8)
        
        return {
            'encoder_w1': random.normal(subkeys[0], (self.embedding_dim, 128)),
            'encoder_b1': jnp.zeros(128),
            'encoder_w2': random.normal(subkeys[1], (128, 64)),
            'encoder_b2': jnp.zeros(64),
            'encoder_w3': random.normal(subkeys[2], (64, 32)),
            'encoder_b3': jnp.zeros(32),
            'memory_type_classifier_w': random.normal(subkeys[3], (32, 4)),  # 4 memory types
            'memory_type_classifier_b': jnp.zeros(4),
            'retrieval_w1': random.normal(subkeys[4], (32, 64)),
            'retrieval_b1': jnp.zeros(64),
            'retrieval_w2': random.normal(subkeys[5], (64, 128)),
            'retrieval_b2': jnp.zeros(128),
            'retrieval_w3': random.normal(subkeys[6], (128, self.embedding_dim)),
            'retrieval_b3': jnp.zeros(self.embedding_dim)
        }
    
    def _initialize_pattern_classifier(self) -> Dict[str, jnp.ndarray]:
        """Initialize pattern classifier for Alexander patterns"""
        self.key, *subkeys = random.split(self.key, 4)
        
        return {
            'pattern_w1': random.normal(subkeys[0], (self.embedding_dim, 96)),
            'pattern_b1': jnp.zeros(96),
            'pattern_w2': random.normal(subkeys[1], (96, 48)),
            'pattern_b2': jnp.zeros(48),
            'pattern_classifier_w': random.normal(subkeys[2], (48, 286)),  # 286 patterns from OEIS A000081
            'pattern_classifier_b': jnp.zeros(286)
        }
    
    def _initialize_alexander_patterns(self) -> Dict[int, Dict[str, Any]]:
        """Initialize Christopher Alexander pattern language (253 + 33 patterns)"""
        patterns = {}
        
        # Core 253 patterns with visual encoding
        pattern_symbols = ['🏛️', '🌳', '🏠', '🛤️', '🌊', '🔥', '💎', '🌀', '⚡', '🎭', 
                          '🎪', '🎨', '🎯', '🎲', '🎵', '🎸', '🎺', '🎻', '🎼', '🎹']
        
        pattern_colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
                         '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9']
        
        for i in range(253):  # Core Alexander patterns
            patterns[i] = {
                'pattern_id': f'alexander_{i}',
                'name': f'Pattern {i}',
                'level': 'core',
                'symbol': pattern_symbols[i % len(pattern_symbols)],
                'color': pattern_colors[i % len(pattern_colors)],
                'activation': 0.0,
                'connections': set()
            }
        
        # Additional 33 regional transformation patterns
        for i in range(253, 286):
            patterns[i] = {
                'pattern_id': f'regional_{i}',
                'name': f'Regional Pattern {i}',
                'level': 'regional',
                'symbol': '🌍',
                'color': '#8B5CF6',
                'activation': 0.0,
                'connections': set()
            }
        
        return patterns
    
    @partial(jit, static_argnums=(0,))
    def encode_memory(self, params: Dict[str, jnp.ndarray], 
                     memory_data: jnp.ndarray) -> Tuple[jnp.ndarray, jnp.ndarray]:
        """Encode memory data and classify memory type"""
        # Encode memory
        h1 = jnp.tanh(jnp.dot(memory_data, params['encoder_w1']) + params['encoder_b1'])
        h2 = jnp.tanh(jnp.dot(h1, params['encoder_w2']) + params['encoder_b2'])
        encoded = jnp.tanh(jnp.dot(h2, params['encoder_w3']) + params['encoder_b3'])
        
        # Classify memory type
        memory_type_probs = jax.nn.softmax(
            jnp.dot(encoded, params['memory_type_classifier_w']) + params['memory_type_classifier_b']
        )
        
        return encoded, memory_type_probs
    
    @partial(jit, static_argnums=(0,))
    def classify_alexander_pattern(self, params: Dict[str, jnp.ndarray], 
                                  memory_data: jnp.ndarray) -> jnp.ndarray:
        """Classify input according to Alexander pattern language"""
        h1 = jnp.tanh(jnp.dot(memory_data, params['pattern_w1']) + params['pattern_b1'])
        h2 = jnp.tanh(jnp.dot(h1, params['pattern_w2']) + params['pattern_b2'])
        pattern_probs = jax.nn.softmax(
            jnp.dot(h2, params['pattern_classifier_w']) + params['pattern_classifier_b']
        )
        return pattern_probs
    
    def store_memory(self, memory_id: str, memory_data: Any, 
                    memory_context: Dict[str, Any]) -> PatternVector:
        """Store memory with automatic type classification and pattern encoding"""
        
        # Convert memory data to embedding
        if isinstance(memory_data, dict):
            # Create feature vector from dictionary
            feature_vector = self._dict_to_vector(memory_data)
        else:
            # Use random embedding for other types
            self.key, subkey = random.split(self.key)
            feature_vector = random.normal(subkey, (self.embedding_dim,))
        
        # Encode memory and classify type
        encoded_memory, memory_type_probs = self.encode_memory(
            self.memory_encoder_params, feature_vector
        )
        
        # Classify Alexander pattern
        pattern_probs = self.classify_alexander_pattern(
            self.pattern_classifier_params, feature_vector
        )
        
        # Determine dominant memory type
        memory_types = ['declarative', 'procedural', 'episodic', 'intentional']
        dominant_type_idx = jnp.argmax(memory_type_probs)
        dominant_type = memory_types[dominant_type_idx]
        
        # Determine dominant Alexander pattern
        dominant_pattern_idx = int(jnp.argmax(pattern_probs))
        alexander_pattern = self.alexander_patterns[dominant_pattern_idx]
        
        # Create pattern vector with visual encoding
        pattern_vector = PatternVector(
            pattern_id=memory_id,
            vector_symbol=alexander_pattern['symbol'],
            color_code=alexander_pattern['color'],
            semantic_embedding=encoded_memory,
            activation_level=float(jnp.max(pattern_probs)),
            emergence_timestamp=datetime.now()
        )
        
        # Store in appropriate memory type
        memory_entry = {
            'data': memory_data,
            'context': memory_context,
            'encoding': encoded_memory,
            'pattern_vector': pattern_vector,
            'alexander_pattern_id': dominant_pattern_idx,
            'confidence': float(jnp.max(memory_type_probs))
        }
        
        if dominant_type == 'declarative':
            self.declarative_memory[memory_id] = memory_entry
        elif dominant_type == 'procedural':
            self.procedural_memory[memory_id] = memory_entry
        elif dominant_type == 'episodic':
            self.episodic_memory[memory_id] = memory_entry
        else:  # intentional
            self.intentional_memory[memory_id] = memory_entry
        
        # Store pattern vector
        self.pattern_vectors[memory_id] = pattern_vector
        
        return pattern_vector
    
    def _dict_to_vector(self, data_dict: Dict[str, Any]) -> jnp.ndarray:
        """Convert dictionary to feature vector"""
        vector = jnp.zeros(self.embedding_dim)
        
        # Simple hash-based encoding
        for i, (key, value) in enumerate(data_dict.items()):
            if i >= self.embedding_dim:
                break
            
            if isinstance(value, (int, float)):
                vector = vector.at[i].set(float(value))
            elif isinstance(value, str):
                # Simple string hash
                hash_val = hash(value) % 1000 / 1000.0
                vector = vector.at[i].set(hash_val)
        
        return vector

class EchoPropagationEngine:
    """
    Advanced echo propagation engine with activation spreading,
    pattern recognition, and feedback loops
    """
    
    def __init__(self, memory_space: HypergraphMemorySpace):
        self.memory_space = memory_space
        self.key = random.PRNGKey(84)
        self.activation_threshold = 0.5
        self.propagation_decay = 0.9
        
        # Initialize propagation networks
        self.propagation_params = self._initialize_propagation_network()
        self.feedback_params = self._initialize_feedback_network()
        
    def _initialize_propagation_network(self) -> Dict[str, jnp.ndarray]:
        """Initialize neural network for activation propagation"""
        self.key, *subkeys = random.split(self.key, 6)
        
        return {
            'prop_w1': random.normal(subkeys[0], (32, 48)),  # Pattern embedding size (32 from encoder)
            'prop_b1': jnp.zeros(48),
            'prop_w2': random.normal(subkeys[1], (48, 32)),
            'prop_b2': jnp.zeros(32),
            'activation_w': random.normal(subkeys[2], (32, 1)),
            'activation_b': jnp.zeros(1),
            'influence_w1': random.normal(subkeys[3], (32, 32)),  # Match embedding dimension
            'influence_b1': jnp.zeros(32),
            'influence_w2': random.normal(subkeys[4], (32, 32)),  # Match embedding dimension
            'influence_b2': jnp.zeros(32)
        }
    
    def _initialize_feedback_network(self) -> Dict[str, jnp.ndarray]:
        """Initialize feedback loop network"""
        self.key, *subkeys = random.split(self.key, 4)
        
        return {
            'feedback_w1': random.normal(subkeys[0], (128, 64)),  # Combined state
            'feedback_b1': jnp.zeros(64),
            'feedback_w2': random.normal(subkeys[1], (64, 32)),
            'feedback_b2': jnp.zeros(32),
            'update_w': random.normal(subkeys[2], (32, 64)),
            'update_b': jnp.zeros(64)
        }
    
    @partial(jit, static_argnums=(0,))
    def propagate_activation(self, params: Dict[str, jnp.ndarray],
                           source_embedding: jnp.ndarray,
                           target_embedding: jnp.ndarray) -> Tuple[float, jnp.ndarray]:
        """Propagate activation between pattern embeddings"""
        
        # Compute activation strength using source embedding only (32 dimensions)
        h1 = jnp.tanh(jnp.dot(source_embedding, params['prop_w1']) + params['prop_b1'])
        h2 = jnp.tanh(jnp.dot(h1, params['prop_w2']) + params['prop_b2'])
        activation = jax.nn.sigmoid(jnp.dot(h2, params['activation_w']) + params['activation_b'])[0]
        
        # Compute influence on target
        h1_inf = jnp.tanh(jnp.dot(source_embedding, params['influence_w1']) + params['influence_b1'])
        influence = jnp.tanh(jnp.dot(h1_inf, params['influence_w2']) + params['influence_b2'])
        
        return activation, influence
    
    def spread_activation(self, initial_patterns: List[str], 
                         steps: int = 5) -> Dict[str, float]:
        """Spread activation through the pattern network"""
        
        # Initialize activation levels
        activations = {pattern_id: 0.0 for pattern_id in self.memory_space.pattern_vectors.keys()}
        
        # Set initial activations
        for pattern_id in initial_patterns:
            if pattern_id in activations:
                activations[pattern_id] = 1.0
        
        # Propagate activation for specified steps
        for step in range(steps):
            new_activations = activations.copy()
            
            for source_id, source_activation in activations.items():
                if source_activation > self.activation_threshold:
                    source_pattern = self.memory_space.pattern_vectors.get(source_id)
                    if not source_pattern:
                        continue
                    
                    for target_id, target_pattern in self.memory_space.pattern_vectors.items():
                        if source_id != target_id:
                            # Compute propagation
                            prop_strength, influence = self.propagate_activation(
                                self.propagation_params,
                                source_pattern.semantic_embedding,
                                target_pattern.semantic_embedding
                            )
                            
                            # Update target activation
                            propagated_activation = source_activation * float(prop_strength) * self.propagation_decay
                            new_activations[target_id] = max(
                                new_activations[target_id],
                                propagated_activation
                            )
            
            activations = new_activations
        
        return activations

class CognitiveGrammarKernel:
    """
    Cognitive Grammar Kernel implementing symbolic reasoning,
    neural-symbolic integration, and meta-cognitive reflection
    """
    
    def __init__(self, memory_space: HypergraphMemorySpace):
        self.memory_space = memory_space
        self.key = random.PRNGKey(126)
        
        # Symbolic reasoning rules
        self.symbolic_rules = []
        self.meta_cognitive_state = {}
        
        # Neural-symbolic integration networks
        self.integration_params = self._initialize_integration_network()
        
    def _initialize_integration_network(self) -> Dict[str, jnp.ndarray]:
        """Initialize neural-symbolic integration network"""
        self.key, *subkeys = random.split(self.key, 6)
        
        return {
            'symbol_encoder_w': random.normal(subkeys[0], (100, 64)),  # Symbolic features
            'symbol_encoder_b': jnp.zeros(64),
            'neural_encoder_w': random.normal(subkeys[1], (32, 64)),   # Neural features
            'neural_encoder_b': jnp.zeros(64),
            'integration_w1': random.normal(subkeys[2], (128, 96)),    # Combined features
            'integration_b1': jnp.zeros(96),
            'integration_w2': random.normal(subkeys[3], (96, 48)),
            'integration_b2': jnp.zeros(48),
            'reasoning_w': random.normal(subkeys[4], (48, 32)),
            'reasoning_b': jnp.zeros(32)
        }
    
    def add_symbolic_rule(self, rule_id: str, condition: str, 
                         action: str, confidence: float):
        """Add a symbolic reasoning rule"""
        rule = {
            'rule_id': rule_id,
            'condition': condition,
            'action': action,
            'confidence': confidence,
            'activation_count': 0,
            'success_rate': 0.0
        }
        self.symbolic_rules.append(rule)
    
    def meta_cognitive_reflection(self, system_state: Dict[str, Any]) -> Dict[str, Any]:
        """Perform meta-cognitive reflection on system state"""
        
        reflection = {
            'timestamp': datetime.now().isoformat(),
            'system_coherence': self._assess_system_coherence(system_state),
            'learning_progress': self._assess_learning_progress(system_state),
            'adaptation_needs': self._identify_adaptation_needs(system_state),
            'emergent_properties': self._detect_emergent_properties(system_state)
        }
        
        self.meta_cognitive_state = reflection
        return reflection
    
    def _assess_system_coherence(self, system_state: Dict[str, Any]) -> float:
        """Assess overall system coherence"""
        # Simple coherence metric based on pattern consistency
        if not self.memory_space.pattern_vectors:
            return 0.5
        
        activations = [pv.activation_level for pv in self.memory_space.pattern_vectors.values()]
        coherence = 1.0 - np.std(activations) if activations else 0.5
        return max(0.0, min(1.0, coherence))
    
    def _assess_learning_progress(self, system_state: Dict[str, Any]) -> float:
        """Assess learning progress"""
        # Based on memory growth and pattern diversity
        total_memories = (len(self.memory_space.declarative_memory) +
                         len(self.memory_space.procedural_memory) +
                         len(self.memory_space.episodic_memory) +
                         len(self.memory_space.intentional_memory))
        
        progress = min(1.0, total_memories / 100.0)  # Normalize to 100 memories
        return progress
    
    def _identify_adaptation_needs(self, system_state: Dict[str, Any]) -> List[str]:
        """Identify areas needing adaptation"""
        needs = []
        
        # Check for low activation patterns
        low_activation_patterns = [
            pv.pattern_id for pv in self.memory_space.pattern_vectors.values()
            if pv.activation_level < 0.3
        ]
        
        if len(low_activation_patterns) > len(self.memory_space.pattern_vectors) * 0.5:
            needs.append("Increase pattern activation diversity")
        
        # Check rule effectiveness
        ineffective_rules = [
            rule for rule in self.symbolic_rules
            if rule['activation_count'] > 0 and rule['success_rate'] < 0.5
        ]
        
        if ineffective_rules:
            needs.append("Refine symbolic reasoning rules")
        
        return needs
    
    def _detect_emergent_properties(self, system_state: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Detect emergent properties in the system"""
        emergent_properties = []
        
        # Detect pattern clusters
        if len(self.memory_space.pattern_vectors) > 5:
            # Simple clustering based on activation levels
            high_activation = [
                pv for pv in self.memory_space.pattern_vectors.values()
                if pv.activation_level > 0.7
            ]
            
            if len(high_activation) > 2:
                emergent_properties.append({
                    'type': 'pattern_cluster',
                    'description': f'High activation cluster of {len(high_activation)} patterns',
                    'strength': np.mean([pv.activation_level for pv in high_activation])
                })
        
        return emergent_properties

class PSysMembraneManager:
    """
    P-System membrane manager implementing the Deep Tree Echo architecture
    with self-organizing capabilities
    """
    
    def __init__(self):
        self.membranes = {}
        self.membrane_hierarchy = {}
        self.evolution_step = 0
        
        # Initialize membrane hierarchy
        self._initialize_membrane_hierarchy()
    
    def _initialize_membrane_hierarchy(self):
        """Initialize the Deep Tree Echo membrane hierarchy"""
        
        # Root membrane (system boundary)
        root = Membrane("root", MembraneType.ROOT)
        self.membranes["root"] = root
        
        # Cognitive membrane (core processing)
        cognitive = Membrane("cognitive", MembraneType.COGNITIVE, parent_id="root")
        self.membranes["cognitive"] = cognitive
        root.add_child("cognitive")
        
        # Memory, reasoning, and grammar membranes under cognitive
        for mem_type, mem_id in [
            (MembraneType.MEMORY, "memory"),
            (MembraneType.REASONING, "reasoning"),
            (MembraneType.GRAMMAR, "grammar")
        ]:
            membrane = Membrane(mem_id, mem_type, parent_id="cognitive")
            self.membranes[mem_id] = membrane
            cognitive.add_child(mem_id)
        
        # Extension membrane (plugin container)
        extension = Membrane("extension", MembraneType.EXTENSION, parent_id="root")
        self.membranes["extension"] = extension
        root.add_child("extension")
        
        # Browser, ML, and introspection membranes under extension
        for mem_type, mem_id in [
            (MembraneType.BROWSER, "browser"),
            (MembraneType.ML, "ml"),
            (MembraneType.INTROSPECTION, "introspection")
        ]:
            membrane = Membrane(mem_id, mem_type, parent_id="extension")
            self.membranes[mem_id] = membrane
            extension.add_child(mem_id)
        
        # Security membrane (validation & control)
        security = Membrane("security", MembraneType.SECURITY, parent_id="root")
        self.membranes["security"] = security
        root.add_child("security")
        
        # Authentication, validation, and emergency membranes under security
        for mem_type, mem_id in [
            (MembraneType.AUTHENTICATION, "authentication"),
            (MembraneType.VALIDATION, "validation"),
            (MembraneType.EMERGENCY, "emergency")
        ]:
            membrane = Membrane(mem_id, mem_type, parent_id="security")
            self.membranes[mem_id] = membrane
            security.add_child(mem_id)
    
    def evolve_system(self) -> Dict[str, Any]:
        """Evolve the membrane system one step"""
        self.evolution_step += 1
        
        evolution_report = {
            'step': self.evolution_step,
            'timestamp': datetime.now().isoformat(),
            'membrane_states': {},
            'system_changes': [],
            'emergent_behaviors': []
        }
        
        # Evolve each membrane
        for membrane_id, membrane in self.membranes.items():
            membrane.evolution_step = self.evolution_step
            
            # Apply membrane rules (simplified)
            membrane_changes = self._apply_membrane_rules(membrane)
            
            evolution_report['membrane_states'][membrane_id] = {
                'active': membrane.active,
                'object_count': len(membrane.objects),
                'rule_count': len(membrane.rules),
                'priority': membrane.priority,
                'changes': membrane_changes
            }
            
            if membrane_changes:
                evolution_report['system_changes'].extend(membrane_changes)
        
        # Detect emergent behaviors
        emergent_behaviors = self._detect_emergent_behaviors()
        evolution_report['emergent_behaviors'] = emergent_behaviors
        
        return evolution_report
    
    def _apply_membrane_rules(self, membrane: Membrane) -> List[str]:
        """Apply evolution rules to a membrane"""
        changes = []
        
        # Simple self-organization rules
        
        # Rule 1: Increase priority if membrane is highly active
        if len(membrane.objects) > 10:
            membrane.priority = min(10, membrane.priority + 1)
            changes.append(f"Increased priority to {membrane.priority}")
        
        # Rule 2: Create new objects based on membrane type
        if membrane.membrane_type == MembraneType.MEMORY and len(membrane.objects) < 5:
            new_obj_id = f"memory_obj_{self.evolution_step}"
            membrane.add_object(new_obj_id, {'type': 'memory_trace', 'strength': 0.5})
            changes.append(f"Created new memory object: {new_obj_id}")
        
        # Rule 3: Deactivate membranes with no objects for too long
        if len(membrane.objects) == 0 and membrane.evolution_step > 10:
            membrane.active = False
            changes.append("Deactivated due to inactivity")
        
        return changes
    
    def _detect_emergent_behaviors(self) -> List[Dict[str, Any]]:
        """Detect emergent behaviors in the membrane system"""
        behaviors = []
        
        # Detect membrane synchronization
        active_membranes = [m for m in self.membranes.values() if m.active]
        if len(active_membranes) > 5:
            avg_priority = np.mean([m.priority for m in active_membranes])
            if np.std([m.priority for m in active_membranes]) < 1.0:
                behaviors.append({
                    'type': 'synchronization',
                    'description': 'Membrane priorities are converging',
                    'strength': 1.0 - np.std([m.priority for m in active_membranes])
                })
        
        # Detect hierarchical emergence
        cognitive_membrane = self.membranes.get('cognitive')
        if cognitive_membrane and len(cognitive_membrane.children_ids) > 2:
            child_activities = [
                len(self.membranes[child_id].objects) 
                for child_id in cognitive_membrane.children_ids
                if child_id in self.membranes
            ]
            
            if child_activities and max(child_activities) > 5:
                behaviors.append({
                    'type': 'hierarchical_emergence',
                    'description': 'Cognitive subsystems showing coordinated activity',
                    'strength': max(child_activities) / 10.0
                })
        
        return behaviors

class SelfOrganizingSystem:
    """
    Main self-organizing system integrating all components
    with advanced visualization capabilities
    """
    
    def __init__(self, embedding_dim: int = 256):
        self.embedding_dim = embedding_dim
        
        # Initialize core components
        self.memory_space = HypergraphMemorySpace(embedding_dim)
        self.echo_engine = EchoPropagationEngine(self.memory_space)
        self.grammar_kernel = CognitiveGrammarKernel(self.memory_space)
        self.membrane_manager = PSysMembraneManager()
        
        # System state
        self.system_state = {
            'initialization_time': datetime.now(),
            'evolution_steps': 0,
            'total_patterns': 0,
            'active_membranes': 0
        }
        
        # Visualization data
        self.visualization_data = {
            'membrane_hierarchy': {},
            'pattern_network': {},
            'activation_flows': [],
            'emergent_structures': []
        }
    
    def process_input(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input through the self-organizing system"""
        
        # Store input as memory
        memory_id = f"input_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        pattern_vector = self.memory_space.store_memory(
            memory_id, input_data, {'source': 'external_input'}
        )
        
        # Propagate activation
        activations = self.echo_engine.spread_activation([memory_id])
        
        # Update pattern activations
        for pattern_id, activation in activations.items():
            if pattern_id in self.memory_space.pattern_vectors:
                self.memory_space.pattern_vectors[pattern_id].activation_level = activation
        
        # Perform meta-cognitive reflection
        reflection = self.grammar_kernel.meta_cognitive_reflection(self.system_state)
        
        # Evolve membrane system
        evolution_report = self.membrane_manager.evolve_system()
        
        # Update system state
        self.system_state.update({
            'evolution_steps': evolution_report['step'],
            'total_patterns': len(self.memory_space.pattern_vectors),
            'active_membranes': len([m for m in self.membrane_manager.membranes.values() if m.active])
        })
        
        # Generate visualization data
        self._update_visualization_data()
        
        return {
            'timestamp': datetime.now().isoformat(),
            'input_pattern': {
                'pattern_id': pattern_vector.pattern_id,
                'symbol': pattern_vector.vector_symbol,
                'color': pattern_vector.color_code,
                'activation': pattern_vector.activation_level
            },
            'activations': {k: float(v) for k, v in activations.items()},
            'meta_cognitive_reflection': reflection,
            'evolution_report': evolution_report,
            'system_state': self.system_state,
            'visualization_data': self.visualization_data
        }
    
    def _update_visualization_data(self):
        """Update visualization data for advanced rendering"""
        
        # Membrane hierarchy visualization
        self.visualization_data['membrane_hierarchy'] = {
            membrane_id: {
                'type': membrane.membrane_type.value,
                'parent': membrane.parent_id,
                'children': list(membrane.children_ids),
                'active': membrane.active,
                'priority': membrane.priority,
                'object_count': len(membrane.objects)
            }
            for membrane_id, membrane in self.membrane_manager.membranes.items()
        }
        
        # Pattern network visualization
        self.visualization_data['pattern_network'] = {
            'nodes': [
                {
                    'id': pv.pattern_id,
                    'symbol': pv.vector_symbol,
                    'color': pv.color_code,
                    'activation': pv.activation_level,
                    'x': float(pv.semantic_embedding[0]) if len(pv.semantic_embedding) > 0 else 0,
                    'y': float(pv.semantic_embedding[1]) if len(pv.semantic_embedding) > 1 else 0
                }
                for pv in self.memory_space.pattern_vectors.values()
            ],
            'edges': []  # Would be computed based on activation propagation
        }
        
        # Activation flows
        self.visualization_data['activation_flows'] = [
            {
                'source': pattern_id,
                'activation': activation,
                'timestamp': datetime.now().isoformat()
            }
            for pattern_id, activation in 
            [(pv.pattern_id, pv.activation_level) for pv in self.memory_space.pattern_vectors.values()]
            if activation > 0.5
        ]

# Example usage and testing
def test_self_organizing_system():
    """Test the self-organizing system"""
    
    # Initialize system
    system = SelfOrganizingSystem()
    
    # Process sample inputs
    sample_inputs = [
        {'type': 'supplier', 'name': 'Organic Ingredients Co', 'specialty': 'organic'},
        {'type': 'ingredient', 'name': 'Hyaluronic Acid', 'price': 459.90},
        {'type': 'salon', 'name': 'Luxury Spa', 'services': ['facials', 'treatments']},
        {'type': 'market_trend', 'direction': 'rising', 'confidence': 0.8}
    ]
    
    results = []
    for i, input_data in enumerate(sample_inputs):
        print(f"Processing input {i+1}: {input_data['type']}")
        result = system.process_input(input_data)
        results.append(result)
        
        print(f"  Pattern: {result['input_pattern']['symbol']} ({result['input_pattern']['color']})")
        print(f"  Activations: {len(result['activations'])} patterns activated")
        print(f"  System coherence: {result['meta_cognitive_reflection']['system_coherence']:.3f}")
        print(f"  Active membranes: {result['system_state']['active_membranes']}")
        print()
    
    print("Self-Organizing System Test Complete")
    print(f"Total patterns created: {system.system_state['total_patterns']}")
    print(f"Evolution steps: {system.system_state['evolution_steps']}")
    
    return results

if __name__ == "__main__":
    test_self_organizing_system()
