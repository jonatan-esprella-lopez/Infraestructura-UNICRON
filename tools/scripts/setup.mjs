#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['install'], { shell: true, stdio: 'inherit' });
process.exit(result.status ?? 1);
