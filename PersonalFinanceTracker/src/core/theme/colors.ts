export const baseColors = {
  primary: '#a855f7',
  accent: '#14b8a6',
  warning: '#f97316',
  danger: '#ef4444',
  success: '#10b981',
  info: '#3b82f6',
  
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
};

export const lightColors = {
  ...baseColors,
  
  background: {
    primary: baseColors.white,
    secondary: baseColors.stone[100],
    tertiary: baseColors.stone[200],
  },
  
  surface: {
    default: baseColors.white,
    elevated: baseColors.white,
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  text: {
    primary: baseColors.stone[900],
    secondary: baseColors.stone[600],
    tertiary: baseColors.stone[400],
    inverse: baseColors.white,
    onPrimary: baseColors.white,
    onAccent: baseColors.white,
    onDanger: baseColors.white,
    onWarning: baseColors.white,
    onSuccess: baseColors.white,
  },
  
  border: {
    light: baseColors.stone[200],
    default: baseColors.stone[300],
    dark: baseColors.stone[400],
  },
};

export const darkColors = {
  ...baseColors,
  
  background: {
    primary: baseColors.stone[900],
    secondary: baseColors.stone[800],
    tertiary: baseColors.stone[700],
  },
  
  surface: {
    default: baseColors.stone[800],
    elevated: baseColors.stone[700],
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  text: {
    primary: baseColors.stone[50],
    secondary: baseColors.stone[300],
    tertiary: baseColors.stone[400],
    inverse: baseColors.stone[900],
    onPrimary: baseColors.white,
    onAccent: baseColors.white,
    onDanger: baseColors.white,
    onWarning: baseColors.white,
    onSuccess: baseColors.white,
  },
  
  border: {
    light: baseColors.stone[700],
    default: baseColors.stone[600],
    dark: baseColors.stone[500],
  },
};

export type Colors = typeof lightColors;