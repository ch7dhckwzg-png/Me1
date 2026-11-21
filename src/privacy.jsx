import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/instrument-serif/400.css'
import './index.css'
import LegalPage from '@/components/LegalPage'
import { PRIVACY } from '@/legal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LegalPage title="Privacy policy" sections={PRIVACY} />
  </StrictMode>,
)
