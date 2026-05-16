#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const files = await collectTypeScriptFiles('apps/api/src');

const violations = [];

for (const file of files) {
  const content = await readFile(file, 'utf8');

  if (content.includes("from '../../../presentation") || content.includes("from '../../presentation")) {
    violations.push(`${file}: infrastructure/application should not import presentation`);
  }
}

if (violations.length > 0) {
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log('Import validation passed');

async function collectTypeScriptFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectTypeScriptFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(path);
    }
  }

  return files;
}
