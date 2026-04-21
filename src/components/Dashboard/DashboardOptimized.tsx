import { useCallback, useMemo } from 'react'
import { useTasks } from '../../hooks/useTasks'
import type { Filters } from '../../hooks/useTasks'
import { SearchBar } from '../SearchBar/SearchBar'
import { Stats, expensiveStatsCalc } from '../Stats/Stats'
import { TaskListOptimized } from '../TaskList/TaskListOptimized'
import styles from './Dashboard.module.css'

export function DashboardOptimized() {
  const { tasks, filters, stats, setSearch, setPriority, setStatus } = useTasks()

  const computed = useMemo(() => expensiveStatsCalc(stats), [stats])

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

      <SearchBar
        filters={filters}
        onSearch={handleSearch}
        onPriority={handlePriority}
        onStatus={handleStatus}
      />

      <Stats stats={stats} computed={computed} />

      <TaskListOptimized tasks={tasks} />
    </div>
  )
}
