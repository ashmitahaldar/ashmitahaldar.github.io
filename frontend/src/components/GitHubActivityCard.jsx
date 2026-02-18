import React, { useEffect, useMemo, useState } from 'react';
import { Github } from 'lucide-react';
import PixelCard from './PixelCard';
import { extractGitHubUsername, getGitHubContributions } from '../services/githubClient';
import styles from './GitHubActivityCard.module.css';

const CONTRIBUTION_DAYS = 364;

const createEmptyContributions = (days = CONTRIBUTION_DAYS) => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      key: `${date.toISOString()}-${index}`,
      isoDate: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    };
  });
};

export default function GitHubActivityCard({ github }) {
  const [contributionDays, setContributionDays] = useState(() => createEmptyContributions(CONTRIBUTION_DAYS));
  const [dataSource, setDataSource] = useState('Loading...');
  const weekColumns = Math.ceil(contributionDays.length / 7);

  useEffect(() => {
    const load = async () => {
      const username = extractGitHubUsername(github);
      if (!username) {
        setContributionDays(createEmptyContributions(CONTRIBUTION_DAYS));
        setDataSource('GitHub not configured');
        return;
      }

      try {
        const rows = await getGitHubContributions(username, CONTRIBUTION_DAYS);
        if (rows.length > 0) {
          setContributionDays(rows);
          setDataSource(`Live (GraphQL) • @${username}`);
          return;
        }
        setContributionDays(createEmptyContributions(CONTRIBUTION_DAYS));
        setDataSource(`No activity • @${username}`);
      } catch (error) {
        console.error('GitHub activity load failed:', error);
        setContributionDays(createEmptyContributions(CONTRIBUTION_DAYS));
        if (error?.code === 'MISSING_TOKEN') {
          setDataSource('Set REACT_APP_GITHUB_TOKEN');
          return;
        }
        if (error?.message?.includes('Bad credentials')) {
          setDataSource('Invalid GitHub token');
          return;
        }
        if (error?.message?.includes('Resource not accessible by personal access token')) {
          setDataSource('Token lacks required access');
          return;
        }
        if (error?.code === 'USER_NOT_FOUND') {
          setDataSource('GitHub user not found');
          return;
        }
        if (error?.code === 'GRAPHQL_TIMEOUT') {
          setDataSource('GitHub API timeout');
          return;
        }
        if (error instanceof TypeError) {
          setDataSource('Network/CORS blocked');
          return;
        }
        setDataSource(`Unable to load • @${username}`);
      }
    };

    load();
  }, [github]);

  const monthMarkers = useMemo(
    () => {
      const markers = [];
      let lastColumn = -10;

      contributionDays.forEach((entry, index) => {
        const date = new Date(entry.isoDate);
        const isMonthStart = date.getDate() === 1 || index === 0;
        if (!isMonthStart) return;

        const column = Math.floor(index / 7) + 1;
        if (column - lastColumn < 2) return;

        markers.push({
          key: `${entry.key}-m`,
          label: date.toLocaleDateString(undefined, { month: 'short' }),
          column,
        });
        lastColumn = column;
      });

      return markers;
    },
    [contributionDays]
  );

  return (
    <PixelCard className={styles.contributionCard}>
      <div className={styles.header}>
        <Github className={styles.headerIcon} />
        <h3 className={styles.headerTitle}>GitHub Activity</h3>
        <span className={styles.badge}>{dataSource}</span>
      </div>

      <div
        className={styles.heatmapViewport}
        style={{ '--week-cols': weekColumns }}
      >
        <div className={styles.monthRow}>
          {monthMarkers.map((marker) => (
            <span
              key={marker.key}
              className={styles.monthLabel}
              style={{ gridColumn: `${marker.column} / span 2` }}
            >
              {marker.label}
            </span>
          ))}
        </div>

        <div className={styles.heatmapGrid}>
          {contributionDays.map((day) => (
            <span
              key={day.key}
              className={`${styles.heatCell} ${styles[`heatLevel${day.level}`]}`}
              data-tooltip={`${day.isoDate} • ${day.count} contributions`}
              title={`${day.isoDate} • ${day.count} contributions`}
            />
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendText}>Less</span>
        <span className={`${styles.legendCell} ${styles.heatLevel0}`} />
        <span className={`${styles.legendCell} ${styles.heatLevel1}`} />
        <span className={`${styles.legendCell} ${styles.heatLevel2}`} />
        <span className={`${styles.legendCell} ${styles.heatLevel3}`} />
        <span className={`${styles.legendCell} ${styles.heatLevel4}`} />
        <span className={styles.legendText}>More</span>
      </div>
    </PixelCard>
  );
}
