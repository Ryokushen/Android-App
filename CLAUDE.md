# CLAUDE.md - Personal Finance Tracker

## Project Overview

A React Native Android application for personal finance management with a Supabase backend. The app focuses on manual transaction entry, budget tracking, debt management, and financial insights with a modern, warm UI design and strong offline support.

**Tech Stack:**
- **Frontend:** React Native (TypeScript), React Navigation, React Query/TanStack Query
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security)
- **UI/Charts:** react-native-svg, react-native-reanimated
- **Storage:** AsyncStorage, SQLite (offline), Supabase (cloud)
- **Key Libraries:** react-hook-form, zod, react-native-gesture-handler

## Project Structure

```
personal-finance-tracker/
├── src/
│   ├── core/              # Theme, colors, typography, icons, routes, constants
│   ├── data/              # API clients, queries, mutations, local cache, offline sync
│   ├── features/          # Feature modules (each with components, hooks, utils)
│   │   ├── accounts/
│   │   ├── budgets/
│   │   ├── debts/
│   │   ├── insights/
│   │   ├── investments/
│   │   ├── subscriptions/
│   │   ├── transactions/
│   │   └── goals/
│   ├── ui/                # Shared UI components
│   │   ├── atoms/         # Card, Pill, Button, Input
│   │   ├── charts/        # LineSpark, Donut, BarMini, GoalRing
│   │   └── forms/         # Form components with validation
│   ├── screens/           # Main screens (Home, Transactions, Budgets, Accounts, Insights)
│   ├── navigation/        # Navigation configuration
│   ├── hooks/             # Shared custom hooks
│   ├── utils/             # Helper functions, formatters
│   └── types/             # TypeScript type definitions
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── seed.sql          # Seed data for development
│   └── functions/        # Edge functions if needed
└── __tests__/            # Test files
```

## 🚨 CRITICAL WORKFLOW - ALWAYS FOLLOW

### Context7 Documentation Reference (MANDATORY)
**ALWAYS use Context7 MCP server before:**
- Implementing new features or components
- Refactoring existing code
- Conducting code reviews
- Setting up new libraries
- Looking up API best practices
- Checking library-specific patterns

**How to use Context7:**
1. Call `mcp__Context7__resolve-library-id` with library name
2. Use `mcp__Context7__get-library-docs` with the resolved ID
3. Reference the latest documentation before making design decisions

### Task Management
**BEFORE EVERY TASK:**
1. First read tasks.md with: `cat tasks.md`
2. Identify the current task being worked on
3. Check task dependencies and requirements
4. Use Context7 to reference relevant library documentation

**AFTER COMPLETING WORK:**
1. Update tasks.md to mark progress
2. Add any new discovered tasks
3. Update the "Current Status" section below

## When to Use Zen MCP Multi-LLM Collaboration Tools

### 🤝 **General Collaboration & Brainstorming**
**Use `zen:chat` when:**
- You need a thinking partner for complex ideas or analysis
- Bouncing ideas during your own analysis process
- Getting second opinions on plans or approaches
- Collaborative brainstorming sessions
- Validating checklists and methodologies
- Exploring alternatives to proposed solutions
- General development questions requiring deeper discussion

### 🔍 **Deep Investigation & Complex Problem Solving**
**Use `zen:thinkdeep` when:**
- Facing complex architectural decisions
- Debugging mysterious or elusive bugs
- Analyzing performance challenges
- Conducting security analysis
- Problems requiring systematic hypothesis testing
- Issues needing evidence-based investigation
- Situations requiring expert validation of findings
- Scale complexity with modes: 'low' for quick investigation, 'high' for complex issues, 'max' for extremely complex challenges

### 🗳️ **Decision Making & Consensus Building**
**Use `zen:consensus` when:**
- Making critical architectural choices
- Evaluating feature proposals
- Choosing between technology stacks
- Strategic planning decisions
- Need multiple perspectives on a complex decision
- Want structured debate with different viewpoints (for/against/neutral)
- Require comprehensive analysis before committing to a direction

### 📋 **Planning & Task Decomposition**
**Use `zen:planner` when:**
- Breaking down complex projects
- System design with many unknowns
- Migration strategy development
- Architectural decisions requiring iterative refinement
- Problems where the path forward is unclear
- Need to explore multiple approaches systematically

