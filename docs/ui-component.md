# UI Component Guide

## Overview

Brighten provides a complete, drop-in photo editor UI component that includes:
- Header with undo/redo, zoom controls, and export
- Sidebar with tool selection
- Panel system for filters, adjustments, layers, text, and shapes
- Dark and light themes

## Quick Start

```typescript
import { createEditorUI } from 'brighten';

const editor = createEditorUI({
  container: '#editor',
  image: 'https://example.com/photo.jpg',
  theme: 'dark',
});
```

## Configuration

```typescript
interface EditorUIConfig {
  container: HTMLElement | string;  // Container element or selector
  image?: string;                   // Initial image URL
  theme?: 'light' | 'dark';         // Color theme (default: 'dark')
  tools?: ToolType[];               // Enabled tools
  showHeader?: boolean;             // Show header bar (default: true)
  showSidebar?: boolean;            // Show tool sidebar (default: true)
  showPanel?: boolean;              // Show right panel (default: true)
  onExport?: (blob: Blob) => void;  // Custom export handler
  onClose?: () => void;             // Close button callback
}
```

## Basic Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    #editor {
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="editor"></div>
  <script type="module">
    import { createEditorUI } from 'brighten';

    const editor = createEditorUI({
      container: '#editor',
      image: 'sample.jpg',
      theme: 'dark',
      onExport: (blob) => {
        // Upload to server
        const formData = new FormData();
        formData.append('image', blob);
        fetch('/api/upload', { method: 'POST', body: formData });
      },
    });
  </script>
</body>
</html>
```

## Themes

### Dark Theme (Default)

```typescript
createEditorUI({
  container: '#editor',
  theme: 'dark',
});
```

### Light Theme

```typescript
createEditorUI({
  container: '#editor',
  theme: 'light',
});
```

### Custom Theme

Override CSS variables:

```css
.brighten-editor {
  --brighten-bg: #1a1a2e;
  --brighten-surface: #16213e;
  --brighten-surface-hover: #1f3460;
  --brighten-border: #0f3460;
  --brighten-text: #e5e5e5;
  --brighten-text-secondary: #94a3b8;
  --brighten-primary: #e94560;
  --brighten-primary-hover: #d63850;
}
```

## UI Elements

### Header

The header contains:
- **Left**: Undo/Redo buttons
- **Center**: Zoom controls (zoom out, percentage, zoom in)
- **Right**: Open, Export, and optional Close buttons

### Sidebar Tools

| Tool | Icon | Description |
|------|------|-------------|
| Select | Arrow | Select and move layers |
| Crop | Crop icon | Crop the image |
| Transform | Grid | Transform layers (scale, rotate) |
| Filters | Globe | Apply filter presets |
| Adjust | Sun | Adjust brightness, contrast, etc. |
| Brush | Brush | Freehand drawing |
| Text | T | Add text layers |
| Shapes | Shapes | Add rectangles, ellipses, lines |
| Layers | Stack | Manage layers |

### Panels

#### Filters Panel
Displays filter presets organized by category:
- Classic: Vintage, Noir
- Color: Warm, Cool, Vivid
- Film: Matte
- Mood: Dramatic
- Portrait: Soft

#### Adjustments Panel
Sliders for:
- Brightness (-100 to 100)
- Contrast (-100 to 100)
- Saturation (-100 to 100)
- Exposure (-100 to 100)
- Temperature (-100 to 100)
- Tint (-100 to 100)
- Vibrance (-100 to 100)
- Sharpen (0 to 100)
- Vignette (0 to 100)

#### Layers Panel
Shows all layers with:
- Thumbnail preview
- Layer name and type
- Visibility toggle
- Click to select

#### Text Panel
- "Add Text" button
- Font size slider

#### Shapes Panel
- Rectangle button
- Ellipse button
- Line button

## Customization

### Hide Elements

```typescript
createEditorUI({
  container: '#editor',
  showHeader: false,    // Hide header
  showSidebar: false,   // Hide sidebar
  showPanel: false,     // Hide right panel
});
```

### Custom Export Handler

```typescript
createEditorUI({
  container: '#editor',
  onExport: async (blob) => {
    // Upload to S3
    const response = await fetch('/api/get-upload-url');
    const { url } = await response.json();
    await fetch(url, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'image/png' },
    });
    alert('Uploaded!');
  },
});
```

### Close Button

```typescript
createEditorUI({
  container: '#editor',
  onClose: () => {
    // Handle close
    if (confirm('Discard changes?')) {
      window.location.href = '/';
    }
  },
});
```

## Accessing the Core Editor

```typescript
const ui = createEditorUI({ container: '#editor' });

// Get the underlying Editor instance
const editor = ui.getEditor();

// Use core API
editor.on('image:load', ({ width, height }) => {
  console.log(`Loaded: ${width}x${height}`);
});

// Access layer manager
const layers = editor.getLayerManager().getLayers();

// Export programmatically
const blob = await editor.export({ format: 'jpeg', quality: 0.9 });
```

## Loading Images

```typescript
const ui = createEditorUI({ container: '#editor' });

// Load from URL
await ui.loadImage('https://example.com/photo.jpg');

// Load from file input
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  await ui.getEditor().loadFromFile(file);
});
```

## Cleanup

```typescript
const ui = createEditorUI({ container: '#editor' });

// When done
ui.destroy();
```

## Keyboard Shortcuts

The UI supports these keyboard shortcuts (when editor has focus):

| Shortcut | Action |
|----------|--------|
| Ctrl+Z / Cmd+Z | Undo |
| Ctrl+Y / Cmd+Shift+Z | Redo |
| + / = | Zoom in |
| - | Zoom out |
| 0 | Fit to view |

## Responsive Design

The UI is fully responsive:
- On narrow screens, consider hiding the panel
- The canvas area flexes to fill available space
- Touch gestures work on mobile devices

```typescript
const isMobile = window.innerWidth < 768;

createEditorUI({
  container: '#editor',
  showPanel: !isMobile,
});
```
