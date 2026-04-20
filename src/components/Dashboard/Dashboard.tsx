// =============================================================
// "BEFORE" VERSION — Dashboard with performance problems
// =============================================================
//
// INTENTIONAL PROBLEMS in this component:
//
// 1. HEAVY CALCULATION without useMemo
//    expensiveStatsCalc() is called on every render, even when
//    stats haven't changed. Visible in the Profiler as high time on Stats.
//
// 2. FUNCTION RECREATED on every render without useCallback
//    onSearch, onPriority, onStatus are new references on every render.
//    This prevents React.memo from working on child components.
//
// 3. ALL CHILDREN re-render when the parent re-renders
//    Even though Stats props didn't change, it re-renders because
//    the functions passed to SearchBar are new on every render.
//
// How to observe:
//   - Open React DevTools → Profiler tab → Record
//   - Type something in the search field
//   - Stop recording and check the flamegraph: Stats re-renders even without change
//   - Enable "Highlight updates" in DevTools settings

import { useTasks } from '../../hooks/useTasks'
import { SearchBar } from '../SearchBar/SearchBar'
import { Stats, expensiveStatsCalc } from '../Stats/Stats'
import { TaskList } from '../TaskList/TaskList'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const { tasks, filters, stats, setSearch, setPriority, setStatus } = useTasks()

  // PROBLEM 1: heavy calculation without memoization — runs on every render
  const computed = expensiveStatsCalc(stats)

  // PROBLEM 2: new functions on every render (no useCallback)
  // onSearch, onPriority, onStatus are recreated even when state hasn't changed

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard (Before — with problems)</h2>
      <p className={styles.hint}>
        Open the React DevTools Profiler and record while typing in the search field.
        Notice Stats re-rendering unnecessarily due to the expensive calculation.
      </p>

      {/* PROBLEM 2: new function references on every render */}
      <SearchBar
        filters={filters}
        onSearch={setSearch}
        onPriority={setPriority}
        onStatus={setStatus}
      />

      {/* PROBLEM 1: Stats recalculates everything on every render */}
      <Stats stats={stats} computed={computed} />

      {/* PROBLEM 3: TaskList renders all items in the DOM */}
      <TaskList tasks={tasks} />
    </div>
  )
}
