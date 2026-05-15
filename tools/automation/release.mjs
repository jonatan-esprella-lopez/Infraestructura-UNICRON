#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

for (const args of [
  ['run', 'validate:structure'],
  ['run', 'typecheck:all'],
  ['run', 'build:all'],
]) {
  const result = spawnSync('npm', args, { shell: true, stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('Release checks passed');
