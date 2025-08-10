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
**BEFORE EVERY TASK:**
1. First read tasks.md with: `cat tasks.md`
2. Identify the current task being worked on
3. Check task dependencies and requirements

**AFTER COMPLETING WORK:**
1. Update tasks.md to mark progress
2. Add any new discovered tasks
3. Update the "Current Status" section below

## Current Task Status
**Active Task:** [Initialize React Native project and core dependencies]
**Task File:** tasks.md (line 3-9)
**Last Updated:** [Timestamp]

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

## Database Schema

### Core Tables
```sql
-- All tables include user_id with RLS policies
accounts (id, user_id, name, type, balance, apr, credit_limit, archived_at)
transactions (id, user_id, ts, amount, description, txn_type, account_id, category_id, meta)
categories (id, user_id, name, parent_id)
budgets (id, user_id, name, period, start_date, end_date, limit)
budget_entries (id, user_id, budget_id, category_id)
subscriptions (id, user_id, name, cost, frequency, payment_method, next_renewal)
debts (id, user_id, name, type, principal, apr, min_payment, due_day, snowball_order)
investment_accounts (id, user_id, name, type)
holdings (id, user_id, investment_account_id, symbol, qty, cost_basis, current_value)
goals (id, user_id, name, target, current, color)
feature_flags (key, enabled, user_id)
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

### Creating a Supabase Query Hook
```typescript
// Example: useAccounts hook
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/data/supabase';

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};
```

### Offline-First Pattern
```typescript
// Queue offline mutations
const mutation = useMutation({
  mutationFn: async (transaction) => {
    if (!isOnline) {
      await queueOfflineTransaction(transaction);
      return transaction;
    }
    return await saveTransaction(transaction);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['transactions']);
  },
});
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

- **Target:** <100ms tap-to-first-feedback
- **Lists:** Use FlatList with getItemLayout for known heights
- **Images:** Lazy load, use appropriate formats
- **Charts:** Memoize calculations, use InteractionManager for heavy renders
- **Navigation:** Lazy load screens, use React.memo for expensive components

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

### In Progress
- [ ] React Native project setup
- [ ] Supabase backend configuration
- [ ] Core UI components
- [ ] Authentication flow

### Next Steps (Priority Order)
1. Initialize React Native project with TypeScript
2. Set up Supabase and implement auth
3. Create database schema and RLS policies
4. Build navigation and main screens
5. Implement account management
6. Add transaction system
7. Build budget tracking

## Testing Strategy

### Unit Tests
- Calculation helpers (net worth, budget percentages)
- Data formatters (currency, dates)
- Validation functions

### Integration Tests
- Supabase queries and mutations
- Offline sync logic
- Auth flow

### E2E Tests (Detox)
- Add transaction flow
- Budget creation and updates
- Account balance updates
- Tab navigation

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