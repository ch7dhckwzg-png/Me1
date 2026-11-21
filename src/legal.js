// Content for the privacy policy and terms pages.
//
// Fill in BUSINESS before launch (see LAUNCH.md). Empty fields are simply left out of the
// pages, so they always read correctly, but a legal name and address make them complete.
// These pages describe how this website works today. Have them checked by someone qualified
// if your situation is unusual, and update them whenever the site starts collecting more
// (a contact form, analytics, a newsletter, cookies).

import { EMAIL } from '@/content'

export const BUSINESS = {
  tradingName: 'Catalyze',
  legalName: '', // e.g. "Jane Smith trading as Catalyze", or "Catalyze Studio Ltd"
  companyNumber: '', // only for a limited company
  address: '', // registered or trading address
  host: '', // e.g. "Netlify, Inc." once the site is deployed
  jurisdiction: 'England and Wales', // change to Scotland or Northern Ireland if that is where you trade
  email: EMAIL,
}

export const UPDATED = '21 November 2026'

const who = () => {
  const name = BUSINESS.legalName || BUSINESS.tradingName
  const parts = [`${name}${BUSINESS.legalName ? ` (trading as ${BUSINESS.tradingName})` : ''}`]
  if (BUSINESS.companyNumber) parts.push(`company number ${BUSINESS.companyNumber}`)
  if (BUSINESS.address) parts.push(`of ${BUSINESS.address}`)
  return parts.join(', ')
}

export const PRIVACY = [
  {
    h: 'Who we are',
    p: [
      `This website is run by ${who()} ("we", "us"). We are the controller of any personal data described here.`,
      `If you have a question about this policy or your data, email us at ${BUSINESS.email}.`,
    ],
  },
  {
    h: 'What this website collects',
    p: [
      'Nothing that identifies you. The site has no contact forms, no account sign-up, no analytics and no advertising or tracking tools, and it sets no cookies.',
      'The fonts, images and animation code are served from this website itself, so visiting it does not send your details to third parties such as Google Fonts.',
      'To avoid replaying the opening animation each time you load a page, your browser keeps a small note (in "session storage") that the intro has played. It stays on your device, does not identify you, is never sent to us, and is deleted when you close the tab.',
    ],
  },
  {
    h: 'When you email us',
    p: [
      `If you email ${BUSINESS.email}, we receive your email address, your name if you include it, and whatever you choose to tell us. We use this only to reply to you and, if you go ahead, to plan and deliver your project.`,
      'Our lawful basis is our legitimate interest in responding to enquiries and, where you become a client, taking steps to enter into and carry out a contract with you.',
      'Our email is provided by Google (Gmail), which stores messages on our behalf.',
    ],
  },
  {
    h: 'Our website host',
    p: [
      `${BUSINESS.host ? `This site is hosted by ${BUSINESS.host}. ` : ''}Like any web host, our hosting provider automatically processes technical information such as your IP address and browser type to deliver the site and keep it secure. We do not use this information to identify you.`,
    ],
  },
  {
    h: 'How long we keep it',
    p: [
      'Enquiries that do not become projects are deleted within 12 months. Client correspondence and records are kept for as long as UK tax and accounting rules require, usually six years, and then deleted.',
    ],
  },
  {
    h: 'Sharing',
    p: [
      'We do not sell your data or share it for marketing. We only share it with the services named above that help us run the business, or where the law requires it.',
    ],
  },
  {
    h: 'Your rights',
    p: [
      'Under UK data protection law you can ask to see the personal data we hold about you, to correct it, to delete it, to restrict or object to how we use it, and to receive a copy to take elsewhere. Email us and we will respond within one month.',
      'If you are unhappy with how we have handled your data, you can complain to the Information Commissioner’s Office at ico.org.uk. We would appreciate the chance to put things right first.',
    ],
  },
  {
    h: 'Changes to this policy',
    p: ['If the way the site works changes, we will update this page and the date below.'],
  },
]

export const TERMS = [
  {
    h: 'About these terms',
    p: [
      `These terms apply to your use of this website, run by ${who()}. By using the site you accept them. If you do not agree, please do not use the site.`,
    ],
  },
  {
    h: 'Using the website',
    p: [
      'You may browse the site and share links to it. Please do not copy or reuse its content for commercial purposes, try to gain unauthorised access to it, or use it in a way that breaks the law or disrupts the site for others.',
    ],
  },
  {
    h: 'Our work and content',
    p: [
      'All text, designs, images, animations and code on this site belong to us unless stated otherwise, and are protected by copyright.',
      'The brands shown in our work section (Norde, Lumen, Oak & Iron, Ember and Marlow) are concept projects we created to show our range. They are not real businesses or clients.',
    ],
  },
  {
    h: 'Information on the site',
    p: [
      'We keep the site accurate and up to date, but it is general information about our services, not an offer. Prices, timelines and what is included are confirmed in writing for each project.',
    ],
  },
  {
    h: 'Projects',
    p: [
      'Every project is covered by a written proposal or agreement that we send before work begins. It sets out what we will deliver, the cost, payment terms, timelines and who owns the finished work. If anything in it differs from these website terms, the project agreement applies.',
    ],
  },
  {
    h: 'Liability',
    p: [
      'We are not responsible for any loss caused by relying on information on this site, or by the site being unavailable, except where the law does not allow us to limit our liability. Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited by law.',
    ],
  },
  {
    h: 'Privacy',
    p: ['How we handle personal data is explained in our privacy policy.'],
  },
  {
    h: 'Law',
    p: [
      `These terms are governed by the law of ${BUSINESS.jurisdiction}, and any dispute will be dealt with by its courts.`,
    ],
  },
  {
    h: 'Changes',
    p: ['We may update these terms from time to time. The date below shows when they last changed.'],
  },
]
