-- Template seed akun BersihKita.
-- Seed asli dari pengguna sudah diterapkan ke Supabase secara idempotent.
-- Isi password melalui secret manager/SQL Editor pribadi; jangan commit password ke Git.
-- Jalankan setelah schema.sql.

create extension if not exists pgcrypto;

-- Gunakan pola akun berikut dengan password aman yang dikelola di luar repository:
-- admin@lapor.test  | Administrator | admin
-- ob1@lapor.test    | Budi (OB)     | ob
-- ob2@lapor.test    | Siti (OB)     | ob
-- umum1@lapor.test  | Andi Pelapor  | umum
-- umum2@lapor.test  | Rina Pelapor  | umum

-- Setelah user dibuat melalui Supabase Auth, jalankan update role berikut:
-- update public.profiles set role = 'admin', full_name = 'Administrator'
-- where user_id = 'UUID_USER_ADMIN';
-- update public.profiles set role = 'ob', full_name = 'Budi (OB)'
-- where user_id = 'UUID_USER_OB1';
-- update public.profiles set role = 'ob', full_name = 'Siti (OB)'
-- where user_id = 'UUID_USER_OB2';
-- update public.profiles set role = 'umum', full_name = 'Andi Pelapor'
-- where user_id = 'UUID_USER_UMUM1';
-- update public.profiles set role = 'umum', full_name = 'Rina Pelapor'
-- where user_id = 'UUID_USER_UMUM2';
