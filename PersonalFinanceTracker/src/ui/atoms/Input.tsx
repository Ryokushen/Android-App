import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Animated,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { inputHeights } from '../../core/theme/spacing';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  disabled?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  type?: 'text' | 'numeric' | 'currency' | 'password' | 'email';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'outlined',
  disabled = false,
  clearable = false,
  onClear,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  type = 'text',
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  secureTextEntry,
  ...textInputProps
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
  
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);
  
  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || localValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, localValue, animatedLabel]);
  
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleChangeText = (text: string) => {
    if (type === 'currency') {
      const numericValue = text.replace(/[^0-9.]/g, '');
      const parts = numericValue.split('.');
      if (parts.length > 2) return;
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }
      text = parts.join('.');
    } else if (type === 'numeric') {
      text = text.replace(/[^0-9]/g, '');
    }
    
    setLocalValue(text);
    onChangeText?.(text);
  };
  
  const handleClear = () => {
    setLocalValue('');
    onChangeText?.('');
    onClear?.();
  };
  
  const getKeyboardType = (): TextInputProps['keyboardType'] => {
    switch (type) {
      case 'numeric':
        return 'numeric';
      case 'currency':
        return 'decimal-pad';
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };
  
  const getInputHeight = () => inputHeights[size];
  
  const getBorderColor = () => {
    if (error) return theme.colors.danger;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border.default;
  };
  
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.background.tertiary;
    if (variant === 'filled') return theme.colors.background.secondary;
    return theme.colors.background.primary;
  };
  
  const containerStyles: ViewStyle[] = [
    styles.container,
    containerStyle,
  ];
  
  const inputContainerStyles: ViewStyle[] = [
    styles.inputContainer,
    {
      height: getInputHeight(),
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderWidth: variant === 'outlined' ? theme.borderWidth.default : 0,
      borderBottomWidth: theme.borderWidth.default,
      borderRadius: variant === 'outlined' ? theme.borderRadius.md : 0,
      paddingHorizontal: theme.spacing[3],
    },
  ];
  
  const labelStyles: Animated.AnimatedProps<TextStyle> = {
    position: 'absolute',
    left: leftIcon ? theme.spacing[10] : theme.spacing[3],
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [getInputHeight() / 2 - 10, -10],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.typography.body.fontSize, theme.typography.caption.fontSize],
    }),
    color: error
      ? theme.colors.danger
      : animatedLabel.interpolate({
          inputRange: [0, 1],
          outputRange: [theme.colors.text.secondary, theme.colors.primary],
        }),
    backgroundColor: getBackgroundColor(),
    paddingHorizontal: theme.spacing[1],
  };
  
  const inputStyles: TextStyle[] = [
    styles.input,
    theme.typography.body,
    {
      color: disabled ? theme.colors.text.tertiary : theme.colors.text.primary,
      paddingLeft: leftIcon ? theme.spacing[8] : 0,
      paddingRight: (rightIcon || clearable) ? theme.spacing[8] : 0,
    },
    inputStyle,
  ];
  
  const showClearButton = clearable && localValue && !disabled;
  
  return (
    <View style={containerStyles}>
      <View style={inputContainerStyles}>
        {label && (
          <Animated.Text style={labelStyles}>
            {label}
          </Animated.Text>
        )}
        
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          value={localValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={!label ? placeholder : isFocused ? placeholder : ''}
          placeholderTextColor={theme.colors.text.tertiary}
          editable={!disabled}
          keyboardType={getKeyboardType()}
          secureTextEntry={type === 'password' || secureTextEntry}
          style={inputStyles}
          {...textInputProps}
        />
        
        {showClearButton && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        )}
        
        {rightIcon && !showClearButton && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            theme.typography.caption,
            {
              color: error ? theme.colors.danger : theme.colors.text.secondary,
              marginTop: theme.spacing[1],
              marginLeft: theme.spacing[3],
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
  },
  helperText: {
    marginTop: 4,
  },
});