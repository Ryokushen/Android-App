export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  default: 8,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const borderWidth = {
  none: 0,
  thin: 0.5,
  default: 1,
  thick: 2,
} as const;

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
} as const;

export const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  '2xl': 64,
  '3xl': 80,
  '4xl': 96,
} as const;

export const buttonHeights = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
} as const;

export const inputHeights = {
  sm: 36,
  md: 44,
  lg: 52,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type BorderWidth = typeof borderWidth;
export type IconSizes = typeof iconSizes;