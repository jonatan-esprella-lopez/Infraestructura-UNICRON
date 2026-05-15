#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

for (const args of [
  ['install'],
  ['run', 'validate:structure'],
  ['run', 'typecheck:all'],
]) {
  const result = spawnSync('npm', args, { shell: true, stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
