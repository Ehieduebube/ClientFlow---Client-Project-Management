import { Modal } from '@/components/ui/Modal'
import { TaskForm } from '@/components/tasks/TaskForm'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'
import { useToast } from '@/context/ToastContext'
import type { Task, TaskInput } from '@/types'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
  defaultProjectId?: string
  lockProject?: boolean
}

export function TaskFormModal({ isOpen, onClose, task, defaultProjectId, lockProject }: TaskFormModalProps) {
  const { showToast } = useToast()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask(task?.id ?? '', task?.project_id)

  const isSubmitting = createTask.isPending || updateTask.isPending

  async function handleSubmit(input: TaskInput) {
    try {
      if (task) {
        await updateTask.mutateAsync(input)
        showToast({ variant: 'success', title: 'Task updated' })
      } else {
        await createTask.mutateAsync(input)
        showToast({ variant: 'success', title: 'Task added' })
      }
      onClose()
    } catch (error) {
      showToast({
        variant: 'error',
        title: task ? 'Could not update task' : 'Could not add task',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit task' : 'Add task'}>
      <TaskForm
        initialValue={task}
        defaultProjectId={defaultProjectId}
        lockProject={lockProject}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
