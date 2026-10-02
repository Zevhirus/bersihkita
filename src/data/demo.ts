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
  umum: { label: 'UMUM', title: 'Halo, Rani', subtitle: 'Pantau laporan kebersihanmu di sini.', initials: 'RS' },
  admin: { label: 'ADMIN', title: 'Selamat pagi, Dimas', subtitle: 'Jaga alur fasilitas tetap sigap hari ini.', initials: 'DP' },
  ob: { label: 'OB / CLEANING', title: 'Halo, Budi', subtitle: 'Ada tugas yang siap kamu tuntaskan.', initials: 'BS' },
}

export const obUsers: ObUser[] = [
  { id: 'ob-budi', name: 'Budi Santoso', initials: 'BS', color: 'bg-violet-100 text-violet-700', activeJobs: 2 },
  { id: 'ob-sari', name: 'Sari Wulandari', initials: 'SW', color: 'bg-rose-100 text-rose-700', activeJobs: 1 },
  { id: 'ob-andi', name: 'Andi Pratama', initials: 'AP', color: 'bg-amber-100 text-amber-700', activeJobs: 0 },
]

export const initialReports: Report[] = [
  {
    id: 'BR-240819-01', userId: 'user-rani', reporter: 'Rani Saputri', location: 'Lantai 2 · Ruang Kolaborasi 2A', category: 'Ruang kerja',
    description: 'Tempat sampah penuh dan ada tumpahan kopi di dekat meja bersama. Mohon dibersihkan sebelum sesi siang.',
    photoBeforeUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&auto=format&fit=crop&q=82', status: 'PENDING',
    createdAt: '2026-10-02T08:42:00+07:00', updatedAt: '2026-10-02T08:42:00+07:00',
  },
  {
    id: 'BR-240819-02', userId: 'user-rani', reporter: 'Rani Saputri', location: 'Lantai 1 · Pantry Utama', category: 'Pantry',
    description: 'Lantai pantry licin setelah dispenser bocor. Sudah dipasang tanda hati-hati sementara.',
    photoBeforeUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&auto=format&fit=crop&q=82', status: 'IN_PROGRESS', assignedObId: 'ob-budi', assignedObName: 'Budi Santoso',
    createdAt: '2026-10-02T07:10:00+07:00', updatedAt: '2026-10-02T07:52:00+07:00',
  },
  {
    id: 'BR-240818-04', userId: 'user-rani', reporter: 'Rani Saputri', location: 'Basement · Toilet Wanita', category: 'Toilet',
    description: 'Cermin dan wastafel perlu dibersihkan. Tisu juga hampir habis.',
    photoBeforeUrl: 'https://images.unsplash.com/photo-1584622781867-8c1dbe42fb3f?w=900&auto=format&fit=crop&q=82', status: 'COMPLETED', assignedObId: 'ob-sari', assignedObName: 'Sari Wulandari',
    photoAfterUrl: 'https://images.unsplash.com/photo-1584622781867-8c1dbe42fb3f?w=900&auto=format&fit=crop&q=82', obNotes: 'Area sudah dibersihkan dan refill tisu sudah dilakukan.',
    createdAt: '2026-10-01T15:20:00+07:00', updatedAt: '2026-10-01T16:05:00+07:00',
  },
  {
    id: 'BR-240818-03', userId: 'user-eko', reporter: 'Eko Pratama', location: 'Lantai 3 · Koridor Timur', category: 'Area publik',
    description: 'Debu terlihat cukup tebal di sudut koridor dekat ruang meeting.',
    photoBeforeUrl: 'https://images.unsplash.com/photo-1581579185169-9c9b0c2fbe1b?w=900&auto=format&fit=crop&q=82', status: 'PENDING',
    createdAt: '2026-10-02T08:05:00+07:00', updatedAt: '2026-10-02T08:05:00+07:00',
  },
  {
    id: 'BR-240817-09', userId: 'user-nadia', reporter: 'Nadia Putri', location: 'Lantai 4 · Ruang Rapat 4B', category: 'Ruang meeting',
    description: 'Kursi dan meja perlu dirapikan setelah kegiatan sore. Mohon dicek juga area bawah meja.',
    photoBeforeUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=82', status: 'REJECTED',
    createdAt: '2026-10-01T12:12:00+07:00', updatedAt: '2026-10-01T12:35:00+07:00',
  },
]

export const formatRelativeDate = (iso: string) => {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
}
