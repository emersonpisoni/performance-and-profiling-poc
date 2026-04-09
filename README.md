# React Performance & Profiling POC

Projeto de estudo sobre performance e profiling no React. Demonstra problemas comuns, como identificá-los com ferramentas e como resolvê-los.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` e alterne entre **Before** e **After** no menu superior.

---

## Ferramentas de Profiling

### React DevTools Profiler

A principal ferramenta para medir performance em React.

1. Instale a extensão **React Developer Tools** no Chrome/Firefox
2. Abra o DevTools → aba **Profiler**
3. Clique em **Record** (círculo vermelho)
4. Interaja com a página (ex: digite na busca)
5. Clique em **Stop**
6. Analise o flamegraph: cada barra é um componente, a largura indica o tempo de render

**Configurações úteis:**
- "Highlight updates when components render" → pisca os componentes que re-renderizaram
- "Record why each component rendered" → mostra o motivo do re-render

### `why-did-you-render`

Biblioteca que loga no console quando um componente re-renderiza com as mesmas props.

Para ativar, descomente a linha em `src/main.tsx`:

```ts
import './wdyr'
```

Abra o console do browser e interaja com a página — você verá logs como:
```
TaskItem re-rendered with the same props
```

### Web Vitals

Métricas padronizadas de UX (Core Web Vitals):

| Métrica | O que mede | Meta |
|---|---|---|
| **LCP** | Largest Contentful Paint — tempo até o maior elemento carregar | < 2.5s |
| **CLS** | Cumulative Layout Shift — estabilidade visual da página | < 0.1 |
| **INP** | Interaction to Next Paint — responsividade a cliques/teclas | < 200ms |

Para medir, use a lib `web-vitals` ou a extensão **Web Vitals** do Chrome.

---

## Problemas e Soluções

### 1. Re-renders desnecessários → `React.memo`

**Problema:** Quando um componente pai re-renderiza, todos os filhos re-renderizam junto, mesmo que as props não mudaram.

```tsx
// ANTES: TaskItem re-renderiza a cada mudança no pai
function TaskItem({ task }: Props) { ... }

// DEPOIS: só re-renderiza se `task` mudar
const TaskItem = memo(function TaskItem({ task }: Props) { ... })
```

**Observe no Profiler:** na versão Before, `TaskItem` aparece no flamegraph mesmo sem mudança nas tasks.

---

### 2. Função recriada a cada render → `useCallback`

**Problema:** funções definidas dentro do componente são recriadas a cada render. Isso quebra `React.memo` nos filhos, pois a referência é sempre nova.

```tsx
// ANTES: nova função a cada render → memo não funciona
<SearchBar onSearch={(value) => setSearch(value)} />

// DEPOIS: referência estável
const handleSearch = useCallback((value: string) => setSearch(value), [setSearch])
<SearchBar onSearch={handleSearch} />
```

**Quando usar:** só vale a pena quando a função é passada como prop para um componente memoizado com `React.memo`.

---

### 3. Cálculo pesado a cada render → `useMemo`

**Problema:** cálculos custosos (agregações, filtros, transformações) rodam a cada render mesmo que os dados de entrada não mudaram.

```tsx
// ANTES: roda a cada render do Dashboard
const computed = expensiveStatsCalc(stats)

// DEPOIS: só roda quando `stats` mudar
const computed = useMemo(() => expensiveStatsCalc(stats), [stats])
```

**Onde está no código:** `src/components/Stats/Stats.tsx` — `expensiveStatsCalc` bloqueia a thread por ~8ms intencionalmente para tornar o custo visível no Profiler.

---

### 4. Lista longa no DOM → Virtualização (`react-window`)

**Problema:** renderizar 10.000 itens no DOM cria 10.000 nós, consome memória e trava o scroll.

```tsx
// ANTES: todos os 10.000 itens no DOM
{tasks.map((task) => <TaskItem key={task.id} task={task} />)}

// DEPOIS: react-window renderiza apenas ~10 itens visíveis
<FixedSizeList
  height={500}
  itemCount={tasks.length}
  itemSize={72}
  itemData={tasks}
>
  {Row}
</FixedSizeList>
```

**Observe:** no DevTools → Elements, compare quantos nós `.item` existem no Before vs After.

---

### 5. Bundle grande → `React.lazy + Suspense`

**Problema:** todo o código JS é carregado de uma vez, mesmo partes que o usuário pode nunca ver.

```tsx
// ANTES: importação estática — sempre no bundle inicial
import { HeavyComponent } from './HeavyComponent'

// DEPOIS: carregado só quando necessário
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

---

## Estrutura do Projeto

```
src/
├── data/tasks.ts                    # Gerador de 10.000 tarefas mockadas
├── hooks/useTasks.ts                # Lógica de filtro e busca
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx            # Versão com problemas (Before)
│   │   └── DashboardOptimized.tsx   # Versão otimizada (After)
│   ├── TaskList/
│   │   ├── TaskList.tsx             # Lista sem virtualização
│   │   ├── TaskListOptimized.tsx    # Lista com react-window
│   │   └── TaskItem.tsx             # Item (+ versão memoizada)
│   ├── SearchBar/SearchBar.tsx      # Campo de busca e filtros
│   └── Stats/Stats.tsx              # Cards de estatísticas + cálculo pesado
├── pages/
│   ├── BeforePage.tsx
│   └── AfterPage.tsx
├── wdyr.ts                          # Configuração do why-did-you-render
└── main.tsx
```

## Regras de ouro

| Situação | Ferramenta |
|---|---|
| Componente filho com props que não mudam sempre | `React.memo` |
| Função passada como prop para componente memoizado | `useCallback` |
| Cálculo custoso com dependências específicas | `useMemo` |
| Lista com centenas/milhares de itens | `react-window` ou `react-virtual` |
| Rota ou componente raramente acessado | `React.lazy + Suspense` |

> **Atenção:** não otimize prematuramente. Meça primeiro com o Profiler, depois aplique a solução.
