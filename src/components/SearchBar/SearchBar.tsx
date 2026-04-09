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
        placeholder="Buscar tarefas..."
        value={filters.search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        className={styles.select}
        value={filters.priority}
        onChange={(e) => onPriority(e.target.value as Filters['priority'])}
      >
        <option value="all">Todas prioridades</option>
        <option value="high">Alta</option>
        <option value="medium">Média</option>
        <option value="low">Baixa</option>
      </select>
      <select
        className={styles.select}
        value={filters.status}
        onChange={(e) => onStatus(e.target.value as Filters['status'])}
      >
        <option value="all">Todos status</option>
        <option value="todo">A fazer</option>
        <option value="in-progress">Em progresso</option>
        <option value="done">Concluído</option>
      </select>
    </div>
  )
}
