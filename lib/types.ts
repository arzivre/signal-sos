export interface Signal {
  id: string
  userId: string
  status: boolean
  type: 'shelter' | 'sos'
  author: string
  title: string
  location?: string
  necessity: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

export interface People {
  id: string
  type: string
  name: string
  email: string
}