### 🐛 **Debugging & Root Cause Analysis**
**Use `zen:debug` when:**
- Traditional debugging approaches have failed
- Dealing with race conditions or timing issues
- Memory leaks or performance degradation
- Integration problems between systems
- Mysterious errors with unclear origins
- Need systematic investigation with hypothesis testing

### 🔒 **Security & Code Quality**
**Use `zen:secaudit` when:**
- Comprehensive security assessments needed
- OWASP Top 10 compliance checking
- Threat modeling for applications
- Identifying vulnerabilities before deployment
- Compliance evaluation (SOC2, PCI DSS, HIPAA, GDPR)

**Use `zen:codereview` when:**
- Comprehensive code quality assessment
- Identifying anti-patterns and code smells
- Performance optimization opportunities
- Architectural assessment of existing code
- Pre-merge validation of significant changes

### 📝 **Code Generation & Refactoring**
**Use `zen:refactor` when:**
- Code needs significant restructuring
- Identifying decomposition opportunities
- Modernizing legacy code
- Improving code maintainability
- Reducing technical debt systematically

**Use `zen:testgen` when:**
- Creating comprehensive test suites
- Need edge case coverage
- Building tests for complex systems
- Following existing test patterns
- Generating framework-specific tests

### 📊 **Analysis & Documentation**
**Use `zen:analyze` when:**
- Comprehensive codebase analysis needed
- Strategic improvement planning
- Performance evaluation
- Architectural assessment
- Tech stack evaluation

**Use `zen:docgen` when:**
- Generating comprehensive documentation
- Documenting complex algorithms
- Creating API documentation
- Modernizing existing documentation

### 🎯 **When to Choose Multi-LLM Over Single Model**

**Prefer Multi-LLM collaboration when:**
1. **Complexity is High**: The problem requires deep, systematic investigation
2. **Stakes are Significant**: Decisions have major architectural or security implications
3. **Multiple Perspectives Valuable**: Different viewpoints would improve the solution
4. **Validation Critical**: You need expert validation of your approach
5. **Exploration Needed**: The problem space is unclear and requires systematic exploration
6. **Cross-functional Expertise**: The problem spans multiple domains (security, performance, architecture)

**Use Single Model (Claude alone) when:**
1. **Simple, straightforward tasks**: Basic coding, explanations, or queries
2. **Speed is critical**: Need immediate responses without investigation overhead
3. **Well-defined problems**: Clear requirements with established patterns
4. **Routine operations**: Standard CRUD, simple refactoring, basic documentation

### 💡 **Best Practices**

1. **Start with the simplest tool that meets your needs** - don't use `thinkdeep` for simple questions
2. **Adjust thinking modes based on complexity** - use 'low' for simple, 'high' for complex
3. **Provide context** - The more context you give, the better the multi-model analysis
4. **Use continuation_id** - For follow-up questions to maintain conversation context
5. **Be specific about what you need** - Clear requirements lead to better collaborative outcomes

### 🚀 **Quick Decision Tree**

```
Is it complex/critical?
├─ NO → Use Claude directly
└─ YES → Do you need...
    ├─ Multiple perspectives? → zen:consensus
    ├─ Deep investigation? → zen:thinkdeep
    ├─ Step-by-step planning? → zen:planner
    ├─ Bug hunting? → zen:debug
    ├─ Security review? → zen:secaudit
    ├─ Code quality check? → zen:codereview
    └─ General discussion? → zen:chat
```

## Current Task Status
**Active Task:** Task 6 - Implement Account Management System
**Task File:** tasks.md (line 70-76)
**Last Updated:** January 11, 2025 05:35 UTC

## Task Management Commands
```bash

Working Agreement
When asked to implement any feature:

ALWAYS first check tasks.md for the specific task details
ALWAYS update tasks.md after completing work
ALWAYS note any blockers or new tasks discovered

Task File Location

Main task list: /tasks.md
Completed archive: /completed-tasks.md (move completed sections here)

## Key Design Patterns

### Color Palette
- Primary: `#a855f7` (purple)
- Accent: `#14b8a6` (teal)
- Warning: `#f97316` (orange)
- Danger: `#ef4444` (red)
- Neutrals: Stone/amber families

### Component Patterns
- **Cards:** Rounded corners (xl-2xl), soft shadows, 12-16dp padding
- **Pills:** Micro-stat displays with colored backgrounds
- **Charts:** Gradient fills, soft animations, touch interactions
- **Forms:** Numeric keyboard for amounts, date pickers, category selectors

