#!/usr/bin/env node
const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4000';
const response = await fetch(`${baseUrl}/health`);

if (!response.ok) {
  console.error(`Healthcheck failed: ${response.status}`);
  process.exit(1);
}

console.log(JSON.stringify(await response.json(), null, 2));
