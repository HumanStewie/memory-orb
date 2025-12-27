import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AddButton from './components/AddButton.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AddButton />
    <App />
  </StrictMode>,
)
