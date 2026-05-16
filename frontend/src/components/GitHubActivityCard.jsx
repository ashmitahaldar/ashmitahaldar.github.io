import React, { useEffect, useMemo, useState } from 'react';
import { Github } from 'lucide-react';
import CornerCard from './CornerCard';
import { extractGitHubUsername, getGitHubContributionSnapshot } from '../services/githubClient';
import styles from './GitHubActivityCard.module.css';

const CONTRIBUTION_DAYS = 364;

const createEmptyContributions = (days = CONTRIBUTION_DAYS) => {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
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
  const [lastUpdated, setLastUpdated] = useState('');
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
        const snapshot = await getGitHubContributionSnapshot(username, CONTRIBUTION_DAYS);
        const rows = snapshot.rows || [];
        const updatedText = snapshot.generatedAt
          ? new Date(snapshot.generatedAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
            })
          : '';
        setLastUpdated(updatedText);
        if (rows.length > 0) {
          setContributionDays(rows);
          setDataSource(`Synced · @${username}`);
          return;
        }
        setContributionDays(createEmptyContributions(CONTRIBUTION_DAYS));
        setDataSource(`No synced activity · @${username}`);
      } catch (error) {
        console.error('GitHub activity load failed:', error);
        setContributionDays(createEmptyContributions(CONTRIBUTION_DAYS));
        const username2 = extractGitHubUsername(github);
        if (error?.code === 'SNAPSHOT_UNAVAILABLE')       setDataSource('Run contribution sync');
        else if (error?.code === 'SNAPSHOT_USERNAME_MISMATCH') setDataSource('Snapshot username mismatch');
        else if (error instanceof TypeError)              setDataSource('Snapshot fetch failed');
        else                                              setDataSource(`Unable to load · @${username2}`);
      }
    };
    load();
  }, [github]);

  const monthMarkers = useMemo(() => {
    const markers = [];
    let lastColumn = -10;
    contributionDays.forEach((entry, index) => {
      const date = new Date(`${entry.isoDate}T00:00:00Z`);
      const isMonthStart = date.getUTCDate() === 1 || index === 0;
      if (!isMonthStart) return;
      const column = Math.floor(index / 7) + 1;
      if (column - lastColumn < 2) return;
      markers.push({
        key: `${entry.key}-m`,
        label: date.toLocaleDateString(undefined, { month: 'short', timeZone: 'UTC' }),
        column,
      });
      lastColumn = column;
    });
    return markers;
  }, [contributionDays]);

  return (
    <CornerCard tone="pink">
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8, marginBottom: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Github style={{ width: 18, height: 18, color: 'var(--pink)' }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>GitHub Activity</span>
          {lastUpdated && (
            <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>
              // last updated: {lastUpdated}
            </span>
          )}
        </div>
        <span className="ds-tag">{dataSource}</span>
      </div>

      {/* Heatmap */}
      <div style={{ overflowX: 'auto', paddingBottom: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'max-content', margin: '0 auto' }}>
          {/* Month labels */}
          <div
            className={styles.monthRow}
            style={{ '--week-cols': weekColumns }}
          >
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

          {/* Grid */}
          <div className={styles.heatmapGrid}>
            {contributionDays.map((day) => (
              <span
                key={day.key}
                className={`${styles.heatCell} ${styles[`heatLevel${day.level}`]}`}
                data-tooltip={`${day.isoDate} · ${day.count} contributions`}
                title={`${day.isoDate} · ${day.count} contributions`}
                role="img"
                aria-label={`${day.isoDate} · ${day.count} contributions`}
                tabIndex={0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={`${styles.legendCell} ${styles[`heatLevel${l}`]}`} />
        ))}
        <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>More</span>
      </div>
    </CornerCard>
  );
}
