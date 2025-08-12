# Personal Finance Tracker - Architectural Plan

## Executive Summary

This document outlines the comprehensive architectural plan for the Personal Finance Tracker React Native application based on the provided mockup. The app features manual transaction entry, budget tracking, account management, and financial insights with a warm, modern UI design optimized for Android.

## Core Architecture Overview

### Technology Stack
```
Frontend Framework:    React Native 0.73+ (TypeScript)
State Management:     React Query (TanStack Query) + Zustand
Navigation:           React Navigation v6
Backend:             Supabase (PostgreSQL, Auth, Real-time)
UI Components:       Custom components with react-native-svg
Animations:          react-native-reanimated v3
Charts:              Custom SVG components
Forms:               react-hook-form + zod validation
Offline Support:     AsyncStorage + SQLite
```

## Feature Analysis from Mockup

### 1. Home Dashboard
- **Wealth Card**: Net worth visualization with animated line chart
- **Quick Stats Pills**: Assets, Debt, Cash, Account count
- **Upcoming Renewals**: Subscription tracking
- **Budget Overview**: Mini progress bars for top budgets
- **Quick Accounts**: 4 primary accounts with balances
- **Goals Strip**: Horizontal scrollable goal progress rings

### 2. Transactions Tab
- **Search & Filter**: Real-time transaction search
- **Swipe Actions**: Categorize (right), Delete (left), Split (long-press)
- **Transaction List**: Date, description, category, amount, account
- **Smart Tips**: Visual hints for gesture actions

### 3. Budgets Tab
- **Visual Bar Chart**: Monthly budget consumption
- **Budget Cards**: Individual budget progress with warnings
- **Color-coded Progress**: Visual indicators for budget health

### 4. Accounts Tab
- **Account Cards**: Balance, APR, payment dates
- **Interest Tracking**: YTD interest for credit/loan accounts
- **Account Types**: Checking, Savings, Credit, Loan, Investment, Cash

### 5. Insights Tab
- **Spending Donut Chart**: Category breakdown with animations
- **Cash Flow Bars**: 6-month income vs expense comparison
- **Key Metrics**: Savings rate, DTI, Net worth change

## Detailed Component Architecture

### Core UI Components (`src/ui/`)

#### Atoms
```typescript
// Card.tsx
interface CardProps {
  gradient?: boolean;
  borderColor?: string;
  padding?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  children: ReactNode;
}

// Pill.tsx
interface PillProps {
  label: string;
  value: string | number;
  color?: 'purple' | 'teal' | 'orange' | 'rose';
  icon?: ReactNode;
}

// Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'fab';
  gradient?: boolean;
  onPress: () => void;
  children: ReactNode;
}

// Input.tsx
interface InputProps {
  type: 'text' | 'number' | 'search';
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: ReactNode;
}
```

#### Charts
```typescript
// LineSpark.tsx
interface LineSparkProps {
  data: number[] | { in: number; out?: number }[];
  width?: number;
  height?: number;
  animated?: boolean;
  gradient?: boolean;
}

// Donut.tsx
interface DonutProps {
  segments: { name: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  interactive?: boolean;
}

// BarMini.tsx
interface BarMiniProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showWarning?: boolean;
}

// GoalRing.tsx
interface GoalRingProps {
  size?: number;
  thickness?: number;
  percentage: number;
  color?: string;
}
```

### Feature Modules (`src/features/`)

#### Accounts Module
```typescript
// src/features/accounts/types.ts
interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  apr?: number;
  credit_limit?: number;
  is_primary: boolean;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

type AccountType = 'checking' | 'savings' | 'credit_card' | 'loan' | 'investment' | 'cash';

// src/features/accounts/hooks/useAccounts.ts
export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// src/features/accounts/components/AccountCard.tsx
// src/features/accounts/components/AccountList.tsx
// src/features/accounts/components/QuickAccounts.tsx
```

#### Transactions Module
```typescript
// src/features/transactions/types.ts
interface Transaction {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  description: string;
  category_id: string;
  account_id: string;
  txn_type: 'income' | 'expense' | 'transfer';
  meta?: TransactionMeta;
}

interface TransactionMeta {
  notes?: string;
  tags?: string[];
  location?: string;
  receipt_url?: string;
}

// Swipe Actions Implementation
interface SwipeableTransactionProps {
  transaction: Transaction;
  onCategorize: () => void;
  onDelete: () => void;
  onSplit: () => void;
}
```

