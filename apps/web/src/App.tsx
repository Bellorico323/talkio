import { ThemeProvider } from './context/theme-provider'
import './styles/global.css'
import { MainPage } from './pages/main-page'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query'

export function App() {
  return (
    <ThemeProvider storageKey="bun-ui-theme">
      <QueryClientProvider client={queryClient}>
        <MainPage />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
