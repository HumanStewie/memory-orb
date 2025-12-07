import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MemoryName from './components/MemoryName.tsx'
import AddButton from './components/AddButton.tsx'
import Arrows from './components/Arrows.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div id='wcontainer'>
      <MemoryName />
      
    </div>
    <AddButton />
    <App />
  </StrictMode>,
)