#### Budgets Module
```typescript
// src/features/budgets/types.ts
interface Budget {
  id: string;
  user_id: string;
  name: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  category_ids: string[];
}

// Visual components
// src/features/budgets/components/BudgetBar.tsx
// src/features/budgets/components/BudgetGrid.tsx
// src/features/budgets/components/BudgetWarning.tsx
```

### State Management Architecture

#### Global State (Zustand)
```typescript
// src/store/appStore.ts
interface AppState {
  // UI State
  activeTab: TabName;
  searchQuery: string;
  notifications: Notification[];
  
  // User Preferences
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  
  // Actions
  setActiveTab: (tab: TabName) => void;
  setSearchQuery: (query: string) => void;
  addNotification: (notification: Notification) => void;
}

// src/store/offlineStore.ts
interface OfflineState {
  pendingTransactions: Transaction[];
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSyncTime: Date | null;
  
  queueTransaction: (transaction: Transaction) => void;
  syncWithServer: () => Promise<void>;
}
```

#### Server State (React Query)
```typescript
// src/data/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      onError: (error) => {
        // Global error handling
        handleApiError(error);
      },
    },
  },
});
```

### Navigation Structure

```typescript
// src/navigation/AppNavigator.tsx
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 64,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTopColor: 'rgba(251, 146, 60, 0.2)',
        },
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#78716c',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
    </Tab.Navigator>
  );
}

// Root Stack with Modals
function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="AddTransaction" component={AddTransactionModal} />
      <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
      <Stack.Screen name="BudgetDetails" component={BudgetDetailsScreen} />
      <Stack.Screen name="GoalDetails" component={GoalDetailsScreen} />
    </Stack.Navigator>
  );
}
```

## Data Flow Architecture

### API Layer
```typescript
// src/data/api/supabase.ts
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});

// src/data/api/endpoints.ts
export const api = {
  accounts: {
    list: () => supabaseClient.from('accounts').select('*'),
    create: (data: AccountCreate) => supabaseClient.from('accounts').insert(data),
    update: (id: string, data: AccountUpdate) => 
      supabaseClient.from('accounts').update(data).eq('id', id),
  },
  transactions: {
    list: (filters?: TransactionFilters) => {
      let query = supabaseClient.from('transactions').select('*');
      if (filters?.dateRange) {
        query = query.gte('date', filters.dateRange.start)
                    .lte('date', filters.dateRange.end);
      }
      return query;
    },
  },
  // ... other endpoints
};
```

### Offline Sync Strategy
```typescript
// src/data/offline/syncManager.ts
class SyncManager {
  private queue: OfflineQueue;
  private sqlite: SQLiteDatabase;
  
  async queueOperation(operation: OfflineOperation) {
    // Store in SQLite for persistence
    await this.sqlite.insert('offline_queue', operation);
    
    // Attempt immediate sync if online
    if (await NetInfo.fetch().then(state => state.isConnected)) {
      this.processQueue();
    }
  }
  
  async processQueue() {
    const operations = await this.sqlite.query('offline_queue');
    
    for (const op of operations) {
      try {
        await this.executeOperation(op);
        await this.sqlite.delete('offline_queue', op.id);
      } catch (error) {
        // Retry logic
        this.handleSyncError(op, error);
      }
    }
  }
}
```

## Performance Optimizations

### 1. List Virtualization
```typescript
// Use FlashList for large lists
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={transactions}
  renderItem={renderTransaction}
  estimatedItemSize={80}
  keyExtractor={(item) => item.id}
/>
```

### 2. Memoization Strategy
```typescript
// Expensive calculations
const netWorth = useMemo(() => 
  accounts.reduce((sum, acc) => sum + acc.balance, 0),
  [accounts]
);

// Component memoization
const TransactionItem = memo(({ transaction }) => {
  // ...
}, (prev, next) => prev.transaction.id === next.transaction.id);
```

### 3. Image & Asset Optimization
```typescript
// Lazy load heavy components
const InsightsCharts = lazy(() => import('./InsightsCharts'));

// Optimize chart rendering
const ChartContainer = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only render when visible
    const timer = InteractionManager.runAfterInteractions(() => {
      setIsVisible(true);
    });
    return () => timer.cancel();
  }, []);
  
  return isVisible ? <Chart data={data} /> : <ChartSkeleton />;
};
```

