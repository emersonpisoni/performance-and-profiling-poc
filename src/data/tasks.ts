export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: number
  title: string
  description: string
  priority: Priority
  status: Status
  category: string
  assignee: string
  createdAt: string
}

const priorities: Priority[] = ['low', 'medium', 'high']
const statuses: Status[] = ['todo', 'in-progress', 'done']
const categories = ['Frontend', 'Backend', 'DevOps', 'Design', 'QA', 'Docs']
const assignees = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank']
const verbs = ['Fix', 'Implement', 'Refactor', 'Review', 'Update', 'Add', 'Remove', 'Optimize', 'Test', 'Document']
const subjects = ['login page', 'API endpoint', 'database query', 'UI component', 'unit tests', 'CI pipeline', 'authentication flow', 'dashboard layout', 'error handling', 'cache layer']

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Deterministic generation so data is stable across renders
export function generateTasks(count = 10_000): Task[] {
  const tasks: Task[] = []
  for (let i = 0; i < count; i++) {
    const r = (offset: number) => seededRandom(i * 7 + offset)
    tasks.push({
      id: i + 1,
      title: `${verbs[Math.floor(r(0) * verbs.length)]} ${subjects[Math.floor(r(1) * subjects.length)]} #${i + 1}`,
      description: `Task ${i + 1}: detailed description about what needs to be done and why it matters to the project.`,
      priority: priorities[Math.floor(r(2) * priorities.length)],
      status: statuses[Math.floor(r(3) * statuses.length)],
      category: categories[Math.floor(r(4) * categories.length)],
      assignee: assignees[Math.floor(r(5) * assignees.length)],
      createdAt: new Date(2024, Math.floor(r(6) * 12), Math.floor(r(7) * 28) + 1).toLocaleDateString('en-US'),
    })
  }
  return tasks
}

// Singleton — generated once, reused everywhere
export const ALL_TASKS = generateTasks()
