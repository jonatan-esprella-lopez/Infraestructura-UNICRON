#!/usr/bin/env node
import { readdir } from 'node:fs/promises';

const moduleDirs = await readdir('apps/api/src/modules', { withFileTypes: true });
const invalid = moduleDirs
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !/^_?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name));

if (invalid.length > 0) {
  console.error(`Invalid module directory names: ${invalid.join(', ')}`);
  process.exit(1);
}

console.log('Naming validation passed');
