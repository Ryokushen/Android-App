import React from 'react';
import {
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ActivityIndicator,
  View,
  PressableProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { buttonHeights } from '../../core/theme/spacing';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  onPress,
  children,
  ...pressableProps
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  
  const getBackgroundColor = () => {
    if (isDisabled) {
      return theme.colors.stone[300];
    }
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.accent;
      case 'danger':
        return theme.colors.danger;
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (isDisabled && variant !== 'ghost') {
      return theme.colors.text.tertiary;
    }
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return theme.colors.white;
      case 'ghost':
        return isDisabled ? theme.colors.text.tertiary : theme.colors.primary;
      default:
        return theme.colors.white;
    }
  };
  
  const getBorderStyle = (): ViewStyle => {
    if (variant === 'ghost') {
      return {
        borderWidth: theme.borderWidth.default,
        borderColor: isDisabled ? theme.colors.border.light : theme.colors.primary,
      };
    }
    return {};
  };
  
  const getSizeStyles = (): ViewStyle => {
    const height = buttonHeights[size];
    const paddingHorizontal = size === 'sm' ? theme.spacing[3] : 
                             size === 'lg' ? theme.spacing[6] : 
                             theme.spacing[4];
    
    return {
      height,
      paddingHorizontal,
      minWidth: height * 2,
    };
  };
  
  const getTextStyles = (): TextStyle => {
    switch (size) {
      case 'sm':
        return theme.typography.buttonSmall;
      case 'lg':
        return theme.typography.button;
      default:
        return theme.typography.button;
    }
  };
  
  const buttonStyle: ViewStyle[] = [
    styles.base,
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: theme.borderRadius.lg,
      ...getSizeStyles(),
      ...getBorderStyle(),
    },
    fullWidth && styles.fullWidth,
    variant !== 'ghost' && theme.shadows.sm,
    style,
  ];
  
  const buttonTextStyle: TextStyle[] = [
    getTextStyles(),
    {
      color: getTextColor(),
    },
    textStyle,
  ];
  
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'small'}
          color={getTextColor()}
        />
      );
    }
    
    const textElement = (
      <Text style={buttonTextStyle}>
        {children}
      </Text>
    );
    
    if (!icon) {
      return textElement;
    }
    
    return (
      <View style={styles.content}>
        {iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        {textElement}
        {iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </View>
    );
  };
  
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && !isDisabled && styles.pressed,
      ]}
      android_ripple={
        !isDisabled
          ? {
              color: theme.colors.white + '30',
              borderless: false,
            }
          : undefined
      }
      {...pressableProps}
    >
      {renderContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});