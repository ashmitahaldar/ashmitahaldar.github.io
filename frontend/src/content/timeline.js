// Life as a git log — rendered on /about (#timeline), newest first.
// ⚑ TODO: dates and milestones are seeded guesses from your bio —
// fix the years, add the real firsts (hackathons, internships,
// ships, wins). `head: true` marks the latest entry (HEAD -> now).
// type reads like a commit prefix: init / feat / fix / chore.

export const LIFE_LOG = [
  { year: '2026', type: 'feat',  scope: 'site',  text: 'rebuilt this site — fewer boxes, more me', head: true },
  { year: '2024', type: 'feat',  scope: 'nus',   text: 'started computer science + entrepreneurship @ NUS' },
  { year: '2023', type: 'feat',  scope: 'moved', text: 'Singapore — fourth country, same fascination' },
  { year: '2021', type: 'feat',  scope: 'moved', text: 'the Vietnam years — lived, studied, adapted' },
  { year: '20xx', type: 'feat',  scope: 'code',  text: 'first program, because I wanted to know how video games work' },
  { year: '20xx', type: 'feat',  scope: 'moved', text: 'a few years in Taiwan' },
  { year: '20xx', type: 'chore', scope: 'moved', text: 'cities across India — never one single place to call home' },
  { year: '200x', type: 'init',  text: 'born in India' },
];

// Deterministic short "commit hash" from the entry text, so every
// entry (including ones you add later) gets a stable-looking sha.
export function fakeHash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, 'a').slice(0, 7);
}
