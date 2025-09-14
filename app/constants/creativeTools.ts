export interface CreativeEffect {
  name: string
  label: string
  description: string
  category: 'artistic' | 'vintage' | 'professional' | 'social'
  sharpConfig: any
  preview?: string
}

export const CREATIVE_EFFECTS: Record<string, CreativeEffect> = {
  // Artistic Effects
  oilPainting: {
    name: 'oilPainting',
    label: 'Oil Painting',
    description: 'Artistic oil painting effect',
    category: 'artistic',
    sharpConfig: {
      blur: 1.5,
      modulate: { saturation: 1.3, brightness: 1.1 },
      sharpen: 0.5
    }
  },
  
  watercolor: {
    name: 'watercolor',
    label: 'Watercolor',
    description: 'Soft watercolor painting style',
    category: 'artistic',
    sharpConfig: {
      blur: 2,
      modulate: { saturation: 0.8, brightness: 1.2, lightness: 1.1 },
      gamma: 1.2
    }
  },
  
  sketch: {
    name: 'sketch',
    label: 'Pencil Sketch',
    description: 'Hand-drawn pencil sketch effect',
    category: 'artistic',
    sharpConfig: {
      modulate: { saturation: 0 },
      linear: { a: 1.5, b: -0.2 },
      sharpen: 2
    }
  },
  
  // Vintage Effects
  filmNoir: {
    name: 'filmNoir',
    label: 'Film Noir',
    description: 'Classic black and white cinema',
    category: 'vintage',
    sharpConfig: {
      modulate: { saturation: 0, brightness: 0.9, lightness: 1.3 },
      gamma: 1.2 // Fixed: was 0.8, now 1.2 for darker contrast
    }
  },
  
  retroPop: {
    name: 'retroPop',
    label: 'Retro Pop',
    description: 'Vibrant 80s pop art style',
    category: 'vintage',
    sharpConfig: {
      modulate: { saturation: 1.8, brightness: 1.2 },
      tint: { r: 255, g: 200, b: 150 }
    }
  },
  
  polaroid: {
    name: 'polaroid',
    label: 'Polaroid',
    description: 'Instant camera vintage look',
    category: 'vintage',
    sharpConfig: {
      modulate: { saturation: 0.7, brightness: 1.15, lightness: 0.95 },
      tint: { r: 255, g: 245, b: 220 }
    }
  },
  
  // Professional Effects
  hdr: {
    name: 'hdr',
    label: 'HDR',
    description: 'High dynamic range enhancement',
    category: 'professional',
    sharpConfig: {
      modulate: { brightness: 1.1, saturation: 1.2, lightness: 1.2 },
      sharpen: 1,
      gamma: 1.1 // Fixed: was 0.9, now 1.1
    }
  },
  
  portrait: {
    name: 'portrait',
    label: 'Portrait Pro',
    description: 'Professional portrait enhancement',
    category: 'professional',
    sharpConfig: {
      modulate: { brightness: 1.05, saturation: 1.1 },
      sharpen: 0.8,
      blur: 0.3
    }
  },
  
  landscape: {
    name: 'landscape',
    label: 'Landscape Pro',
    description: 'Enhanced landscape photography',
    category: 'professional',
    sharpConfig: {
      modulate: { saturation: 1.3, brightness: 1.05, lightness: 1.1 },
      sharpen: 1.2
    }
  },
  
  // Social Media Effects
  instagram: {
    name: 'instagram',
    label: 'Insta Perfect',
    description: 'Instagram-ready enhancement',
    category: 'social',
    sharpConfig: {
      modulate: { saturation: 1.2, brightness: 1.08 },
      tint: { r: 255, g: 250, b: 240 }
    }
  },
  
  tiktok: {
    name: 'tiktok',
    label: 'TikTok Viral',
    description: 'High-contrast viral look',
    category: 'social',
    sharpConfig: {
      modulate: { saturation: 1.4, brightness: 1.1, lightness: 1.2 },
      sharpen: 1
    }
  },
  
  aesthetic: {
    name: 'aesthetic',
    label: 'Aesthetic Vibe',
    description: 'Trendy aesthetic filter',
    category: 'social',
    sharpConfig: {
      modulate: { saturation: 0.9, brightness: 1.15 },
      tint: { r: 255, g: 240, b: 255 }
    }
  }
}

export interface TextOverlay {
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
  fontWeight: 'normal' | 'bold'
  opacity: number
  rotation: number
  shadow: boolean
}

export interface Watermark {
  type: 'text' | 'image'
  content: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  opacity: number
  size: number
}

export interface BorderEffect {
  type: 'solid' | 'gradient' | 'shadow' | 'vintage'
  width: number
  color: string
  opacity: number
  blur?: number
}

export const BORDER_PRESETS: Record<string, BorderEffect> = {
  classic: {
    type: 'solid',
    width: 10,
    color: '#ffffff',
    opacity: 1
  },
  
  shadow: {
    type: 'shadow',
    width: 20,
    color: '#000000',
    opacity: 0.3,
    blur: 15
  },
  
  vintage: {
    type: 'vintage',
    width: 15,
    color: '#f4f1e8',
    opacity: 0.9
  },
  
  modern: {
    type: 'gradient',
    width: 8,
    color: '#6366f1',
    opacity: 0.8
  }
}

export const CREATIVE_CATEGORIES = {
  artistic: {
    label: 'Artistic',
    description: 'Creative artistic effects',
    icon: '🎨'
  },
  vintage: {
    label: 'Vintage',
    description: 'Retro and vintage styles',
    icon: '📷'
  },
  professional: {
    label: 'Professional',
    description: 'Pro photography enhancement',
    icon: '💼'
  },
  social: {
    label: 'Social Media',
    description: 'Trending social filters',
    icon: '📱'
  }
}

export function getEffectsByCategory(category: string): CreativeEffect[] {
  return Object.values(CREATIVE_EFFECTS).filter(effect => effect.category === category)
}

export function getAllCategories(): string[] {
  return Object.keys(CREATIVE_CATEGORIES)
}
