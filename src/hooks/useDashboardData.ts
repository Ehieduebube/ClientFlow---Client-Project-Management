import { useMemo } from 'react'
import { useClients } from '@/hooks/useClients'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import { isDueThisWeek, isDueToday, isOverdue, parseDate } from '@/lib/utils'
import type { Client, ProjectWithClient, TaskWithProject } from '@/types'
import { startOfWeek, subWeeks, isWithinInterval, endOfWeek, format } from 'date-fns'

const EMPTY_CLIENTS: Client[] = []
const EMPTY_PROJECTS: ProjectWithClient[] = []
const EMPTY_TASKS: TaskWithProject[] = []

export function useDashboardData() {
  const clientsQuery = useClients()
  const projectsQuery = useProjects()
  const tasksQuery = useTasks()

  const isLoading = clientsQuery.isLoading || projectsQuery.isLoading || tasksQuery.isLoading
  const isError = clientsQuery.isError || projectsQuery.isError || tasksQuery.isError

  const clients = clientsQuery.data ?? EMPTY_CLIENTS
  const projects = projectsQuery.data ?? EMPTY_PROJECTS
  const tasks = tasksQuery.data ?? EMPTY_TASKS

  const stats = useMemo(() => {
    const activeClients = clients.filter((c) => c.status === 'active').length
    const activeProjects = projects.filter((p) => p.status !== 'completed').length
    const openTasks = tasks.filter((t) => t.status !== 'done')
    const overdueTasks = openTasks.filter((t) => isOverdue(t.due_date)).length
    const dueThisWeek = openTasks.filter((t) => isDueThisWeek(t.due_date)).length

    return { activeClients, activeProjects, overdueTasks, dueThisWeek }
  }, [clients, projects, tasks])

  const myWork = useMemo(() => {
    const openTasks = tasks.filter((t) => t.status !== 'done' && t.due_date)
    const sortByDate = (a: TaskWithProject, b: TaskWithProject) =>
      parseDate(a.due_date!).getTime() - parseDate(b.due_date!).getTime()

    const overdue = openTasks.filter((t) => isOverdue(t.due_date)).sort(sortByDate)
    const dueToday = openTasks.filter((t) => isDueToday(t.due_date)).sort(sortByDate)
    const upcoming = openTasks
      .filter((t) => !isOverdue(t.due_date) && !isDueToday(t.due_date) && isDueThisWeek(t.due_date))
      .sort(sortByDate)

    return { overdue, dueToday, upcoming }
  }, [tasks])

  const upcomingDeadlines = useMemo(() => {
    return projects
      .filter((p) => p.status !== 'completed' && p.deadline)
      .sort((a, b) => parseDate(a.deadline!).getTime() - parseDate(b.deadline!).getTime())
      .slice(0, 5)
  }, [projects])

  const recentlyUpdatedProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => parseDate(b.updated_at).getTime() - parseDate(a.updated_at).getTime())
      .slice(0, 5)
  }, [projects])

  const projectsByStatus = useMemo(() => {
    const buckets: Record<string, { status: string; label: string; count: number }> = {
      planning: { status: 'planning', label: 'Planning', count: 0 },
      in_progress: { status: 'in_progress', label: 'In Progress', count: 0 },
      review: { status: 'review', label: 'Review', count: 0 },
      completed: { status: 'completed', label: 'Completed', count: 0 },
    }
    projects.forEach((p: ProjectWithClient) => {
      buckets[p.status].count += 1
    })
    return Object.values(buckets)
  }, [projects])

  const taskCompletionTrend = useMemo(() => {
    const weeks = Array.from({ length: 8 }).map((_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
      return { weekStart, weekEnd, label: format(weekStart, 'MMM d'), count: 0 }
    })

    tasks.forEach((task) => {
      if (task.status !== 'done' || !task.completed_at) return
      const completedDate = parseDate(task.completed_at)
      const bucket = weeks.find((w) => isWithinInterval(completedDate, { start: w.weekStart, end: w.weekEnd }))
      if (bucket) bucket.count += 1
    })

    return weeks.map((w) => ({ label: w.label, completed: w.count }))
  }, [tasks])

  return {
    isLoading,
    isError,
    refetch: () => {
      clientsQuery.refetch()
      projectsQuery.refetch()
      tasksQuery.refetch()
    },
    clients,
    projects,
    tasks,
    stats,
    myWork,
    upcomingDeadlines,
    recentlyUpdatedProjects,
    projectsByStatus,
    taskCompletionTrend,
  }
}
