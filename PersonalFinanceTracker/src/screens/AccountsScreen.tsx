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
import { AccountsScreenProps } from '../navigation/types';

export const AccountsScreen: React.FC<AccountsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const AccountCard = ({ name, type, balance, lastTransaction, isPrimary }: any) => {
    const getAccountIcon = () => {
      switch (type) {
        case 'checking':
        case 'savings':
          return AppIcons.bank;
        case 'credit_card':
          return AppIcons.creditCard;
        case 'cash':
          return AppIcons.cash;
        case 'investment':
          return AppIcons.investment;
        default:
          return AppIcons.accounts;
      }
    };
    
    return (
      <Card
        variant="elevated"
        margin={2}
        onPress={() => console.log('Account details')}
      >
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountInfo}>
              <Icon name={getAccountIcon()} size={24} color={theme.colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>
                  {name}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary }]}>
                  {type.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            {isPrimary && <Pill value="Primary" color="primary" size="sm" />}
          </View>
          <View style={styles.accountBalance}>
            <Text style={[theme.typography.h4, { color: theme.colors.text.primary }]}>
              ${balance.toFixed(2)}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.text.tertiary }]}>
              Last transaction: {lastTransaction}
            </Text>
          </View>
          {type === 'credit_card' && (
            <View style={styles.creditInfo}>
              <Pill label="Available" value="$2,500" size="sm" />
              <Pill label="Pay by" value="Jan 15" color="warning" size="sm" style={{ marginLeft: 8 }} />
            </View>
          )}
        </View>
      </Card>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScreenHeader
        title="Accounts"
        syncStatus="synced"
        rightAction={{
          icon: AppIcons.settings,
          onPress: () => console.log('Settings'),
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Net Worth Summary */}
        <Card variant="elevated" margin={4}>
          <View style={styles.netWorthCard}>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
              Net Worth
            </Text>
            <Text style={[theme.typography.h2, { color: theme.colors.text.primary, marginTop: 8 }]}>
              $24,580.00
            </Text>
            <View style={styles.netWorthBreakdown}>
              <View style={styles.breakdownItem}>
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
                  Total Assets
                </Text>
                <Text style={[theme.typography.body, { color: theme.colors.success }]}>
                  $32,450.00
                </Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownItem}>
                <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>
                  Total Debt
                </Text>
                <Text style={[theme.typography.body, { color: theme.colors.danger }]}>
                  $7,870.00
                </Text>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Account Categories */}
        <View style={styles.section}>
          <Text style={[theme.typography.h6, { color: theme.colors.text.primary, marginLeft: 16, marginBottom: 8 }]}>
            Bank Accounts
          </Text>
          <AccountCard
            name="Main Checking"
            type="checking"
            balance={4230.50}
            lastTransaction="2 hours ago"
            isPrimary={true}
          />
          <AccountCard
            name="Savings Account"
            type="savings"
            balance={12500.00}
            lastTransaction="5 days ago"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[theme.typography.h6, { color: theme.colors.text.primary, marginLeft: 16, marginBottom: 8 }]}>
            Credit Cards
          </Text>
          <AccountCard
            name="Chase Sapphire"
            type="credit_card"
            balance={-1250.00}
            lastTransaction="Today"
          />
          <AccountCard
            name="Apple Card"
            type="credit_card"
            balance={-620.00}
            lastTransaction="Yesterday"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[theme.typography.h6, { color: theme.colors.text.primary, marginLeft: 16, marginBottom: 8 }]}>
            Other Accounts
          </Text>
          <AccountCard
            name="Cash"
            type="cash"
            balance={350.00}
            lastTransaction="3 days ago"
          />
          <AccountCard
            name="Investment Portfolio"
            type="investment"
            balance={15720.50}
            lastTransaction="1 week ago"
          />
        </View>
      </ScrollView>
      
      <FAB
        icon={AppIcons.add}
        onPress={() => console.log('Add account')}
        label="Account"
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
    paddingVertical: 16,
    paddingBottom: 100,
  },
  netWorthCard: {
    padding: 20,
    alignItems: 'center',
  },
  netWorthBreakdown: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
  },
  breakdownDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  section: {
    marginTop: 24,
  },
  accountCard: {
    padding: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountBalance: {
    marginTop: 12,
  },
  creditInfo: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});