import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Root Stack Navigator
export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  ComponentShowcase: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Transactions: {
    accountId?: string;
    categoryId?: string;
  };
  Budgets: {
    budgetId?: string;
  };
  Accounts: {
    accountId?: string;
  };
  Insights: {
    period?: 'week' | 'month' | 'year';
  };
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<'Main'>
  >;

// Navigation Prop Types
export type HomeScreenProps = MainTabScreenProps<'Home'>;
export type TransactionsScreenProps = MainTabScreenProps<'Transactions'>;
export type BudgetsScreenProps = MainTabScreenProps<'Budgets'>;
export type AccountsScreenProps = MainTabScreenProps<'Accounts'>;
export type InsightsScreenProps = MainTabScreenProps<'Insights'>;