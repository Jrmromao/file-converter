export interface FilterConfig {
  name: string
  label: string
  description: string
  sharpConfig: {
    modulate?: {
      brightness?: number
      saturation?: number
      hue?: number
      lightness?: number
    }
    tint?: { r: number; g: number; b: number }
    gamma?: number
    linear?: { a?: number; b?: number }
  }
}

export const FILTERS: Record<string, FilterConfig> = {
  none: {
    name: 'none',
    label: 'Original',
    description: 'No filter applied',
    sharpConfig: {}
  },
  
  sepia: {
    name: 'sepia',
    label: 'Sepia',
    description: 'Warm vintage brown tone',
    sharpConfig: {
      modulate: {
        saturation: 0.6,
        brightness: 1.1
      },
      tint: { r: 255, g: 228, b: 196 }
    }
  },
  
  vintage: {
    name: 'vintage',
    label: 'Vintage',
    description: 'Faded retro look',
    sharpConfig: {
      modulate: {
        brightness: 1.1,
        saturation: 0.8,
        lightness: 0.95
      },
      tint: { r: 230, g: 213, b: 172 }
    }
  },
  
  cool: {
    name: 'cool',
    label: 'Cool',
    description: 'Blue-tinted cool tone',
    sharpConfig: {
      modulate: {
        saturation: 1.2,
        brightness: 1.05
      },
      tint: { r: 179, g: 224, b: 255 }
    }
  },
  
  warm: {
    name: 'warm',
    label: 'Warm',
    description: 'Orange-tinted warm tone',
    sharpConfig: {
      modulate: {
        saturation: 1.2,
        brightness: 1.05
      },
      tint: { r: 255, g: 228, b: 179 }
    }
  },
  
  dramatic: {
    name: 'dramatic',
    label: 'Dramatic',
    description: 'High contrast dramatic look',
    sharpConfig: {
      modulate: {
        brightness: 0.9,
        saturation: 1.3,
        lightness: 1.2
      },
      gamma: 0.8
    }
  },
  
  blackwhite: {
    name: 'blackwhite',
    label: 'Black & White',
    description: 'Classic monochrome',
    sharpConfig: {
      modulate: {
        saturation: 0
      }
    }
  },
  
  vibrant: {
    name: 'vibrant',
    label: 'Vibrant',
    description: 'Enhanced colors and saturation',
    sharpConfig: {
      modulate: {
        saturation: 1.4,
        brightness: 1.1
      }
    }
  },
  
  soft: {
    name: 'soft',
    label: 'Soft',
    description: 'Gentle, muted tones',
    sharpConfig: {
      modulate: {
        saturation: 0.8,
        brightness: 1.05,
        lightness: 1.1
      }
    }
  }
}

export function getFilterNames(): string[] {
  return Object.keys(FILTERS)
}

export function getFilter(name: string): FilterConfig | null {
  return FILTERS[name] || null
}
