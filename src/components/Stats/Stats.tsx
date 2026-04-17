import type { useTasks } from '../../hooks/useTasks'
import styles from './Stats.module.css'

type Stats = ReturnType<typeof useTasks>['stats']

// Simulates a "heavy" calculation to demonstrate the useMemo problem.
// PROBLEM: without useMemo, this runs on every render of the parent component.
export function expensiveStatsCalc(stats: Stats): {
  completionRate: number
  highPriorityRate: number
  inProgressRate: number
} {
  // Simulates slow processing (e.g. aggregations on large datasets)
  const start = performance.now()
  while (performance.now() - start < 8) {
    // blocks the thread for ~8ms to make the cost visible in the Profiler
  }
  return {
    completionRate: stats.filtered > 0 ? Math.round((stats.done / stats.filtered) * 100) : 0,
    highPriorityRate: stats.filtered > 0 ? Math.round((stats.highPriority / stats.filtered) * 100) : 0,
    inProgressRate: stats.filtered > 0 ? Math.round((stats.inProgress / stats.filtered) * 100) : 0,
  }
}

interface Props {
  stats: Stats
  computed: ReturnType<typeof expensiveStatsCalc>
}

export function Stats({ stats, computed }: Props) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.label}>Filtered total</span>
        <span className={styles.value}>{stats.filtered.toLocaleString()}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Done</span>
        <span className={`${styles.value} ${styles.done}`}>
          {stats.done.toLocaleString()} ({computed.completionRate}%)
        </span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>In progress</span>
        <span className={`${styles.value} ${styles.progress}`}>
          {stats.inProgress.toLocaleString()} ({computed.inProgressRate}%)
        </span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>High priority</span>
        <span className={`${styles.value} ${styles.high}`}>
          {stats.highPriority.toLocaleString()} ({computed.highPriorityRate}%)
        </span>
      </div>
    </div>
  )
}
