# React Performance & Profiling POC

A study project on React performance and profiling. Demonstrates common performance problems, how to identify them with tooling, and how to fix them.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and toggle between **Before** and **After** in the top navigation.

---

## Profiling Tools

### React DevTools Profiler

The main tool for measuring React performance.

1. Install the **React Developer Tools** extension for Chrome/Firefox
2. Open DevTools → **Profiler** tab
3. Click **Record** (red circle)
4. Interact with the page (e.g. type in the search field)
5. Click **Stop**
6. Analyze the flamegraph: each bar is a component, width indicates render time

**Useful settings:**
- "Highlight updates when components render" → flashes components that re-rendered
- "Record why each component rendered" → shows the reason for each re-render

### `why-did-you-render`

Library that logs to the console when a component re-renders with the same props.

To enable, uncomment the line in `src/main.tsx`:

```ts
import './wdyr'
```

Open the browser console and interact with the page — you will see logs like:
```
TaskItem re-rendered with the same props
```

### Web Vitals

Standardized UX metrics (Core Web Vitals):

| Metric | What it measures | Target |
|---|---|---|
| **LCP** | Largest Contentful Paint — time until the largest element loads | < 2.5s |
| **CLS** | Cumulative Layout Shift — visual stability of the page | < 0.1 |
| **INP** | Interaction to Next Paint — responsiveness to clicks/keystrokes | < 200ms |

To measure, use the `web-vitals` library or the **Web Vitals** Chrome extension.

---

## Problems and Solutions

### 1. Unnecessary re-renders → `React.memo`

**Problem:** When a parent component re-renders, all children re-render too, even if their props didn't change.

```tsx
// BEFORE: TaskItem re-renders on every parent change
function TaskItem({ task }: Props) { ... }

// AFTER: only re-renders if `task` changes
const TaskItem = memo(function TaskItem({ task }: Props) { ... })
```

**See in Profiler:** in the Before version, `TaskItem` appears in the flamegraph even when tasks haven't changed.

---

### 2. Function recreated on every render → `useCallback`

**Problem:** functions defined inside a component are recreated on every render. This breaks `React.memo` on children, since the reference is always new.

```tsx
// BEFORE: new function on every render → memo doesn't work
<SearchBar onSearch={(value) => setSearch(value)} />

// AFTER: stable reference
const handleSearch = useCallback((value: string) => setSearch(value), [setSearch])
<SearchBar onSearch={handleSearch} />
```

**When to use:** only worth it when the function is passed as a prop to a component wrapped in `React.memo`.

---

### 3. Heavy calculation on every render → `useMemo`

**Problem:** expensive computations (aggregations, filters, transformations) run on every render even when their inputs haven't changed.

```tsx
// BEFORE: runs on every Dashboard render
const computed = expensiveStatsCalc(stats)

// AFTER: only runs when `stats` changes
const computed = useMemo(() => expensiveStatsCalc(stats), [stats])
```

**Where it is in the code:** `src/components/Stats/Stats.tsx` — `expensiveStatsCalc` intentionally blocks the thread for ~8ms to make the cost visible in the Profiler.

---

### 4. Long list in the DOM → Virtualization (`react-window`)

**Problem:** rendering 10,000 items creates 10,000 DOM nodes, consuming memory and freezing scroll.

```tsx
// BEFORE: all 10,000 items in the DOM
{tasks.map((task) => <TaskItem key={task.id} task={task} />)}

// AFTER: react-window renders only ~10 visible items
<FixedSizeList
  height={500}
  itemCount={tasks.length}
  itemSize={72}
  itemData={tasks}
>
  {Row}
</FixedSizeList>
```

**See:** in DevTools → Elements, compare how many `.item` nodes exist in Before vs After.

---

### 5. Large bundle → `React.lazy + Suspense`

**Problem:** all JS code is loaded at once, even parts the user may never visit.

```tsx
// BEFORE: static import — always in the initial bundle
import { HeavyComponent } from './HeavyComponent'

// AFTER: loaded only when needed
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

---

## Project structure

```
src/
├── data/tasks.ts                    # Generator for 10,000 mock tasks
├── hooks/useTasks.ts                # Filter and search logic
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx            # Version with problems (Before)
│   │   └── DashboardOptimized.tsx   # Optimized version (After)
│   ├── TaskList/
│   │   ├── TaskList.tsx             # List without virtualization
│   │   ├── TaskListOptimized.tsx    # List with react-window
│   │   └── TaskItem.tsx             # Item (+ memoized version)
│   ├── SearchBar/SearchBar.tsx      # Search input and filters
│   └── Stats/Stats.tsx              # Stats cards + expensive calculation
├── pages/
│   ├── BeforePage.tsx
│   └── AfterPage.tsx
├── wdyr.ts                          # why-did-you-render setup
└── main.tsx
```

## Golden rules

| Situation | Tool |
|---|---|
| Child component with props that rarely change | `React.memo` |
| Function passed as prop to a memoized component | `useCallback` |
| Expensive calculation with specific dependencies | `useMemo` |
| List with hundreds/thousands of items | `react-window` or `react-virtual` |
| Route or component that is rarely accessed | `React.lazy + Suspense` |

> **Warning:** don't optimize prematurely. Measure first with the Profiler, then apply the solution.
