// =============================================================
// VERSÃO "AFTER" — Dashboard com otimizações aplicadas
// =============================================================
//
// SOLUÇÕES aplicadas:
//
// 1. useMemo para cálculo pesado
//    expensiveStatsCalc só roda quando `stats` mudar de referência.
//    No Profiler: tempo do Stats cai para perto de 0ms em renders subsequentes.
//
// 2. useCallback para funções passadas como props
//    As referências são estáveis entre renders, permitindo que React.memo
//    nos filhos evite re-renders desnecessários.
//
// 3. Virtualização com react-window
//    TaskListOptimized renderiza apenas ~10 itens na viewport,
//    independentemente de quantas tarefas existem no array.
//
// Como observar:
//   - Abra o React DevTools → aba Profiler → Record
//   - Digite algo no campo de busca
//   - Compare o flamegraph com o da versão "Before"

import { useCallback, useMemo } from 'react'
import { useTasks } from '../../hooks/useTasks'
import type { Filters } from '../../hooks/useTasks'
import { SearchBar } from '../SearchBar/SearchBar'
import { Stats, expensiveStatsCalc } from '../Stats/Stats'
import { TaskListOptimized } from '../TaskList/TaskListOptimized'
import styles from './Dashboard.module.css'

export function DashboardOptimized() {
  const { tasks, filters, stats, setSearch, setPriority, setStatus } = useTasks()

  // SOLUÇÃO 1: useMemo — cálculo pesado só roda quando stats muda
  const computed = useMemo(() => expensiveStatsCalc(stats), [stats])

  // SOLUÇÃO 2: useCallback — referências estáveis evitam re-renders nos filhos
  const handleSearch = useCallback((value: string) => setSearch(value), [setSearch])
  const handlePriority = useCallback((value: Filters['priority']) => setPriority(value), [setPriority])
  const handleStatus = useCallback((value: Filters['status']) => setStatus(value), [setStatus])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard (After — otimizado)</h2>
      <p className={styles.hint}>
        Abra o React DevTools Profiler e grave enquanto digita na busca.
        Observe que Stats não re-renderiza mais, e a lista usa virtualização.
      </p>

      {/* Referências estáveis via useCallback */}
      <SearchBar
        filters={filters}
        onSearch={handleSearch}
        onPriority={handlePriority}
        onStatus={handleStatus}
      />

      {/* SOLUÇÃO 1: cálculo memoizado */}
      <Stats stats={stats} computed={computed} />

      {/* SOLUÇÃO 3: lista virtualizada — só ~10 nós DOM na tela */}
      <TaskListOptimized tasks={tasks} />
    </div>
  )
}
