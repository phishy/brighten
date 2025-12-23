# Filters Guide

## Built-in Filters

Brighten includes 15+ built-in filters:

| Filter | Range | Description |
|--------|-------|-------------|
| `brightness` | -1 to 1 | Adjust image brightness |
| `contrast` | -1 to 1 | Adjust image contrast |
| `saturation` | -1 to 1 | Adjust color saturation |
| `hue` | -1 to 1 | Rotate hue (full rotation at ±1) |
| `exposure` | -2 to 2 | Adjust exposure (stops) |
| `temperature` | -1 to 1 | Warm (positive) or cool (negative) |
| `tint` | -1 to 1 | Add green (positive) or magenta (negative) |
| `vibrance` | -1 to 1 | Smart saturation boost |
| `sharpen` | 0 to 1 | Sharpen edges |
| `blur` | 0 to 1 | Gaussian blur |
| `grayscale` | 0 to 1 | Convert to grayscale |
| `sepia` | 0 to 1 | Apply sepia tone |
| `invert` | 0 to 1 | Invert colors |
| `vignette` | 0 to 1 | Add vignette effect |
| `noise` | 0 to 1 | Add random noise |
| `grain` | 0 to 1 | Add film grain |

## Using Filters

```typescript
import { FilterEngine } from 'brighten';

const filterEngine = new FilterEngine();
const imageData = editor.getImageData();

// Apply single filter
const result = filterEngine.applyFilter(imageData, {
  type: 'brightness',
  value: 0.3,
  enabled: true,
});

// Apply multiple filters (order matters)
const result = filterEngine.applyFilters(imageData, [
  { type: 'exposure', value: 0.5, enabled: true },
  { type: 'contrast', value: 0.2, enabled: true },
  { type: 'saturation', value: -0.1, enabled: true },
  { type: 'vignette', value: 0.3, enabled: true },
]);
```

## Filter Presets

Built-in presets for quick application:

| Preset | Category | Effect |
|--------|----------|--------|
| `vintage` | Classic | Desaturated sepia with grain |
| `noir` | Classic | High contrast black & white |
| `warm` | Color | Warmer temperature |
| `cool` | Color | Cooler temperature |
| `vivid` | Color | Boosted saturation & vibrance |
| `matte` | Film | Lifted blacks, soft contrast |
| `dramatic` | Mood | High contrast with vignette |
| `soft` | Portrait | Slight blur, lifted shadows |

```typescript
// Apply preset
const vintage = filterEngine.applyPreset(imageData, 'vintage');

// Get all presets
const presets = filterEngine.getPresets();

// Get presets by category
const byCategory = filterEngine.getPresetsByCategory();
// Map<string, FilterPreset[]>
```

## Custom Filters

Register your own filters:

```typescript
filterEngine.registerFilter({
  type: 'custom',
  apply: (imageData, value) => {
    const data = imageData.data;
    // Custom pixel manipulation
    for (let i = 0; i < data.length; i += 4) {
      // data[i]   = R
      // data[i+1] = G
      // data[i+2] = B
      // data[i+3] = A
    }
    return imageData;
  },
});
```

## Custom Presets

```typescript
filterEngine.registerPreset({
  id: 'my-preset',
  name: 'My Custom Look',
  category: 'Custom',
  filters: [
    { type: 'contrast', value: 0.1, enabled: true },
    { type: 'temperature', value: 0.2, enabled: true },
    { type: 'vignette', value: 0.2, enabled: true },
  ],
});
```

## Performance Tips

1. **Batch operations**: Apply multiple filters in one `applyFilters()` call
2. **Disable unused**: Set `enabled: false` instead of removing filters
3. **Preview at lower resolution**: For real-time preview, apply to downscaled image
4. **Use WebGL for heavy operations**: Consider WebGL shaders for blur/convolution (future feature)

## Filter Algorithms

### Brightness
Adds constant value to RGB channels.

### Contrast
Applies contrast formula: `factor * (color - 128) + 128`

### Saturation
Blends between grayscale and original based on saturation value.

### Hue Rotation
Rotates colors in HSL space using rotation matrix.

### Exposure
Multiplies by `2^exposure` (like camera stops).

### Sharpen
Uses unsharp mask convolution kernel.

### Blur
Box blur with configurable radius via convolution.
