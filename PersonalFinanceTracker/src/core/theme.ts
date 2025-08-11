export const lightTheme = {
  colors: {
    primary: '#a855f7',
    accent: '#14b8a6',
    warning: '#f97316',
    danger: '#ef4444',
    success: '#10b981',
    
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f4',
      tertiary: '#e7e5e4',
    },
    
    surface: {
      default: '#ffffff',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    border: {
      light: '#e7e5e4',
      default: '#d6d3d1',
      dark: '#a8a29e',
    },
    
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
      tertiary: '#a8a29e',
      inverse: '#ffffff',
    },
    
    neutral: {
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
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    
    background: {
      primary: '#1c1917',
      secondary: '#292524',
      tertiary: '#44403c',
    },
    
    surface: {
      default: '#292524',
      elevated: '#44403c',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
    
    text: {
      primary: '#fafaf9',
      secondary: '#d6d3d1',
      tertiary: '#a8a29e',
      inverse: '#1c1917',
    },
    
    border: {
      light: '#44403c',
      default: '#57534e',
      dark: '#78716c',
    },
  },
};

export const theme = lightTheme;

export type Theme = typeof lightTheme;