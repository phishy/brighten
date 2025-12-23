import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writeFileSync, unlinkSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

const TEST_DIR = './test-tmp';
const TEST_CONFIG_PATH = join(TEST_DIR, 'config.yaml');

describe('Config Loader', () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
    vi.unstubAllEnvs();
  });

  describe('interpolateEnvVars', () => {
    it('should replace ${VAR} with environment variable value', async () => {
      vi.stubEnv('TEST_API_KEY', 'secret123');
      
      writeFileSync(TEST_CONFIG_PATH, `
server:
  port: 3000
operations:
  background-remove:
    provider: replicate
providers:
  replicate:
    api_key: \${TEST_API_KEY}
`);

      const { loadConfig } = await import('./loader.js');
      const config = loadConfig(TEST_CONFIG_PATH);
      
      expect(config.providers.replicate?.api_key).toBe('secret123');
    });

    it('should replace missing env vars with empty string', async () => {
      writeFileSync(TEST_CONFIG_PATH, `
server:
  port: 3000
operations:
  background-remove:
    provider: replicate
providers:
  replicate:
    api_key: \${NONEXISTENT_VAR}
`);

      const { loadConfig } = await import('./loader.js');
      const config = loadConfig(TEST_CONFIG_PATH);
      
      expect(config.providers.replicate?.api_key).toBe('');
    });

    it('should handle multiple env vars in same config', async () => {
      vi.stubEnv('API_KEY', 'key123');
      vi.stubEnv('API_HOST', 'api.example.com');
      
      writeFileSync(TEST_CONFIG_PATH, `
server:
  port: 3000
operations:
  background-remove:
    provider: replicate
providers:
  replicate:
    api_key: \${API_KEY}
    endpoint: https://\${API_HOST}/v1
`);

      const { loadConfig } = await import('./loader.js');
      const config = loadConfig(TEST_CONFIG_PATH);
      
      expect(config.providers.replicate?.api_key).toBe('key123');
      expect(config.providers.replicate?.endpoint).toBe('https://api.example.com/v1');
    });
  });

  describe('loadConfig', () => {
    it('should load and parse YAML config', async () => {
      writeFileSync(TEST_CONFIG_PATH, `
server:
  port: 4000
  host: localhost
operations:
  background-remove:
    provider: replicate
    fallback: removebg
  unblur:
    provider: replicate
providers:
  replicate:
    api_key: test-key
`);

      const { loadConfig } = await import('./loader.js');
      const config = loadConfig(TEST_CONFIG_PATH);
      
      expect(config.server.port).toBe(4000);
      expect(config.server.host).toBe('localhost');
      expect(config.operations['background-remove'].provider).toBe('replicate');
      expect(config.operations['background-remove'].fallback).toBe('removebg');
      expect(config.operations['unblur'].provider).toBe('replicate');
    });

    it('should throw if config file not found', async () => {
      const { loadConfig } = await import('./loader.js');
      
      expect(() => loadConfig('./nonexistent.yaml')).toThrow('Config file not found');
    });

    it('should use default values for optional fields', async () => {
      writeFileSync(TEST_CONFIG_PATH, `
operations:
  test-op:
    provider: replicate
`);

      const { loadConfig } = await import('./loader.js');
      const config = loadConfig(TEST_CONFIG_PATH);
      
      expect(config.server.port).toBe(3000);
      expect(config.server.host).toBe('0.0.0.0');
    });
  });
});
