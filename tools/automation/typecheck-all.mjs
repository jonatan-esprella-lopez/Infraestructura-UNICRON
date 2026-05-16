#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

run('npm', ['run', 'typecheck:api']);
run('npm', ['run', 'typecheck:web']);

function run(command, args) {
  const result = spawnSync(command, args, { shell: true, stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
