export type Role = 'umum' | 'admin' | 'ob'
export type Status = 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'

export interface Report {
  id: string
  userId: string
  reporter: string
  location: string
  category: string
  description: string
  photoBeforeUrl: string
  status: Status
  assignedObId?: string
  assignedObName?: string
  photoAfterUrl?: string
  obNotes?: string
  createdAt: string
  updatedAt: string
}

export interface ObUser { id: string; name: string; initials: string; color: string; activeJobs: number }

export const statusMeta: Record<Status, { label: string; tone: string; dot: string }> = {
  PENDING: { label: 'Menunggu verifikasi', tone: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  APPROVED: { label: 'Disetujui admin', tone: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'Sedang dikerjakan', tone: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  COMPLETED: { label: 'Selesai', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  REJECTED: { label: 'Ditolak', tone: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
}

export const roleMeta: Record<Role, { label: string; title: string; subtitle: string; initials: string }> = {
  umum: { label: 'UMUM', title: 'Halo', subtitle: 'Pantau laporan kebersihanmu di sini.', initials: 'UM' },
  admin: { label: 'ADMIN', title: 'Selamat pagi', subtitle: 'Jaga alur fasilitas tetap sigap hari ini.', initials: 'AD' },
  ob: { label: 'OB / CLEANING', title: 'Halo', subtitle: 'Ada tugas yang siap kamu tuntaskan.', initials: 'OB' },
}

export const formatRelativeDate = (iso: string) => {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
}
