import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Icon, AppIcons } from '../atoms/Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabBarItemProps {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  label: string;
}

const TabBarItem: React.FC<TabBarItemProps> = ({
  route,
  index,
  isFocused,
  onPress,
  onLongPress,
  label,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  const getIconName = () => {
    switch (route.name) {
      case 'Home':
        return isFocused ? AppIcons.home : AppIcons.homeOutline;
      case 'Transactions':
        return AppIcons.transactions;
      case 'Budgets':
        return isFocused ? AppIcons.budgets : AppIcons.budgetsOutline;
      case 'Accounts':
        return AppIcons.accounts;
      case 'Insights':
        return AppIcons.insights;
      default:
        return AppIcons.home;
    }
  };
  
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Icon
          name={getIconName()}
          size={24}
          color={isFocused ? theme.colors.primary : theme.colors.text.tertiary}
        />
        {isFocused && (
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            color: isFocused ? theme.colors.primary : theme.colors.text.tertiary,
            fontWeight: isFocused ? '600' : '400',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.default,
          borderTopColor: theme.colors.border.light,
          paddingBottom: insets.bottom,
          ...theme.shadows.md,
        },
      ]}
    >
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          
          const isFocused = state.index === index;
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          
          return (
            <TabBarItem
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              label={label as string}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 56,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});