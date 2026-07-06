// Fallback microblog entries — used when the Sanity `microblog` type
// has no documents yet. Add real entries in the Studio and these
// disappear automatically.
// ⚑ TODO: replace/retire these once the first real logs are published.

export const LOG_FALLBACK = [
  {
    _id: 'fallback-1',
    postedAt: '2026-07-06T21:30:00+08:00',
    text: 'rebuilt the home page. fewer boxes, more air. the site breathes now.',
    mood: '🌱',
    tags: ['meta', 'site'],
  },
  {
    _id: 'fallback-2',
    postedAt: '2026-07-04T23:10:00+08:00',
    text: 'learning: naming things is still the hardest problem. today\'s casualty: a variable named `thing2`.',
    mood: '🙃',
    tags: ['dev'],
  },
  {
    _id: 'fallback-3',
    postedAt: '2026-07-01T22:00:00+08:00',
    text: 'started sketching the 3d version of me for the hero. she already types faster than i do.',
    mood: '✨',
    tags: ['art', '3d'],
  },
];
