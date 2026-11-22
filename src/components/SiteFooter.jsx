import { EMAIL, MAILTO } from '@/content'
import logo from '@/assets/logo.svg'

const YEAR = new Date().getFullYear()

/** One footer for every page. `base` is '' on the home page and '/' elsewhere, for section links. */
export default function SiteFooter({ base = '' }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <a href={base || '#home'} className="footer-home" aria-label="Catalyze home">
            <img src={logo} width="1275" height="477" alt="" className="footer-logo" />
          </a>
          <p>A creative studio for brands that want to be noticed.</p>
        </div>
        <nav aria-label="Footer">
          <a href={`${base}#services`}>Services</a>
          <a href={`${base}#work`}>Work</a>
          <a href={`${base}#process`}>Process</a>
          <a href={`${base}#faq`}>Questions</a>
          <a href={`${base}#contact`}>Contact</a>
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
