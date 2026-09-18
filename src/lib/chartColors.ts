import type { ProjectStatus } from '@/types'

/**
 * Chart fills reuse the same semantic meaning as the StatusBadge tones
 * (lib/status.ts) so a color always means the same thing across the app.
 * Values are the validated hexes from the design system's status/categorical
 * palette, not arbitrary picks.
 */
export const PROJECT_STATUS_CHART_COLORS: Record<ProjectStatus, string> = {
  planning: '#94a3b8', // neutral — matches Badge tone="neutral"
  in_progress: '#2a78d6', // categorical blue — matches Badge tone="blue"
  review: '#fab219', // status "warning" — matches Badge tone="amber"
  completed: '#0ca30c', // status "good" — matches Badge tone="green"
}

export const CHART_INK = {
  axis: '#94a3b8',
  grid: '#e2e8f0',
  label: '#334155',
}

export const TASK_TREND_COLOR = '#2a78d6'
