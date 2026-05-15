#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { componentGeneratorConfig } from './config.mjs';
import { writeFileIfMissing, printResults } from '../_shared/files.mjs';
import { toKebabCase, toPascalCase } from '../_shared/naming.mjs';

const [, , rawName] = process.argv;

if (!rawName) {
  console.error('Usage: node tools/generators/component-generator/index.mjs <component-name>');
  process.exit(1);
}

const kebabName = toKebabCase(rawName);
const pascalName = toPascalCase(rawName);
const root = join(componentGeneratorConfig.root, kebabName);
const replacements = {
  '{{kebabName}}': kebabName,
  '{{PascalName}}': pascalName,
};

const componentTemplate = await readFile(new URL('./templates/component.tsx.tpl', import.meta.url), 'utf8');
const cssTemplate = await readFile(new URL('./templates/component.css.tpl', import.meta.url), 'utf8');

printResults([
  await writeFileIfMissing(join(root, `${pascalName}.tsx`), render(componentTemplate, replacements)),
  await writeFileIfMissing(join(root, `${pascalName}.css`), render(cssTemplate, replacements)),
  await writeFileIfMissing(join(root, 'index.ts'), `export * from './${pascalName}';\n`),
]);

function render(template, values) {
  return Object.entries(values).reduce((output, [key, value]) => output.replaceAll(key, value), template);
}
