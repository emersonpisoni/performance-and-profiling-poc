import type { Filters } from '../../hooks/useTasks'
import styles from './SearchBar.module.css'

interface Props {
  filters: Filters
  onSearch: (value: string) => void
  onPriority: (value: Filters['priority']) => void
  onStatus: (value: Filters['status']) => void
}

export function SearchBar({ filters, onSearch, onPriority, onStatus }: Props) {
  return (
    <div className={styles.bar}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        className={styles.select}
        value={filters.priority}
        onChange={(e) => onPriority(e.target.value as Filters['priority'])}
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        className={styles.select}
        value={filters.status}
        onChange={(e) => onStatus(e.target.value as Filters['status'])}
      >
        <option value="all">All statuses</option>
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  )
}
