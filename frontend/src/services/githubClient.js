function createError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

const REPOSITORY_SNAPSHOT_URL =
  'https://raw.githubusercontent.com/ashmitahaldar/ashmitahaldar.github.io/main/frontend/public/github-contributions.json';
const LOCAL_SNAPSHOT_URL = '/github-contributions.json';

function getSnapshotUrls() {
  const hostname = typeof window === 'undefined' ? '' : window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

  return isLocalhost
    ? [LOCAL_SNAPSHOT_URL, REPOSITORY_SNAPSHOT_URL]
    : [REPOSITORY_SNAPSHOT_URL, LOCAL_SNAPSHOT_URL];
}

function getCacheBustedUrl(url) {
  const snapshotUrl = new URL(url, window.location.origin);
  snapshotUrl.searchParams.set('v', Date.now().toString());
  return snapshotUrl.toString();
}

export function extractGitHubUsername(githubUrlOrHandle) {
  if (!githubUrlOrHandle || typeof githubUrlOrHandle !== 'string') return null;

  const trimmed = githubUrlOrHandle.trim().replace(/\/+$/, '');
  if (!trimmed) return null;

  if (!trimmed.includes('://') && !trimmed.includes('/')) {
    return trimmed.replace(/^@/, '') || null;
  }

  try {
    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return null;
    return segments[0].replace(/^@/, '') || null;
  } catch {
    return null;
  }
}

function normalizeContributionRows(rows) {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((entry, index) => {
      const isoDate = String(entry?.isoDate || entry?.date || '').slice(0, 10);
      if (!isoDate) return null;

      const count = Number(entry?.count) || 0;
      const levelValue = Number(entry?.level);
      const level = Number.isFinite(levelValue)
        ? Math.max(0, Math.min(4, levelValue))
        : count === 0
          ? 0
          : count < 3
            ? 1
            : count < 5
              ? 2
              : count < 8
                ? 3
                : 4;

      return {
        key: isoDate,
        isoDate,
        count,
        level,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Date.parse(a.isoDate) - Date.parse(b.isoDate));
}

async function fetchJson(url) {
  const response = await fetch(getCacheBustedUrl(url), { cache: 'no-store' });
  if (!response.ok) {
    throw createError(`Contributions snapshot unavailable (${response.status})`, 'SNAPSHOT_UNAVAILABLE');
  }

  return response.json();
}

async function fetchSnapshot(username) {
  let lastError = null;
  let payload = null;

  for (const url of getSnapshotUrls()) {
    try {
      payload = await fetchJson(url);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!payload) {
    throw lastError || createError('Contributions snapshot unavailable', 'SNAPSHOT_UNAVAILABLE');
  }

  const snapshotUsername = extractGitHubUsername(payload?.username || payload?.login || '');
  const requestedUsername = extractGitHubUsername(username || '');

  if (requestedUsername && snapshotUsername && requestedUsername !== snapshotUsername) {
    throw createError(
      `Snapshot username mismatch (${snapshotUsername})`,
      'SNAPSHOT_USERNAME_MISMATCH'
    );
  }

  return payload;
}

export async function getGitHubContributions(username, days = 364) {
  const payload = await fetchSnapshot(username);
  const normalized = normalizeContributionRows(payload?.contributions || []);
  return !Number.isFinite(days) || days <= 0 ? normalized : normalized.slice(-days);
}

export async function getGitHubContributionSnapshot(username, days = 364) {
  const payload = await fetchSnapshot(username);
  const normalized = normalizeContributionRows(payload?.contributions || []);
  const rows = !Number.isFinite(days) || days <= 0 ? normalized : normalized.slice(-days);
  return {
    rows,
    generatedAt: payload?.generatedAt || null,
  };
}
