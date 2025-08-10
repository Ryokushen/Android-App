# Personal Finance Tracker — Design Document
_Last updated: 2025-08-10_

## 0) Purpose & Scope
This document describes the product/UX design and technical architecture for a **personal-use** Android finance app built in **React Native** with a **Supabase** backend. It reflects the current interactive mockup and aligns to the shared `requirements.md` (R1–R10). The MVP is **manual transaction entry** (no bank sync), a clean, modern UI, and strong offline support.

---

## 1) Product Overview
- **Platform:** React Native (Android-first). The mockup demonstrates visual/interaction patterns that map to RN components.
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security).
- **User model:** Single user (you) with manual entry; future connectors are behind feature flags.
- **Visual tone:** Warm, modern, creamy palette (purples/teals/oranges), rounded corners, subtle elevation, soft gradients, and gentle motion.

**Core value:** 1) Capture transactions quickly; 2) visualize budgets & cash flow; 3) track accounts, debts, subscriptions, investments; 4) produce simple insights and exports.

---

## 2) Information Architecture & Navigation
**Bottom tab bar** (no top nav) with 5 tabs:

1. **Home**
   - **Total Wealth card (compact)** with:
     - Net worth headline (≈30% smaller than initial).
     - **Micro-stat pills:** Assets total, Debt total, Cash on hand, Accounts count.
     - **Mini net worth chart** (area line with soft gradient fill) + month labels.
     - “Last 7d spend” micro-label.
   - **Upcoming** renewals (subscriptions) with date + cost.
   - **Budgets preview** (BarMini x2–3).
   - **Quick Accounts** (4 cards) with balance colorization.
   - **Goals strip** with circular progress rings.

2. **Transactions**
   - Search input.
   - **Swipe Tips row** (educational chips).
   - Transaction list: title, date·account, category chip, signed amount color-coded.

3. **Budgets**
   - Top “This Month” overview (4-column stack bars).
   - Per-budget cards: used/limit; progress bar with gradient; warning at 100%+; % used.

4. **Accounts**
   - Card grid with balances.
   - For credit cards/loans: **“Pay by”** pill and **Interest YTD** pill.
   - (Per your request: **no sparklines**.)

5. **Insights**
   - Donut chart of spend by category + legend.
   - Income vs Expense bars (6 months).
   - KPI tiles (Savings Rate, DTI, Net Worth MoM).

**Header:** Title “Personal Finance”, status **Manual Entry** (purple dot). “Pro” badge removed.

**FAB (floating action button):** Contextual label by tab:
- Home/Transactions → _Add Transaction_
- Budgets → _New Budget_
- Accounts → _New Account_
- Insights → _Export Report_

**Notifications:** Occasional contextual banners; **dismissable**.

---

## 3) Key Interactions
- **Manual add transaction** via FAB:
  - Fields: amount, date, description, category (select/create), account, type (income/expense).
  - Validation: numeric amount, date not in the future.
  - On save: writes to Supabase; balances update immediately (optimistic).
- **Search & filters:** Transactions filter by description/category/account; budgets by time period.
- **Gestures:** (RN) swipe row actions (categorize/delete), long-press to split.
- **Feedback:** Budget threshold warnings, goal milestones; loading shimmers for async ops.
- **Performance target:** <100ms for local interactions; virtualization for large lists.

---

## 4) Data Model (Supabase)
> All tables include `user_id uuid not null` referencing `auth.users(id)`; protect with RLS.

### 4.1 Tables
- **accounts**
  - `id uuid pk`, `user_id`, `name text`, `type enum(checking|savings|credit_card|loan|investment|cash)`,
  - `balance numeric`, `apr numeric`, `credit_limit numeric`, `archived_at timestamptz`
- **transactions**
  - `id uuid pk`, `user_id`, `ts timestamptz`, `amount numeric`, `description text`,
  - `txn_type text check(income|expense)`, `account_id uuid fk`, `category_id uuid fk`, `meta jsonb`
- **categories**
  - `id uuid pk`, `user_id`, `name text`, `parent_id uuid`
- **budgets**
  - `id uuid pk`, `user_id`, `name text`, `period text(monthly|weekly|custom)`,
  - `start_date date`, `end_date date`, `limit numeric`
- **budget_entries** (many-to-many between budgets and categories)
  - `id uuid pk`, `user_id`, `budget_id uuid fk`, `category_id uuid fk`
- **subscriptions**
  - `id uuid pk`, `user_id`, `name text`, `cost numeric`, `frequency text(monthly|yearly|custom)`,
  - `payment_method uuid(account_id)`, `next_renewal date`
