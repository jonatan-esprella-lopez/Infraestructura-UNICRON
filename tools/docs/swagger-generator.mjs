#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';

const document = {
  openapi: '3.1.0',
  info: {
    title: 'Unicron API',
    version: '0.1.0',
  },
  paths: {
    '/health': { get: { summary: 'Health check' } },
    '/metrics': { get: { summary: 'Runtime metrics' } },
    '/api/v1/crm': { get: { summary: 'CRM module overview' } },
    '/api/v1/crm/leads': { post: { summary: 'Create lead' } },
    '/api/v1/qr/scan': { post: { summary: 'Scan QR mission' } },
  },
};

await mkdir('tools/docs/generated', { recursive: true });
await writeFile('tools/docs/generated/openapi.json', `${JSON.stringify(document, null, 2)}\n`);
console.log('Generated tools/docs/generated/openapi.json');
