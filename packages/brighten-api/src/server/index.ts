import express, { Request, Response } from 'express';
import cors from 'cors';
import type { Config } from '../config/schema.js';
import { OperationRouter } from '../router/index.js';
import type { OperationType } from '../operations/types.js';
import { generateOpenAPISpec } from '../openapi.js';

export function createServer(config: Config) {
  const app = express();
  const router = new OperationRouter(config);

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  app.get('/openapi.json', (_req: Request, res: Response) => {
    const openApiSpec = generateOpenAPISpec(config);
    res.json(openApiSpec);
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.get('/operations', (_req: Request, res: Response) => {
    res.json({
      operations: router.getAvailableOperations().map(op => ({
        name: op,
        provider: router.getProviderForOperation(op),
      })),
    });
  });

  app.post('/v1/:operation', async (req: Request, res: Response) => {
    const { operation } = req.params;
    const { image, options } = req.body;

    if (!image) {
      res.status(400).json({ error: 'Image is required' });
      return;
    }

    const base64Match = image.match(/^data:([^;]+);base64,(.+)$/);
    let imageBuffer: Buffer;
    let mimeType: string;

    if (base64Match) {
      mimeType = base64Match[1];
      imageBuffer = Buffer.from(base64Match[2], 'base64');
    } else {
      mimeType = 'image/png';
      imageBuffer = Buffer.from(image, 'base64');
    }

    try {
      const result = await router.execute(operation as OperationType, {
        image: imageBuffer,
        mimeType,
        options,
      });

      const base64Result = result.image.toString('base64');

      res.json({
        image: `data:${result.mimeType};base64,${base64Result}`,
        metadata: result.metadata,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Operation ${operation} failed:`, message);
      res.status(500).json({ error: message });
    }
  });

  return app;
}

export async function startServer(config: Config) {
  const app = createServer(config);
  const port = config.server.port;
  const host = config.server.host;

  return new Promise<typeof app>((resolve) => {
    app.listen(port, host, () => {
      console.log(`Brighten API running at http://${host}:${port}`);
      console.log(`OpenAPI spec at http://${host}:${port}/openapi.json`);
      resolve(app);
    });
  });
}
