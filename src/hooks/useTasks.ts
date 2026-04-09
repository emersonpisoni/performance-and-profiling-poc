import { useState } from 'react'
import { ALL_TASKS, type Task, type Priority, type Status } from '../data/tasks'

export interface Filters {
  search: string
  priority: Priority | 'all'
  status: Status | 'all'
}

export function useTasks() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    priority: 'all',
    status: 'all',
  })

  // NOTE: No memoization here — used intentionally in the "Before" version.
  // The "After" version wraps this in useMemo inside the component.
  const filtered = ALL_TASKS.filter((task) => {
    const matchSearch =
      filters.search === '' ||
      task.title.toLowerCase().includes(filters.search.toLowerCase())
    const matchPriority = filters.priority === 'all' || task.priority === filters.priority
    const matchStatus = filters.status === 'all' || task.status === filters.status
    return matchSearch && matchPriority && matchStatus
  })

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search }))
  }

  function setPriority(priority: Filters['priority']) {
    setFilters((prev) => ({ ...prev, priority }))
  }

  function setStatus(status: Filters['status']) {
    setFilters((prev) => ({ ...prev, status }))
  }

  const stats = {
    total: ALL_TASKS.length,
    filtered: filtered.length,
    done: filtered.filter((t: Task) => t.status === 'done').length,
    inProgress: filtered.filter((t: Task) => t.status === 'in-progress').length,
    todo: filtered.filter((t: Task) => t.status === 'todo').length,
    highPriority: filtered.filter((t: Task) => t.priority === 'high').length,
  }

  return { tasks: filtered, filters, stats, setSearch, setPriority, setStatus }
}
