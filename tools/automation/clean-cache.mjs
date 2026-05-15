#!/usr/bin/env node
import { rm } from 'node:fs/promises';

const targets = [
  'apps/api/dist',
  'apps/web/dist',
  'apps/web/tsconfig.tsbuildinfo',
  'tools/docs/generated',
];

for (const target of targets) {
  await rm(target, { force: true, recursive: true });
  console.log(`removed: ${target}`);
}
