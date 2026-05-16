#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';

const content = `# Architecture

Pattern: Clean Architecture + Modular Monolith + DDD + Event Driven.

Runtime apps:

- apps/web
- apps/api

Shared packages:

- packages/ui
- packages/core
- packages/ai
- packages/modules

Operational folders:

- infra: deployment and platform configuration.
- tools: internal generators, validators, mocks, seeds and automation.
`;

await mkdir('tools/docs/generated', { recursive: true });
await writeFile('tools/docs/generated/architecture.md', content);
console.log('Generated tools/docs/generated/architecture.md');
