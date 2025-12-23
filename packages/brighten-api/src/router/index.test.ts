import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OperationRouter } from './index.js';
import type { Config } from '../config/schema.js';
import type { OperationType, OperationInput, OperationResult } from '../operations/types.js';

vi.mock('../providers/index.js', () => {
  class MockProvider {
    name: string;
    shouldFail: boolean;
    
    constructor(config: { api_key?: string }, name: string, shouldFail = false) {
      this.name = name;
      this.shouldFail = shouldFail;
    }
    
    async execute(operation: OperationType, input: OperationInput): Promise<OperationResult> {
      if (this.shouldFail) {
        throw new Error(`${this.name} failed`);
      }
      return {
        image: Buffer.from('processed'),
        mimeType: 'image/png',
        metadata: {
          provider: this.name,
          processingTime: 100,
        },
      };
    }
  }

  return {
    BaseProvider: MockProvider,
    ReplicateProvider: class extends MockProvider {
      constructor(config: { api_key?: string }) {
        super(config, 'replicate');
      }
    },
    FalProvider: class extends MockProvider {
      constructor(config: { api_key?: string }) {
        super(config, 'fal');
      }
    },
    RemoveBgProvider: class extends MockProvider {
      constructor(config: { api_key?: string }) {
        super(config, 'removebg');
      }
    },
  };
});

describe('OperationRouter', () => {
  const createConfig = (overrides: Partial<Config> = {}): Config => ({
    server: { port: 3000, host: '0.0.0.0' },
    operations: {
      'background-remove': { provider: 'replicate' },
    },
    providers: {
      replicate: { api_key: 'test-key', timeout: 30000 },
    },
    ...overrides,
  });

  const createInput = (): OperationInput => ({
    image: Buffer.from('test-image'),
    mimeType: 'image/png',
  });

  describe('constructor', () => {
    it('should initialize with configured providers', () => {
      const config = createConfig();
      const router = new OperationRouter(config);
      
      expect(router.getAvailableOperations()).toContain('background-remove');
    });

    it('should only initialize providers with api_key', () => {
      const config = createConfig({
        providers: {
          replicate: { api_key: 'key', timeout: 30000 },
          fal: { timeout: 30000 },
        },
      });
      const router = new OperationRouter(config);
      
      expect(router.getProviderForOperation('background-remove' as OperationType)).toBe('replicate');
    });
  });

  describe('execute', () => {
    it('should route operation to configured provider', async () => {
      const config = createConfig();
      const router = new OperationRouter(config);
      
      const result = await router.execute('background-remove' as OperationType, createInput());
      
      expect(result.metadata?.provider).toBe('replicate');
    });

    it('should throw for unconfigured operation', async () => {
      const config = createConfig();
      const router = new OperationRouter(config);
      
      await expect(router.execute('unknown-op' as OperationType, createInput()))
        .rejects.toThrow('Operation not configured');
    });

    it('should throw when provider not available', async () => {
      const config = createConfig({
        operations: {
          'background-remove': { provider: 'nonexistent' },
        },
      });
      const router = new OperationRouter(config);
      
      await expect(router.execute('background-remove' as OperationType, createInput()))
        .rejects.toThrow('Provider not available');
    });
  });

  describe('getAvailableOperations', () => {
    it('should return all configured operations', () => {
      const config = createConfig({
        operations: {
          'background-remove': { provider: 'replicate' },
          'unblur': { provider: 'replicate' },
          'upscale': { provider: 'replicate' },
        },
      });
      const router = new OperationRouter(config);
      
      const ops = router.getAvailableOperations();
      
      expect(ops).toHaveLength(3);
      expect(ops).toContain('background-remove');
      expect(ops).toContain('unblur');
      expect(ops).toContain('upscale');
    });
  });

  describe('getProviderForOperation', () => {
    it('should return provider name for configured operation', () => {
      const config = createConfig();
      const router = new OperationRouter(config);
      
      expect(router.getProviderForOperation('background-remove' as OperationType)).toBe('replicate');
    });

    it('should return undefined for unconfigured operation', () => {
      const config = createConfig();
      const router = new OperationRouter(config);
      
      expect(router.getProviderForOperation('unknown' as OperationType)).toBeUndefined();
    });
  });
});
