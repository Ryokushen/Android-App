import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  Pressable,
  PressableProps,
} from 'react-native';
import { Theme } from '../../core/theme/types';
import { useTheme } from '../../hooks/useTheme';

export interface CardProps extends Omit<PressableProps, 'style'> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: keyof Theme['spacing'];
  margin?: keyof Theme['spacing'];
  borderRadius?: keyof Theme['borderRadius'];
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 4,
  margin,
  borderRadius = 'xl',
  backgroundColor,
  borderColor,
  style,
  onPress,
  children,
  ...pressableProps
}) => {
  const theme = useTheme();
  
  const cardStyles: ViewStyle[] = [
    styles.base,
    {
      padding: theme.spacing[padding],
      margin: margin ? theme.spacing[margin] : undefined,
      borderRadius: theme.borderRadius[borderRadius],
      backgroundColor: backgroundColor || theme.colors.surface.default,
    },
  ];
  
  if (variant === 'outlined') {
    cardStyles.push({
      borderWidth: theme.borderWidth.default,
      borderColor: borderColor || theme.colors.border.default,
    });
  } else if (variant === 'elevated') {
    cardStyles.push(theme.shadows.md);
  } else {
    cardStyles.push(theme.shadows.sm);
  }
  
  if (style) {
    cardStyles.push(style);
  }
  
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyles,
          pressed && styles.pressed,
        ]}
        android_ripple={{
          color: theme.colors.primary + '20',
          borderless: false,
        }}
        {...pressableProps}
      >
        {children}
      </Pressable>
    );
  }
  
  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.95,
  },
});