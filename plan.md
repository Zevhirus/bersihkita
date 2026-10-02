# Plan — BersihKita

## Tujuan
Membangun dashboard pelaporan kebersihan yang menggunakan Supabase Auth dan RLS sebagai sumber kebenaran akses untuk role UMUM, ADMIN, dan OB.

## Keputusan implementasi
- **Framework:** React + TypeScript + Vite.
- **Styling:** Tailwind CSS melalui utility classes dan CSS tokens lokal.
- **Auth:** Supabase email/password; `profiles.role` menentukan dashboard dan tidak ada role switcher.
- **Data:** laporan dibaca dari Supabase; UMUM difilter `user_id`, OB difilter `assigned_ob_id`, ADMIN dapat melihat seluruh laporan sesuai RLS.
- **Workflow:** submit, verify, assign, complete, upload foto, dan logout memakai boundary Supabase typed.
- **Seed:** `supabase/akunseed.template.sql` berisi lima akun role nyata dari pengguna.
- **Route:** single-page dashboard dengan route manifest `/manus-routes.json`.
- **SQL:** `supabase/schema.sql` berisi enum, tabel, indeks, trigger `updated_at`, Storage policy, dan RLS.

## Struktur proyek
- `src/App.tsx` — auth gate, session, shell role-based, state/query laporan.
- `src/components.tsx` — login, sidebar, header, stat cards, status badge, before/after, modal/form.
- `src/data/domain.ts` — tipe domain, metadata role/status, helper tipe.
- `src/lib/supabase.ts` — Supabase client, Auth, profile lookup, query/mutation boundary.
- `src/index.css` — Tailwind directives, design tokens, typography, motion, scrollbar.
- `public/manus-routes.json` — deklarasi route yang tersedia.
- `supabase/schema.sql` — DDL PostgreSQL + RLS + Storage policies.
- `supabase/akunseed.template.sql` — seed akun yang diterapkan ke project Supabase.
- `README.md` — cara menjalankan, login, dan menerapkan seed.

## Desain
- **Design movement:** editorial civic-tech dashboard — tenang, presisi, dan manusiawi, bukan panel admin generik.
- **Core principles:** status terbaca sekilas, tindakan dekat konteks laporan, kontras tinggi membangun kepercayaan, responsif dari panel kerja ke bottom navigation mobile.
- **Color philosophy:** navy sebagai jangkar institusional; blue sebagai energi aksi; mint/amber/rose sebagai sinyal status; off-white memberi ruang napas.
- **Layout paradigm:** sidebar navy sebagai rail orientasi dan konten utama memakai komposisi queue + context.
- **Signature elements:** logo mark tetes + kilau, live pulse status, kartu before/after.
- **Interaction philosophy:** aksi terkonfirmasi melalui toast dan modal detail mempertahankan konteks laporan.
- **Animation:** fade-up singkat, hover 2px, pulse halus, modal scale; hormati `prefers-reduced-motion`.
- **Typography:** Inter untuk UI dan angka, Plus Jakarta Sans untuk headline.
- **Brand essence:** “Satu laporan kecil, dampak yang terasa bersih” untuk pelapor, admin fasilitas, dan OB; **jelas, sigap, peduli**.
- **Brand voice:** CTA lugas dan suportif, seperti “Laporkan area yang perlu ditangani.” dan “Tugaskan, bersihkan, buktikan.”
- **Wordmark & logo:** wordmark BersihKita dengan mark tetes air dan sapuan diagonal.
- **Signature brand color:** `#2F7DF4` BersihKita Blue.

## Serving
Vite dev server listen pada `0.0.0.0:3000`, dengan build production ke `dist`. Preview memakai path relatif dan SPA fallback.
