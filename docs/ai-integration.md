# AI Integration Guide

## Overview

Brighten provides a provider-agnostic AI integration layer for features like:
- Background removal
- Image enhancement
- Image upscaling
- Generative fill (inpainting)

## Setup

```typescript
import { AIManager, RemoveBgProvider, ReplicateProvider } from 'brighten';

const aiManager = new AIManager();

// Register specific providers for specific features
aiManager.registerProvider('backgroundRemoval', new RemoveBgProvider({
  apiKey: 'your-remove-bg-api-key',
}));

aiManager.registerProvider('upscale', new ReplicateProvider({
  apiKey: 'your-replicate-api-key',
}));

// Or set a default provider for all features
aiManager.setDefaultProvider(new ReplicateProvider({
  apiKey: 'your-replicate-api-key',
}));
```

## Background Removal

```typescript
// Export current canvas as blob
const imageBlob = await editor.export({ format: 'png' });

// Remove background
const result = await aiManager.removeBackground(imageBlob);

// result.foreground - Blob with transparent background
// result.mask - Optional mask blob
// result.background - Optional background blob

// Load result back into editor
const img = new Image();
img.src = URL.createObjectURL(result.foreground);
img.onload = () => {
  editor.getLayerManager().addImageLayer(img, { name: 'Foreground' });
};
```

## Image Enhancement

```typescript
const enhanced = await aiManager.enhance(imageBlob, {
  strength: 0.7, // 0-1
});

// enhanced.enhanced - Enhanced image blob
```

## Image Upscaling

```typescript
const upscaled = await aiManager.upscale(imageBlob, 2); // 2x scale

// upscaled.upscaled - Upscaled image blob
// upscaled.scale - Actual scale applied
```

## Generative Fill (Inpainting)

```typescript
// Create a mask (white = area to fill)
const maskCanvas = document.createElement('canvas');
// ... draw mask

const maskBlob = await new Promise(resolve => 
  maskCanvas.toBlob(resolve, 'image/png')
);

const result = await aiManager.generativeFill(
  imageBlob,
  maskBlob,
  'beautiful sunset sky'
);

// result.filled - Image with generated content
```

## Providers

### RemoveBgProvider

Uses remove.bg API for background removal.

```typescript
new RemoveBgProvider({
  apiKey: 'your-api-key',
  size: 'auto',        // 'preview' | 'full' | 'auto'
  type: 'auto',        // 'auto' | 'person' | 'product' | 'car'
  format: 'png',       // 'png' | 'jpg' | 'zip'
  bgColor: '#ffffff',  // Optional background color
});
```

Supports: `removeBackground` only.

### ReplicateProvider

Uses Replicate API for various AI models.

```typescript
new ReplicateProvider({
  apiKey: 'your-api-key',
  pollingInterval: 1000,   // ms between status checks
  maxPollingTime: 60000,   // max wait time
});
```

Supports: `removeBackground`, `enhance`, `upscale`, `generativeFill`

## Custom Providers

Create your own provider by extending `AIProvider`:

```typescript
import { AIProvider, AIProviderOptions } from 'brighten';

class MyProvider extends AIProvider {
  get name() {
    return 'my-provider';
  }

  async removeBackground(image: Blob) {
    const base64 = await this.blobToBase64(image);
    
    const response = await this.fetchWithTimeout('https://my-api.com/remove-bg', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64 }),
    });

    const data = await response.json();
    const foreground = await this.base64ToBlob(data.result);

    return { foreground };
  }

  async enhance(image: Blob, options?: { strength?: number }) {
    // Implement or throw if not supported
    throw new Error('Not supported');
  }

  async upscale(image: Blob, scale: number) {
    throw new Error('Not supported');
  }

  async generativeFill(image: Blob, mask: Blob, prompt: string) {
    throw new Error('Not supported');
  }
}
```

## Error Handling

```typescript
try {
  const result = await aiManager.removeBackground(imageBlob);
} catch (error) {
  if (error.message.includes('API key')) {
    // Handle auth error
  } else if (error.message.includes('timed out')) {
    // Handle timeout
  } else {
    // Handle other errors
  }
}
```

## Feature Detection

```typescript
if (aiManager.isFeatureAvailable('backgroundRemoval')) {
  // Show background removal button
}

if (aiManager.isFeatureAvailable('generativeFill')) {
  // Show generative fill tool
}
```
