import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { VisibilityProvider } from './contexts/VisibilityContext'

createRoot(document.getElementById('root')!).render(
  <VisibilityProvider>
    <App />
  </VisibilityProvider>
)
