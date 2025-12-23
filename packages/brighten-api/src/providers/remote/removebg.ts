import { BaseProvider } from '../base.js';
import type { OperationType, OperationInput, OperationResult } from '../../operations/types.js';
import type { ProviderConfig } from '../../config/schema.js';

export class RemoveBgProvider extends BaseProvider {
  readonly name = 'removebg';
  readonly supportedOperations: OperationType[] = ['background-remove'];

  private apiKey: string;

  constructor(config: ProviderConfig) {
    super(config);
    if (!config.api_key) {
      throw new Error('Remove.bg API key is required');
    }
    this.apiKey = config.api_key;
  }

  async execute(operation: OperationType, input: OperationInput): Promise<OperationResult> {
    if (operation !== 'background-remove') {
      throw new Error(`Remove.bg only supports background-remove, got: ${operation}`);
    }

    const startTime = Date.now();

    const formData = new FormData();
    formData.append('image_file_b64', input.image.toString('base64'));
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Remove.bg API error: ${response.status} - ${error}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    return {
      image: imageBuffer,
      mimeType: 'image/png',
      metadata: {
        provider: this.name,
        processingTime: Date.now() - startTime,
      },
    };
  }
}
