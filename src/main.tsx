import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// To enable why-did-you-render in the "Before" version,
// uncomment the import below (must come BEFORE any React/App import):
// import './wdyr'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
