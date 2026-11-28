import { EMAIL, MAILTO } from '@/content'
import { PAGES, pageHref } from '@/pages'
import logo from '@/assets/logo.svg'

const YEAR = new Date().getFullYear()

/** One footer for every page. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <a href="/" className="footer-home" aria-label="Catalyze home">
            <img src={logo} width="1286" height="488" alt="" className="footer-logo" />
          </a>
          <p>A creative studio for brands that want to be noticed.</p>
        </div>
        <nav aria-label="Footer">
          {PAGES.map((p) => (
            <a key={p.slug} href={pageHref(p.slug)}>{p.label}</a>
          ))}
        </nav>
        <div>
          <a href={MAILTO} className="footer-mail">{EMAIL}</a>
          <nav className="footer-legal-links" aria-label="Legal">
            <a href="/privacy.html">Privacy policy</a>
            <a href="/terms.html">Terms and conditions</a>
          </nav>
          <p className="footer-legal">© {YEAR} Catalyze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
