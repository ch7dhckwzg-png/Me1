import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import LegalPage from '@/components/LegalPage'
import { TERMS } from '@/legal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LegalPage title="Terms and conditions" sections={TERMS} />
  </StrictMode>,
)
