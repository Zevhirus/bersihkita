# BersihKita

Dashboard pelaporan kebersihan lingkungan/fasilitas dengan tiga role: **UMUM**, **ADMIN**, dan **OB / CLEANING SERVICE**. Aplikasi sekarang hanya menggunakan akun Supabase Auth nyata; tidak ada akun preview, data demo, atau role switcher.

## Jalankan lokal

```bash
pnpm install
pnpm dev
```

Preview default berjalan pada `http://localhost:3000`.

## Login dan pemisahan role

Halaman login menggunakan `supabase.auth.signInWithPassword`, lalu membaca `profiles.role` untuk menentukan dashboard:

- `umum` hanya melihat laporan miliknya sendiri.
- `admin` melihat seluruh laporan dan dapat approve/reject/assign.
- `ob` hanya melihat laporan yang `assigned_ob_id`-nya menunjuk ke profile miliknya.

Logout menghapus sesi aplikasi. Role tidak bisa diganti dari dashboard.

## Menerapkan seed akun

Seed asli dari pengguna sudah diterapkan ke Supabase secara idempotent melalui proses Admin API. Repository hanya menyimpan [`supabase/akunseed.template.sql`](./supabase/akunseed.template.sql) tanpa password plaintext. Jalankan template atau buat user melalui Supabase Auth setelah `supabase/schema.sql`:

| Role | Email |
|---|---|
| ADMIN | `admin@lapor.test` |
| OB | `ob1@lapor.test`, `ob2@lapor.test` |
| UMUM | `umum1@lapor.test`, `umum2@lapor.test` |

Password mengikuti seed privat yang dikirim pengguna. Ganti password akun setelah login pertama dan jangan commit kredensial ke repository.

## Hubungkan Supabase

1. Buat project Supabase.
2. Jalankan [`supabase/schema.sql`](./supabase/schema.sql) pada SQL Editor.
3. Jalankan [`supabase/akunseed.template.sql`](./supabase/akunseed.template.sql) pada SQL Editor.
4. Isi `.env.local` dengan URL dan publishable/anon key.
5. Jalankan ulang server Vite.

Frontend hanya menggunakan `SUPABASE_URL` dan publishable/anon key. **Jangan pernah menaruh `SUPABASE_SECRET_KEY` di `.env`, frontend, repository, atau browser.**

## Struktur penting

```text
src/
  App.tsx              # Auth gate, session, shell role-based, query state
  components.tsx       # Login, sidebar, header, cards, modal, status badge
  data/domain.ts         # Tipe domain dan metadata status (tanpa seed data)
  lib/supabase.ts      # Supabase Auth + query/mutation boundary
  index.css            # Tailwind + design tokens
supabase/schema.sql    # DDL, trigger, RLS, Storage policies
supabase/akunseed.template.sql  # Seed akun dari pengguna
public/manus-routes.json
```

## Hapus laporan oleh ADMIN

ADMIN memiliki tombol **Hapus laporan** pada detail laporan. Aksi meminta konfirmasi sebelum menghapus permanen. Policy RLS `reports_admin_delete` memastikan hanya role `admin` yang dapat melakukan penghapusan.

Jika database sudah dibuat sebelum fitur ini ditambahkan, jalankan [`supabase/migrations/20261002_admin_delete.sql`](./supabase/migrations/20261002_admin_delete.sql) sekali di Supabase SQL Editor. `supabase/schema.sql` juga sudah memuat policy tersebut untuk instalasi baru.

## Foto before/after

Foto before pada laporan baru wajib dipilih dan diunggah ke bucket `report-photos` sebelum record laporan dibuat. Foto after OB memakai bucket yang sama. Dengan begitu foto tetap tampil setelah refresh atau login dari perangkat lain; laporan lama yang menyimpan `blob:` URL perlu dibuat ulang atau dihapus karena URL tersebut hanya valid pada browser asal.