- **debts**
  - `id uuid pk`, `user_id`, `name text`, `type text(loan|cc)`, `principal numeric`, `apr numeric`,
  - `min_payment numeric`, `due_day int`, `snowball_order int`
- **investment_accounts**
  - `id uuid pk`, `user_id`, `name text`, `type text(brokerage|retirement|crypto)`
- **holdings**
  - `id uuid pk`, `user_id`, `investment_account_id uuid fk`, `symbol text`,
  - `qty numeric`, `cost_basis numeric`, `current_value numeric`
- **goals**
  - `id uuid pk`, `user_id`, `name text`, `target numeric`, `current numeric`, `color text`
- **feature_flags**
  - `key text pk`, `enabled bool`, `user_id uuid null` (null → global)

### 4.2 Schema snippets
```sql
create type account_type as enum ('checking','savings','credit_card','loan','investment','cash');

create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type account_type not null,
  balance numeric not null default 0,
  apr numeric,
  credit_limit numeric,
  archived_at timestamptz
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ts timestamptz not null,
  amount numeric not null,
  description text,
  txn_type text check (txn_type in ('income','expense')) not null,
  account_id uuid not null references accounts(id) on delete cascade,
  category_id uuid references categories(id),
  meta jsonb default '{}'::jsonb
);

-- RLS example
alter table accounts enable row level security;
create policy "owner read" on accounts for select using (auth.uid() = user_id);
create policy "owner write" on accounts for insert with check (auth.uid() = user_id);
create policy "owner update" on accounts for update using (auth.uid() = user_id);
create policy "owner delete" on accounts for delete using (auth.uid() = user_id);
````

### 4.3 Views & RPCs

* **View** `v_budget_spend(period)` → aggregates spend by category for a given budget period.
* **View** `v_net_worth_monthly` → snapshot balances at month end for charts.
* **RPC** `upsert_transaction(json)` → validates and inserts with category inference.
* **RPC** `recalc_debt_schedule(debt_id)` → recompute payoff after extra payments.

---

## 5) State Management, Caching, Offline

* **React Query/TanStack Query** for server state (RN equivalent).
* **Local-first storage** (SQLite/AsyncStorage) for offline add + later sync.
* **Optimistic updates** for transactions & balances; reconcile on server ack.
* **Selectors** for derived stats: net worth, assets vs debt, cash on hand, last 7d spend.
* **Feature flags** fetched at startup to toggle modules.

---

## 6) Charts & Rendering

* **RN implementation:** `react-native-svg` (and `react-native-reanimated` if needed for perf).
* Components mapping:

  * **LineSpark** → mini **area** line (soft gradient fill) for net worth on Home.
  * **Donut** → spend by category with hover/press effects.
  * **BarMini** → budget progress with animated width + gradient.
  * **GoalRing** → circular progress for goals.

**Net Worth Series Logic:** sum monthly deltas (`income - expense`) from a computed start value so the final chart point equals the current net worth.

---

## 7) Security, Privacy, Reliability

* **Auth:** Supabase Auth (email/pass or passkey). Short sessions; refresh tokens.
* **RLS:** Strict per-table policies (owner-only).
* **Encryption:** TLS in transit; at-rest managed by Supabase/Postgres. Never store secrets in the client.
* **PII minimization:** Manual-entry only; no bank credentials.
* **Backup/Export:** CSV/JSON export from Insights; local file + share sheet.

---

## 8) Performance & Quality

* **Targets:** <100ms tap-to-first-feedback; avoid jank; virtualize long lists.
* **Async UX:** show skeletons/shimmers and concise banners on errors.
* **Testing:**

  * Unit tests for helpers (formatting, clamp, series generation).
  * Snapshot tests for critical cards.
  * E2E (Detox) for tab nav, add-transaction, and budget update flows.
  * Contract tests for RPCs/views.

---

## 9) Accessibility & i18n

* Respect system font scale (Dynamic Type).
* Provide numeric/aria summaries for charts.
* WCAG AA contrast for text; do not rely on color alone for meaning.
* Reduced motion setting dampens animated gradients.
* Date/amount formatting via locale; currency configurable later.

---

## 10) Design System (Tokens)

* **Colors:** `primary=#a855f7`, `accent=#14b8a6`, `warn=#f97316`, `danger=#ef4444`, neutrals in “stone/amber” families.
* **Elevation:** 0/2/4/8 soft shadows (avoid heavy shadows on low-end devices).
* **Radius:** `xl → 2xl` for cards and pills.
* **Spacing:** 4/8/12/16/24 scale; card paddings ≈12–16dp.
* **Motion:** Quick, subtle, reversible; avoid complex transitions in lists.

