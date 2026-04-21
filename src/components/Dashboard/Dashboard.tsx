import { useTasks } from '../../hooks/useTasks'
import { SearchBar } from '../SearchBar/SearchBar'
import { Stats, expensiveStatsCalc } from '../Stats/Stats'
import { TaskList } from '../TaskList/TaskList'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const { tasks, filters, stats, setSearch, setPriority, setStatus } = useTasks()

  const computed = expensiveStatsCalc(stats)

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard (Before — with problems)</h2>
      <p className={styles.hint}>
        Open the React DevTools Profiler and record while typing in the search field.
        Notice Stats re-rendering unnecessarily due to the expensive calculation.
      </p>

      <SearchBar
        filters={filters}
        onSearch={setSearch}
        onPriority={setPriority}
        onStatus={setStatus}
      />

      <Stats stats={stats} computed={computed} />

      <TaskList tasks={tasks} />
    </div>
  )
}
