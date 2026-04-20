// =============================================================
// "AFTER" VERSION — Dashboard with optimizations applied
// =============================================================
//
// SOLUTIONS applied:
//
// 1. useMemo for heavy calculation
//    expensiveStatsCalc only runs when `stats` changes reference.
//    In the Profiler: Stats time drops to near 0ms on subsequent renders.
//
// 2. useCallback for functions passed as props
//    References are stable between renders, allowing React.memo
//    on children to skip unnecessary re-renders.
//
// 3. Virtualization with react-window
//    TaskListOptimized renders only ~10 items in the viewport,
//    regardless of how many tasks exist in the array.
//
// How to observe:
//   - Open React DevTools → Profiler tab → Record
//   - Type something in the search field
//   - Compare the flamegraph with the "Before" version

import { useCallback, useMemo } from 'react'
import { useTasks } from '../../hooks/useTasks'
import type { Filters } from '../../hooks/useTasks'
import { SearchBar } from '../SearchBar/SearchBar'
import { Stats, expensiveStatsCalc } from '../Stats/Stats'
import { TaskListOptimized } from '../TaskList/TaskListOptimized'
import styles from './Dashboard.module.css'

export function DashboardOptimized() {
  const { tasks, filters, stats, setSearch, setPriority, setStatus } = useTasks()

  // SOLUTION 1: useMemo — heavy calculation only runs when stats changes
  const computed = useMemo(() => expensiveStatsCalc(stats), [stats])

  // SOLUTION 2: useCallback — stable references prevent re-renders on children
  const handleSearch = useCallback((value: string) => setSearch(value), [setSearch])
  const handlePriority = useCallback((value: Filters['priority']) => setPriority(value), [setPriority])
  const handleStatus = useCallback((value: Filters['status']) => setStatus(value), [setStatus])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard (After — optimized)</h2>
      <p className={styles.hint}>
        Open the React DevTools Profiler and record while typing in the search field.
        Notice that Stats no longer re-renders, and the list uses virtualization.
      </p>

      {/* Stable references via useCallback */}
      <SearchBar
        filters={filters}
        onSearch={handleSearch}
        onPriority={handlePriority}
        onStatus={handleStatus}
      />

      {/* SOLUTION 1: memoized calculation */}
      <Stats stats={stats} computed={computed} />

      {/* SOLUTION 3: virtualized list — only ~10 DOM nodes on screen */}
      <TaskListOptimized tasks={tasks} />
    </div>
  )
}
