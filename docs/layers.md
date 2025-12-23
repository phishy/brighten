# Layers Guide

## Layer Types

Brighten supports six layer types:

| Type | Description | Use Case |
|------|-------------|----------|
| `image` | Raster image layer | Photos, backgrounds |
| `text` | Text with typography | Captions, titles |
| `shape` | Vector shapes | Rectangles, ellipses, polygons |
| `drawing` | Freehand brush strokes | Annotations, signatures |
| `sticker` | Pre-made image overlays | Emojis, decorations |
| `adjustment` | Non-destructive adjustments | Curves, levels |

## Working with Layers

```typescript
const layerManager = editor.getLayerManager();
```

### Image Layers

```typescript
const imgElement = new Image();
imgElement.src = 'sticker.png';
imgElement.onload = () => {
  const layer = layerManager.addImageLayer(imgElement, {
    name: 'Overlay',
    opacity: 0.8,
    blendMode: 'multiply',
  });
};
```

### Text Layers

```typescript
const textLayer = layerManager.addTextLayer('Hello World', {
  fontFamily: 'Arial',
  fontSize: 48,
  fontWeight: 'bold',
  fontStyle: 'italic',
  color: '#ffffff',
  textAlign: 'center',
  lineHeight: 1.2,
  letterSpacing: 2,
  stroke: {
    color: '#000000',
    width: 2,
  },
  shadow: {
    color: 'rgba(0,0,0,0.5)',
    blur: 4,
    offsetX: 2,
    offsetY: 2,
  },
});
```

### Shape Layers

```typescript
// Rectangle
const rect = layerManager.addShapeLayer('rectangle', {
  fill: '#ff0000',
  stroke: { color: '#000000', width: 2 },
  cornerRadius: 10,
});

// Ellipse
const ellipse = layerManager.addShapeLayer('ellipse', {
  fill: 'rgba(0, 255, 0, 0.5)',
});

// Polygon
const polygon = layerManager.addShapeLayer('polygon', {
  points: [
    { x: 50, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ],
  fill: '#0000ff',
});

// Line
const line = layerManager.addShapeLayer('line', {
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  ],
  stroke: { color: '#000000', width: 3 },
});
```

### Drawing Layers

```typescript
const drawingLayer = layerManager.addDrawingLayer({
  name: 'Annotations',
});

// Drawing is typically done through BrushTool
```

### Sticker Layers

```typescript
const stickerImg = new Image();
stickerImg.src = 'emoji.png';
stickerImg.onload = () => {
  const sticker = layerManager.addStickerLayer(stickerImg, {
    name: 'Emoji',
    category: 'emotions',
  });
};
```

## Layer Properties

All layers share these base properties:

```typescript
interface LayerBase {
  id: string;           // Unique identifier
  type: LayerType;      // Layer type
  name: string;         // Display name
  visible: boolean;     // Visibility
  locked: boolean;      // Prevent editing
  opacity: number;      // 0-1
  blendMode: BlendMode; // Compositing mode
  transform: Transform; // Position, scale, rotation
}
```

### Transform

```typescript
interface Transform {
  x: number;        // X position
  y: number;        // Y position
  scaleX: number;   // Horizontal scale
  scaleY: number;   // Vertical scale
  rotation: number; // Rotation in radians
  skewX: number;    // Horizontal skew
  skewY: number;    // Vertical skew
}
```

## Layer Operations

### Update Layer

```typescript
layerManager.updateLayer(layer.id, {
  opacity: 0.5,
  visible: false,
  transform: {
    ...layer.transform,
    rotation: Math.PI / 4, // 45 degrees
  },
});
```

### Remove Layer

```typescript
layerManager.removeLayer(layer.id);
```

### Duplicate Layer

```typescript
const clone = layerManager.duplicateLayer(layer.id);
```

### Reorder Layers

```typescript
// Move up (towards front)
layerManager.moveLayerUp(layer.id);

// Move down (towards back)
layerManager.moveLayerDown(layer.id);

// Set specific order
layerManager.reorderLayers(['layer1', 'layer2', 'layer3']);
```

## Selection

```typescript
// Select single layer
layerManager.selectLayer(layer.id);

// Add to selection (multi-select)
layerManager.selectLayer(layer.id, true);

// Deselect
layerManager.deselectLayer(layer.id);

// Clear selection
layerManager.clearSelection();

// Get selected layers
const selected = layerManager.getSelectedLayers();
const selectedIds = layerManager.getSelectedIds();

// Get active layer
const active = layerManager.getActiveLayer();
const activeId = layerManager.getActiveId();
```

## Blend Modes

Supported blend modes:

- `normal`
- `multiply`
- `screen`
- `overlay`
- `darken`
- `lighten`
- `color-dodge`
- `color-burn`
- `hard-light`
- `soft-light`
- `difference`
- `exclusion`
- `hue`
- `saturation`
- `color`
- `luminosity`

```typescript
layerManager.updateLayer(layer.id, {
  blendMode: 'multiply',
});
```

## Events

```typescript
editor.on('layer:add', ({ layer }) => {
  console.log('Layer added:', layer.name);
});

editor.on('layer:remove', ({ layerId }) => {
  console.log('Layer removed:', layerId);
});

editor.on('layer:update', ({ layerId, changes }) => {
  console.log('Layer updated:', layerId, changes);
});

editor.on('layer:select', ({ layerIds }) => {
  console.log('Selection changed:', layerIds);
});

editor.on('layer:reorder', ({ layerIds }) => {
  console.log('Layer order:', layerIds);
});
```
