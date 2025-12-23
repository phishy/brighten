# Tools Guide

## Available Tools

| Tool | Type | Description |
|------|------|-------------|
| Select | `select` | Select and move layers |
| Crop | `crop` | Crop the canvas |
| Rotate | `rotate` | Rotate the canvas |
| Transform | `transform` | Scale, rotate, skew layers |
| Brush | `brush` | Freehand drawing |
| Eraser | `eraser` | Erase brush strokes |
| Blur Brush | `blur-brush` | Selective blur |
| Text | `text` | Add/edit text |
| Shape | `shape` | Add shapes |
| Sticker | `sticker` | Add stickers |
| Focus | `focus` | Tilt-shift/blur effects |
| Hand | `hand` | Pan the canvas |
| Zoom | `zoom` | Zoom in/out |

## Setting the Active Tool

```typescript
editor.setTool('crop');
const currentTool = editor.getTool();

editor.on('tool:change', ({ tool, previousTool }) => {
  console.log(`Changed from ${previousTool} to ${tool}`);
});
```

## Crop Tool

```typescript
import { CropTool } from 'brighten';

const cropTool = new CropTool();
cropTool.attach({ editor, canvas: editor.getCanvasManager().getDisplayCanvas() });
cropTool.activate();

// Set aspect ratio (width/height)
cropTool.setAspectRatio(16 / 9);  // 16:9
cropTool.setAspectRatio(1);       // Square
cropTool.setAspectRatio(undefined); // Free

// Get/set crop rectangle
const rect = cropTool.getCropRect();
cropTool.setCropRect({ x: 100, y: 100, width: 500, height: 300 });

// Apply crop
const finalRect = cropTool.apply();
if (finalRect) {
  // Crop the canvas to finalRect
}

// Cancel
cropTool.cancel();
```

### Crop Presets

```typescript
const cropPresets = [
  { id: 'free', name: 'Free', aspectRatio: undefined },
  { id: 'square', name: 'Square', aspectRatio: 1 },
  { id: '4:3', name: '4:3', aspectRatio: 4/3 },
  { id: '16:9', name: '16:9', aspectRatio: 16/9 },
  { id: '9:16', name: '9:16 (Story)', aspectRatio: 9/16 },
  { id: '2:3', name: '2:3 (Portrait)', aspectRatio: 2/3 },
];
```

## Transform Tool

```typescript
import { TransformTool } from 'brighten';

const transformTool = new TransformTool();
transformTool.attach({ editor, canvas: editor.getCanvasManager().getDisplayCanvas() });
transformTool.activate();

// Rotate by degrees
transformTool.rotate(90);   // Rotate 90° clockwise
transformTool.rotate(-45);  // Rotate 45° counter-clockwise

// Flip
transformTool.flipHorizontal();
transformTool.flipVertical();
```

### Transform Handles

The transform tool provides 8 resize handles + rotation handle:
- Corner handles (nw, ne, se, sw): Resize proportionally
- Edge handles (n, e, s, w): Resize in one dimension
- Rotation handle: Rotate the layer

Hold Shift while resizing to maintain aspect ratio.

## Brush Tool

```typescript
import { BrushTool } from 'brighten';

const brushTool = new BrushTool();
brushTool.attach({ editor, canvas: editor.getCanvasManager().getDisplayCanvas() });
brushTool.activate();

// Configure brush
brushTool.setOptions({
  color: '#ff0000',
  size: 20,
  opacity: 0.8,
  hardness: 0.5,
});

// Get current options
const options = brushTool.getOptions();
```

### Brush Options

```typescript
interface BrushOptions {
  color: string;    // CSS color
  size: number;     // Brush diameter in pixels
  opacity: number;  // 0-1
  hardness: number; // 0-1 (soft to hard edge)
}
```

## Creating Custom Tools

Extend the `BaseTool` class:

```typescript
import { BaseTool } from 'brighten';
import type { ToolType, Point } from 'brighten';

class MyCustomTool extends BaseTool {
  type: ToolType = 'select'; // Use existing type or add to types
  name = 'My Tool';
  cursor = 'pointer';

  protected onActivate(): void {
    console.log('Tool activated');
  }

  protected onDeactivate(): void {
    console.log('Tool deactivated');
  }

  onPointerDown(point: Point, event: PointerEvent): void {
    console.log('Pointer down at', point);
  }

  onPointerMove(point: Point, event: PointerEvent): void {
    console.log('Pointer move at', point);
  }

  onPointerUp(point: Point, event: PointerEvent): void {
    console.log('Pointer up at', point);
  }

  // Optional keyboard handlers
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cancel();
    }
  }
}
```

## Tool Lifecycle

1. **attach(context)**: Called when tool is added to editor
2. **activate()**: Called when tool becomes active
3. **onPointer* events**: Called during user interaction
4. **deactivate()**: Called when switching to another tool
5. **detach()**: Called when tool is removed

## Coordinate Conversion

Tools receive canvas coordinates. To convert:

```typescript
onPointerDown(point: Point, event: PointerEvent): void {
  // point is already in canvas coordinates
  
  // To get screen coordinates:
  const screenPoint = this.context?.editor.canvasToScreen(point);
  
  // From screen to canvas:
  const canvasPoint = this.context?.editor.screenToCanvas({
    x: event.clientX,
    y: event.clientY,
  });
}
```
