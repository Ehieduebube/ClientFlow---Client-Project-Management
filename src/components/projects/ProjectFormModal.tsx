import { Modal } from '@/components/ui/Modal'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects'
import { useToast } from '@/context/ToastContext'
import type { Project, ProjectInput } from '@/types'

interface ProjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  project?: Project
  defaultClientId?: string
}

export function ProjectFormModal({ isOpen, onClose, project, defaultClientId }: ProjectFormModalProps) {
  const { showToast } = useToast()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject(project?.id ?? '')

  const isSubmitting = createProject.isPending || updateProject.isPending

  async function handleSubmit(input: ProjectInput) {
    try {
      if (project) {
        await updateProject.mutateAsync(input)
        showToast({ variant: 'success', title: 'Project updated' })
      } else {
        await createProject.mutateAsync(input)
        showToast({ variant: 'success', title: 'Project created' })
      }
      onClose()
    } catch (error) {
      showToast({
        variant: 'error',
        title: project ? 'Could not update project' : 'Could not create project',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit project' : 'New project'}
      size="lg"
    >
      <ProjectForm
        initialValue={project}
        defaultClientId={defaultClientId}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
