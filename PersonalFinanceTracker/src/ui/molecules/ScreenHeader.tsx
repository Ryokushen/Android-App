import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { Icon, AppIcons } from '../atoms/Icon';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  syncStatus?: 'syncing' | 'synced' | 'offline' | 'error';
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  syncStatus = 'synced',
  style,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return AppIcons.sync;
      case 'offline':
        return AppIcons.offline;
      case 'error':
        return AppIcons.syncDisabled;
      case 'synced':
      default:
        return AppIcons.online;
    }
  };
  
  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return theme.colors.primary;
      case 'offline':
        return theme.colors.warning;
      case 'error':
        return theme.colors.danger;
      case 'synced':
      default:
        return theme.colors.success;
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.default,
          borderBottomColor: theme.colors.border.light,
          paddingTop: insets.top,
          ...theme.shadows.sm,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <Pressable
              onPress={onBackPress}
              style={styles.backButton}
              android_ripple={{
                color: theme.colors.primary + '20',
                borderless: true,
                radius: 20,
              }}
            >
              <Icon
                name="arrow-back"
                size={24}
                color={theme.colors.text.primary}
              />
            </Pressable>
          )}
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                theme.typography.h5,
                { color: theme.colors.text.primary },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  theme.typography.caption,
                  { color: theme.colors.text.secondary },
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.syncIndicator}>
            <Icon
              name={getSyncIcon()}
              size={16}
              color={getSyncColor()}
            />
          </View>
          {rightAction && (
            <Pressable
              onPress={rightAction.onPress}
              style={styles.actionButton}
              android_ripple={{
                color: theme.colors.primary + '20',
                borderless: true,
                radius: 20,
              }}
            >
              <Icon
                name={rightAction.icon}
                size={24}
                color={theme.colors.text.primary}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIndicator: {
    marginRight: 12,
    padding: 4,
  },
  actionButton: {
    padding: 4,
  },
});