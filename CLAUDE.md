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