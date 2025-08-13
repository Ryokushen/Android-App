import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ScreenHeader } from '../ui/molecules/ScreenHeader';
import { Card, Pill, Input } from '../ui/atoms';
import { FAB } from '../ui/atoms/FAB';
import { Icon, AppIcons } from '../ui/atoms/Icon';
import { TransactionsScreenProps } from '../navigation/types';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: 'income' | 'expense';
  account: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Salary', amount: 3500, date: new Date(), category: 'Income', type: 'income', account: 'Checking' },
  { id: '2', description: 'Grocery Store', amount: -125.50, date: new Date(), category: 'Food', type: 'expense', account: 'Credit Card' },
  { id: '3', description: 'Electric Bill', amount: -89.00, date: new Date(), category: 'Bills', type: 'expense', account: 'Checking' },
  { id: '4', description: 'Restaurant', amount: -45.00, date: new Date(), category: 'Food', type: 'expense', account: 'Credit Card' },
  { id: '5', description: 'Gas Station', amount: -52.30, date: new Date(), category: 'Transport', type: 'expense', account: 'Credit Card' },
];

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isExpense = item.type === 'expense';
    const amountColor = isExpense ? theme.colors.danger : theme.colors.success;
    
    return (
      <Pressable
        style={[styles.transactionItem, { backgroundColor: theme.colors.surface.default }]}
        android_ripple={{
          color: theme.colors.primary + '10',
        }}
      >
        <View style={styles.transactionLeft}>
          <View style={[styles.categoryIcon, { backgroundColor: theme.colors.background.secondary }]}>
            <Icon
              name={
                item.category === 'Food' ? AppIcons.food :
                item.category === 'Transport' ? AppIcons.transport :
                item.category === 'Bills' ? AppIcons.bills :
                AppIcons.shopping
              }
              size={20}
              color={theme.colors.text.secondary}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>
              {item.description}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary }]}>
                {item.category} • {item.account}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[theme.typography.body, { color: amountColor, fontWeight: '600' }]}>
            {isExpense ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary }]}>
            Today
          </Text>
        </View>
      </Pressable>
    );
  };
  
  const ListHeader = () => (
    <View style={[styles.listHeader, { backgroundColor: theme.colors.background.primary }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Icon name={AppIcons.search} size={20} color={theme.colors.text.tertiary} />}
          clearable
          size="sm"
        />
      </View>
      
      {/* Filter Pills */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterButton, { borderColor: theme.colors.border.default }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name={AppIcons.filter} size={16} color={theme.colors.text.secondary} />
          <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginLeft: 4 }]}>
            Filters
          </Text>
        </Pressable>
        <Pill value="This Month" size="sm" style={{ marginLeft: 8 }} />
        <Pill value="All Accounts" size="sm" style={{ marginLeft: 8 }} />
      </View>
      
      {/* Summary */}
      <Card variant="elevated" margin={2} style={{ marginTop: 12 }}>
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
              Income
            </Text>
            <Text style={[theme.typography.h6, { color: theme.colors.success }]}>
              $3,500.00
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
              Expenses
            </Text>
            <Text style={[theme.typography.h6, { color: theme.colors.danger }]}>
              $1,236.80
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
              Balance
            </Text>
            <Text style={[theme.typography.h6, { color: theme.colors.primary }]}>
              $2,263.20
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScreenHeader
        title="Transactions"
        syncStatus="synced"
        rightAction={{
          icon: AppIcons.calendar,
          onPress: () => console.log('Calendar'),
        }}
      />
      
      <FlatList
        data={mockTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.colors.border.light }]} />
        )}
        contentContainerStyle={styles.listContent}
      />
      
      <FAB
        icon={AppIcons.add}
        onPress={() => console.log('Add transaction')}
        label="Add Transaction"
        variant="extended"
        gradient={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeader: {
    paddingBottom: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  summary: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  listContent: {
    paddingBottom: 100,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  transactionMeta: {
    flexDirection: 'row',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
});