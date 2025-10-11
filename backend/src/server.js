import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import dataService from './services/dataService.js';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data service
dataService.initialize()
  .then(() => {
    console.log('Data service initialized successfully');
  })
  .catch(error => {
    console.error('Failed to initialize data service:', error);
    process.exit(1);
  });

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: typeDefs,
  rootValue: resolvers,
  graphiql: true, // Enable GraphiQL interface for development
  customFormatErrorFn: (error) => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
  })
}));

// REST API endpoints
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'HyperGraphQL API for Skin Zone',
    version: '1.0.0',
    endpoints: {
      graphql: '/graphql',
      graphiql: '/graphql (in browser)',
      api: '/api',
      health: '/api/health',
      entities: '/api/entities',
      relations: '/api/relations',
      organizations: '/api/orgs',
      sync: '/api/sync',
      trace: '/api/trace/:productId'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HyperGraphQL API server running on http://localhost:${PORT}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🔧 GraphiQL interface: http://localhost:${PORT}/graphql`);
  console.log(`🌐 REST API: http://localhost:${PORT}/api`);
});

export default app;
