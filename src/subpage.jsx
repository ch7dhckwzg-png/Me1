import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/anton/400.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import 'lenis/dist/lenis.css'
import './index.css'
import useReducedMotion from '@/hooks/useReducedMotion'
import useSmoothScroll, { useJumpToHash } from '@/hooks/useSmoothScroll'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import SiteNav from '@/components/SiteNav'
import SiteDock from '@/components/SiteDock'
import SiteFooter from '@/components/SiteFooter'
import Services from '@/sections/Services'
import Work from '@/sections/Work'
import Process from '@/sections/Process'
import Faq from '@/sections/Faq'
import Contact from '@/sections/Contact'
import { PAGES } from '@/pages'

// Which page this is comes from <body data-page="..."> in its HTML entry.
const slug = document.body.dataset.page
const page = PAGES.find((p) => p.slug === slug)

const SECTIONS = { services: Services, work: Work, process: Process, faq: Faq }

/** One page of the site: the menu, a breadcrumb, the page's section and the contact sign-off. */
function SubPage() {
  const reducedMotion = useReducedMotion()
  const lenisRef = useSmoothScroll(reducedMotion)
  useJumpToHash(lenisRef)
  const Section = SECTIONS[slug]


  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header" id="home">
        <SiteNav current={slug} />
      </header>
      <main id="main" tabIndex={-1} className={`subpage subpage-${slug}`}>
        <nav className="breadcrumb wrap" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">{page.label}</li>
          </ol>
        </nav>
        {Section && <Section reducedMotion={reducedMotion} level={1} />}
        <Contact level={slug === 'contact' ? 1 : 2} />
      </main>
      <ScrollProgress className="scroll-progress" aria-hidden="true" />
      <SiteDock />
      <SiteFooter />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SubPage />
  </StrictMode>,
)
