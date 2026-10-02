import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ObUser, Report, Role } from '../data/domain'

// Publishable key memang aman dikirim ke browser; secret/service key tidak pernah digunakan di sini.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://ydwarmmglbtuxcrgfmrt.supabase.co') as string
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Qa8diHjtx2xanHhQLjd5nQ_NRXtTdmd') as string

export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = Boolean(supabase)

export interface AuthIdentity {
  userId: string
  profileId?: string
  email: string
  fullName: string
  role: Role
}

function toRole(value: unknown): Role {
  return value === 'admin' || value === 'ob' ? value : 'umum'
}

async function identityFromUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): Promise<AuthIdentity> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  const { data, error } = await supabase.from('profiles').select('id, full_name, role').eq('user_id', user.id).maybeSingle()
  if (error) throw error
  return {
    userId: user.id,
    profileId: data?.id,
    email: user.email ?? '',
    fullName: data?.full_name ?? String(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Pengguna'),
    role: toRole(data?.role),
  }
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi. Hubungi administrator.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (!data.user) throw new Error('Akun tidak ditemukan.')
  return identityFromUser(data.user)
}

export async function getCurrentIdentity() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.user ? identityFromUser(data.session.user) : null
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
}

export async function fetchReportsForIdentity(identity: AuthIdentity): Promise<Report[]> {
  if (!supabase) return []
  let query = supabase.from('reports').select('*').order('created_at', { ascending: false })
  if (identity.role === 'umum') query = query.eq('user_id', identity.userId)
  if (identity.role === 'ob' && identity.profileId) query = query.eq('assigned_ob_id', identity.profileId)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(row => ({
    id: row.id,
    userId: row.user_id,
    reporter: row.user_id === identity.userId ? identity.fullName : 'Pengguna BersihKita',
    location: row.location,
    category: row.category ?? 'Area fasilitas',
    description: row.description,
    photoBeforeUrl: row.photo_before_url,
    status: row.status as Report['status'],
    assignedObId: row.assigned_ob_id ?? undefined,
    photoAfterUrl: row.photo_after_url ?? undefined,
    obNotes: row.ob_notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function fetchObProfiles(): Promise<ObUser[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('profiles').select('id, full_name').eq('role', 'ob').order('full_name')
  if (error) throw error
  return (data ?? []).map((row, index) => ({
    id: row.id,
    name: row.full_name,
    initials: row.full_name.split(' ').map((part: string) => part[0]).join('').slice(0, 2).toUpperCase(),
    color: ['bg-violet-100 text-violet-700', 'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700'][index % 3],
    activeJobs: 0,
  }))
}

export async function submitReport(input: { userId: string; location: string; category?: string; description: string; photoBeforeUrl: string }) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  return supabase.from('reports').insert({ user_id: input.userId, location: input.location, category: input.category ?? null, description: input.description, photo_before_url: input.photoBeforeUrl, status: 'PENDING' }).select().single()
}

export async function verifyReport(reportId: string, decision: 'approve' | 'reject') {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  return supabase.from('reports').update({ status: decision === 'approve' ? 'APPROVED' : 'REJECTED' }).eq('id', reportId).select().single()
}

export async function deleteReport(reportId: string) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  return supabase.from('reports').delete().eq('id', reportId)
}

export async function assignReport(reportId: string, obId: string) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  return supabase.from('reports').update({ assigned_ob_id: obId, status: 'IN_PROGRESS' }).eq('id', reportId).select().single()
}

export async function completeReport(reportId: string, photoAfterUrl: string, obNotes: string) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  return supabase.from('reports').update({ status: 'COMPLETED', photo_after_url: photoAfterUrl, ob_notes: obNotes }).eq('id', reportId).select().single()
}

export async function uploadReportPhoto(file: File, userId: string) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  const path = `${userId}/${crypto.randomUUID()}-${file.name}`
  const result = await supabase.storage.from('report-photos').upload(path, file, { upsert: false })
  if (result.error) throw result.error
  return supabase.storage.from('report-photos').getPublicUrl(path).data.publicUrl
}
