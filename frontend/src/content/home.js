// Static content — fallback for when Sanity fields aren't populated.
// NowSection uses now.items when Sanity nowItems is empty (see Home.jsx).

export const HOME_CONTENT = {
  // ── // now section ────────────────────────────────────────
  // Populated via Sanity (profile.nowItems / profile.nowUpdated).
  // This fallback shows only items with real values so nothing
  // placeholder-looking ever reaches production.
  now: {
    updated: 'May 2026',
    items: [
      { icon: 'read',   label: 'reading',   text: '"Show Your Work" by Austin Kleon' },
      { icon: 'listen', label: 'listening', text: 'lo-fi house & the Acquired podcast' },
    ],
  },

  // ── skills (rendered as a JS object literal) ──────────────
  // Append † to items you're currently learning.
  skills: [
    { group: 'languages',  items: ['TypeScript', 'Python', 'Java', 'C++', 'SQL', 'Rust†'] },
    { group: 'frameworks', items: ['React', 'Next.js', 'Node', 'FastAPI', 'Tailwind', 'Three.js'] },
    { group: 'data + ml',  items: ['Postgres', 'Prisma', 'pgvector', 'PyTorch', 'pandas'] },
    { group: 'design',     items: ['Figma', 'Framer', 'Procreate', 'After Effects'] },
    { group: 'ops',        items: ['Git', 'Docker', 'Vercel', 'Fly.io', 'GitHub Actions'] },
  ],

  // ── fun facts ─────────────────────────────────────────────
  funFacts: [
    { k: 'books / yr',     v: '~30',           note: 'mostly fiction + memoirs' },
    { k: 'coffee',         v: 'oat flat white', note: 'two, no more' },
    { k: 'IDE theme',      v: 'Tokyo Night',    note: 'pink accent, of course' },
    { k: 'most prod hour', v: '11 pm → 2 am' },
    { k: 'side quest',     v: 'Singapore MRT trivia videos' },
    { k: 'best code spot', v: 'on my bed' },
    { k: 'keyboard',       v: 'Aula F99' },
    { k: 'love letter to', v: 'handmade typography' },
  ],
};
