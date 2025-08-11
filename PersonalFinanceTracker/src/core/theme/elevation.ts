import { Platform, ViewStyle } from 'react-native';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12 | 16 | 24;

const androidElevation = (level: ElevationLevel): ViewStyle => ({
  elevation: level,
});

const iosElevation = (level: ElevationLevel): ViewStyle => {
  const shadowOpacity = 0.02 + (level * 0.01);
  const shadowRadius = level * 0.5;
  
  return {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: level * 0.5,
    },
    shadowOpacity: Math.min(shadowOpacity, 0.3),
    shadowRadius: shadowRadius,
  };
};

export const elevation = (level: ElevationLevel): ViewStyle => {
  return Platform.select({
    android: androidElevation(level),
    ios: iosElevation(level),
  }) as ViewStyle;
};

export const shadows = {
  none: elevation(0),
  xs: elevation(1),
  sm: elevation(2),
  md: elevation(4),
  lg: elevation(8),
  xl: elevation(12),
  '2xl': elevation(16),
  '3xl': elevation(24),
} as const;

export const cardShadow: ViewStyle = Platform.select({
  android: {
    elevation: 2,
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
}) as ViewStyle;

export const buttonShadow: ViewStyle = Platform.select({
  android: {
    elevation: 3,
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
}) as ViewStyle;

export const modalShadow: ViewStyle = Platform.select({
  android: {
    elevation: 8,
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
}) as ViewStyle;

export type Shadows = typeof shadows;