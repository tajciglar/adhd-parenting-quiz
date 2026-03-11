# UI/UX Design System

## Brand

**Harbor** — "A calm space in the chaos."

A behavioral assessment quiz for parents of children with ADHD. The design prioritizes calm, focus, and warmth — no visual overwhelm. One question at a time to reduce cognitive load.

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `harbor-primary` | `#7040CA` | Headings, primary buttons, brand elements |
| `harbor-bg` | `#FAF7FC` | Page background (light lavender) |
| `harbor-accent` | `#9B59B6` | Progress bar, selected states, section headers |
| `harbor-text` | `#1A1A1A` | Body text |
| `harbor-error` | `#C97B63` | Error states, validation messages |
| `harbor-primary-light` | `#9B59B6` | Button hover states |
| `harbor-accent-light` | `#C39BD3` | Light accent variants |

Defined in `apps/web/src/index.css` using Tailwind v4 `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-harbor-primary: #7040ca;
  --color-harbor-bg: #FAF7FC;
  --color-harbor-accent: #9B59B6;
  --color-harbor-text: #1a1a1a;
  --color-harbor-error: #C97B63;
  --color-harbor-primary-light: #9B59B6;
  --color-harbor-accent-light: #C39BD3;
  --font-family-sans: "Inter", system-ui, sans-serif;
}
```

This palette is shared with the Harbor AI Assistant for brand consistency.

## Typography

- **Font:** Inter (loaded via Google Fonts in `index.html`)
- **Question titles:** `text-2xl font-semibold text-harbor-text`
- **Subtitles / labels:** `text-harbor-text/50` (50% opacity)
- **Section headers:** `text-sm font-semibold text-harbor-accent uppercase tracking-wider`

## Animation Guidelines (Framer Motion)

All animations use smooth easing — **no spring or bounce**.

### Step Transitions
- Slide 24px horizontally + fade
- Duration: 0.4s
- Ease: `[0.4, 0, 0.2, 1]`
- Direction-aware: slides right on forward, left on back

```tsx
<motion.div
  key={step}
  initial={{ opacity: 0, x: direction * 24 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: direction * -24 }}
  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
/>
```

### Staggered Cards
- Fade-in with `0.1s` delay per card
- Vertical slide: `y: 16px` → `y: 0`
- Duration: 0.5s

### AnimatePresence
- Always use `mode="wait"` — no overlapping exit/enter

## Component Patterns

### Question Types

| Component | Used by steps | Behavior |
|-----------|---------------|----------|
| `SingleSelect` | 1, 2, 3, 6, 7, 8 | Card-style radio buttons, click auto-advances |
| `MultiSelect` | 9, 11, 12, 13, 14 | Toggle cards, "None" deselects others |
| `LimitedSelect` | 10 | Multi-select capped at N, counter shown |
| `TextInput` | 4 | Single-line input with placeholder |
| `NumberInput` | 5 | Number with +/- stepper buttons |
| `TextArea` | 15, 16 | Multi-line with 500-char count |

### Selection Cards
```
Unselected: border-harbor-primary/15 hover:border-harbor-primary/30 bg-white
Selected:   border-harbor-accent bg-harbor-accent/10
```

- SingleSelect: `rounded-full` radio-style indicator
- MultiSelect: `rounded-md` checkbox with white checkmark

### Button
```
Primary:  bg-harbor-primary text-white hover:bg-harbor-primary-light rounded-xl px-8 py-3
Disabled: opacity-50 cursor-not-allowed
```

### Progress Bar
- Fixed at top of page
- `harbor-accent` color
- Width: `(currentStep / totalSteps) * 100%`
- CSS transition animation

### Micro-Copy
Encouraging italic text in `text-harbor-accent` at key transitions:

| Step | Text |
|------|------|
| 4 | "Now let's learn about your child." |
| 9 | "This helps us understand your family's support system." |
| 11 | "Understanding the daily picture helps us help you." |
| 15 | "Almost there. These last two are the most important." |

## Key Pages

### Quiz Flow (`/onboarding`)
- One question at a time, centered (`max-w-xl`)
- Progress bar at top
- Back (ghost) / Continue (primary) navigation at bottom
- No account required — fully guest-accessible

### Results Page (`/results`)
- Archetype reveal with trait summary
- Sales content for detailed report
- CTA: "Get Your Full Report"

### Checkout (`/checkout`)
- Stripe-powered payment
- Order summary with archetype info

### Report (`/report`)
- Detailed PDF report with trait analysis
- Archetype-specific guidance

### Admin Dashboard (`/admin`)
- Secret-key protected
- Funnel analytics: step dropoff, conversion rates
- Daily trend, archetype distribution
- Recent submissions table
