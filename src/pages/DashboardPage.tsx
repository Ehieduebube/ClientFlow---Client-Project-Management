import { PageHeader } from '@/components/ui/PageHeader'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { MyWorkSection } from '@/components/dashboard/MyWorkSection'
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines'
import { RecentProjects } from '@/components/dashboard/RecentProjects'
import { ProjectsByStatusChart } from '@/components/dashboard/ProjectsByStatusChart'
import { TaskCompletionChart } from '@/components/dashboard/TaskCompletionChart'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useAuth } from '@/context/AuthContext'

function Panel({
  title,
  action,
  children,
  delay = 0,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  delay?: number
}) {
  return (
    <section
      className="rounded-lg border border-ink-200 bg-white p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const {
    isLoading,
    isError,
    refetch,
    stats,
    myWork,
    upcomingDeadlines,
    recentlyUpdatedProjects,
    projectsByStatus,
    taskCompletionTrend,
  } = useDashboardData()

  const firstName = user?.email?.split('@')[0]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorState message="We couldn't load your dashboard data." onRetry={refetch} />
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back${firstName ? `, ${firstName}` : ''}`}
        description="Here's what needs your attention right now."
      />

      <div className="mb-6">
        <StatsRow
          activeClients={stats.activeClients}
          activeProjects={stats.activeProjects}
          dueThisWeek={stats.dueThisWeek}
          overdue={stats.overdueTasks}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Panel title="Projects by status" delay={60}>
          <div className="mt-3">
            <ProjectsByStatusChart data={projectsByStatus} />
          </div>
        </Panel>
        <Panel title="Task completion" delay={100}>
          <div className="mt-3">
            <TaskCompletionChart data={taskCompletionTrend} />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="My work" delay={140}>
            <div className="mt-3">
              <MyWorkSection overdue={myWork.overdue} dueToday={myWork.dueToday} upcoming={myWork.upcoming} />
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Upcoming deadlines" delay={180}>
            <UpcomingDeadlines projects={upcomingDeadlines} />
          </Panel>

          <Panel title="Recently updated" delay={220}>
            <RecentProjects projects={recentlyUpdatedProjects} />
          </Panel>
        </div>
      </div>
    </div>
  )
}
