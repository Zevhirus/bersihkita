# BersihKita — Delivery Outcomes

- [x] **Dashboard UMUM dan submit laporan** — Role UMUM memiliki dashboard dengan form input laporan kebersihan yang memuat unggah foto area kotor, lokasi/detail ruangan, kategori area, dan keterangan detail keluhan; submit membuat laporan berstatus `PENDING` dan laporan muncul pada daftar laporan milik user.
- [x] **Dashboard ADMIN dan verifikasi** — Role ADMIN melihat ringkasan Total Laporan, Pending, In Progress, Done, Ditolak; tabel laporan masuk menampilkan foto, lokasi, keterangan, dan aksi approve/reject; approve menyediakan assignment petugas OB dan mengubah status menjadi `IN_PROGRESS`.
- [x] **Dashboard OB dan penyelesaian** — Role OB/CLEANING SERVICE hanya melihat tugas yang `assigned_ob_id`-nya menunjuk profile tersebut, dapat melihat detail laporan, mengunggah foto sesudah dibersihkan, menambahkan catatan, dan menandai tugas selesai sehingga status menjadi `COMPLETED`.
- [x] **Status dan before/after** — User dapat melihat status `PENDING`, `APPROVED`, `IN_PROGRESS`, `COMPLETED`, atau `REJECTED`, serta foto before/after bila tersedia.
- [x] **Supabase schema dan RLS** — Proyek menyertakan DDL SQL lengkap untuk enum role/status, tabel `profiles` dan `reports`, relasi/index/timestamp, Storage foto, serta kebijakan RLS sesuai hak akses UMUM, ADMIN, dan OB.
- [x] **Login dan session** — Aplikasi hanya menampilkan login email/password Supabase, memuat role dari `profiles`, menyediakan logout, dan tidak menyediakan role switcher, akun preview, atau data demo.
- [x] **Seed akun pengguna** — File `supabase/akunseed.template.sql` tersimpan di proyek dan lima akun dari seed sudah diterapkan secara idempotent ke project Supabase dengan role ADMIN, OB, dan UMUM.
- [x] **Integrasi client dan arsitektur** — Struktur folder rapi, komponen React + Tailwind modular, dan Supabase Client/query boundary tersedia untuk alur Submit, Verify, Assign, Complete, Storage upload, dan profile lookup.

- [x] **Metrik dan penghapusan ADMIN** — Indikator persentase statis `+12%` dan `+8%` dihapus; ADMIN dapat menghapus laporan melalui tombol berkonfirmasi, handler Supabase, dan policy RLS `reports_admin_delete`.

- [x] **Sinkronisasi metrik ADMIN dan OB** — Jumlah tugas aktif per OB, progress operasional, total selesai, dan indikator rating tidak lagi memakai angka statis; saat tidak ada laporan nilainya menjadi 0 atau belum ada data.

- [x] **Foto before permanen** — Foto before pada laporan baru wajib dipilih, diunggah ke Supabase Storage, dan URL permanennya disimpan di `photo_before_url`; laporan lama dengan blob URL menampilkan fallback “Foto belum tersedia”.
