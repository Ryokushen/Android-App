import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../ui/atoms';
import { FAB } from '../ui/atoms/FAB';
import { HomeScreenProps } from '../navigation/types';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, G, Rect } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing 
} from 'react-native-reanimated';
import { formatCurrency, formatCompactCurrency, formatShortDate } from '@/utils/formatters';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data matching the mockup
const mockData = {
  netWorth: 17515.27,
  assetsTotal: 32511.05,
  debtTotal: 14995.78,
  cashOnHand: 16620.73,
  accountsCount: 6,
  last7dSpend: 207.44,
  monthlyChange: 5.2,
  netWorthSeries: [12000, 13500, 14200, 15800, 16600, 17515],
  monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  subscriptions: [
    { id: 's1', name: 'Spotify Family', cost: 16.99, renews: '2025-08-15' },
    { id: 's2', name: 'YouTube Premium', cost: 13.99, renews: '2025-08-18' },
    { id: 's3', name: 'Notion Plus', cost: 8.0, renews: '2025-08-28' },
  ],
  budgets: [
    { id: 'b1', name: 'Groceries', limit: 600, spent: 338 },
    { id: 'b2', name: 'Dining Out', limit: 250, spent: 198 },
    { id: 'b3', name: 'Transport', limit: 220, spent: 126 },
  ],
  accounts: [
    { id: 'a1', name: 'Chase Checking', type: 'checking', balance: 4250.23 },
    { id: 'a2', name: 'Ally Savings', type: 'savings', balance: 12250.5 },
    { id: 'a3', name: 'Amex Gold', type: 'credit_card', balance: -745.78 },
    { id: 'a4', name: 'Brokerage', type: 'investment', balance: 15890.32 },
  ],
  goals: [
    { id: 'g1', name: 'Emergency Fund', target: 10000, current: 6200, color: '#a855f7' },
    { id: 'g2', name: 'Travel', target: 3000, current: 1200, color: '#14b8a6' },
    { id: 'g3', name: 'Debt Free', target: 14250, current: 2000, color: '#ec4899' },
    { id: 'g4', name: 'New Laptop', target: 1800, current: 450, color: '#f97316' },
  ],
};

// LineSpark chart component
const LineSpark: React.FC<{ data: number[], width?: number, height?: number }> = ({ 
  data, 
  width = SCREEN_WIDTH - 64, 
  height = 96 
}) => {
  const values = data;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const denom = Math.max(1, values.length - 1);
  
  const coords = values.map((v, i) => {
    const x = (i / denom) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return { x, y };
  });
  
  const lineD = `M ${coords.map(c => `${c.x} ${c.y}`).join(' L ')}`;
  const areaD = `M 0 ${height} L ${coords.map(c => `${c.x} ${c.y}`).join(' L ')} L ${width} ${height} Z`;
  
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
          <Stop offset="50%" stopColor="#f97316" stopOpacity="1" />
          <Stop offset="100%" stopColor="#14b8a6" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
          <Stop offset="60%" stopColor="#f97316" stopOpacity="0.15" />
          <Stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={areaD} fill="url(#fillGradient)" />
      <Path 
        d={lineD}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
};

// Mini bar chart component for budgets
const BarMini: React.FC<{ label: string, value: number, max: number, color?: string }> = ({ 
  label, 
  value, 
  max, 
  color = '#a855f7' 
}) => {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100));
  const animatedWidth = useSharedValue(0);
  
  useEffect(() => {
    animatedWidth.value = withTiming(pct, {
      duration: 700,
      easing: Easing.out(Easing.exp),
    });
  }, [pct]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));
  
  return (
    <View style={styles.barMiniContainer}>
      <View style={styles.barMiniHeader}>
        <Text style={styles.barMiniLabel}>{label}</Text>
        <Text style={[styles.barMiniPercent, pct >= 90 && styles.barMiniPercentWarning]}>
          {pct}%
        </Text>
      </View>
      <View style={styles.barMiniTrack}>
        <Animated.View 
          style={[
            styles.barMiniFill,
            { backgroundColor: color },
            animatedStyle
          ]} 
        />
      </View>
    </View>
  );
};

