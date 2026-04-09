// SOLUÇÃO: react-window renderiza apenas os itens visíveis na tela.
// Independentemente de quantos itens existam, só ~10-15 nós DOM são criados.
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import type { Task } from '../../data/tasks'
import { TaskItemMemo } from './TaskItem'
import styles from './TaskList.module.css'

interface Props {
  tasks: Task[]
}

const ITEM_HEIGHT = 72

function Row({ index, style, data }: ListChildComponentProps<Task[]>) {
  const task = data[index]
  return (
    <div style={style}>
      <TaskItemMemo task={task} />
    </div>
  )
}

export function TaskListOptimized({ tasks }: Props) {
  if (tasks.length === 0) {
    return <div className={styles.empty}>Nenhuma tarefa encontrada.</div>
  }

  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        {tasks.length.toLocaleString()} tarefa(s) — com virtualização (react-window)
      </div>
      {/* SOLUÇÃO: FixedSizeList só monta os itens visíveis na viewport */}
      <FixedSizeList
        height={500}
        width="100%"
        itemCount={tasks.length}
        itemSize={ITEM_HEIGHT}
        itemData={tasks}
      >
        {Row}
      </FixedSizeList>
    </div>
  )
}
