# API.md - Supabase Query Patterns & Integration Guide

## Overview

This document provides comprehensive Supabase query patterns and API integration guidelines for the Personal Finance Tracker React Native application. It follows TanStack Query (React Query) best practices for data fetching, caching, and state management.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Query Patterns](#query-patterns)
3. [Mutation Patterns](#mutation-patterns)
4. [Real-time Subscriptions](#real-time-subscriptions)
5. [Offline Support](#offline-support)
6. [Error Handling](#error-handling)
7. [Type Safety](#type-safety)
8. [Performance Optimization](#performance-optimization)

## Initial Setup

### Supabase Client Configuration

```typescript
// src/data/supabase.ts
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '@/types/supabase'
import Config from 'react-native-config'

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

### React Query Setup for React Native

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

// Configure focus management for app state changes
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
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

## Query Patterns

### Basic Query Hook

```typescript
// src/features/accounts/hooks/useAccounts.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/data/supabase'
import { Tables } from '@/types/supabase'

type Account = Tables<'accounts'>

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
```

### Query with Filters

```typescript
// src/features/transactions/hooks/useTransactions.ts
interface TransactionFilters {
  accountId?: string
  categoryId?: string
  dateRange?: { start: string; end: string }
  txnType?: 'income' | 'expense' | 'transfer'
}

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
      
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('ts', filters.dateRange.start)
          .lte('ts', filters.dateRange.end)
      }
      
      if (filters?.txnType) {
        query = query.eq('txn_type', filters.txnType)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: true,
  })
}
```

### Paginated Query with Infinite Scroll

```typescript
// src/features/transactions/hooks/useInfiniteTransactions.ts
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 20

export const useInfiniteTransactions = () => {
  return useInfiniteQuery({
    queryKey: ['transactions', 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, accounts(name), categories(name)')
        .order('ts', { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1)
      
      if (error) throw error
      return data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === PAGE_SIZE 
        ? allPages.length * PAGE_SIZE 
        : undefined
    },
  })
}
```

### Dependent Queries

```typescript
// src/features/budgets/hooks/useBudgetWithSpending.ts
export const useBudgetWithSpending = (budgetId: string) => {
  const { data: budget } = useQuery({
    queryKey: ['budgets', budgetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budgetId)
        .single()
      
      if (error) throw error
      return data
    },
  })

  const { data: spending } = useQuery({
    queryKey: ['budgets', budgetId, 'spending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_budget_spending', { budget_id: budgetId })
      
      if (error) throw error
      return data
    },
    enabled: !!budget, // Only run when budget is loaded
  })

  return { budget, spending }
}
```

## Mutation Patterns

### Basic Mutation

```typescript
// src/features/accounts/hooks/useCreateAccount.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase'

type AccountInsert = TablesInsert<'accounts'>

export const useCreateAccount = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (account: AccountInsert) => {
      const { data, error } = await supabase
        .from('accounts')
        .insert(account)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['net-worth'] })
    },
  })
}
```

### Optimistic Updates

```typescript
// src/features/transactions/hooks/useUpdateTransaction.ts
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'transactions'> & { id: string }) => {
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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['transactions'] })
      
      // Snapshot previous value
      const previousTransactions = queryClient.getQueryData(['transactions'])
      
      // Optimistically update
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
      // Rollback on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
```

### Batch Operations

```typescript
// src/features/transactions/hooks/useBulkCategorize.ts
export const useBulkCategorize = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      transactionIds, 
      categoryId 
    }: { 
      transactionIds: string[]
      categoryId: string 
    }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update({ category_id: categoryId })
        .in('id', transactionIds)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
```

## Real-time Subscriptions

### Basic Real-time Hook

```typescript
// src/features/transactions/hooks/useRealtimeTransactions.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export const useRealtimeTransactions = () => {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        },
        (payload: RealtimePostgresChangesPayload<Tables<'transactions'>>) => {
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
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['transactions'], (old: any[]) => {
              return old?.filter(txn => txn.id !== payload.old.id) || []
            })
          }
          
          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ['accounts'] })
          queryClient.invalidateQueries({ queryKey: ['budgets'] })
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
```

### Presence (Collaborative Features)

```typescript
// src/features/shared/hooks/usePresence.ts
export const usePresence = (budgetId: string) => {
  const [presenceState, setPresenceState] = useState<any>({})
  
  useEffect(() => {
    const channel = supabase.channel(`budget:${budgetId}`)
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setPresenceState(state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: supabase.auth.user()?.id,
            online_at: new Date().toISOString(),
          })
        }
      })
    
    return () => {
      channel.unsubscribe()
    }
  }, [budgetId])
  
  return presenceState
}
```

## Offline Support

### Offline Queue Manager

```typescript
// src/data/offline/queueManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { v4 as uuidv4 } from 'uuid'

