import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import NotFound from '@/components/NotFound'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)