## Architecture Overview

### Technology Stack
- **Frontend Framework:** React Native 0.73+ (TypeScript)
- **State Management:** React Query (TanStack Query) + Zustand
- **Navigation:** React Navigation v6
- **Backend:** Supabase (PostgreSQL, Auth, Real-time)
- **UI Components:** Custom components with react-native-svg
- **Animations:** react-native-reanimated v3
- **Charts:** Custom SVG components
- **Forms:** react-hook-form + zod validation
- **Offline Support:** AsyncStorage + SQLite

### Feature Modules from Mockup
1. **Home Dashboard**: Net worth visualization, quick stats, upcoming renewals
2. **Transactions Tab**: Search, filter, swipe actions for categorization
3. **Budgets Tab**: Visual bar charts, budget cards with warnings
4. **Accounts Tab**: Balance tracking, APR, payment dates, interest YTD
5. **Insights Tab**: Spending donut chart, cash flow bars, key metrics

## Database Schema

### Core Tables
```sql
-- All tables include user_id with RLS policies
accounts (id, user_id, name, type, balance, apr, credit_limit, archived_at, is_primary)
transactions (id, user_id, ts, amount, description, txn_type, account_id, category_id, meta)
categories (id, user_id, name, parent_id)
budgets (id, user_id, name, period, start_date, end_date, limit_amount)
budget_entries (id, user_id, budget_id, category_id)
subscriptions (id, user_id, name, cost, frequency, payment_method, next_renewal, is_active)
debts (id, user_id, name, type, principal, apr, min_payment, due_day, snowball_order, account_id)
investment_accounts (id, user_id, name, type)
holdings (id, user_id, investment_account_id, symbol, qty, cost_basis, current_value)
goals (id, user_id, name, target, current, color, target_date)
feature_flags (key, enabled, user_id)

-- Views for common aggregations
v_budget_spend (budget_id, spent, remaining, percentage_used)
v_net_worth (user_id, assets, liabilities, net_worth)
```

## Common Development Commands

### Project Setup
```bash
# Install dependencies
npm install

# iOS specific (if needed later)
cd ios && pod install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on Android device
adb devices  # Check connected devices
npm run android --deviceId=<device_id>
```

### Supabase Development
```bash
# Start local Supabase
npx supabase start

# Run migrations
npx supabase migration up

# Reset database
npx supabase db reset

# Generate TypeScript types from database
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Testing
```bash
# Unit tests
npm test

# E2E tests with Detox
npm run e2e:build
npm run e2e:test

# Type checking
npm run type-check
```

## Development Patterns

### Adding a New Feature Module
```typescript
// src/features/[feature-name]/
// ├── components/     # Feature-specific components
// ├── hooks/          # Feature-specific hooks
// ├── screens/        # Feature screens if needed
// ├── utils/          # Feature utilities
// ├── types.ts        # Feature types
// └── index.ts        # Public API
```

### API Integration Patterns

#### Supabase Client Setup
```typescript
// src/data/supabase.ts
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  Config.SUPABASE_URL!,
  Config.SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

#### React Query Setup for React Native
```typescript
// src/data/queryClient.ts
import { QueryClient } from '@tanstack/react-query'
import NetInfo from '@react-native-community/netinfo'
import { onlineManager, focusManager } from '@tanstack/react-query'
import { AppState, Platform } from 'react-native'

// Configure online status management
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

// Configure focus management
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

AppState.addEventListener('change', onAppStateChange)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
})
```

#### Query Hook Examples
```typescript
// Basic query
export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('name')
      
      if (error) throw error
      return data
    },
  })
}

// Query with filters
export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          account:accounts(id, name),
          category:categories(id, name)
        `)
        .order('ts', { ascending: false })
      
      if (filters?.accountId) {
        query = query.eq('account_id', filters.accountId)
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('ts', filters.dateRange.start)
          .lte('ts', filters.dateRange.end)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: true,
  })
}
```

#### Mutation Patterns
```typescript
// Basic mutation with optimistic updates
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onMutate: async (updatedTransaction) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] })
      
      const previousTransactions = queryClient.getQueryData(['transactions'])
      
      queryClient.setQueryData(['transactions'], (old: any[]) => {
        return old?.map(txn => 
          txn.id === updatedTransaction.id 
            ? { ...txn, ...updatedTransaction }
            : txn
        )
      })
      
      return { previousTransactions }
    },
    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
