import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from './Icon';

export interface FABProps {
  icon?: string;
  onPress: () => void;
  label?: string;
  variant?: 'standard' | 'extended' | 'mini';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  visible?: boolean;
  style?: ViewStyle;
  color?: string;
  gradient?: {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FAB: React.FC<FABProps> = ({
  icon,
  onPress,
  label,
  variant = 'standard',
  position = 'bottom-right',
  visible = true,
  style,
  color,
  gradient,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12 });
      rotation.value = withSpring(0);
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0);
      rotation.value = withSpring(-90);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));
  
  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [0.9, 0.95]) }],
  }));
  
  const getSize = () => {
    switch (variant) {
      case 'mini':
        return 40;
      case 'extended':
        return 48;
      case 'standard':
      default:
        return 56;
    }
  };
  
  const getPosition = (): ViewStyle => {
    const basePosition: ViewStyle = {
      position: 'absolute',
      bottom: 80, // Above tab bar
    };
    
    switch (position) {
      case 'bottom-left':
        return { ...basePosition, left: 16 };
      case 'bottom-center':
        return { ...basePosition, alignSelf: 'center' };
      case 'bottom-right':
      default:
        return { ...basePosition, right: 16 };
    }
  };
  
  const size = getSize();
  const backgroundColor = color || theme.colors.primary;
  
  const fabContent = (
    <Animated.View style={[styles.content, pressAnimatedStyle]}>
      {icon && (
        <Icon
          name={icon}
          size={24}
          color={theme.colors.white}
        />
      )}
      {variant === 'extended' && label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.white,
              marginLeft: icon ? 8 : 0,
            },
            theme.typography.button,
          ]}
        >
          {label}
        </Text>
      )}
    </Animated.View>
  );
  
  const fabStyle = [
    styles.fab,
    getPosition(),
    {
      backgroundColor: gradient ? 'transparent' : backgroundColor,
      width: variant === 'extended' && label ? 'auto' : size,
      height: size,
      borderRadius: size / 2,
      paddingHorizontal: variant === 'extended' && label ? 16 : 0,
      ...theme.shadows.lg,
    },
    animatedStyle,
    style,
  ];
  
  if (gradient) {
    return (
      <AnimatedPressable
        onPress={onPress}
        style={fabStyle}
        android_ripple={{
          color: theme.colors.white + '30',
          borderless: false,
        }}
      >
        <LinearGradient
          colors={gradient.colors}
          start={gradient.start || { x: 0, y: 0 }}
          end={gradient.end || { x: 1, y: 0 }}
          style={[
            styles.gradientContainer,
            {
              borderRadius: size / 2,
            }
          ]}
        >
          {fabContent}
        </LinearGradient>
      </AnimatedPressable>
    );
  }
  
  return (
    <AnimatedPressable
      onPress={onPress}
      style={fabStyle}
      android_ripple={{
        color: theme.colors.white + '30',
        borderless: false,
      }}
    >
      {fabContent}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
  },
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});