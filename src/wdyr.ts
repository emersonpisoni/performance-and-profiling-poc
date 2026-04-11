// why-did-you-render — logs to the console when a component re-renders unnecessarily.
// Enable by importing this file in main.tsx BEFORE any React import.
//
// Docs: https://github.com/welldone-software/why-did-you-render
import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render'

whyDidYouRender(React, {
  trackAllPureComponents: true,
  logOnDifferentValues: true,
})
