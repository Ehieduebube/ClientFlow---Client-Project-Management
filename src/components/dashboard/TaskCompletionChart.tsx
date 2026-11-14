import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_INK, TASK_TREND_COLOR } from '@/lib/chartColors'

interface TaskCompletionChartProps {
  data: { label: string; completed: number }[]
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: { label: string; completed: number } }[] }) {
  if (!active || !payload?.length) return null
  const { label, completed } = payload[0].payload
  return (
    <div className="rounded-md border border-ink-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-ink-900">Week of {label}</p>
      <p className="text-ink-600">{completed} {completed === 1 ? 'task' : 'tasks'} completed</p>
    </div>
  )
}

export function TaskCompletionChart({ data }: TaskCompletionChartProps) {
  const total = data.reduce((sum, d) => sum + d.completed, 0)

  return (
    <>
      <p className="mb-1 text-2xl font-semibold text-ink-900">{total}</p>
      <p className="mb-3 text-xs text-ink-600">tasks completed in the last 8 weeks</p>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="taskTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TASK_TREND_COLOR} stopOpacity={0.18} />
              <stop offset="100%" stopColor={TASK_TREND_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: CHART_INK.axis, fontSize: 11 }} interval={1} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: CHART_INK.axis, fontSize: 11 }} width={24} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="completed"
            stroke={TASK_TREND_COLOR}
            strokeWidth={2}
            fill="url(#taskTrendFill)"
            dot={{ r: 3, fill: TASK_TREND_COLOR, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: TASK_TREND_COLOR, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}
