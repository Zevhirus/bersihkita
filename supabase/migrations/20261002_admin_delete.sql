-- Jalankan sekali pada project Supabase yang sudah memakai schema.sql.
drop policy if exists "reports_admin_delete" on public.reports;

create policy "reports_admin_delete"
on public.reports for delete
to authenticated
using (public.current_user_role() = 'admin');
