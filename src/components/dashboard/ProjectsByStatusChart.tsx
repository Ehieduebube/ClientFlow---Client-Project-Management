import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { PROJECT_STATUS_CHART_COLORS, CHART_INK } from '@/lib/chartColors'
import type { ProjectStatus } from '@/types'

interface ProjectsByStatusChartProps {
  data: { status: string; label: string; count: number }[]
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: { label: string; count: number } }[] }) {
  if (!active || !payload?.length) return null
  const { label, count } = payload[0].payload
  return (
    <div className="rounded-md border border-ink-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-ink-900">{label}</p>
      <p className="text-ink-500">{count} {count === 1 ? 'project' : 'projects'}</p>
    </div>
  )
}

export function ProjectsByStatusChart({ data }: ProjectsByStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  if (total === 0) {
    return <p className="flex h-48 items-center justify-center text-sm text-ink-500">No projects yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke={CHART_INK.grid} strokeDasharray="0" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_INK.axis, fontSize: 12 }}
        />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: CHART_INK.axis, fontSize: 12 }} width={28} />
        <Tooltip cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }} content={<ChartTooltip />} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
          <LabelList dataKey="count" position="top" style={{ fill: CHART_INK.label, fontSize: 12, fontWeight: 500 }} />
          {data.map((entry) => (
            <Cell key={entry.status} fill={PROJECT_STATUS_CHART_COLORS[entry.status as ProjectStatus]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
