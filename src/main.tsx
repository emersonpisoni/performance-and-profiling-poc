import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Para ativar o why-did-you-render na versão "Before",
// descomente o import abaixo (deve vir ANTES do import do React/App):
// import './wdyr'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