interface QueuedOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  table: string
  data: any
  timestamp: number
}

class OfflineQueueManager {
  private readonly QUEUE_KEY = '@offline_queue'
  
  async addToQueue(operation: Omit<QueuedOperation, 'id' | 'timestamp'>) {
    const queuedOp: QueuedOperation = {
      ...operation,
      id: uuidv4(),
      timestamp: Date.now(),
    }
    
    const queue = await this.getQueue()
    queue.push(queuedOp)
    await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue))
    
    // Try to sync if online
    this.syncIfOnline()
    
    return queuedOp
  }
  
  async getQueue(): Promise<QueuedOperation[]> {
    const data = await AsyncStorage.getItem(this.QUEUE_KEY)
    return data ? JSON.parse(data) : []
  }
  
  async syncIfOnline() {
    const state = await NetInfo.fetch()
    if (state.isConnected) {
      await this.processQueue()
    }
  }
  
  async processQueue() {
    const queue = await this.getQueue()
    const failed: QueuedOperation[] = []
    
    for (const operation of queue) {
      try {
        await this.executeOperation(operation)
      } catch (error) {
        console.error('Failed to sync operation:', error)
        failed.push(operation)
      }
    }
    
    // Keep failed operations in queue
    await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(failed))
    
    // Invalidate all queries after sync
    if (queue.length > failed.length) {
      queryClient.invalidateQueries()
    }
  }
  
  private async executeOperation(operation: QueuedOperation) {
    switch (operation.type) {
      case 'create':
        return supabase.from(operation.table).insert(operation.data)
      case 'update':
        return supabase
          .from(operation.table)
          .update(operation.data)
          .eq('id', operation.data.id)
      case 'delete':
        return supabase
          .from(operation.table)
          .delete()
          .eq('id', operation.data.id)
    }
  }
}

export const offlineQueue = new OfflineQueueManager()
```

### Offline-First Mutation

```typescript
// src/features/transactions/hooks/useOfflineCreateTransaction.ts
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
        // Add to offline queue
        const queued = await offlineQueue.addToQueue({
          type: 'create',
          table: 'transactions',
          data: transaction,
        })
        
        // Return optimistic data
        return { ...transaction, id: queued.id, synced: false }
      }
      
      // Online - normal creation
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single()
      
      if (error) throw error
      return { ...data, synced: true }
    },
    onSuccess: (data) => {
      // Add to cache immediately
      queryClient.setQueryData(['transactions'], (old: any[]) => {
        return [data, ...(old || [])]
      })
    },
  })
}
```

## Error Handling

### Global Error Handler

```typescript
// src/data/errorHandler.ts
import { PostgrestError } from '@supabase/supabase-js'
import Toast from 'react-native-toast-message'

export class APIError extends Error {
  code?: string
  details?: string
  hint?: string
  
  constructor(error: PostgrestError) {
    super(error.message)
    this.code = error.code
    this.details = error.details
    this.hint = error.hint
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    // Handle specific error codes
    switch (error.code) {
      case '23505': // Unique violation
        Toast.show({
          type: 'error',
          text1: 'Duplicate Entry',
          text2: 'This item already exists',
        })
        break
      case '23503': // Foreign key violation
        Toast.show({
          type: 'error',
          text1: 'Reference Error',
          text2: 'Related data not found',
        })
        break
      case '42501': // Insufficient privilege
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'You do not have access to this resource',
        })
        break
      default:
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong',
        })
    }
  } else {
    Toast.show({
      type: 'error',
      text1: 'Unexpected Error',
      text2: 'Please try again later',
    })
  }
  
  // Log to error tracking service
  console.error('API Error:', error)
}
```

### Query Error Boundary

```typescript
// src/components/QueryErrorBoundary.tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

export const QueryErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorMessage}>{error.message}</Text>
              <Button 
                title="Try again" 
                onPress={() => {
                  resetErrorBoundary()
                  reset()
                }}
              />
            </View>
          )}
          onReset={reset}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

## Type Safety

### Generated Types Usage

```typescript
// src/features/accounts/types.ts
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'

// Read types
export type Account = Tables<'accounts'>
export type Transaction = Tables<'transactions'>
export type Budget = Tables<'budgets'>

// Insert types
export type AccountInsert = TablesInsert<'accounts'>
export type TransactionInsert = TablesInsert<'transactions'>

// Update types
export type AccountUpdate = TablesUpdate<'accounts'>
export type TransactionUpdate = TablesUpdate<'transactions'>

// Custom types for joined queries
export interface TransactionWithRelations extends Transaction {
  account: Pick<Account, 'id' | 'name'>
  category: Pick<Category, 'id' | 'name'>
}
```

