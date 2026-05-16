#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { moduleGeneratorConfig } from './config.mjs';
import { writeFileIfMissing, printResults } from '../_shared/files.mjs';
import { toCamelCase, toKebabCase, toPascalCase } from '../_shared/naming.mjs';

const args = process.argv.slice(2);
const rawName = args.find((arg) => !arg.startsWith('--'));
const flags = args.filter((arg) => arg.startsWith('--'));

if (!rawName) {
  console.error('Usage: node tools/generators/module-generator/index.mjs <module-name> [--api] [--web]');
  process.exit(1);
}

const kebabName = toKebabCase(rawName);
const pascalName = toPascalCase(rawName);
const camelName = toCamelCase(rawName);
const generateApi = flags.includes('--api') || !flags.includes('--web');
const generateWeb = flags.includes('--web') || !flags.includes('--api');
const replacements = {
  '{{camelName}}': camelName,
  '{{kebabName}}': kebabName,
  '{{PascalName}}': pascalName,
};

const results = [];

if (generateApi) {
  const template = await loadTemplate('api-module.ts.tpl');
  results.push(
    await writeFileIfMissing(
      join(moduleGeneratorConfig.apiModulesRoot, kebabName, `${kebabName}.module.ts`),
      render(template, replacements),
    ),
  );
  results.push(
    await writeFileIfMissing(
      join(moduleGeneratorConfig.apiModulesRoot, kebabName, 'index.ts'),
      `export * from './${kebabName}.module.js';\n`,
    ),
  );
}

if (generateWeb) {
  const template = await loadTemplate('web-page.tsx.tpl');
  results.push(
    await writeFileIfMissing(
      join(moduleGeneratorConfig.webModulesRoot, kebabName, 'pages', `${pascalName}Page.tsx`),
      render(template, replacements),
    ),
  );
  results.push(
    await writeFileIfMissing(
      join(moduleGeneratorConfig.webModulesRoot, kebabName, 'index.ts'),
      `export * from './pages/${pascalName}Page';\n`,
    ),
  );
}

printResults(results);

async function loadTemplate(name) {
  return readFile(new URL(`./templates/${name}`, import.meta.url), 'utf8');
}

function render(template, values) {
  return Object.entries(values).reduce((output, [key, value]) => output.replaceAll(key, value), template);
}
