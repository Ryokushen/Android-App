import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { ComponentShowcase } from '@/screens/dev/ComponentShowcase';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Home</Text>
    </View>
  );
};

const TransactionsScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Transactions</Text>
    </View>
  );
};

const BudgetsScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Budgets</Text>
    </View>
  );
};

const AccountsScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Accounts</Text>
    </View>
  );
};

const InsightsScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Insights</Text>
    </View>
  );
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? (
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.text.tertiary,
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.text.inverse,
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          >
            <Tab.Screen name="Home" component={ComponentShowcase} />
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="Budgets" component={BudgetsScreen} />
            <Tab.Screen name="Accounts" component={AccountsScreen} />
            <Tab.Screen name="Insights" component={InsightsScreen} />
          </Tab.Navigator>
        ) : (
          <LoginScreen />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});