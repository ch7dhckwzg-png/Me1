// Everything the site says lives here, so copy can change without touching layout.

export const EMAIL = 'catalyzeuk@gmail.com'
export const MAILTO = `mailto:${EMAIL}?subject=Project%20enquiry`

export const SERVICES = [
  {
    id: 'brand',
    example: { href: '#work-design', label: 'See logo examples' },
    title: 'Brand identity',
    short: 'Branding',
    body: 'A logo, colours and type that people remember, with simple guidelines so everything you make looks like you.',
    includes: ['Logo design', 'Brand guidelines', 'Colour & typography', 'Signage & stationery'],
  },
  {
    id: 'graphic',
    example: { href: '#work-design', label: 'See menus and graphics' },
    title: 'Graphic design',
    short: 'Graphic design',
    body: 'Menus, print and graphic bundles that feel considered, readable and unmistakably yours.',
    includes: ['Menus', 'Posters & flyers', 'Graphic bundles', 'Packaging & labels'],
  },
  {
    id: 'web',
    example: { href: '#web-packages', label: 'See packages and live demos' },
    title: 'Web design',
    short: 'Web design',
    body: 'Fast, beautiful websites that are easy to use on any screen and built to turn visitors into customers.',
    includes: ['Design & build', 'Online shops', 'Booking & enquiries', 'Care & updates'],
  },
  {
    id: 'photo',
    example: { href: '#work-photo', label: 'See photography' },
    title: 'Photography',
    short: 'Photography',
    body: 'Headshots, food, products and the everyday images your website needs, shot and edited to match your brand.',
    includes: ['Headshots & team portraits', 'Food & drink', 'Product', 'Website & brand imagery'],
  },
  {
    id: 'motion',
    example: { href: '#work-motion', label: 'See animations' },
    title: 'Motion & animation',
    short: 'Motion',
    body: 'Product animations, store walk-throughs and moving graphics that stop the scroll and show what you do.',
    includes: ['Product animation', 'Store walk-throughs', 'Animated logos', 'Social video'],
  },
  {
    id: 'marketing',
    title: 'Digital marketing',
    short: 'Marketing',
    body: 'Ads, search and content, planned and run so the right people find you and keep coming back.',
    includes: ['Paid social & search', 'SEO', 'Content planning'],
  },
]

// Concept websites, designed by Catalyze to show the range of what we build.
export const WEBSITES = [
  {
    id: 'norde',
    name: 'Norde',
    kind: 'Coffee roaster',
    body: 'An online shop for a small-batch coffee roaster, with subscriptions, origin stories and a checkout that gets out of the way.',
    tags: ['Online shop', 'Subscriptions', 'Brand identity'],
  },
  {
    id: 'lumen',
    name: 'Lumen',
    kind: 'Skincare',
    body: 'A calm, product-led shop for a skincare brand, built around a simple three-step routine.',
    tags: ['Online shop', 'Product pages', 'Packaging'],
  },
  {
    id: 'oak',
    name: 'Oak & Iron',
    kind: 'Barbershop',
    body: 'A booking-first site for a barbershop: choose a service, a barber and a time in under thirty seconds.',
    tags: ['Online booking', 'Mobile first', 'Logo'],
  },
]

// Website packages: the same concept barbershop (Oak & Iron) built at each level.
// Served from this site (demos/oak-iron, copied into dist/ by scripts/copy-demos.mjs after the build).
export const DEMO_URL = '/demos/oak-iron'
export const PACKAGES = [
  { id: 'essentials', name: 'Essentials', body: 'One sharp page: what you do, prices, opening hours, tap to call and directions.' },
  { id: 'business', name: 'Business', body: 'A full site: services with descriptions, your team, gallery, FAQs and a custom animated feature.' },
  { id: 'signature', name: 'Signature', body: 'A standout animated opening and an interactive feature made for your trade.' },
  { id: 'booking', name: 'Signature + Booking', body: 'Everything in Signature, plus customers book appointments on your site, with texts, emails and calendar sync.' },
]

// Photography: each slot shows its photo once `src` is set (see README, "Adding photos").
export const PHOTOGRAPHY = [
  {
    id: 'headshots',
    label: 'Headshots',
    lead: 'Portraits that look like you on a good day, for your website, LinkedIn and press.',
    shots: [
      { title: 'Studio portrait', note: 'Clean backdrop, flattering light', src: null },
      { title: 'Natural light', note: 'Relaxed, outdoors or by a window', src: null },
      { title: 'Team portraits', note: 'A consistent look for the whole team', src: null },
    ],
  },
  {
    id: 'food',
    label: 'Food & drink',
    lead: 'Dishes and drinks that look as good as they taste, for menus, delivery apps and social.',
    shots: [
      { title: 'The signature plate', note: 'Your hero dish, styled and lit', src: null },
      { title: 'Flat lay', note: 'The whole table, from above', src: null },
      { title: 'Drinks & bar', note: 'Cocktails, coffee and pours in motion', src: null },
    ],
  },
  {
    id: 'product',
    label: 'Product',
    lead: 'Crisp, true-to-life product images for your shop, marketplaces and ads.',
    shots: [
      { title: 'Clean studio', note: 'On white or a colour from your brand', src: null },
      { title: 'Lifestyle', note: 'Your product, in use, in the real world', src: null },
      { title: 'Detail & texture', note: 'Close-ups that show the quality', src: null },
    ],
  },
  {
    id: 'web',
    label: 'Website imagery',
    lead: 'The everyday images that make a website feel real: your space, your people, your process.',
    shots: [
      { title: 'Spaces & interiors', note: 'Your shop, studio or venue at its best', src: null },
      { title: 'Behind the scenes', note: 'The making, the prep, the craft', src: null },
      { title: 'Brand details', note: 'Textures and objects that set the mood', src: null },
    ],
  },
]

export const PROCESS = [
  {
    title: 'Talk',
    body: 'Tell us about your business, your customers and what isn’t working. We’ll listen first and ask the useful questions.',
  },
  {
    title: 'Plan',
    body: 'We agree exactly what we’re making, how long it will take and what it will cost, before any work begins.',
  },
  {
    title: 'Create',
    body: 'Design, photography and build, with check-ins at each stage, so you see it take shape and there are no surprises.',
  },
  {
    title: 'Launch & grow',
    body: 'We put it live, show you how everything works and stay on hand to keep it looking sharp and performing well.',
  },
]

export const FAQ = [
  {
    q: 'Where are you based?',
    a: 'We work mobile, so we come to you for photo and video shoots, and meet in person or on a video call, whichever suits you.',
  },
  {
    q: 'Do I have to use all of your services?',
    a: 'Not at all. Bring us in for one thing, like a logo or a set of headshots, or for everything at once. Whatever we make is designed to work with the rest if you add more later.',
  },
  {
    q: 'How much does a project cost?',
    a: 'Every business needs something different, so we quote after a short chat about what you want to achieve. You’ll have a clear price in writing before anything starts.',
  },
  {
    q: 'How long does a website take?',
    a: 'It depends on the size of the site and how much photography and copy it needs. We’ll give you a timeline at the start and keep you updated along the way.',
  },
  {
    q: 'Can you work with my existing logo and branding?',
    a: 'Yes. We can build on what you already have, give it a gentle refresh, or start from scratch if you’re ready for something new.',
  },
  {
    q: 'What do you need from me to get started?',
    a: 'Just an email with a little about your business and what you’d like to do. We’ll reply within two working days and arrange a time to talk.',
  },
]
