import type { Task } from '../../data/tasks'
import styles from './TaskList.module.css'

const priorityLabel: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const statusLabel: Record<Task['status'], string> = {
  'todo': 'To do',
  'in-progress': 'In progress',
  'done': 'Done',
}

interface Props {
  task: Task
}

export function TaskItem({ task }: Props) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <span className={styles.itemTitle}>{task.title}</span>
        <span className={`${styles.badge} ${styles[`priority_${task.priority}`]}`}>
          {priorityLabel[task.priority]}
        </span>
      </div>
      <div className={styles.itemMeta}>
        <span className={`${styles.statusBadge} ${styles[`status_${task.status.replace('-', '_')}`]}`}>
          {statusLabel[task.status]}
        </span>
        <span className={styles.metaText}>{task.category}</span>
        <span className={styles.metaText}>{task.assignee}</span>
        <span className={styles.metaText}>{task.createdAt}</span>
      </div>
    </div>
  )
}

// Memoized version — used in the "After" page
import { memo } from 'react'
export const TaskItemMemo = memo(TaskItem)
