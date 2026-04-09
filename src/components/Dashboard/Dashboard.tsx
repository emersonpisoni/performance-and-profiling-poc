// =============================================================
// VERSÃO "BEFORE" — Dashboard com problemas de performance
// =============================================================
//
// PROBLEMAS INTENCIONAIS neste componente:
//
// 1. CÁLCULO PESADO sem useMemo
//    expensiveStatsCalc() é chamado a cada render, mesmo quando
//    as stats não mudaram. Visível no Profiler como tempo alto no Stats.
//
// 2. FUNÇÃO RECRIADA a cada render sem useCallback
//    onSearch, onPriority, onStatus são novas referências a cada render.
//    Isso impede que React.memo funcione nos filhos.
//
// 3. TODOS OS FILHOS re-renderizam quando o pai re-renderiza
//    Mesmo que as props de Stats não mudaram, ele re-renderiza porque
//    as funções passadas ao SearchBar são novas a cada render.
//
// Como observar:
//   - Abra o React DevTools → aba Profiler → Record
//   - Digite algo no campo de busca
//   - Pare a gravação e veja o flamegraph: Stats re-renderiza mesmo sem mudança
//   - Ative "Highlight updates" nas configurações do DevTools

import { useTasks } from '../../hooks/useTasks'
import { SearchBar } from '../SearchBar/SearchBar'
import { Stats, expensiveStatsCalc } from '../Stats/Stats'
import { TaskList } from '../TaskList/TaskList'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const { tasks, filters, stats, setSearch, setPriority, setStatus } = useTasks()

  // PROBLEMA 1: cálculo pesado sem memoização — roda a cada render
  const computed = expensiveStatsCalc(stats)

  // PROBLEMA 2: funções novas a cada render (sem useCallback)
  // onSearch, onPriority, onStatus são recriadas mesmo que o estado não mude

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard (Before — com problemas)</h2>
      <p className={styles.hint}>
        Abra o React DevTools Profiler e grave enquanto digita na busca.
        Observe Stats re-renderizando desnecessariamente por causa do cálculo pesado.
      </p>

      {/* PROBLEMA 2: novas referências de função a cada render */}
      <SearchBar
        filters={filters}
        onSearch={setSearch}
        onPriority={setPriority}
        onStatus={setStatus}
      />

      {/* PROBLEMA 1: Stats recalcula tudo a cada render */}
      <Stats stats={stats} computed={computed} />

      {/* PROBLEMA 3: TaskList renderiza todos os itens no DOM */}
      <TaskList tasks={tasks} />
    </div>
  )
}
