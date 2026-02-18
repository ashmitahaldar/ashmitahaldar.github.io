import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
const DEFAULT_DAYS = 364;

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

function mustEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function parseDays() {
  const raw = process.env.GITHUB_CONTRIBUTION_DAYS?.trim();
  if (!raw) return DEFAULT_DAYS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_DAYS;
  return Math.floor(parsed);
}

function computeRange(days) {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));
  return { from, to };
}

function normalizeRows(weeks, fromIso, toIso) {
  const fromMs = Date.parse(fromIso);
  const toMs = Date.parse(toIso);
  const byDate = new Map();

  for (const week of weeks || []) {
    for (const day of week?.contributionDays || []) {
      const isoDate = String(day?.date || '').slice(0, 10);
      if (!isoDate) continue;
      const dateMs = Date.parse(isoDate);
      if (!Number.isFinite(dateMs) || dateMs < fromMs || dateMs > toMs) continue;

      const count = Number(day?.contributionCount) || 0;
      const mapped = CONTRIBUTION_LEVEL_MAP[day?.contributionLevel];
      const level = Number.isFinite(mapped)
        ? mapped
        : count === 0
          ? 0
          : count < 3
            ? 1
            : count < 5
              ? 2
              : count < 8
                ? 3
                : 4;

      byDate.set(isoDate, { count, level });
    }
  }

  const rows = [];
  const cursor = new Date(fromIso);
  const end = new Date(toIso);
  while (cursor <= end) {
    const isoDate = cursor.toISOString().slice(0, 10);
    const value = byDate.get(isoDate) || { count: 0, level: 0 };
    rows.push({ isoDate, count: value.count, level: value.level });
    cursor.setDate(cursor.getDate() + 1);
  }

  return rows;
}

async function fetchContributionCalendar({ token, username, from, to }) {
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
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`GitHub GraphQL request failed (${response.status}): ${text.slice(0, 200)}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    throw new Error(`GitHub GraphQL error: ${payload.errors[0]?.message || 'Unknown error'}`);
  }

  const weeks = payload?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks) {
    throw new Error('No contribution calendar data returned');
  }
  return weeks;
}

async function main() {
  const token = mustEnv('GITHUB_GRAPHQL_TOKEN');
  const username = mustEnv('GITHUB_USERNAME');
  const days = parseDays();
  const { from, to } = computeRange(days);

  const weeks = await fetchContributionCalendar({ token, username, from, to });
  const contributions = normalizeRows(weeks, from.toISOString().slice(0, 10), to.toISOString().slice(0, 10));

  const output = {
    username,
    generatedAt: new Date().toISOString(),
    days,
    contributions,
  };

  const outputPath = path.resolve('frontend/public/github-contributions.json');
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${contributions.length} contributions to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
