// PROBLEM: Renders ALL items in the DOM at once.
// With 10,000 tasks, this creates 10,000 DOM nodes, freezing scroll and the browser.
import type { Task } from '../../data/tasks'
import { TaskItem } from './TaskItem'
import styles from './TaskList.module.css'

interface Props {
  tasks: Task[]
}

export function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <div className={styles.empty}>No tasks found.</div>
  }

  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        {tasks.length.toLocaleString()} task(s) — no virtualization
      </div>
      <div className={styles.scroll}>
        {/* PROBLEM: all {tasks.length} items are rendered at once */}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
