import { loadConfig } from './config/index.js';
import { startServer } from './server/index.js';

async function main() {
  const configPath = process.env.CONFIG_PATH || undefined;
  const config = loadConfig(configPath);
  
  console.log(`Starting Brighten API server...`);
  console.log(`Available operations: ${Object.keys(config.operations).join(', ')}`);
  
  await startServer(config);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { loadConfig } from './config/index.js';
export { createServer, startServer } from './server/index.js';
export { OperationRouter } from './router/index.js';
export * from './operations/types.js';
export * from './providers/index.js';
