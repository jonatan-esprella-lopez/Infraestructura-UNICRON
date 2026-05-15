import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function writeFileIfMissing(path, content) {
  await mkdir(dirname(path), { recursive: true });

  try {
    await writeFile(path, content, { flag: 'wx' });
    return { path, created: true };
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      return { path, created: false };
    }

    throw error;
  }
}

export function printResults(results) {
  for (const result of results) {
    const status = result.created ? 'created' : 'skipped';
    console.log(`${status}: ${result.path}`);
  }
}
