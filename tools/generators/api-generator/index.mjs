#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const [, , moduleName] = process.argv;

if (!moduleName) {
  console.error('Usage: node tools/generators/api-generator/index.mjs <module-name>');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['tools/generators/module-generator/index.mjs', moduleName, '--api'], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
