import React from 'react';
import { ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';

export type IconFamily = 'material' | 'material-community' | 'ionicons';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  family?: IconFamily;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  family = 'material',
  style,
}) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.text.primary;
  
  const iconProps = {
    name,
    size,
    color: iconColor,
    style,
  };
  
  switch (family) {
    case 'material-community':
      return <MaterialCommunityIcons {...iconProps} />;
    case 'ionicons':
      return <Ionicons {...iconProps} />;
    case 'material':
    default:
      return <MaterialIcons {...iconProps} />;
  }
};

// Common icon names for the app
export const AppIcons = {
  // Navigation
  home: 'home',
  homeOutline: 'home',
  transactions: 'swap-horiz',
  transactionsOutline: 'swap-horiz',
  budgets: 'pie-chart',
  budgetsOutline: 'pie-chart-outline',
  accounts: 'account-balance-wallet',
  accountsOutline: 'account-balance-wallet',
  insights: 'trending-up',
  insightsOutline: 'trending-up',
  
  // Actions
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  close: 'close',
  check: 'check',
  search: 'search',
  filter: 'filter-list',
  sort: 'sort',
  more: 'more-vert',
  settings: 'settings',
  
  // Categories
  food: 'restaurant',
  transport: 'directions-car',
  shopping: 'shopping-cart',
  entertainment: 'movie',
  bills: 'receipt',
  health: 'local-hospital',
  education: 'school',
  
  // Account types
  bank: 'account-balance',
  creditCard: 'credit-card',
  cash: 'payments',
  investment: 'show-chart',
  loan: 'money-off',
  
  // Status
  sync: 'sync',
  syncDisabled: 'sync-disabled',
  offline: 'cloud-off',
  online: 'cloud-queue',
  warning: 'warning',
  error: 'error',
  info: 'info',
  success: 'check-circle',
  
  // Misc
  calendar: 'calendar-today',
  notification: 'notifications',
  user: 'person',
  logout: 'logout',
  theme: 'brightness-6',
  currency: 'attach-money',
} as const;