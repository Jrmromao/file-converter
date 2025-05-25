export const FILTERS = {
  none: 'none',
  grayscale: 'grayscale',
  sepia: 'sepia',
  vintage: 'vintage',
  cool: 'cool',
  warm: 'warm',
  dramatic: 'dramatic'
} as const

export type ImageFilter = keyof typeof FILTERS 