```

#### Real-time Subscriptions
```typescript
// src/features/transactions/hooks/useRealtimeTransactions.ts
export const useRealtimeTransactions = () => {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData(['transactions'], (old: any[]) => {
              return [payload.new, ...(old || [])]
            })
          } else if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(['transactions'], (old: any[]) => {
              return old?.map(txn => 
                txn.id === payload.new.id ? payload.new : txn
              ) || []
            })
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
```

### Offline-First Pattern
```typescript
// Offline Queue Manager
class OfflineQueueManager {
  private readonly QUEUE_KEY = '@offline_queue'
  
  async addToQueue(operation: QueuedOperation) {
    const queue = await this.getQueue()
    queue.push({ ...operation, id: uuidv4(), timestamp: Date.now() })
    await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue))
    this.syncIfOnline()
    return operation
  }
  
  async syncIfOnline() {
    const state = await NetInfo.fetch()
    if (state.isConnected) {
      await this.processQueue()
    }
  }
}

// Offline-first mutation hook
export const useOfflineCreateTransaction = () => {
  const queryClient = useQueryClient()
  const [isOnline, setIsOnline] = useState(true)
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(!!state.isConnected)
    })
    return unsubscribe
  }, [])
  
  return useMutation({
    mutationFn: async (transaction: TablesInsert<'transactions'>) => {
      if (!isOnline) {
        const queued = await offlineQueue.addToQueue({
          type: 'create',
          table: 'transactions',
          data: transaction,
        })
        return { ...transaction, id: queued.id, synced: false }
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single()
      
      if (error) throw error
      return { ...data, synced: true }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['transactions'], (old: any[]) => {
        return [data, ...(old || [])]
      })
    },
  })
}
```

### Form Validation Pattern
```typescript
// Using react-hook-form + zod
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const transactionSchema = z.object({
  amount: z.number().positive(),
  date: z.date().max(new Date()),
  description: z.string().min(1),
  category_id: z.string().uuid(),
  account_id: z.string().uuid(),
  txn_type: z.enum(['income', 'expense']),
});
```

## Performance Guidelines

### Core Metrics
- **Target:** <100ms tap-to-first-feedback
- **Lists:** Use FlatList with getItemLayout for known heights
- **Images:** Lazy load, use appropriate formats
- **Charts:** Memoize calculations, use InteractionManager for heavy renders
- **Navigation:** Lazy load screens, use React.memo for expensive components

### Performance Optimizations

#### Query Key Factory Pattern
```typescript
// src/data/queryKeys.ts
export const queryKeys = {
  all: ['finance'] as const,
  
  accounts: () => [...queryKeys.all, 'accounts'] as const,
  account: (id: string) => [...queryKeys.accounts(), id] as const,
  
  transactions: () => [...queryKeys.all, 'transactions'] as const,
  transaction: (id: string) => [...queryKeys.transactions(), id] as const,
  transactionsByAccount: (accountId: string) => 
    [...queryKeys.transactions(), 'by-account', accountId] as const,
  
  budgets: () => [...queryKeys.all, 'budgets'] as const,
  budget: (id: string) => [...queryKeys.budgets(), id] as const,
  budgetSpending: (id: string) => [...queryKeys.budget(id), 'spending'] as const,
}
```

#### React Native Screen Focus Management
```typescript
// src/hooks/useRefreshOnFocus.ts
import { useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'

export const useRefreshOnFocus = <T>(
  refetch: () => Promise<T>
) => {
  const firstTimeRef = useRef(true)
  
  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false
        return
      }
      
      refetch()
    }, [refetch])
  )
}
```

#### List Virtualization
```typescript
// Use FlashList for large lists
import { FlashList } from "@shopify/flash-list"

<FlashList
  data={transactions}
  renderItem={renderTransaction}
  estimatedItemSize={80}
  keyExtractor={(item) => item.id}
/>
```

## Security Patterns

### Row Level Security (RLS)
```sql
-- Apply to all user tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see own accounts" ON accounts
  FOR ALL USING (auth.uid() = user_id);
```

### Secure Storage
```typescript
// Use react-native-keychain for sensitive data
import * as Keychain from 'react-native-keychain';

