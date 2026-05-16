export const openApiDocument = {
  info: {
    title: 'Unicron API',
    version: '0.1.0',
  },
  openapi: '3.1.0',
  paths: {
    '/health': {
      get: {
        summary: 'Service health',
      },
    },
    '/metrics': {
      get: {
        summary: 'Runtime metrics',
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness checks',
      },
    },
  },
};
