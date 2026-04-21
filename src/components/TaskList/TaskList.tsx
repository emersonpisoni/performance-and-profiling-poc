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
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
