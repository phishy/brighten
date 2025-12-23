# Getting Started with Brighten

## Installation

```bash
npm install brighten
```

## Quick Start

```typescript
import { createEditor } from 'brighten';

const editor = createEditor({
  container: '#editor',
  image: 'https://example.com/photo.jpg',
});

// Load an image
await editor.loadImage('path/to/image.jpg');

// Apply a filter preset
const filterEngine = new FilterEngine();
const imageData = editor.getImageData();
const filtered = filterEngine.applyPreset(imageData, 'vintage');
editor.getCanvasManager().putImageData(filtered);

// Export
const blob = await editor.export({ format: 'png', quality: 0.92 });
```

## Configuration Options

```typescript
interface BrightenConfig {
  container: HTMLElement | string;  // Container element or selector
  image?: string | HTMLImageElement | HTMLCanvasElement;  // Initial image
  width?: number;                   // Canvas width (if no image)
  height?: number;                  // Canvas height (if no image)
  maxHistorySteps?: number;         // Undo history limit (default: 50)
  enableKeyboardShortcuts?: boolean;
  enableTouchGestures?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  locale?: string;
}
```

## Loading Images

```typescript
// From URL
await editor.loadImage('https://example.com/photo.jpg');

// From File (e.g., from <input type="file">)
await editor.loadFromFile(fileInput.files[0]);

// From HTMLImageElement
await editor.loadImage(imgElement);

// From Canvas
await editor.loadImage(canvasElement);
```

## Working with Layers

```typescript
const layerManager = editor.getLayerManager();

// Add text
const textLayer = layerManager.addTextLayer('Hello World', {
  fontSize: 48,
  color: '#ffffff',
  fontFamily: 'Arial',
});

// Add shape
const shapeLayer = layerManager.addShapeLayer('rectangle', {
  fill: '#ff0000',
  transform: { x: 100, y: 100, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
});

// Update layer
layerManager.updateLayer(textLayer.id, { opacity: 0.8 });

// Remove layer
layerManager.removeLayer(shapeLayer.id);
```

## Applying Filters

```typescript
import { FilterEngine } from 'brighten';

const filterEngine = new FilterEngine();

// Single filter
const imageData = editor.getImageData();
const brightened = filterEngine.applyFilter(imageData, {
  type: 'brightness',
  value: 0.2,
  enabled: true,
});

// Multiple filters
const adjusted = filterEngine.applyFilters(imageData, [
  { type: 'brightness', value: 0.1, enabled: true },
  { type: 'contrast', value: 0.2, enabled: true },
  { type: 'saturation', value: -0.1, enabled: true },
]);

// Preset
const vintage = filterEngine.applyPreset(imageData, 'vintage');

// Apply to canvas
editor.getCanvasManager().putImageData(vintage);
editor.saveToHistory('Apply vintage filter');
```

## Undo/Redo

```typescript
// Check availability
if (editor.canUndo()) {
  editor.undo();
}

if (editor.canRedo()) {
  editor.redo();
}

// Listen for changes
editor.on('history:change', ({ canUndo, canRedo }) => {
  undoButton.disabled = !canUndo;
  redoButton.disabled = !canRedo;
});
```

## Zoom and Pan

```typescript
// Zoom
editor.setZoom(1.5);
editor.zoomIn();   // 1.25x
editor.zoomOut();  // 0.8x
editor.fitToView();

// Pan
editor.setPan({ x: 100, y: 50 });

// Get current values
const zoom = editor.getZoom();
const pan = editor.getPan();
```

## Exporting

```typescript
// As Blob
const blob = await editor.export({ format: 'png', quality: 0.92 });

// As Data URL
const dataUrl = editor.exportDataURL('jpeg', 0.85);

// Download
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'edited-photo.png';
link.click();
```

## Events

```typescript
editor.on('image:load', ({ width, height }) => {
  console.log(`Image loaded: ${width}x${height}`);
});

editor.on('layer:add', ({ layer }) => {
  console.log(`Layer added: ${layer.name}`);
});

editor.on('tool:change', ({ tool, previousTool }) => {
  console.log(`Tool changed from ${previousTool} to ${tool}`);
});

editor.on('render', () => {
  // Called after each render
});
```

## Cleanup

```typescript
editor.destroy();
```
