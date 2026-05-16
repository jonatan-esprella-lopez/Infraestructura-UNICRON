#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['run', 'lint:web'], { shell: true, stdio: 'inherit' });
process.exit(result.status ?? 1);
