// Static content for sections that don't live in Sanity.
// TODO items are flagged with ⚑ — fill these in before shipping.

export const HOME_CONTENT = {
  // ── // now section ────────────────────────────────────────
  // ⚑ Replace every `text` field with what you're actually doing right now.
  now: {
    updated: 'May 2026',
    items: [
      { icon: 'build',  label: 'building',  text: '⚑ fill in what you\'re currently building' },
      { icon: 'read',   label: 'reading',   text: '"Show Your Work" by Austin Kleon' },
      { icon: 'learn',  label: 'learning',  text: '⚑ fill in what you\'re learning' },
      { icon: 'listen', label: 'listening', text: 'lo-fi house & the Acquired podcast' },
      { icon: 'travel', label: 'next stop', text: '⚑ fill in your next destination' },
    ],
  },

  // ── skills (rendered as a JS object literal) ──────────────
  // ⚑ Review and edit — the list is a reasonable starting point.
  // Append † to items you're currently learning (shows "// † = currently learning" footer).
  skills: [
    { group: 'languages',  items: ['TypeScript', 'Python', 'Java', 'C++', 'SQL', 'Rust†'] },
    { group: 'frameworks', items: ['React', 'Next.js', 'Node', 'FastAPI', 'Tailwind', 'Three.js'] },
    { group: 'data + ml',  items: ['Postgres', 'Prisma', 'pgvector', 'PyTorch', 'pandas'] },
    { group: 'design',     items: ['Figma', 'Framer', 'Procreate', 'After Effects'] },
    { group: 'ops',        items: ['Git', 'Docker', 'Vercel', 'Fly.io', 'GitHub Actions'] },
  ],

  // ── fun facts ─────────────────────────────────────────────
  // ⚑ Replace placeholders with real facts about you.
  funFacts: [
    { k: 'books / yr',     v: '~30',              note: 'mostly fiction + memoirs' },
    { k: 'coffee',         v: 'oat flat white',    note: 'two, no more' },
    { k: 'IDE theme',      v: 'Tokyo Night',       note: 'pink accent, of course' },
    { k: 'most prod hour', v: '11 pm → 2 am' },
    { k: 'side quest',     v: '⚑ fill in a side quest' },
    { k: 'best code spot', v: '⚑ fill in your best spot' },
    { k: 'keyboard',       v: '⚑ fill in your keyboard' },
    { k: 'love letter to', v: 'handmade typography' },
  ],
};
