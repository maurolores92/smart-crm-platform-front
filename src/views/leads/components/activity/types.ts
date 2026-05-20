export type ActivityType = 'Note' | 'Call' | 'Meeting' | 'Email' | 'Follow Up'

export interface ActivityUser {
  id: number
  name: string
  lastName?: string
  email?: string
}

export interface Activity {
  id: number
  content: string
  type: ActivityType
  createdAt: string
  user?: ActivityUser
}

export interface ActivityCreatePayload {
  type: ActivityType
  content: string
}
