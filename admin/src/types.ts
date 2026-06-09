export type AttendanceFilter = 'all' | 'yes' | 'no' | 'unknown'

export interface GuestStats {
  responsesTotal: number
  confirmedCount: number
  declinedCount: number
  adults: number
  children: number
  totalGuests: number
}

export interface Guest {
  id: string
  lastName: string
  firstName: string
  name: string
  attendance: string
  attendanceLabel: string
  statusBadge: string
  statusTone: 'yes' | 'no' | 'unknown'
  adults: number
  adultsLabel: string | null
  children: string
  childrenLabel: string
  childrenTag: string | null
  favoriteSong: string
  comment: string
  createdAt: string | null
  updatedAt: string | null
}

export interface DashboardResponse {
  stats: GuestStats
  guests: Guest[]
  updatedAt: string | null
}
