#!/usr/bin/env node
import { access } from 'node:fs/promises';

const requiredPaths = [
  'apps/api/src/bootstrap',
  'apps/api/src/core',
  'apps/api/src/infrastructure',
  'apps/api/src/modules',
  'apps/web/src/modules',
  'infra/docker/local/docker-compose.yml',
  'infra/nginx/default.conf',
  'infra/database/postgres/init.sql',
  'tools/generators/module-generator/index.mjs',
  'tools/automation/typecheck-all.mjs',
];

const missing = [];

for (const path of requiredPaths) {
  try {
    await access(path);
  } catch {
    missing.push(path);
  }
}

if (missing.length > 0) {
  console.error('Missing required architecture paths:');
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log('Structure validation passed');
