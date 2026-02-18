const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

const CONTRIBUTION_LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const CONTRIBUTIONS_QUERY = `
  query UserContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

function getGitHubToken() {
  return (
    process.env.REACT_APP_GITHUB_TOKEN?.trim() ||
    ''
  );
}

function createError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
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

function normalizeContributionRows(weeks) {
  if (!Array.isArray(weeks)) return [];

  return weeks
    .flatMap((week) => week?.contributionDays || [])
    .map((day) => {
      const isoDate = String(day?.date || '').slice(0, 10);
      if (!isoDate) return null;

      const count = Number(day?.contributionCount) || 0;
      const level = CONTRIBUTION_LEVEL_MAP[day?.contributionLevel] ??
        (count === 0 ? 0 : count < 3 ? 1 : count < 5 ? 2 : count < 8 ? 3 : 4);

      return {
        key: `${isoDate}-${count}`,
        isoDate,
        count,
        level,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Date.parse(a.isoDate) - Date.parse(b.isoDate));
}

export async function getGitHubContributions(username, days = 140) {
  if (!username) return [];

  const token = getGitHubToken();
  if (!token) {
    throw createError('Missing GitHub token', 'MISSING_TOKEN');
  }

  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: {
          login: username,
          from: start.toISOString(),
          to: end.toISOString(),
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '');
      throw createError(
        `GitHub GraphQL request failed (${response.status})${bodyText ? `: ${bodyText.slice(0, 140)}` : ''}`,
        'GRAPHQL_HTTP_ERROR'
      );
    }

    const payload = await response.json();

    if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
      const msg = payload.errors[0]?.message || 'GitHub GraphQL returned an error';
      throw createError(msg, 'GRAPHQL_API_ERROR');
    }

    if (!payload?.data?.user) {
      throw createError(`GitHub user "${username}" not found or inaccessible`, 'USER_NOT_FOUND');
    }

    const weeks = payload?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!weeks) {
      throw createError('No GitHub user contribution data found', 'NO_USER_DATA');
    }

    return normalizeContributionRows(weeks);
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw createError('GitHub GraphQL request timed out', 'GRAPHQL_TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
