import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { ScreenHeader } from '../ui/molecules/ScreenHeader';
import { Card, Pill, Button } from '../ui/atoms';
import { FAB } from '../ui/atoms/FAB';
import { Icon, AppIcons } from '../ui/atoms/Icon';
import { HomeScreenProps } from '../navigation/types';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScreenHeader
        title="Home"
        subtitle={getGreeting()}
        syncStatus="synced"
        rightAction={{
          icon: AppIcons.notification,
          onPress: () => console.log('Notifications'),
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
          {/* Total Wealth Card */}
          <Card variant="elevated" margin={4}>
            <View style={styles.wealthCard}>
              <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
                Total Wealth
              </Text>
              <Text style={[styles.wealthAmount, theme.typography.h2, { color: theme.colors.text.primary }]}>
                $24,580.00
              </Text>
              <View style={styles.wealthChange}>
                <Icon
                  name={AppIcons.insights}
                  size={16}
                  color={theme.colors.success}
                />
                <Text style={[theme.typography.bodySmall, { color: theme.colors.success, marginLeft: 4 }]}>
                  +5.2% this month
                </Text>
              </View>
            </View>
          </Card>
          
          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <Pill label="Assets" value="$32,450" color="primary" />
            <Pill label="Debt" value="$7,870" color="danger" />
            <Pill label="Cash" value="$4,230" color="success" />
            <Pill label="Accounts" value="6" color="accent" />
          </View>
          
          {/* Last 7 Days Spending */}
          <Card margin={4}>
            <View style={styles.spendingCard}>
              <View style={styles.spendingHeader}>
                <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>
                  Last 7 Days
                </Text>
                <Text style={[theme.typography.h5, { color: theme.colors.primary }]}>
                  $542.30
                </Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary }]}>
                  Chart will go here
                </Text>
              </View>
            </View>
          </Card>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={[theme.typography.h6, { color: theme.colors.text.primary, marginBottom: 12 }]}>
              Quick Actions
            </Text>
            <View style={styles.actionGrid}>
              <Card
                variant="outlined"
                padding={3}
                style={styles.actionCard}
                onPress={() => navigation.navigate('Transactions')}
              >
                <Icon name={AppIcons.transactions} size={28} color={theme.colors.primary} />
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary, marginTop: 8 }]}>
                  Transactions
                </Text>
              </Card>
              <Card
                variant="outlined"
                padding={3}
                style={styles.actionCard}
                onPress={() => navigation.navigate('Budgets')}
              >
                <Icon name={AppIcons.budgets} size={28} color={theme.colors.accent} />
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary, marginTop: 8 }]}>
                  Budgets
                </Text>
              </Card>
              <Card
                variant="outlined"
                padding={3}
                style={styles.actionCard}
                onPress={() => navigation.navigate('Accounts')}
              >
                <Icon name={AppIcons.accounts} size={28} color={theme.colors.warning} />
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary, marginTop: 8 }]}>
                  Accounts
                </Text>
              </Card>
              <Card
                variant="outlined"
                padding={3}
                style={styles.actionCard}
                onPress={() => navigation.navigate('Insights')}
              >
                <Icon name={AppIcons.insights} size={28} color={theme.colors.success} />
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary, marginTop: 8 }]}>
                  Insights
                </Text>
              </Card>
            </View>
          </View>
          
          {/* Recent Transactions */}
          <Card margin={4}>
            <View style={styles.recentHeader}>
              <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>
                Recent Transactions
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => navigation.navigate('Transactions')}
              >
                See All
              </Button>
            </View>
            <View style={styles.transactionsList}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <Icon name={AppIcons.shopping} size={20} color={theme.colors.text.secondary} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>
                        Grocery Store
                      </Text>
                      <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary }]}>
                        Today, 2:30 PM
                      </Text>
                    </View>
                  </View>
                  <Text style={[theme.typography.body, { color: theme.colors.danger }]}>
                    -$45.20
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
      
      <FAB
        icon={AppIcons.add}
        onPress={() => console.log('Add transaction')}
        variant="standard"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  wealthCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  wealthAmount: {
    marginTop: 8,
    fontWeight: '700',
  },
  wealthChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: 16,
    gap: 8,
  },
  spendingCard: {
    padding: 16,
  },
  spendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartPlaceholder: {
    height: 100,
    marginTop: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  transactionsList: {
    paddingTop: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});