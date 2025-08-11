import React from 'react';
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface PillProps {
  label?: string;
  value: string | number;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Pill: React.FC<PillProps> = ({
  label,
  value,
  color = 'neutral',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  
  const getBackgroundColor = () => {
    switch (color) {
      case 'primary':
        return theme.colors.primary + '15';
      case 'accent':
        return theme.colors.accent + '15';
      case 'success':
        return theme.colors.success + '15';
      case 'warning':
        return theme.colors.warning + '15';
      case 'danger':
        return theme.colors.danger + '15';
      case 'neutral':
      default:
        return theme.colors.background.secondary;
    }
  };
  
  const getTextColor = () => {
    switch (color) {
      case 'primary':
        return theme.colors.primary;
      case 'accent':
        return theme.colors.accent;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'danger':
        return theme.colors.danger;
      case 'neutral':
      default:
        return theme.colors.text.primary;
    }
  };
  
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing[2],
          paddingVertical: theme.spacing[1],
          minHeight: 24,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          minHeight: 40,
        };
      case 'md':
      default:
        return {
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2],
          minHeight: 32,
        };
    }
  };
  
  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return theme.typography.caption;
      case 'lg':
        return theme.typography.body;
      case 'md':
      default:
        return theme.typography.bodySmall;
    }
  };
  
  const pillStyle: ViewStyle[] = [
    styles.container,
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: theme.borderRadius.full,
      ...getSizeStyles(),
    },
    style,
  ];
  
  const valueTextStyle: TextStyle[] = [
    getTextSize(),
    {
      color: getTextColor(),
      fontWeight: theme.typography.label.fontWeight,
    },
    textStyle,
  ];
  
  const labelTextStyle: TextStyle[] = [
    getTextSize(),
    {
      color: theme.colors.text.secondary,
      marginRight: theme.spacing[1],
    },
  ];
  
  return (
    <View style={pillStyle}>
      {icon && <View style={styles.icon}>{icon}</View>}
      {label && <Text style={labelTextStyle}>{label}</Text>}
      <Text style={valueTextStyle}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
});