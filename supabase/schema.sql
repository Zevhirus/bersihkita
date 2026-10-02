-- BersihKita — Supabase PostgreSQL schema
-- Jalankan di Supabase SQL Editor setelah project dibuat.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('umum', 'admin', 'ob');
create type public.report_status as enum ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'umum',
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  location text not null,
  category text,
  description text not null,
  photo_before_url text not null,
  status public.report_status not null default 'PENDING',
  assigned_ob_id uuid references public.profiles(id) on delete set null,
  photo_after_url text,
  ob_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reports_user_id_idx on public.reports(user_id);
create index reports_status_idx on public.reports(status);
create index reports_assigned_ob_idx on public.reports(assigned_ob_id);
create index reports_created_at_idx on public.reports(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where user_id = auth.uid() limit 1;
$$;

-- Profile otomatis untuk user baru. Role default tetap UMUM.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.reports enable row level security;

-- Profiles: user dapat melihat profil yang diperlukan; admin dapat mengelola profil.
create policy "profiles_read_authenticated"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (user_id = auth.uid() or public.current_user_role() = 'admin')
with check (user_id = auth.uid() or public.current_user_role() = 'admin');

-- UMUM hanya membuat/melihat laporan miliknya; ADMIN melihat seluruh laporan; OB melihat tugas yang di-assign.
create policy "reports_insert_own"
on public.reports for insert
to authenticated
with check (user_id = auth.uid());

create policy "reports_select_by_role"
on public.reports for select
to authenticated
using (
  user_id = auth.uid()
  or public.current_user_role() = 'admin'
  or (public.current_user_role() = 'ob' and assigned_ob_id = (select id from public.profiles where user_id = auth.uid()))
);

create policy "reports_admin_update"
on public.reports for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "reports_admin_delete"
on public.reports for delete
to authenticated
using (public.current_user_role() = 'admin');

create policy "reports_ob_complete_assigned"
on public.reports for update
to authenticated
using (
  public.current_user_role() = 'ob'
  and assigned_ob_id = (select id from public.profiles where user_id = auth.uid())
)
with check (
  public.current_user_role() = 'ob'
  and assigned_ob_id = (select id from public.profiles where user_id = auth.uid())
  and status = 'COMPLETED'
);

-- Storage bucket untuk foto before/after. Jika bucket dibuat dari dashboard, gunakan nama yang sama.
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

create policy "report_photos_read_authenticated"
on storage.objects for select
to authenticated
using (bucket_id = 'report-photos');

create policy "report_photos_upload_own_folder"
on storage.objects for insert
to authenticated
with check (bucket_id = 'report-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "report_photos_update_own_folder"
on storage.objects for update
to authenticated
using (bucket_id = 'report-photos' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'report-photos' and (storage.foldername(name))[1] = auth.uid()::text);
