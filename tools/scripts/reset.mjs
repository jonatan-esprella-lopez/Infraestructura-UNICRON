#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

spawnSync('node', ['tools/automation/clean-cache.mjs'], { shell: true, stdio: 'inherit' });
const result = spawnSync('npm', ['install'], { shell: true, stdio: 'inherit' });
process.exit(result.status ?? 1);
