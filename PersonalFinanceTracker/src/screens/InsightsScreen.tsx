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
import { Icon, AppIcons } from '../ui/atoms/Icon';
import { InsightsScreenProps } from '../navigation/types';

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const KPICard = ({ title, value, change, trend }: any) => {
    const isPositive = trend === 'up';
    
    return (
      <Card variant="elevated" style={styles.kpiCard}>
        <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
          {title}
        </Text>
        <Text style={[theme.typography.h4, { color: theme.colors.text.primary, marginTop: 4 }]}>
          {value}
        </Text>
        <View style={styles.kpiChange}>
          <Icon
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={16}
            color={isPositive ? theme.colors.success : theme.colors.danger}
          />
          <Text
            style={[
              theme.typography.caption,
              { color: isPositive ? theme.colors.success : theme.colors.danger, marginLeft: 4 },
            ]}
          >
            {change}
          </Text>
        </View>
      </Card>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScreenHeader
        title="Insights"
        subtitle="January 2025"
        syncStatus="synced"
        rightAction={{
          icon: AppIcons.filter,
          onPress: () => console.log('Filter'),
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          <KPICard title="Savings Rate" value="23%" change="+5%" trend="up" />
          <KPICard title="Avg Daily Spend" value="$82" change="-12%" trend="down" />
          <KPICard title="Net Worth MoM" value="+5.2%" change="+2.1%" trend="up" />
          <KPICard title="Debt to Income" value="18%" change="-3%" trend="down" />
        </View>
        
        {/* Spending by Category */}
        <Card variant="elevated" margin={4}>
          <View style={styles.chartCard}>
            <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>
              Spending by Category
            </Text>
            <View style={styles.chartPlaceholder}>
              <Icon name={AppIcons.budgets} size={48} color={theme.colors.text.tertiary} />
              <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary, marginTop: 8 }]}>
                Donut chart will go here
              </Text>
            </View>
            <View style={styles.categoryList}>
              <View style={styles.categoryItem}>
                <View style={[styles.categoryDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={[theme.typography.bodySmall, { color: theme.colors.text.primary }]}>
                  Food & Dining
                </Text>
                <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginLeft: 'auto' }]}>
                  $450 (25%)
                </Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={[styles.categoryDot, { backgroundColor: theme.colors.accent }]} />
                <Text style={[theme.typography.bodySmall, { color: theme.colors.text.primary }]}>
                  Transportation
                </Text>
                <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginLeft: 'auto' }]}>
                  $280 (15%)
                </Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={[styles.categoryDot, { backgroundColor: theme.colors.warning }]} />
                <Text style={[theme.typography.bodySmall, { color: theme.colors.text.primary }]}>
                  Shopping
                </Text>
                <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginLeft: 'auto' }]}>
                  $350 (19%)
                </Text>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Income vs Expenses */}
        <Card variant="elevated" margin={4}>
          <View style={styles.chartCard}>
            <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>
              Income vs Expenses (6 Months)
            </Text>
            <View style={styles.chartPlaceholder}>
              <Icon name="bar-chart" size={48} color={theme.colors.text.tertiary} />
              <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary, marginTop: 8 }]}>
                Bar chart will go here
              </Text>
            </View>
          </View>
        </Card>
        
        {/* Trends */}
        <Card variant="elevated" margin={4}>
          <View style={styles.trendsCard}>
            <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>
              Notable Trends
            </Text>
            <View style={styles.trendItem}>
              <Icon name={AppIcons.info} size={20} color={theme.colors.info} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>
                  Restaurant spending up 32%
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
                  Compared to last month
                </Text>
              </View>
            </View>
            <View style={styles.trendItem}>
              <Icon name={AppIcons.success} size={20} color={theme.colors.success} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>
                  Bills reduced by $45
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
                  Subscription optimization
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
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
    paddingVertical: 16,
    paddingBottom: 100,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
  },
  kpiChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  chartCard: {
    padding: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryList: {
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  trendsCard: {
    padding: 16,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});