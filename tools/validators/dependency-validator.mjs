#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const rootPackage = JSON.parse(await readFile('package.json', 'utf8'));
const workspaces = rootPackage.workspaces ?? [];

if (!workspaces.includes('apps/*') || !workspaces.includes('packages/*')) {
  console.error('Root package.json must include apps/* and packages/* workspaces');
  process.exit(1);
}

console.log('Dependency validation passed');
