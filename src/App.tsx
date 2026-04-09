import { useState } from 'react'
import { BeforePage } from './pages/BeforePage'
import { AfterPage } from './pages/AfterPage'
import './index.css'
import styles from './App.module.css'

type Page = 'before' | 'after'

export default function App() {
  const [page, setPage] = useState<Page>('before')

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.logo}>React Performance POC</span>
          <nav className={styles.nav}>
            <button
              className={`${styles.navBtn} ${page === 'before' ? styles.active : ''}`}
              onClick={() => setPage('before')}
            >
              Before
            </button>
            <button
              className={`${styles.navBtn} ${page === 'after' ? styles.active : ''}`}
              onClick={() => setPage('after')}
            >
              After
            </button>
          </nav>
        </div>
      </header>

      <main>
        {page === 'before' ? <BeforePage /> : <AfterPage />}
      </main>
    </div>
  )
}
