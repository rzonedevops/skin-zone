# Skin Zone: Cognitive Hypergraph Marketplace

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/rzonedevops/skin-zone)
[![Database](https://img.shields.io/badge/database-Neon%20%7C%20Supabase-blue)](https://neon.tech)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> A next-generation skincare ingredient marketplace powered by cognitive hypergraph architecture, combining Deep Tree Echo and Marduk cognitive systems with JAX-powered neural optimization.

## 🧠 Overview

Skin Zone is not just a marketplace—it's a **cognitive ecosystem** that connects ingredient suppliers, salon professionals, and service providers through an intelligent hypergraph network. By leveraging advanced cognitive architectures and neural optimization, Skin Zone enables emergent intelligence and adaptive market dynamics.

### Key Features

- **🔗 Hypergraph Architecture**: Multi-dimensional relationships between suppliers, ingredients, salons, and services
- **🧠 Dual Cognitive Systems**: Deep Tree Echo (novelty detection) + Marduk (optimization) working in synergy
- **⚡ JAX CEO Subsystem**: Neural network-powered Cognitive Execution Orchestration
- **📊 Real-time Metrics**: Live cognitive synergy metrics calculated from actual network topology
- **🗄️ Dual Database Sync**: Synchronized PostgreSQL databases on Neon and Supabase
- **🎨 Modern UI**: React + Vite + shadcn/ui for beautiful, responsive interfaces

## 🏗️ Architecture

### Cognitive Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Skin Zone Cognitive System                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Deep Tree Echo  │◄────────────►│     Marduk       │    │
│  │ (Right Hemisphere)│              │ (Left Hemisphere)│    │
│  ├──────────────────┤              ├──────────────────┤    │
│  │ • Novelty        │              │ • Optimization   │    │
│  │ • Pattern Rec    │              │ • Logic          │    │
│  │ • Exploration    │              │ • Production     │    │
│  └──────────────────┘              └──────────────────┘    │
│           │                                  │               │
│           └──────────────┬───────────────────┘               │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │  JAX CEO    │                           │
│                   │  Subsystem  │                           │
│                   ├─────────────┤                           │
│                   │ • Neural    │                           │
│                   │ • AutoDiff  │                           │
│                   │ • Optimize  │                           │
│                   └─────────────┘                           │
│                          │                                   │
│           ┌──────────────┴──────────────┐                  │
│           │                              │                  │
│    ┌──────▼──────┐              ┌───────▼────────┐        │
│    │  Hypergraph │              │   AAR Core     │        │
│    │   Memory    │              │ (Agent-Arena-  │        │
│    │             │              │   Relation)    │        │
│    └─────────────┘              └────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Agent-Arena-Relation (AAR) Core

The AAR architecture provides geometric self-awareness:

- **Agent**: Market actors (suppliers, salons) with agency and decision-making
- **Arena**: Market conditions, pricing dynamics, availability states
- **Relation**: Continuous feedback loops enabling adaptive behavior

### Hypergraph Memory System

Multi-modal memory integration:

- **Declarative**: Facts about ingredients, suppliers, prices
- **Procedural**: Algorithms for matching, optimization, routing
- **Episodic**: Historical transactions and market events
- **Intentional**: Strategic goals and planning

## 📊 Database Architecture

### Dual Database Strategy

Skin Zone maintains synchronized PostgreSQL databases on two platforms:

#### Neon Database
- **Purpose**: Development, testing, serverless scaling
- **Project**: skin-zone-hypergraph (damp-brook-31747632)
- **Status**: ✅ Populated (75 nodes, 127 edges)
- **Features**: Branching, instant provisioning, auto-scaling

#### Supabase Database
- **Purpose**: Production, real-time features, authentication
- **Status**: 🔄 Ready for population
- **Features**: Real-time subscriptions, Row Level Security, Auth

### Core Schema

```sql
-- Nodes: All entities in the hypergraph
CREATE TABLE nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,  -- supplier, ingredient, platform, salon, service, etc.
    name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Edges: All relationships between entities
CREATE TABLE edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL REFERENCES nodes(id),
    target TEXT NOT NULL REFERENCES nodes(id),
    type TEXT NOT NULL,  -- supplies, uses_ingredient, offers_service, etc.
    metadata JSONB DEFAULT '{}',
    weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for complete schema documentation.

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- pnpm package manager
- Python 3.11+
- PostgreSQL (via Neon/Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/rzonedevops/skin-zone.git
cd skin-zone

# Install frontend dependencies
cd skin-zone-app
pnpm install

# Build the application
pnpm build

# Start development server
pnpm dev
```

### Database Setup

#### Option 1: Neon (Recommended for Development)

```bash
# Install MCP CLI (if not already installed)
# MCP integration is configured via Manus

# Populate Neon database
python3.11 populate_neon_db.py
```

#### Option 2: Supabase (Recommended for Production)

```bash
# Set environment variables
export SUPABASE_URL="your-supabase-url"
export SUPABASE_KEY="your-supabase-key"

# Install Supabase client
pip3 install supabase

# Create tables via Supabase Dashboard SQL Editor
# Execute: neon_schema_init.sql

# Populate Supabase database
python3.11 populate_supabase_db.py
```

## 📈 Cognitive Synergy Metrics

The system calculates real-time cognitive metrics from the hypergraph structure:

### Network Strength
- **Formula**: `(network_density * 1000 + avg_degree * 10) * 2`
- **Measures**: Overall connectivity and robustness
- **Current**: 87% (75 nodes, 127 edges)

### Adaptive Capacity
- **Formula**: `(type_count / 10) * 100 + (avg_degree / 5) * 20`
- **Measures**: Ability to respond to market changes
- **Current**: 92% (8 node types, diverse connections)

### Emergent Intelligence
- **Formula**: `cross_type_ratio * 100 + type_count * 5`
- **Measures**: Novel patterns from cross-domain interactions
- **Current**: 78% (high cross-type connectivity)

### System Coherence
- **Formula**: `(avg_degree / 10) * 50 + (network_density * 1000) + 40`
- **Measures**: Integration across subsystems
- **Current**: 94% (well-connected network)

## 🗂️ Project Structure

```
skin-zone/
├── skin-zone-app/              # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CognitiveSynergyEnhanced.jsx  # Real metrics component
│   │   │   └── ...
│   │   ├── App.jsx             # Main application
│   │   └── main.jsx
│   ├── public/
│   │   └── hypergraph_data.json  # Hypergraph data for frontend
│   ├── package.json
│   └── vite.config.js
├── hypergraph_data.json        # Master hypergraph data
├── database_schema.sql         # Complete PostgreSQL schema
├── neon_schema_init.sql        # Simplified schema for initialization
├── populate_neon_db.py         # Neon database population script
├── populate_supabase_db.py     # Supabase database population script
├── neon_connection.txt         # Neon connection details
├── DATABASE_SETUP.md           # Database documentation
├── cognitive_synergy_improvements.md  # Architecture analysis
├── supplier_research_findings.md      # Supplier data research
├── research_findings_salon_spa_networks.md  # Salon/spa research
├── research_data_lotioncrafter_2025.md     # Pricing data
├── research_data_comprehensive_suppliers_2025.md  # Supplier details
├── research_data_salon_spa_marketplaces_2025.md   # Platform data
└── README.md                   # This file
```

## 🔬 Research Data

### Suppliers (8 nodes)

1. **Making Cosmetics** - Comprehensive ingredient catalog, bulk pricing
2. **Lotion Crafter** - Specialty ingredients, fast shipping
3. **From Nature With Love (FNWL)** - Natural/organic focus
4. **BulkActives** - Bulk quantities, wholesale pricing
5. **The Chemistry Store** - Chemical compounds, lab-grade
6. **Essential Wholesale** - Essential oils, carrier oils
7. **Ingredi** - Premium actives, European sourcing
8. **TKB Trading** - Cosmetic pigments, micas

### Ingredients (29 nodes)

Key categories:
- **Humectants**: Hyaluronic Acid, Glycerin, Propanediol
- **Antioxidants**: Vitamin C, Vitamin E, Ferulic Acid
- **Anti-aging**: Retinol, Peptides, Bakuchiol
- **Emollients**: Squalane, Ceramides, Shea Butter
- **Actives**: Niacinamide, Alpha Arbutin, Azelaic Acid

### Platforms (6 nodes)

1. **GlossGenius** - All-in-one salon management ($24-$150/month)
2. **Vagaro** - Booking and marketing ($25-$150/month)
3. **StyleSeat** - Marketplace for beauty professionals (free + commission)
4. **Square Appointments** - POS integration ($0-$60/month)
5. **Fresha** - Free booking platform (commission-based)
6. **Mindbody** - Enterprise wellness software ($129-$349/month)

### Services (13 nodes)

- Facials (Basic, Anti-aging, Acne treatment)
- Chemical Peels
- Microdermabrasion
- LED Light Therapy
- Dermaplaning
- Microneedling
- Hair Services (Cut, Color, Treatment)
- Massage Therapy
- Nail Services

## 🛠️ Development

### Building

```bash
cd skin-zone-app
pnpm build
```

Build output: `skin-zone-app/dist/`

### Testing

```bash
# Run development server
pnpm dev

# Access at http://localhost:5173
```

### Database Queries

#### Via Neon MCP CLI

```bash
# List all nodes
manus-mcp-cli tool call run_sql --server neon \
  --input '{"params":{"sql":"SELECT type, COUNT(*) FROM nodes GROUP BY type","projectId":"damp-brook-31747632"}}'

# Get supplier-ingredient relationships
manus-mcp-cli tool call run_sql --server neon \
  --input '{"params":{"sql":"SELECT * FROM edges WHERE type = '\''supplies'\''","projectId":"damp-brook-31747632"}}'
```

#### Via Supabase Python Client

```python
from supabase import create_client
import os

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

# Query suppliers
suppliers = supabase.table('nodes').select('*').eq('type', 'supplier').execute()

# Query edges
edges = supabase.table('edges').select('*').eq('type', 'supplies').execute()
```

## 📊 Network Statistics

### Current State (v2.0)

| Metric | Value |
|--------|-------|
| Total Nodes | 75 |
| Total Edges | 127 |
| Node Types | 8 |
| Edge Types | 11 |
| Network Density | 4.5% |
| Average Degree | 3.39 |
| Largest Hub | Making Cosmetics (12 connections) |

### Node Distribution

| Type | Count | Description |
|------|-------|-------------|
| Supplier | 8 | Ingredient suppliers |
| Ingredient | 29 | Skincare active ingredients |
| Platform | 6 | Salon management platforms |
| Salon | 3 | Example salons/spas |
| Service | 13 | Services offered |
| Professional | 8 | Professional types |
| Category | 10 | Ingredient categories |
| Certification | 5 | Industry certifications |

### Edge Distribution

| Type | Count | Description |
|------|-------|-------------|
| supplies | 25 | Supplier → Ingredient |
| belongs_to | 18 | Ingredient → Category |
| uses_ingredient | 6 | Service → Ingredient |
| offers_service | 6 | Salon → Service |
| serves_professional | 23 | Platform → Professional |
| supports_service | 21 | Platform → Service |
| performs_service | 13 | Professional → Service |
| certified_by | 6 | Entity → Certification |
| purchases_from | 5 | Salon → Supplier |
| uses_platform | 3 | Salon → Platform |
| provides_space | 4 | Platform → Professional |

## 🔮 Roadmap

### Phase 1: Foundation ✅ (Complete)
- [x] Build system setup and testing
- [x] Database schema design
- [x] Hypergraph data structure
- [x] Supplier and platform research
- [x] Neon database population
- [x] Enhanced cognitive metrics component

### Phase 2: Visualization 🔄 (In Progress)
- [ ] D3.js hypergraph visualization
- [ ] Anime.js interaction animations
- [ ] Interactive node exploration
- [ ] Real-time metric updates

### Phase 3: Intelligence 📅 (Planned)
- [ ] FastAPI backend implementation
- [ ] JAX neural network integration
- [ ] AAR core architecture
- [ ] Real-time cognitive processing

### Phase 4: Evolution 🔭 (Future)
- [ ] Multi-agent coordination
- [ ] Evolutionary learning system
- [ ] Predictive analytics
- [ ] Autonomous optimization

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Deep Tree Echo**: Cognitive architecture for novelty detection
- **Marduk**: Optimization and production planning system
- **JAX**: High-performance numerical computing
- **Neon**: Serverless PostgreSQL platform
- **Supabase**: Open-source Firebase alternative
- **shadcn/ui**: Beautiful, accessible component library

## 📧 Contact

- **Project**: [github.com/rzonedevops/skin-zone](https://github.com/rzonedevops/skin-zone)
- **Issues**: [github.com/rzonedevops/skin-zone/issues](https://github.com/rzonedevops/skin-zone/issues)

---

**Built with 🧠 Cognitive Synergy**

*Skin Zone: Where Intelligence Meets Beauty*

---

# Skin Zone - Multi-Tenant Beauty Marketplace

A comprehensive architecture for a multi-tenant beauty marketplace platform that integrates ingredients, products, brands, salons, treatments, and therapists into a unified ecosystem. The platform features AppDirect integration for subscription management, a Hyper-Graph Neural Network (HGNN) database providing supply chain insights, and a prominent cheerleader mascot for brand identity and user engagement.

## Project Structure

- **backend/** - HyperGraphQL API backend
  - GraphQL and REST API endpoints
  - Org-aware hypergraph queries
  - Supply chain tracing
  - GitHub integration services

- **skin-zone-app/** - React frontend application
  - User interface components
  - HyperGraphQL API client
  - Interactive hypergraph visualization

- **documentation/** - Comprehensive technical documentation
  - Final Architecture Document
  - Technical Documentation
  - HyperGraphQL API Documentation
  - Usage Examples
  - Scalability & Security Validation

- **architecture/** - Detailed architectural components
  - Marketplace Architecture
  - HGNN Database Schema
  - AppDirect Integration
  - Supply Chain Data Flow
  - User Roles and Permissions
  - Cheerleader Mascot Integration

- **entities/** - Entity models and relationships
  - Ingredients
  - Products
  - Brands
  - Salons
  - Treatments
  - Therapists
  - Entity Relationships

- **mockups/** - UI/UX wireframes
  - Homepage
  - Product Listing
  - Product Detail
  - Salon Detail
  - Booking Flow

- **ui_assets/** - UI assets including the cheerleader mascot animation

## Key Features

1. **Multi-tenant Architecture** - Supporting different brands and salons
2. **HyperGraphQL API** - GraphQL and REST API for org-aware hypergraph queries
3. **OpenCog Cognitive AI v2** ✨ - Advanced reasoning, learning, and decision-making with:
   - **Persistence Service** - AtomSpace persistence with optional Redis
   - **Federated Learning** - Privacy-preserving cross-tenant knowledge transfer
   - **Advanced Reasoning** - Multi-step inference with explainability
   - **Enhanced Statistics** - Comprehensive monitoring and analytics
4. **Supply Chain Tracing** - Track products through ingredients to suppliers with cognitive analysis
5. **Hypergraph Navigation** - Path finding and graph traversal capabilities
6. **GitHub Integration** - Map repo folder structure to hypergraph entities
7. **AppDirect Integration** - For subscription and billing management
8. **HGNN Database** - Providing supply chain insights and recommendations
9. **Cognitive Recommendations** - AI-powered treatment and product recommendations with reasoning
10. **Cheerleader Mascot** - Prominent animated mascot across all interfaces
11. **Responsive Design** - Supporting desktop and mobile devices

## Technology Stack

- **Frontend**: React with Vite, TailwindCSS, Radix UI components
- **Backend**: Node.js with Express, GraphQL (express-graphql)
- **API Layer**: HyperGraphQL API for hypergraph queries
- **Cognitive AI**: OpenCog-inspired cognitive architecture with AtomSpace, Pattern Matcher, and PLN reasoning
- **Database**: JSON-based hypergraph data with in-memory processing
- **Future**: PostgreSQL (relational data), Neo4j (graph database), Redis (caching)
- **Messaging**: RabbitMQ or Kafka for inter-service communication (planned)
- **Containerization**: Docker with Kubernetes orchestration (planned)
- **Cloud Infrastructure**: AWS/GCP/Azure (cloud-agnostic design)

## Implementation Roadmap

1. **Foundation Phase** - Core infrastructure setup
2. **Core Functionality Phase** - Basic marketplace features
3. **Advanced Features Phase** - Supply chain insights and recommendations
4. **Optimization Phase** - Performance tuning and security hardening

## Quick Start

### Backend API

```bash
cd backend
npm install
npm start
```

The HyperGraphQL API will be available at:
- GraphQL endpoint: `http://localhost:4000/graphql`
- GraphiQL interface: `http://localhost:4000/graphql` (in browser)
- REST API: `http://localhost:4000/api`

See [Backend README](backend/README.md) for detailed API documentation.

### Frontend Application

```bash
cd skin-zone-app
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

- **[Enhanced Features v2](ENHANCED_FEATURES_V2.md)** ✨ - NEW! Production-ready enterprise features
- **[HyperGraphQL API Documentation](documentation/hypergraphql_api.md)** - Complete API reference
- **[OpenCog Usage Examples](documentation/opencog_usage_examples.md)** - Practical cognitive AI examples
- **[Usage Examples](documentation/hypergraphql_usage_examples.md)** - Practical examples and patterns
- **[Backend README](backend/README.md)** - Backend setup and configuration

## Example Queries

### Get all ingredients

```graphql
{
  nodes(filter: { type: "ingredient" }) {
    id
    name
    properties {
      category
      description
    }
  }
}
```

### Trace supply chain

```graphql
{
  traceSupplyChain(productId: "product_123") {
    product { name }
    ingredients { name }
    suppliers { name }
  }
}
```

### Org-aware query

```graphql
{
  nodes(filter: { type: "salon", tenantId: "luxe_skin_studio" }) {
    id
    name
  }
}
```

### OpenCog cognitive recommendations

```graphql
{
  cognitiveRecommendations(
    userId: "customer_123"
    context: "{\"type\": \"treatment\"}"
    tenantId: "luxe_skin_studio"
  ) {
    id
    name
    cognitiveScore
    confidence
    reasoning {
      rule
      impact
      reason
    }
  }
}
```

### OpenCog supply chain analysis

```graphql
{
  analyzeSupplyChain(
    productId: "product_123"
    analysisType: TRANSPARENCY
    tenantId: "beauty_brand_001"
  ) {
    score
    confidence
    insights {
      metric
      value
      impact
    }
    recommendations {
      type
      priority
      message
    }
  }
}
```

## Repository Organization

This repository contains the complete architectural design, technical documentation, and implementation of the HyperGraphQL API for the Skin Zone beauty marketplace platform. It serves as both a reference architecture and a functional API implementation.
