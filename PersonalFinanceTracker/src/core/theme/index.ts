import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, borderWidth, iconSizes } from './spacing';
import { shadows } from './elevation';
import { Theme } from './types';

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  iconSizes,
  shadows,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  iconSizes,
  shadows,
  isDark: true,
};

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './elevation';
export * from './types';