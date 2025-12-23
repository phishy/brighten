import type { Config } from './config/schema.js';

export function generateOpenAPISpec(config: Config) {
  const operations = Object.keys(config.operations);
  
  return {
    openapi: '3.0.3',
    info: {
      title: 'Brighten API',
      description: 'Unified media processing API with configurable AI backends. Supports background removal, image enhancement, upscaling, and more.',
      version: '0.1.0',
      license: {
        name: 'BUSL-1.1',
        url: 'https://github.com/phishy/brighten/blob/main/LICENSE',
      },
    },
    servers: [
      {
        url: `http://${config.server.host}:${config.server.port}`,
        description: 'Local server',
      },
    ],
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          description: 'Returns the health status of the API',
          operationId: 'healthCheck',
          tags: ['System'],
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/operations': {
        get: {
          summary: 'List available operations',
          description: 'Returns a list of all configured operations and their providers',
          operationId: 'listOperations',
          tags: ['System'],
          responses: {
            '200': {
              description: 'List of operations',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      operations: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            provider: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      ...Object.fromEntries(
        operations.map((op) => [
          `/v1/${op}`,
          {
            post: {
              summary: formatOperationName(op),
              description: getOperationDescription(op),
              operationId: op.replace(/-/g, '_'),
              tags: ['Operations'],
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['image'],
                      properties: {
                        image: {
                          type: 'string',
                          description: 'Base64-encoded image or data URI (e.g., data:image/png;base64,...)',
                          example: 'data:image/png;base64,iVBORw0KGgo...',
                        },
                        options: {
                          type: 'object',
                          description: 'Operation-specific options',
                          additionalProperties: true,
                        },
                      },
                    },
                  },
                },
              },
              responses: {
                '200': {
                  description: 'Operation successful',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          image: {
                            type: 'string',
                            description: 'Processed image as data URI',
                          },
                          metadata: {
                            type: 'object',
                            properties: {
                              provider: { type: 'string' },
                              model: { type: 'string' },
                              processingTime: { type: 'number', description: 'Processing time in milliseconds' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                '400': {
                  description: 'Bad request',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          error: { type: 'string' },
                        },
                      },
                    },
                  },
                },
                '500': {
                  description: 'Internal server error',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          error: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ])
      ),
    },
    components: {
      schemas: {
        ImageInput: {
          type: 'object',
          required: ['image'],
          properties: {
            image: {
              type: 'string',
              description: 'Base64-encoded image or data URI',
            },
            options: {
              type: 'object',
              additionalProperties: true,
            },
          },
        },
        ImageOutput: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
              description: 'Processed image as data URI',
            },
            metadata: {
              type: 'object',
              properties: {
                provider: { type: 'string' },
                model: { type: 'string' },
                processingTime: { type: 'number' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  };
}

function formatOperationName(op: string): string {
  return op
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getOperationDescription(op: string): string {
  const descriptions: Record<string, string> = {
    'background-remove': 'Remove the background from an image, leaving only the foreground subject with transparency.',
    'unblur': 'Enhance and sharpen a blurry image using AI upscaling with face enhancement.',
    'upscale': 'Increase image resolution using AI super-resolution.',
    'face-restore': 'Restore and enhance faces in photos using GFPGAN.',
    'enhance': 'General image enhancement and quality improvement.',
    'colorize': 'Add color to black and white images.',
    'denoise': 'Remove noise and grain from images.',
    'style-transfer': 'Apply artistic styles to images.',
    'inpaint': 'Fill in missing or masked areas of an image.',
    'outpaint': 'Extend an image beyond its original boundaries.',
  };
  return descriptions[op] || `Perform ${formatOperationName(op)} operation on an image.`;
}
