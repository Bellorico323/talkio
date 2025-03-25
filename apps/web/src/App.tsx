import { ThemeProvider } from './context/theme-provider'
import './styles/global.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query'
import { BrowserRouter } from 'react-router'
import { Router } from './router'

export function App() {
  return (
    <ThemeProvider storageKey="bun-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
