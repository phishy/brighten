import type { Config, OperationConfig } from '../config/schema.js';
import type { OperationType, OperationInput, OperationResult } from '../operations/types.js';
import { BaseProvider, ReplicateProvider, FalProvider, RemoveBgProvider } from '../providers/index.js';

export class OperationRouter {
  private providers: Map<string, BaseProvider> = new Map();
  private operationConfigs: Map<string, OperationConfig>;

  constructor(config: Config) {
    this.operationConfigs = new Map(Object.entries(config.operations));
    this.initializeProviders(config);
  }

  private initializeProviders(config: Config): void {
    const { providers } = config;

    if (providers.replicate?.api_key) {
      this.providers.set('replicate', new ReplicateProvider(providers.replicate));
    }

    if (providers.fal?.api_key) {
      this.providers.set('fal', new FalProvider(providers.fal));
    }

    if (providers.removebg?.api_key) {
      this.providers.set('removebg', new RemoveBgProvider(providers.removebg));
    }
  }

  async execute(operation: OperationType, input: OperationInput): Promise<OperationResult> {
    const opConfig = this.operationConfigs.get(operation);
    if (!opConfig) {
      throw new Error(`Operation not configured: ${operation}`);
    }

    const provider = this.providers.get(opConfig.provider);
    if (!provider) {
      if (opConfig.fallback) {
        const fallbackProvider = this.providers.get(opConfig.fallback);
        if (fallbackProvider) {
          return fallbackProvider.execute(operation, input);
        }
      }
      throw new Error(`Provider not available: ${opConfig.provider}`);
    }

    try {
      return await provider.execute(operation, input);
    } catch (error) {
      if (opConfig.fallback) {
        const fallbackProvider = this.providers.get(opConfig.fallback);
        if (fallbackProvider) {
          return fallbackProvider.execute(operation, input);
        }
      }
      throw error;
    }
  }

  getAvailableOperations(): OperationType[] {
    return Array.from(this.operationConfigs.keys()) as OperationType[];
  }

  getProviderForOperation(operation: OperationType): string | undefined {
    return this.operationConfigs.get(operation)?.provider;
  }
}
