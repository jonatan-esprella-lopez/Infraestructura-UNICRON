import './bootstrap/load-env.js';
import { bootstrapApp } from './bootstrap/bootstrap-app.js';

const runtime = await bootstrapApp();

process.on('SIGTERM', () => {
  void runtime.close('SIGTERM');
});

process.on('SIGINT', () => {
  void runtime.close('SIGINT');
});

await runtime.listen();