### Type-safe RPC Calls

```typescript
// src/features/insights/hooks/useMonthlyStats.ts
interface MonthlyStats {
  month: string
  income: number
  expenses: number
  savings: number
  savings_rate: number
}

export const useMonthlyStats = (year: number) => {
  return useQuery({
    queryKey: ['monthly-stats', year],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_monthly_stats', { 
          year_param: year 
        })
        .returns<MonthlyStats[]>()
      
      if (error) throw error
      return data
    },
  })
}
```

## Performance Optimization

### Query Key Factory

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
  
  insights: () => [...queryKeys.all, 'insights'] as const,
  netWorth: () => [...queryKeys.insights(), 'net-worth'] as const,
  monthlyStats: (year: number) => 
    [...queryKeys.insights(), 'monthly-stats', year] as const,
}
```

### Selective Query Invalidation

```typescript
// src/features/transactions/hooks/useSmartInvalidation.ts
export const useSmartInvalidation = () => {
  const queryClient = useQueryClient()
  
  return {
    invalidateTransaction: (transactionId: string, accountId: string) => {
      // Invalidate specific transaction
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.transaction(transactionId) 
      })
      
      // Invalidate transactions list
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.transactions() 
      })
      
      // Invalidate affected account
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.account(accountId) 
      })
      
      // Invalidate insights but not immediately
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.insights(),
        refetchType: 'none' // Don't refetch until needed
      })
    }
  }
}
```

### Prefetching Strategy

```typescript
// src/features/home/hooks/usePrefetchDashboard.ts
export const usePrefetchDashboard = () => {
  const queryClient = useQueryClient()
  
  const prefetchDashboardData = async () => {
    // Prefetch in parallel
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.accounts(),
        queryFn: fetchAccounts,
        staleTime: 10 * 60 * 1000, // 10 minutes
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.budgets(),
        queryFn: fetchBudgets,
        staleTime: 10 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.netWorth(),
        queryFn: fetchNetWorth,
        staleTime: 5 * 60 * 1000,
      }),
    ])
  }
  
  return { prefetchDashboardData }
}
```

### React Native Screen Focus Management

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

// Usage in screen component
const TransactionsScreen = () => {
  const { data, refetch } = useTransactions()
  useRefreshOnFocus(refetch)
  
  return <TransactionsList data={data} />
}
```

## Best Practices

### 1. Query Composition
- Keep queries small and focused
- Use query composition for complex data needs
- Leverage React Query's caching for shared data

### 2. Mutation Strategies
- Always use optimistic updates for better UX
- Implement proper rollback mechanisms
- Queue offline mutations for sync

### 3. Real-time Considerations
- Use real-time sparingly (performance cost)
- Combine with polling for less critical updates
- Clean up subscriptions properly

### 4. Error Handling
- Provide meaningful error messages
- Implement retry logic with exponential backoff
- Log errors for monitoring

### 5. Performance
- Use selective invalidation
- Implement proper pagination
- Prefetch critical data
- Disable queries on unfocused screens

## Migration Scripts

### Generate TypeScript Types

```bash
# Generate types from your Supabase database
npx supabase gen types typescript --local > src/types/supabase.ts

# Or from remote database
npx supabase gen types typescript --project-id "your-project-id" > src/types/supabase.ts
```

### Database Functions

```sql
-- Example: Get budget spending
CREATE OR REPLACE FUNCTION get_budget_spending(budget_id UUID)
RETURNS TABLE (
  spent NUMERIC,
  percentage_used NUMERIC,
  remaining NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(t.amount), 0) as spent,
    CASE 
      WHEN b.limit_amount > 0 
      THEN (COALESCE(SUM(t.amount), 0) / b.limit_amount * 100)
      ELSE 0 
    END as percentage_used,
    b.limit_amount - COALESCE(SUM(t.amount), 0) as remaining
  FROM budgets b
  LEFT JOIN budget_entries be ON be.budget_id = b.id
  LEFT JOIN transactions t ON t.category_id = be.category_id
    AND t.ts >= b.start_date 
    AND t.ts <= b.end_date
    AND t.txn_type = 'expense'
  WHERE b.id = budget_id
  GROUP BY b.id, b.limit_amount;
END;
$$ LANGUAGE plpgsql;
```

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [React Native NetInfo](https://github.com/react-native-netinfo/react-native-netinfo)
- [React Navigation](https://reactnavigation.org/docs/getting-started)