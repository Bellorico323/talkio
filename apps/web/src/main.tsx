import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AuthProvider } from './providers/auth-provider'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<AuthProvider>
			<App />
		</AuthProvider>
	)
}
