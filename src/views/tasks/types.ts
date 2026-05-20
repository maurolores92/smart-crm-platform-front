export interface User {
  id: number
  name: string
  lastName: string
  email: string
}

export interface Lead {
  id: number
  name: string
  company: string
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  assignedUser?: User | null
  assignedUserId?: number | null
  lead?: Lead | null
  leadId?: number | null
  createdAt: string
}

export interface TaskFormState {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignedUserId?: number | null
  leadId?: number | null
}