---

## 11) Mapping to Requirements (R1–R10)

* **R1 Transactions:** Manual add form; validate amount/date; immediate balance updates; pick/create category; list filters.
* **R2 Budgets:** Set limits by period; progress bars; threshold notifications; auto period rollover; history.
* **R3 Accounts:** Types (checking/savings/credit/loan/investment/cash); account cards; net worth calc; edit/archive/primary.
* **R4 Debts:** Debt entity; avalanche/snowball payoff; projected payoff dates; extra payments recalc; progress visuals.
* **R5 Subscriptions:** Capture cost/frequency/payment method; auto transactions on renewal; totals; upcoming; notifications.
* **R6 Investments:** Manual positions (qty/cost/current); portfolio value; gains/losses; history; allocation breakdowns.
* **R7 Extensibility:** Modular feature folders; feature flags; plugin-like architecture; consistent naming and docs.
* **R8 Security & Sync:** Supabase Auth; RLS; encrypted transport; offline cache; secure export.
* **R9 Mobile UX:** Bottom tabs; responsive interactions; light/dark theme; charts and indicators; friendly errors.
* **R10 Reporting/Insights:** Spend by category; income vs expense; cash flow; MoM/YoY comparisons; savings rate, DTI, net worth growth.

---

## 12) Application Architecture

```
app/
  core/            # theme, colors, typography, icons, routes
  data/            # api clients, queries, mutations, local cache
  features/
    accounts/
    budgets/
    debts/
    insights/
    investments/
    subscriptions/
    transactions/
    goals/
  ui/              # atoms: Card, Pill, BarMini, GoalRing, Donut, LineSpark
  screens/         # Home, Transactions, Budgets, Accounts, Insights
```

* **Navigation:** React Navigation bottom tabs; stack per tab if needed.
* **Forms:** react-hook-form + zod; numeric keypad for amount.
* **Gestures:** react-native-gesture-handler + reanimated for swipes.

---

## 13) Offline-first Strategy

* Queue offline mutations (transactions/budgets).
* Generate UUIDv4 client-side.
* On reconnect, sync via “client-wins” (personal app), with conflict warnings for manual resolution.

---

## 14) Analytics & Telemetry (Optional)

* Local-only counters for personal trends; no third-party trackers by default.
* Developer diagnostics (debug mode) for timing, retry counts, cache hits.

---

## 15) Roadmap (Next)

1. Transaction split UX (long-press).
2. Budget alerts with snooze + per-category thresholds.
3. Debt payoff simulator (avalanche/snowball) with timeline.
4. CSV/JSON export wizard (range + entities).
5. Optional import (YNAB/CSV) behind feature flag.
6. Dark theme and theme editor (tune warm palette).

---

## 16) Open Questions

* **Dismissed banners:** Should dismissal snooze future banners for N hours?
* **Investments refresh:** Manual-only vs. optional quotes (feature flag)?
* **Exports:** CSV default; JSON optional; do you want PDF reports later?

---

## 17) Example Client Types

```ts
type AccountType = 'checking'|'savings'|'credit_card'|'loan'|'investment'|'cash';
type TransactionType = 'income'|'expense';

type Account = {
  id: string; name: string; type: AccountType; balance: number;
  apr?: number; creditLimit?: number; archivedAt?: string;
};
type Transaction = {
  id: string; ts: string; amount: number; description?: string;
  txnType: TransactionType; accountId: string; categoryId?: string;
};
type Budget = { id: string; name: string; startDate: string; endDate: string; limit: number };
type Subscription = { id: string; name: string; cost: number; frequency: string; paymentMethod?: string; nextRenewal: string };
type Debt = { id: string; name: string; principal: number; apr: number; minPayment: number; dueDay: number };
type Goal = { id: string; name: string; target: number; current: number; color?: string };
```

---

## 18) Test Plan (MVP)

* **Unit:** `fmtPct` clamping, net worth series last point == current net worth, budget % calc.
* **Component:** BarMini width anim; GoalRing dasharray; Donut slice sum; LineSpark area path.
* **E2E:** Add transaction updates account balance; budget progress updates; tabs switch; notifications dismiss.
* **Regression:** Ensure “Pay by” and “Interest YTD” pills show only for credit/loan types.

```
```
