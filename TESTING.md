# TESTING.md - Comprehensive Testing Strategy

## Overview

This document outlines the testing strategy for the Personal Finance Tracker React Native application, covering unit tests, integration tests, end-to-end tests, and performance testing.

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Test Structure](#test-structure)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [React Native Specific Testing](#react-native-specific-testing)
7. [Supabase Testing](#supabase-testing)
8. [Performance Testing](#performance-testing)
9. [CI/CD Integration](#cicd-integration)

## Testing Stack

### Core Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.4.0",
    "@testing-library/jest-native": "^5.4.3",
    "@testing-library/react-hooks": "^8.0.1",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "jest-expo": "^49.0.0",
    "react-test-renderer": "18.2.0",
    "detox": "^20.13.0",
    "nock": "^13.3.0",
    "msw": "^2.0.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### Test Setup

```typescript
// jest.setup.js
import '@testing-library/jest-native/extend-expect'
import { cleanup } from '@testing-library/react-native'
import { server } from './src/__tests__/mocks/server'

// Mock React Native modules
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}))

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())

// Silence console during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
```

## Test Structure

### Directory Organization

```
src/
├── __tests__/
│   ├── setup/
│   │   ├── jest.setup.ts
│   │   └── test-utils.tsx
│   ├── mocks/
│   │   ├── server.ts
│   │   ├── handlers.ts
│   │   └── data.ts
│   └── fixtures/
│       ├── accounts.ts
│       ├── transactions.ts
│       └── budgets.ts
├── features/
│   ├── accounts/
│   │   ├── __tests__/
│   │   │   ├── AccountCard.test.tsx
│   │   │   ├── useAccounts.test.ts
│   │   │   └── accountUtils.test.ts
│   │   └── ...
│   └── ...
└── e2e/
    ├── config.js
    ├── init.js
    └── tests/
        ├── auth.e2e.js
        ├── transactions.e2e.js
        └── budgets.e2e.js
```

## Unit Testing

### Component Testing

```typescript
// src/features/accounts/__tests__/AccountCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { AccountCard } from '../components/AccountCard'
import { mockAccount } from '@/__tests__/fixtures/accounts'

describe('AccountCard', () => {
  it('renders account information correctly', () => {
    const { getByText } = render(
      <AccountCard account={mockAccount} />
    )
    
    expect(getByText(mockAccount.name)).toBeTruthy()
    expect(getByText('$1,234.56')).toBeTruthy() // Formatted balance
  })
  
  it('handles press events', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <AccountCard 
        account={mockAccount} 
        onPress={onPress}
        testID="account-card"
      />
    )
    
    fireEvent.press(getByTestId('account-card'))
    expect(onPress).toHaveBeenCalledWith(mockAccount)
  })
  
  it('shows credit utilization for credit cards', () => {
    const creditAccount = {
      ...mockAccount,
      type: 'credit_card',
      balance: -500,
      credit_limit: 2000,
    }
    
    const { getByText } = render(
      <AccountCard account={creditAccount} />
    )
    
    expect(getByText('25% utilized')).toBeTruthy()
  })
})
```

### Hook Testing

```typescript
// src/features/accounts/__tests__/useAccounts.test.ts
import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccounts } from '../hooks/useAccounts'
import { server } from '@/__tests__/mocks/server'
import { rest } from 'msw'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useAccounts', () => {
  it('fetches accounts successfully', async () => {
    const { result } = renderHook(() => useAccounts(), {
      wrapper: createWrapper(),
    })
    
    expect(result.current.isLoading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    
    expect(result.current.data).toHaveLength(3)
    expect(result.current.data[0]).toHaveProperty('name')
  })
  
  it('handles error states', async () => {
    server.use(
      rest.get('*/accounts', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    const { result } = renderHook(() => useAccounts(), {
      wrapper: createWrapper(),
    })
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    
    expect(result.current.error).toBeDefined()
  })
})
```

### Utility Function Testing

```typescript
// src/features/accounts/__tests__/accountUtils.test.ts
import {
  calculateNetWorth,
  formatAccountBalance,
  getCreditUtilization,
  groupAccountsByType,
} from '../utils/accountUtils'
import { mockAccounts } from '@/__tests__/fixtures/accounts'

describe('Account Utilities', () => {
  describe('calculateNetWorth', () => {
    it('calculates positive net worth correctly', () => {
      const accounts = [
        { balance: 1000, type: 'checking' },
        { balance: 5000, type: 'savings' },
        { balance: -500, type: 'credit_card' },
      ]
      
      expect(calculateNetWorth(accounts)).toBe(5500)
    })
    
    it('handles empty account list', () => {
      expect(calculateNetWorth([])).toBe(0)
    })
    
    it('excludes archived accounts', () => {
      const accounts = [
        { balance: 1000, archived_at: null },
        { balance: 2000, archived_at: '2024-01-01' },
      ]
      
      expect(calculateNetWorth(accounts)).toBe(1000)
    })
  })
  
  describe('getCreditUtilization', () => {
    it('calculates utilization percentage', () => {
      const account = {
        type: 'credit_card',
        balance: -750,
        credit_limit: 3000,
      }
      
      expect(getCreditUtilization(account)).toBe(25)
    })
    
    it('returns 0 for non-credit accounts', () => {
      const account = {
        type: 'checking',
        balance: 1000,
      }
      
      expect(getCreditUtilization(account)).toBe(0)
    })
    
    it('handles zero credit limit', () => {
      const account = {
        type: 'credit_card',
        balance: -100,
        credit_limit: 0,
      }
      
      expect(getCreditUtilization(account)).toBe(0)
    })
  })
})
```

## Integration Testing

### API Integration Tests

```typescript
// src/features/transactions/__tests__/transactionAPI.integration.test.ts
import { supabase } from '@/data/supabase'
import { createTransaction, updateTransaction } from '../api/transactions'

describe('Transaction API Integration', () => {
  let testTransaction: any
  
  beforeEach(async () => {
    // Setup test data
    const { data } = await supabase
      .from('transactions')
      .insert({
        amount: 100,
        description: 'Test transaction',
        txn_type: 'expense',
        account_id: 'test-account-id',
        user_id: 'test-user-id',
      })
      .select()
      .single()
    
    testTransaction = data
  })
  
  afterEach(async () => {
    // Cleanup
    if (testTransaction?.id) {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', testTransaction.id)
    }
  })
  
  it('creates a transaction with all fields', async () => {
    const newTransaction = {
      amount: 50.25,
      description: 'Coffee',
      txn_type: 'expense',
      account_id: 'test-account-id',
      category_id: 'food-category-id',
      ts: new Date().toISOString(),
    }
    
    const result = await createTransaction(newTransaction)
    
    expect(result).toMatchObject({
      amount: 50.25,
      description: 'Coffee',
      txn_type: 'expense',
    })
    expect(result.id).toBeDefined()
  })
  
  it('updates transaction fields', async () => {
    const updates = {
      amount: 150,
      description: 'Updated description',
    }
    
    const result = await updateTransaction(testTransaction.id, updates)
    
    expect(result.amount).toBe(150)
    expect(result.description).toBe('Updated description')
  })
})
```

### React Query Integration

```typescript
// src/features/budgets/__tests__/budgetMutations.integration.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useCreateBudget, useUpdateBudgetLimit } from '../hooks/budgetMutations'
import { createTestWrapper } from '@/__tests__/setup/test-utils'

describe('Budget Mutations Integration', () => {
  it('creates budget and invalidates queries', async () => {
    const wrapper = createTestWrapper()
    const { result: createResult } = renderHook(
      () => useCreateBudget(),
      { wrapper }
    )
    
    const newBudget = {
      name: 'Food Budget',
      limit_amount: 500,
      period: 'monthly',
      start_date: '2024-01-01',
    }
    
    await act(async () => {
      await createResult.current.mutateAsync(newBudget)
    })
    
    await waitFor(() => {
      expect(createResult.current.isSuccess).toBe(true)
    })
    
    // Verify cache invalidation
    const queryClient = wrapper.props.value
    const budgets = queryClient.getQueryData(['budgets'])
    expect(budgets).toBeDefined()
  })
  
  it('handles optimistic updates correctly', async () => {
    const wrapper = createTestWrapper()
    const { result } = renderHook(
      () => useUpdateBudgetLimit(),
      { wrapper }
    )
    
    const update = {
      budgetId: 'test-budget-id',
      newLimit: 750,
    }
    
    act(() => {
      result.current.mutate(update)
    })
    
    // Check optimistic update
    const queryClient = wrapper.props.value
    const budget = queryClient.getQueryData(['budgets', update.budgetId])
    expect(budget?.limit_amount).toBe(750)
  })
})
```

## End-to-End Testing

### Detox Configuration

```javascript
// .detoxrc.js
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/PersonalFinanceTracker.app',
      build: 'xcodebuild -workspace ios/PersonalFinanceTracker.xcworkspace -scheme PersonalFinanceTracker -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_6_API_33',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
}
```

### E2E Test Examples

```javascript
// e2e/tests/transactions.e2e.js
describe('Transaction Flow', () => {
  beforeAll(async () => {
    await device.launchApp()
    await signIn('test@example.com', 'password123')
  })
  
  beforeEach(async () => {
    await device.reloadReactNative()
  })
  
  it('should add a new transaction', async () => {
    // Navigate to transactions
    await element(by.id('tab-transactions')).tap()
    await element(by.id('add-transaction-fab')).tap()
    
    // Fill form
    await element(by.id('amount-input')).typeText('25.50')
    await element(by.id('description-input')).typeText('Lunch')
    await element(by.id('category-selector')).tap()
    await element(by.text('Food & Dining')).tap()
    await element(by.id('account-selector')).tap()
    await element(by.text('Main Checking')).tap()
    
    // Submit
    await element(by.id('save-transaction')).tap()
    
    // Verify
    await expect(element(by.text('Lunch'))).toBeVisible()
    await expect(element(by.text('$25.50'))).toBeVisible()
  })
  
  it('should swipe to categorize transaction', async () => {
    await element(by.id('tab-transactions')).tap()
    
    // Swipe right on uncategorized transaction
    await element(by.id('transaction-0')).swipe('right')
    await element(by.text('Groceries')).tap()
    
    // Verify category was applied
    await expect(element(by.text('Groceries').atIndex(1))).toBeVisible()
  })
  
  it('should filter transactions by date range', async () => {
    await element(by.id('tab-transactions')).tap()
    await element(by.id('filter-button')).tap()
    
    // Select date range
    await element(by.id('date-range-selector')).tap()
    await element(by.text('This Month')).tap()
    await element(by.id('apply-filters')).tap()
    
    // Verify filtered results
    await expect(element(by.id('transaction-list'))).toBeVisible()
    await expect(element(by.text('January 2024'))).toBeVisible()
  })
})
```

## React Native Specific Testing

### Navigation Testing

```typescript
// src/navigation/__tests__/AppNavigator.test.tsx
import { NavigationContainer } from '@react-navigation/native'
import { render, fireEvent } from '@testing-library/react-native'
import { AppNavigator } from '../AppNavigator'

describe('App Navigation', () => {
  it('navigates to different tabs', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    )
    
    // Start at Home
    expect(getByText('Dashboard')).toBeTruthy()
    
    // Navigate to Transactions
    fireEvent.press(getByTestId('tab-transactions'))
    expect(getByText('Transactions')).toBeTruthy()
    
    // Navigate to Budgets
    fireEvent.press(getByTestId('tab-budgets'))
    expect(getByText('Budgets')).toBeTruthy()
  })
})
```

### Gesture Testing

```typescript
// src/features/transactions/__tests__/SwipeableTransaction.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { SwipeableTransaction } from '../components/SwipeableTransaction'
import { Gesture } from 'react-native-gesture-handler'

describe('SwipeableTransaction', () => {
  it('reveals categorize action on right swipe', () => {
    const { getByTestId } = render(
      <SwipeableTransaction transaction={mockTransaction} />
    )
    
    const swipeable = getByTestId('swipeable-transaction')
    
    // Simulate swipe right
    fireEvent(swipeable, 'onSwipeableOpen', { direction: 'right' })
    
    expect(getByTestId('categorize-action')).toBeTruthy()
  })
  
  it('reveals delete action on left swipe', () => {
    const { getByTestId } = render(
      <SwipeableTransaction transaction={mockTransaction} />
    )
    
    const swipeable = getByTestId('swipeable-transaction')
    
    // Simulate swipe left
    fireEvent(swipeable, 'onSwipeableOpen', { direction: 'left' })
    
    expect(getByTestId('delete-action')).toBeTruthy()
  })
})
```

### Async Storage Testing

```typescript
// src/data/__tests__/localStorage.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalStorage } from '../localStorage'

describe('LocalStorage', () => {
  beforeEach(() => {
    AsyncStorage.clear()
  })
  
  it('stores and retrieves user preferences', async () => {
    const preferences = {
      theme: 'dark',
      currency: 'USD',
      notifications: true,
    }
    
    await LocalStorage.setUserPreferences(preferences)
    const retrieved = await LocalStorage.getUserPreferences()
    
    expect(retrieved).toEqual(preferences)
  })
  
  it('handles offline queue storage', async () => {
    const operations = [
      { type: 'create', table: 'transactions', data: {} },
      { type: 'update', table: 'accounts', data: {} },
    ]
    
    await LocalStorage.queueOfflineOperations(operations)
    const queue = await LocalStorage.getOfflineQueue()
    
    expect(queue).toHaveLength(2)
    expect(queue[0].type).toBe('create')
  })
})
```

## Supabase Testing

### Mock Supabase Client

```typescript
// src/__tests__/mocks/supabase.ts
export const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: {}, error: null }),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({ 
      data: { user: { id: 'test-user-id' } }, 
      error: null 
    }),
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsubscribe: jest.fn(),
  })),
  removeChannel: jest.fn(),
}

jest.mock('@/data/supabase', () => ({
  supabase: mockSupabaseClient,
}))
```

### Testing RLS Policies

```typescript
// src/__tests__/supabase/rls.test.ts
describe('Row Level Security', () => {
  it('user can only access their own transactions', async () => {
    const { data: ownTransactions } = await supabase
      .from('transactions')
      .select('*')
    
    expect(ownTransactions).toBeDefined()
    expect(ownTransactions.every(t => t.user_id === currentUserId)).toBe(true)
  })
  
  it('prevents access to other users data', async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', 'other-user-id')
    
    expect(data).toEqual([])
  })
})
```

## Performance Testing

### Component Render Performance

```typescript
// src/__tests__/performance/render.test.tsx
import { measurePerformance } from 'reassure'
import { TransactionList } from '@/features/transactions/components/TransactionList'

test('TransactionList render performance', async () => {
  const mockTransactions = generateMockTransactions(100)
  
  await measurePerformance(
    <TransactionList transactions={mockTransactions} />,
    {
      runs: 10,
      warmupRuns: 3,
    }
  )
})
```

### Bundle Size Analysis

```bash
# Analyze bundle size
npx react-native-bundle-visualizer

# Check individual component sizes
npx source-map-explorer 'build/static/js/*.js'
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  
  e2e-android:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup environment
        uses: ./.github/actions/setup-detox
      
      - name: Build app
        run: npm run e2e:build:android
      
      - name: Run E2E tests
        run: npm run e2e:test:android
      
      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: detox-artifacts
          path: artifacts/
```

## Testing Commands

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testMatch='**/*.integration.test.{ts,tsx}'",
    "test:unit": "jest --testMatch='**/*.test.{ts,tsx}' --testPathIgnorePatterns='integration|e2e'",
    "e2e:build:ios": "detox build -c ios.sim.debug",
    "e2e:build:android": "detox build -c android.emu.debug",
    "e2e:test:ios": "detox test -c ios.sim.debug",
    "e2e:test:android": "detox test -c android.emu.debug",
    "test:perf": "reassure",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

## Testing Best Practices

### 1. Test Pyramid
- **Unit Tests (70%)**: Fast, isolated, cover business logic
- **Integration Tests (20%)**: Test module interactions
- **E2E Tests (10%)**: Critical user flows only

### 2. Test Organization
- Co-locate tests with source code
- Use descriptive test names
- Group related tests with `describe` blocks
- Follow AAA pattern: Arrange, Act, Assert

### 3. Mocking Strategy
- Mock external dependencies (APIs, native modules)
- Use MSW for API mocking
- Avoid over-mocking internal modules
- Prefer integration tests over heavily mocked unit tests

### 4. Async Testing
- Always use `waitFor` for async operations
- Clean up subscriptions and timers
- Handle promise rejections properly
- Test loading, success, and error states

### 5. Performance
- Keep tests fast (<100ms for unit tests)
- Run tests in parallel
- Use test.skip for slow tests in watch mode
- Profile and optimize slow tests

### 6. Maintenance
- Keep tests simple and readable
- Update tests when requirements change
- Remove obsolete tests
- Maintain high coverage but focus on quality

## Troubleshooting

### Common Issues

1. **Metro bundler conflicts**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Detox build failures**
   ```bash
   cd ios && pod install
   cd android && ./gradlew clean
   ```

3. **AsyncStorage mock issues**
   ```javascript
   // Ensure mock is imported before any component using it
   import '@react-native-async-storage/async-storage/jest/async-storage-mock'
   ```

4. **Navigation testing errors**
   ```javascript
   // Wrap components with NavigationContainer
   const AllTheProviders = ({ children }) => (
     <NavigationContainer>
       <QueryClientProvider client={queryClient}>
         {children}
       </QueryClientProvider>
     </NavigationContainer>
   )
   ```

## Resources

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Detox Documentation](https://wix.github.io/Detox/)
- [MSW Documentation](https://mswjs.io/)
- [Testing React Query](https://tanstack.com/query/latest/docs/react/guides/testing)