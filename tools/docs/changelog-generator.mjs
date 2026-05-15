#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';

const content = `# Changelog

## Unreleased

- Added enterprise infra scaffold.
- Added internal tooling scaffold.
`;

await mkdir('tools/docs/generated', { recursive: true });
await writeFile('tools/docs/generated/CHANGELOG.md', content);
console.log('Generated tools/docs/generated/CHANGELOG.md');
