import { Colors } from './colors';
import { Typography } from './typography';
import { Spacing, BorderRadius, BorderWidth, IconSizes } from './spacing';
import { Shadows } from './elevation';

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  borderWidth: BorderWidth;
  iconSizes: IconSizes;
  shadows: Shadows;
  isDark: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';