// Store
await Keychain.setInternetCredentials(
  'app.finance.tracker',
  'user_session',
  encryptedSession
);

// Retrieve
const credentials = await Keychain.getInternetCredentials('app.finance.tracker');
```

## Current Implementation Status

### Completed
- [x] Project structure defined
- [x] Database schema designed
- [x] UI/UX mockups completed
- [x] Requirements documented
- [x] React Native project initialized with TypeScript
- [x] Supabase backend fully configured
- [x] Authentication flow working (sign up, sign in, sign out)
- [x] Database tables created with RLS policies
- [x] Deep linking configured for auth callbacks
- [x] App successfully running on Android emulator
- [x] Design system and UI components (Task 4)
  - Complete theme system with colors, typography, spacing
  - Base UI components: Card, Pill, Button, Input
  - Dark mode support with ThemeProvider
  - Component showcase for testing

### In Progress
- [ ] Navigation structure implementation (Task 5)
- [ ] Home dashboard screen

### Next Steps (Priority Order)
1. Implement 5-tab bottom navigation with icons
2. Create Home dashboard with wealth card and stats
3. Build Account management screens
4. Implement Transaction entry and list
5. Add Budget creation and tracking
6. Create Insights/Analytics views

## Testing Strategy

### Testing Stack
```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.4.0",
    "@testing-library/jest-native": "^5.4.3",
    "@testing-library/react-hooks": "^8.0.1",
    "jest": "^29.7.0",
    "jest-expo": "^49.0.0",
    "detox": "^20.13.0",
    "nock": "^13.3.0",
    "msw": "^2.0.0"
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
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
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

### Test Examples

#### Component Testing
```typescript
// src/features/accounts/__tests__/AccountCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { AccountCard } from '../components/AccountCard'

describe('AccountCard', () => {
  it('renders account information correctly', () => {
    const { getByText } = render(
      <AccountCard account={mockAccount} />
    )
    
    expect(getByText(mockAccount.name)).toBeTruthy()
    expect(getByText('$1,234.56')).toBeTruthy()
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
})
```

#### Hook Testing
```typescript
// src/features/accounts/__tests__/useAccounts.test.ts
import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccounts } from '../hooks/useAccounts'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  
  return ({ children }) => (
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
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    
    expect(result.current.data).toHaveLength(3)
  })
})
```

#### E2E Testing with Detox
```javascript
// e2e/tests/transactions.e2e.js
describe('Transaction Flow', () => {
  beforeAll(async () => {
    await device.launchApp()
    await signIn('test@example.com', 'password123')
  })
  
  it('should add a new transaction', async () => {
    await element(by.id('tab-transactions')).tap()
    await element(by.id('add-transaction-fab')).tap()
    
    await element(by.id('amount-input')).typeText('25.50')
    await element(by.id('description-input')).typeText('Lunch')
    await element(by.id('category-selector')).tap()
    await element(by.text('Food & Dining')).tap()
    
    await element(by.id('save-transaction')).tap()
    
    await expect(element(by.text('Lunch'))).toBeVisible()
    await expect(element(by.text('$25.50'))).toBeVisible()
  })
})
```

### Testing Commands
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testMatch='**/*.integration.test.{ts,tsx}'",
    "e2e:build:android": "detox build -c android.emu.debug",
    "e2e:test:android": "detox test -c android.emu.debug"
  }
}
```

## Feature Flags

```typescript
// Check feature availability
const isFeatureEnabled = async (key: string): boolean => {
  const { data } = await supabase
    .from('feature_flags')
    .select('enabled')
    .eq('key', key)
    .single();
  
  return data?.enabled ?? false;
};

// Current flags:
// - bank_sync: Bank account synchronization (future)
// - advanced_analytics: ML-powered insights
// - multi_user: Family account sharing
```

## Troubleshooting

### Common Issues

**Build failures on Android:**
```bash
cd android && ./gradlew clean
cd .. && npm run android
```

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

**Supabase connection issues:**
- Check `.env` file for correct URLs and keys
- Verify RLS policies aren't blocking queries
- Check network connectivity

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Supabase Docs](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Query](https://tanstack.com/query/latest)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)

## Contact & Support

Project: Personal Finance Tracker
Platform: Android (React Native)
Backend: Supabase
Status: MVP Development