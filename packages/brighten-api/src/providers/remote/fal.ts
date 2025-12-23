import { BaseProvider } from '../base.js';
import type { OperationType, OperationInput, OperationResult } from '../../operations/types.js';
import type { ProviderConfig } from '../../config/schema.js';

const FAL_ENDPOINTS: Record<string, string> = {
  'background-remove': 'fal-ai/birefnet',
  'upscale': 'fal-ai/creative-upscaler',
  'face-restore': 'fal-ai/face-swap',
};

export class FalProvider extends BaseProvider {
  readonly name = 'fal';
  readonly supportedOperations: OperationType[] = [
    'background-remove',
    'upscale',
    'face-restore',
  ];

  private apiKey: string;

  constructor(config: ProviderConfig) {
    super(config);
    if (!config.api_key) {
      throw new Error('Fal API key is required');
    }
    this.apiKey = config.api_key;
  }

  async execute(operation: OperationType, input: OperationInput): Promise<OperationResult> {
    const endpoint = FAL_ENDPOINTS[operation];
    if (!endpoint) {
      throw new Error(`Fal does not support operation: ${operation}`);
    }

    const startTime = Date.now();
    
    const base64Image = input.image.toString('base64');
    const dataUri = `data:${input.mimeType};base64,${base64Image}`;

    const response = await fetch(`https://fal.run/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: dataUri,
        ...input.options,
      }),
    });

    if (!response.ok) {
      throw new Error(`Fal API error: ${response.status}`);
    }

    const result = await response.json() as { image?: { url: string }; images?: { url: string }[] };
    const outputUrl = result.image?.url || result.images?.[0]?.url;
    
    if (!outputUrl) {
      throw new Error('No output image from Fal');
    }

    const imageResponse = await fetch(outputUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    return {
      image: imageBuffer,
      mimeType: 'image/png',
      metadata: {
        provider: this.name,
        model: endpoint,
        processingTime: Date.now() - startTime,
      },
    };
  }
}
