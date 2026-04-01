/**
 * Single source of truth for all checkout projects.
 *
 * To add a new project (summit, course, etc.):
 *  1. Add a new entry to PROJECTS below
 *  2. Create the Stripe prices and paste the IDs here
 *  3. Upload any bump PDFs to Bunny and paste the URLs here
 *  4. Deploy — no other files need to change
 *
 * URL param: /checkout?project=adhd-parenting&email=...
 * Defaults to DEFAULT_PROJECT if no param is passed.
 */

export const DEFAULT_PROJECT = 'adhd-parenting'

export interface BumpConfig {
  id: string
  name: string
  stripePriceId: string
  regularPrice: number  // cents
  salePrice: number     // cents
  pdfUrl: string        // Bunny CDN URL
  image?: string
  description: string
  bullets: string[]
  checkboxLabel: string
}

export interface ProjectConfig {
  id: string
  name: string
  stripePriceId: string
  price: number         // cents
  originalPrice?: number
  bumps: BumpConfig[]
}

export const PROJECTS: Record<string, ProjectConfig> = {
  'adhd-parenting': {
    id: 'adhd-parenting',
    name: 'ADHD Personality Report',
    stripePriceId: 'price_1TGYs7AVXYPKc4D06z0eajHG',
    price: 1900,
    originalPrice: 4900,
    bumps: [
      {
        id: 'anger-management',
        name: 'Anger Management Adventures Kit',
        stripePriceId: 'price_1TFWzgAVXYPKc4D0HjWwqDlp',
        regularPrice: 13300,
        salePrice: 1200,
        pdfUrl: 'https://wcc-files.b-cdn.net/Anger-Management-Adventures-StrategicParenting.pdf',
        image: '/images/anger-management-adventures-_book-mockup.png',
        description: 'The Anger Management Adventures Kit is a 66-page printable pack with activities based on the revolutionary PER (Playful Emotional Regulation) Method.\n\nThese activities, games and tools will help your child dissolve their anger and navigate the driving thoughts behind it by:',
        bullets: [
          'Understand where anger comes from and what triggers it',
          'Teach your child to recognise and name their emotions',
          'Step-by-step activities to calm big feelings in the moment',
          'Fun games that make emotional regulation stick long-term',
        ],
        checkboxLabel: 'Yes! Add the Anger Management Adventures Kit to my order.',
      },
      {
        id: 'adhd-game-plan',
        name: 'The ADHD Game Plan',
        stripePriceId: 'price_1THItbAVXYPKc4D0jqU2fQfJ',
        regularPrice: 5900,
        salePrice: 700,
        pdfUrl: 'https://wcc-files.b-cdn.net/the-adhd-game-plan-strategicparenting.pdf',
        image: '/images/the-adhd-gameplan-book.png',
        description: 'The ADHD Game Plan includes 25 printable templates to help your child stay regulated and on track every day.',
        bullets: [
          'Easily plan their daily and weekly obligations',
          'Stay more focused and organised throughout the day',
          'Diligently perform household chores without reminders',
          'Successfully achieve their goals one step at a time',
        ],
        checkboxLabel: 'Yes! I want my child to become more organised, focused, and productive.',
      },
    ],
  },

  // ── Add future projects below ────────────────────────────────────────────────
  // 'summit-name': {
  //   id: 'summit-name',
  //   name: 'Summit Product Name',
  //   stripePriceId: 'price_xxx',
  //   price: 2700,
  //   bumps: [
  //     {
  //       id: 'bump-id',
  //       name: 'Bump Name',
  //       stripePriceId: 'price_yyy',
  //       regularPrice: 4700,
  //       salePrice: 900,
  //       pdfUrl: 'https://wcc-files.b-cdn.net/path/to/bump.pdf',
  //       description: '...',
  //       bullets: ['...'],
  //       checkboxLabel: 'Yes! Add this to my order.',
  //     },
  //   ],
  // },
}

export function getProject(id: string): ProjectConfig {
  const project = PROJECTS[id] ?? PROJECTS[DEFAULT_PROJECT]
  return project
}
