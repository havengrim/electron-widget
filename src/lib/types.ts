// src/lib/types.ts
export type DocumentData = {
  id: string
  drn: string
  name: string
  position: string
  office: string
  dateReceived: string
  startDate: string
  endDate: string
  status: 'pending' | 'in-progress' | 'completed' | string
  moaContract?: boolean
  pds?: boolean
  drugTest?: boolean
}