// Goal ring component
const GoalRing: React.FC<{ size?: number, thickness?: number, pct?: number, color?: string }> = ({ 
  size = 56, 
  thickness = 8, 
  pct = 0, 
  color = '#a855f7' 
}) => {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  const len = (p / 100) * C;
  
  return (
    <View style={{ position: 'relative', width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id={`goal-gradient-${color}`}>
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </LinearGradient>
        </Defs>
        <G transform={`translate(${size / 2}, ${size / 2})`}>
          <Circle r={r} fill="none" stroke="#fef3c7" strokeWidth={thickness} opacity="0.5" />
          <Circle 
            r={r} 
            fill="none" 
            stroke={`url(#goal-gradient-${color})`} 
            strokeWidth={thickness} 
            strokeDasharray={`${len} ${C - len}`} 
            transform="rotate(-90)"
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {/* Use absolute positioning for perfect centering */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: '#78716c'
        }}>
          {Math.round(p)}%
        </Text>
      </View>
    </View>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wealth Card */}
        <View style={styles.wealthCard}>
          <View style={styles.wealthCardHeader}>
            <View style={styles.wealthCardTitleRow}>
              <View style={styles.wealthIndicator} />
              <Text style={styles.wealthCardTitle}>Total Wealth</Text>
              <Text style={styles.wealthCardChange}>+{mockData.monthlyChange}%</Text>
            </View>
            <Text style={styles.wealthCardAmount}>{formatCurrency(mockData.netWorth)}</Text>
            
            {/* Micro stat pills */}
            <View style={styles.microStatRow}>
              <View style={[styles.microStat, styles.microStatAssets]}>
                <Text style={styles.microStatLabel}>Assets </Text>
                <Text style={styles.microStatValue}>{formatCurrency(mockData.assetsTotal)}</Text>
              </View>
              <View style={[styles.microStat, styles.microStatDebt]}>
                <Text style={styles.microStatLabel}>Debt </Text>
                <Text style={styles.microStatValue}>{formatCurrency(mockData.debtTotal)}</Text>
              </View>
              <View style={[styles.microStat, styles.microStatCash]}>
                <Text style={styles.microStatLabel}>Cash </Text>
                <Text style={styles.microStatValue}>{formatCurrency(mockData.cashOnHand)}</Text>
              </View>
              <View style={[styles.microStat, styles.microStatAccounts]}>
                <Text style={styles.microStatLabel}>{mockData.accountsCount} accts</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.wealthSpendRow}>
            <View style={styles.spendIndicator} />
            <Text style={styles.spendText}>Last 7d spend {formatCurrency(mockData.last7dSpend)}</Text>
          </View>
          
          {/* Chart */}
          <View style={styles.chartContainer}>
            <LineSpark data={mockData.netWorthSeries} />
          </View>
          
          <View style={styles.monthLabelsRow}>
            {mockData.monthLabels.map((label, i) => (
              <Text key={i} style={styles.monthLabel}>{label}</Text>
            ))}
          </View>
        </View>

        {/* Upcoming & Budgets Row */}
        <View style={styles.gridRow}>
          {/* Upcoming Subscriptions */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardTitle}>Upcoming</Text>
            </View>
            {mockData.subscriptions.map((sub) => (
              <View key={sub.id} style={styles.subscriptionRow}>
                <View style={styles.subscriptionLeft}>
                  <View style={styles.subscriptionDot} />
                  <Text style={styles.subscriptionName}>{sub.name}</Text>
                </View>
                <View style={styles.subscriptionRight}>
                  <Text style={styles.subscriptionDate}>{formatShortDate(new Date(sub.renews))}</Text>
                  <Text style={styles.subscriptionAmount}>{formatCurrency(sub.cost)}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Budgets */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardTitle}>Budgets</Text>
              <Text style={styles.gridCardSubtitle}>This month</Text>
            </View>
            {mockData.budgets.map((budget, i) => (
              <BarMini 
                key={budget.id}
                label={budget.name}
                value={budget.spent}
                max={budget.limit}
                color={['#a855f7', '#14b8a6', '#f97316'][i % 3]}
              />
            ))}
          </View>
        </View>

        {/* Quick Accounts */}
        <View style={styles.quickAccountsCard}>
          <Text style={styles.quickAccountsTitle}>Quick Accounts</Text>
          <View style={styles.accountsGrid}>
            {mockData.accounts.map((account) => (
              <TouchableOpacity key={account.id} style={styles.accountCard}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={[
                  styles.accountBalance,
                  account.balance < 0 && styles.accountBalanceNegative
                ]}>
                  {formatCurrency(account.balance)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Goals Strip */}
        <View style={styles.goalsCard}>
          <View style={styles.goalsHeader}>
            <Text style={styles.goalsTitle}>Goals</Text>
            <Text style={styles.goalsLink}>Track progress →</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.goalsScroll}
          >
            {mockData.goals.map((goal) => {
              const pct = Math.round(((goal.current || 0) / (goal.target || 1)) * 100);
              const left = Math.max(0, (goal.target || 0) - (goal.current || 0));
              
              return (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalRingContainer}>
                    <GoalRing pct={pct} color={goal.color} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalRemaining}>
                      {left > 0 ? `${formatCurrency(left)} left` : 'Completed! 🎉'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
      
      <FAB
        icon="add"
        label="Add Transaction"
        variant="extended"
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  
  // Wealth Card
  wealthCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.1)',
    padding: 16,
    marginBottom: 16,
  },
  wealthCardHeader: {
    marginBottom: 8,
  },
  wealthCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  wealthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a855f7',
    marginRight: 8,
  },
  wealthCardTitle: {
    fontSize: 14,
    color: '#57534e',
    flex: 1,
  },
  wealthCardChange: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  wealthCardAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1917',
    marginBottom: 8,
  },
  microStatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  microStat: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  microStatAssets: {
    borderColor: 'rgba(168, 85, 247, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  microStatDebt: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(254, 242, 242, 0.6)',
  },
  microStatCash: {
    borderColor: 'rgba(20, 184, 166, 0.3)',
    backgroundColor: 'rgba(240, 253, 250, 0.6)',
  },
  microStatAccounts: {
    borderColor: 'rgba(120, 113, 108, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  microStatLabel: {
    fontSize: 10,
    color: '#78716c',
  },
  microStatValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  wealthSpendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    marginBottom: 8,
  },
  spendIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  spendText: {
    fontSize: 10,
    color: '#78716c',
  },
  chartContainer: {
    height: 96,
    marginVertical: 8,
  },
  monthLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  monthLabel: {
    fontSize: 10,
    color: '#a8a29e',
  },
  
  // Grid Cards
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.2)',
    padding: 16,
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
  },
  gridCardSubtitle: {
    fontSize: 11,
    color: '#78716c',
  },
  
  // Subscriptions
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subscriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriptionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a855f7',
    marginRight: 8,
  },
  subscriptionName: {
    fontSize: 12,
    color: '#57534e',
  },
  subscriptionRight: {
    alignItems: 'flex-end',
  },
  subscriptionDate: {
    fontSize: 10,
    color: '#78716c',
    marginBottom: 2,
  },
  subscriptionAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1c1917',
  },
  
  // Budget Bars
  barMiniContainer: {
    marginBottom: 12,
  },
  barMiniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barMiniLabel: {
    fontSize: 12,
    color: '#57534e',
  },
  barMiniPercent: {
    fontSize: 11,
    color: '#78716c',
  },
  barMiniPercentWarning: {
    color: '#ef4444',
    fontWeight: '600',
  },
  barMiniTrack: {
    height: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barMiniFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Quick Accounts
  quickAccountsCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.2)',
    padding: 16,
    marginBottom: 16,
  },
  quickAccountsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
    marginBottom: 12,
  },
  accountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  accountCard: {
    width: '47%',
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.1)',
    padding: 12,
  },
  accountName: {
    fontSize: 11,
    color: '#57534e',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  accountBalanceNegative: {
    color: '#ef4444',
  },
  
  // Goals
  goalsCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.2)',
    padding: 16,
    marginBottom: 16,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
  },
  goalsLink: {
    fontSize: 12,
    color: '#a855f7',
  },
  goalsScroll: {
    marginHorizontal: -4,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.1)',
    padding: 12,
    marginHorizontal: 4,
    minWidth: 180,
  },
  goalRingContainer: {
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1c1917',
    marginBottom: 2,
  },
  goalRemaining: {
    fontSize: 11,
    color: '#57534e',
  },
});