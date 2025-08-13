import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ScreenHeader } from '../ui/molecules/ScreenHeader';
import { Card, Pill } from '../ui/atoms';
import { FAB } from '../ui/atoms/FAB';
import { Icon, AppIcons } from '../ui/atoms/Icon';
import { BudgetsScreenProps } from '../navigation/types';

export const BudgetsScreen: React.FC<BudgetsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const BudgetCard = ({ name, spent, limit, category }: any) => {
    const percentage = (spent / limit) * 100;
    const isOverBudget = percentage > 100;
    const isNearLimit = percentage > 80;
    
    return (
      <Card variant="elevated" margin={2}>
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>
              {name}
            </Text>
            <Pill
              value={`${percentage.toFixed(0)}%`}
              color={isOverBudget ? 'danger' : isNearLimit ? 'warning' : 'success'}
              size="sm"
            />
          </View>
          <View style={styles.budgetAmount}>
            <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>
              ${spent.toFixed(2)} / ${limit.toFixed(2)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: isOverBudget
                    ? theme.colors.danger
                    : isNearLimit
                    ? theme.colors.warning
                    : theme.colors.success,
                },
              ]}
            />
          </View>
          <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary, marginTop: 8 }]}>
            {category} • ${(limit - spent).toFixed(2)} remaining
          </Text>
        </View>
      </Card>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScreenHeader
        title="Budgets"
        subtitle="January 2025"
        syncStatus="synced"
        rightAction={{
          icon: AppIcons.calendar,
          onPress: () => console.log('Period selector'),
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Overall Budget Status */}
        <Card variant="elevated" margin={4}>
          <View style={styles.overallStatus}>
            <Text style={[theme.typography.h5, { color: theme.colors.text.primary }]}>
              Monthly Budget
            </Text>
            <View style={styles.overallAmount}>
              <Text style={[theme.typography.h3, { color: theme.colors.primary }]}>
                $2,450
              </Text>
              <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>
                {' '}/ $3,000
              </Text>
            </View>
            <View style={styles.statusPills}>
              <Pill label="Spent" value="81.7%" color="warning" size="sm" />
              <Pill label="Remaining" value="$550" color="success" size="sm" style={{ marginLeft: 8 }} />
              <Pill label="5 days left" color="neutral" size="sm" style={{ marginLeft: 8 }} />
            </View>
          </View>
        </Card>
        
        {/* Budget Categories */}
        <View style={styles.budgetsList}>
          <BudgetCard name="Food & Dining" spent={450} limit={500} category="Essential" />
          <BudgetCard name="Transportation" spent={280} limit={300} category="Essential" />
          <BudgetCard name="Entertainment" spent={220} limit={200} category="Lifestyle" />
          <BudgetCard name="Shopping" spent={350} limit={400} category="Lifestyle" />
          <BudgetCard name="Bills & Utilities" spent={890} limit={1000} category="Essential" />
        </View>
        
        {/* Unbudgeted Spending */}
        <Card variant="outlined" margin={4}>
          <View style={styles.unbudgeted}>
            <Icon name={AppIcons.warning} size={20} color={theme.colors.warning} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>
                Unbudgeted Spending
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
                3 transactions • $125.50
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
      
      <FAB
        icon={AppIcons.add}
        onPress={() => console.log('Create budget')}
        label="Budget"
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  overallStatus: {
    padding: 16,
  },
  overallAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  statusPills: {
    flexDirection: 'row',
    marginTop: 12,
  },
  budgetsList: {
    marginTop: 16,
  },
  budgetCard: {
    padding: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetAmount: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  unbudgeted: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
});