## Security Architecture

### 1. Authentication Flow
```typescript
// src/features/auth/authManager.ts
class AuthManager {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data?.session) {
      // Store session securely
      await Keychain.setInternetCredentials(
        'app.finance.tracker',
        'session',
        JSON.stringify(data.session)
      );
    }
  }
  
  async biometricAuth() {
    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access your finances',
      fallbackLabel: 'Use passcode',
    });
    
    if (success) {
      // Retrieve stored session
      const credentials = await Keychain.getInternetCredentials('app.finance.tracker');
      return JSON.parse(credentials.password);
    }
  }
}
```

### 2. Data Encryption
```typescript
// Sensitive data encryption
import CryptoJS from 'crypto-js';

const encryptSensitiveData = (data: any, userKey: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), userKey).toString();
};

const decryptSensitiveData = (encryptedData: string, userKey: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, userKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

## Testing Strategy

### Unit Tests
```typescript
// src/features/accounts/__tests__/accountUtils.test.ts
describe('Account Utils', () => {
  test('calculates net worth correctly', () => {
    const accounts = [
      { balance: 1000 },
      { balance: -500 },
      { balance: 2000 },
    ];
    expect(calculateNetWorth(accounts)).toBe(2500);
  });
});
```

### Integration Tests
```typescript
// src/features/transactions/__tests__/transactionFlow.test.ts
describe('Transaction Flow', () => {
  test('creates transaction and updates account balance', async () => {
    const { result } = renderHook(() => useCreateTransaction());
    
    await act(async () => {
      await result.current.mutate({
        amount: -50,
        account_id: 'test-account',
        category_id: 'groceries',
      });
    });
    
    expect(result.current.isSuccess).toBe(true);
  });
});
```

## Deployment Architecture

### Build Configuration
```json
// android/app/build.gradle
android {
  defaultConfig {
    applicationId "com.personalfinance.tracker"
    minSdkVersion 23
    targetSdkVersion 34
    versionCode 1
    versionName "1.0.0"
  }
  
  buildTypes {
    release {
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
      signingConfig signingConfigs.release
    }
  }
}
```

### Environment Configuration
```typescript
// src/config/env.ts
const ENV = {
  dev: {
    SUPABASE_URL: 'http://localhost:54321',
    SUPABASE_ANON_KEY: 'dev-key',
  },
  staging: {
    SUPABASE_URL: 'https://staging.supabase.co',
    SUPABASE_ANON_KEY: 'staging-key',
  },
  prod: {
    SUPABASE_URL: 'https://prod.supabase.co',
    SUPABASE_ANON_KEY: 'prod-key',
  },
};

export default ENV[__DEV__ ? 'dev' : 'prod'];
```

## Migration Path from Mockup

### Phase 1: Core Setup (Week 1)
1. Initialize React Native project with TypeScript
2. Set up Supabase backend and auth
3. Configure navigation structure
4. Implement theme system and base components

### Phase 2: Basic Features (Week 2-3)
1. Account management CRUD
2. Transaction entry and listing
3. Basic search and filtering
4. Offline queue implementation

### Phase 3: Advanced Features (Week 4-5)
1. Budget tracking with visualizations
2. Goals system
3. Subscription tracking
4. Insights and analytics

### Phase 4: Polish & Optimization (Week 6)
1. Animations and transitions
2. Performance optimization
3. Error handling and recovery
4. Testing and bug fixes

## Key Architectural Decisions

1. **React Query over Redux**: Better server state management, built-in caching, and offline support
2. **Zustand for UI State**: Lightweight, TypeScript-friendly, minimal boilerplate
3. **Custom SVG Charts**: Full control over animations and styling vs heavy chart libraries
4. **SQLite for Offline**: Better performance than AsyncStorage for complex queries
5. **Modular Feature Structure**: Scalable architecture for team development

## Success Metrics

- **Performance**: <100ms tap response, <2s cold start
- **Reliability**: 99.9% crash-free sessions
- **Offline**: Full CRUD operations while offline
- **Security**: Biometric auth, encrypted storage
- **UX**: Gesture-based interactions, smooth animations

## Conclusion

This architecture provides a solid foundation for building the Personal Finance Tracker app with excellent performance, offline capabilities, and a delightful user experience. The modular structure ensures maintainability and scalability as the app grows.