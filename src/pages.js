// The site's pages. Each one has its own address (/services/ and so on) and its own
// HTML entry in the project root (services/index.html), rendered by src/subpage.jsx.
export const PAGES = [
  { slug: 'services', label: 'Services', blurb: 'Branding, graphic design, websites, photography, motion and marketing.' },
  { slug: 'work', label: 'Work', blurb: 'Concept websites, photography, logos, menus and animation.' },
  { slug: 'process', label: 'Process', blurb: 'How a project runs, from the first chat to launch.' },
  { slug: 'faq', label: 'Questions', blurb: 'Where we are based, prices, timings and what we need from you.' },
  { slug: 'contact', label: 'Contact', blurb: 'Tell us about your business and what you have in mind.' },
]

export const pageHref = (slug) => `/${slug}/`
