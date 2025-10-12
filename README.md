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
