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
  people?: People[]
}

export interface People {
  id: string
  userId: string
  signalId: string
  status: boolean
  type: SignalType
  name: string
  items: string
}

export type SignalType = 'shelter' | 'sos'
