# Plugin System Guide

## Overview

Brighten's plugin system allows you to extend the editor with custom functionality using a hook-based architecture.

## Creating a Plugin

```typescript
import type { Plugin, PluginContext } from 'brighten';

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  
  initialize({ editor }: PluginContext) {
    // Setup code
    console.log('Plugin initialized');
    
    // Listen to editor events
    editor.on('image:load', ({ width, height }) => {
      console.log(`Image loaded: ${width}x${height}`);
    });
  },
  
  destroy() {
    // Cleanup code
    console.log('Plugin destroyed');
  },
};
```

## Registering Plugins

```typescript
import { PluginManager } from 'brighten';

const pluginManager = new PluginManager();
pluginManager.setEditor(editor);

// Register a plugin object
await pluginManager.register(myPlugin);

// Or use a factory function
await pluginManager.register(() => ({
  name: 'factory-plugin',
  version: '1.0.0',
  initialize({ editor }) {
    // ...
  },
}));
```

## Plugin Hooks

The plugin manager provides a hook system for cross-plugin communication:

```typescript
// In your plugin
initialize({ editor }) {
  // Add a hook listener
  const unsubscribe = pluginManager.addHook('custom:event', (data) => {
    console.log('Custom event received:', data);
  });
  
  // Store unsubscribe for cleanup
  this.unsubscribe = unsubscribe;
}

destroy() {
  this.unsubscribe?.();
}

// Trigger hooks from anywhere
pluginManager.trigger('custom:event', { foo: 'bar' });
```

## Example: Watermark Plugin

```typescript
const watermarkPlugin: Plugin = {
  name: 'watermark',
  version: '1.0.0',
  
  private watermarkLayer: string | null = null,
  
  initialize({ editor }) {
    // Add watermark on image load
    editor.on('image:load', () => {
      this.addWatermark(editor);
    });
  },
  
  addWatermark(editor) {
    const layerManager = editor.getLayerManager();
    
    // Remove existing watermark
    if (this.watermarkLayer) {
      layerManager.removeLayer(this.watermarkLayer);
    }
    
    // Add new watermark
    const size = editor.getCanvasSize();
    const layer = layerManager.addTextLayer('© My Company', {
      name: 'Watermark',
      fontSize: 24,
      color: 'rgba(255,255,255,0.5)',
      transform: {
        x: size.width - 150,
        y: size.height - 40,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
      },
      locked: true,
    });
    
    this.watermarkLayer = layer.id;
  },
  
  destroy() {
    // Watermark will be removed with editor
  },
};
```

## Example: Auto-Save Plugin

```typescript
const autoSavePlugin: Plugin = {
  name: 'auto-save',
  version: '1.0.0',
  
  private intervalId: number | null = null,
  
  initialize({ editor }) {
    // Save every 30 seconds if dirty
    this.intervalId = setInterval(async () => {
      if (editor.isDirtyState()) {
        const blob = await editor.export({ format: 'png' });
        await this.saveToServer(blob);
        console.log('Auto-saved');
      }
    }, 30000);
  },
  
  async saveToServer(blob: Blob) {
    const formData = new FormData();
    formData.append('image', blob);
    await fetch('/api/auto-save', {
      method: 'POST',
      body: formData,
    });
  },
  
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
```

## Example: Analytics Plugin

```typescript
const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  
  initialize({ editor }) {
    editor.on('tool:change', ({ tool }) => {
      this.track('tool_used', { tool });
    });
    
    editor.on('filter:apply', ({ filter }) => {
      this.track('filter_applied', { filter: filter.type });
    });
    
    editor.on('image:export', ({ format, size }) => {
      this.track('image_exported', { format, ...size });
    });
  },
  
  track(event: string, properties: Record<string, any>) {
    // Send to your analytics service
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties }),
    });
  },
};
```

## Plugin Best Practices

1. **Clean up resources**: Always implement `destroy()` to remove event listeners, intervals, etc.

2. **Handle errors gracefully**: Don't let plugin errors crash the editor.

3. **Use namespaced events**: Prefix custom hook events with your plugin name.

4. **Document dependencies**: If your plugin requires other plugins, document it.

5. **Version your plugins**: Use semantic versioning for compatibility tracking.

6. **Keep plugins focused**: One plugin should do one thing well.

## Accessing Plugins

```typescript
// Get a specific plugin
const myPlugin = pluginManager.getPlugin<MyPluginType>('my-plugin');

// Get all plugins
const allPlugins = pluginManager.getPlugins();

// Unregister a plugin
await pluginManager.unregister('my-plugin');

// Destroy all plugins
await pluginManager.destroyAll();
```
