// why-did-you-render — loga no console quando um componente re-renderiza desnecessariamente.
// Ative importando este arquivo no main.tsx ANTES de qualquer import do React.
//
// Documentação: https://github.com/welldone-software/why-did-you-render
import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render'

whyDidYouRender(React, {
  trackAllPureComponents: true,
  logOnDifferentValues: true,
})
