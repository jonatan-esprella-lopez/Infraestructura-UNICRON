#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeFileIfMissing, printResults } from '../_shared/files.mjs';
import { toKebabCase, toPascalCase } from '../_shared/naming.mjs';

const [, , rawModuleName, rawPageName] = process.argv;

if (!rawModuleName || !rawPageName) {
  console.error('Usage: node tools/generators/page-generator/index.mjs <module-name> <page-name>');
  process.exit(1);
}

const moduleName = toKebabCase(rawModuleName);
const pascalModule = toPascalCase(rawModuleName);
const pascalPage = toPascalCase(rawPageName);
const template = await readFile(new URL('./templates/page.tsx.tpl', import.meta.url), 'utf8');

printResults([
  await writeFileIfMissing(
    join('apps/web/src/modules', moduleName, 'pages', `${pascalPage}Page.tsx`),
    template.replaceAll('{{PascalPage}}', pascalPage).replaceAll('{{PascalModule}}', pascalModule),
  ),
]);
