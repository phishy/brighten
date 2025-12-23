import type { OperationType, OperationInput, OperationResult } from '../operations/types.js';
import type { ProviderConfig } from '../config/schema.js';

export abstract class BaseProvider {
  abstract readonly name: string;
  abstract readonly supportedOperations: OperationType[];

  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  supportsOperation(operation: OperationType): boolean {
    return this.supportedOperations.includes(operation);
  }

  abstract execute(
    operation: OperationType,
    input: OperationInput
  ): Promise<OperationResult>;
}
