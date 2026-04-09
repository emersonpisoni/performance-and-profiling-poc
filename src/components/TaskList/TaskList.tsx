// PROBLEMA: Renderiza TODOS os itens no DOM de uma vez.
// Com 10.000 tarefas, isso cria 10.000 nós DOM, travando o scroll e o browser.
import type { Task } from '../../data/tasks'
import { TaskItem } from './TaskItem'
import styles from './TaskList.module.css'

interface Props {
  tasks: Task[]
}

export function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <div className={styles.empty}>Nenhuma tarefa encontrada.</div>
  }

  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        {tasks.length.toLocaleString()} tarefa(s) — sem virtualização
      </div>
      <div className={styles.scroll}>
        {/* PROBLEMA: todos os {tasks.length} itens são renderizados de uma vez */}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
