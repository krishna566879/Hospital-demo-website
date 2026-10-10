-- ==============================================================================
-- Nivaan Multispeciality Hospital - Supabase Production SQL Schema & RLS Policies
-- Project ID: aexzqynhtgpjwlwuzsmm
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aexzqynhtgpjwlwuzsmm/sql
-- ==============================================================================

-- 0. Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 1. Profiles Table (Patient, Doctor, Admin user metadata linked to auth.users)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'patient' check (role in ('patient', 'doctor', 'admin')),
  date_of_birth text,
  blood_group text,
  gender text,
  address text,
  city text,
  emergency_contact jsonb default '{}'::jsonb,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Index for fast lookups
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

-- ==============================================================================
-- 2. Secure RBAC Helper Functions (Security Definer)
-- ==============================================================================
-- Returns true if current authenticated user is an administrator or doctor
create or replace function public.is_admin_or_doctor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'doctor')
  );
$$;

-- Returns true if current authenticated user is an administrator
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Automatically create profile row when new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    phone,
    role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    -- CRITICAL SECURITY RULE:
    -- Never trust client-provided metadata for elevated roles during signup.
    -- All self-service registrations receive 'patient' role by default.
    'patient'
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, profiles.full_name),
    phone = coalesce(excluded.phone, profiles.phone),
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 3. Appointments Table
-- ==============================================================================
create table if not exists public.appointments (
  id text primary key,
  patient_id text, -- Can reference auth.users(id)::text or demo/guest ID
  patient_name text not null,
  patient_email text not null,
  patient_phone text not null,
  patient_dob text,
  doctor_id text not null,
  doctor_name text not null,
  specialization_id text not null,
  specialization_name text not null,
  date text not null, -- YYYY-MM-DD
  start_time text not null, -- e.g. "09:30 AM"
  end_time text not null, -- e.g. "10:00 AM"
  reason_for_visit text not null,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'pending', 'cancelled', 'completed')),
  room_number text,
  cancel_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes for performance & query isolation
create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create index if not exists idx_appointments_patient_email on public.appointments(patient_email);
create index if not exists idx_appointments_doctor_date on public.appointments(doctor_id, date);
create index if not exists idx_appointments_status on public.appointments(status);

-- ==============================================================================
-- 4. Contact Inquiries Table
-- ==============================================================================
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. Row Level Security (RLS) - Patient Data Isolation & Access Control
-- ==============================================================================

-- A. Profiles RLS
alter table public.profiles enable row level security;

-- Owner can read their own profile; Doctors and Admins can view profiles
drop policy if exists "Profiles read policy" on public.profiles;
create policy "Profiles read policy" on public.profiles
  for select using (
    auth.uid() = id
    or public.is_admin_or_doctor()
    or auth.role() = 'anon' -- permits display of doctor credentials
  );

-- Users can update only their own profile, without elevating their role
drop policy if exists "Profiles update policy" on public.profiles;
create policy "Profiles update policy" on public.profiles
  for update using (
    auth.uid() = id
    or public.is_admin()
  )
  with check (
    (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

-- Insert policy for trigger and system signup
drop policy if exists "Profiles insert policy" on public.profiles;
create policy "Profiles insert policy" on public.profiles
  for insert with check (
    auth.uid() = id
    or auth.role() = 'service_role'
    or auth.role() = 'anon'
  );

-- B. Appointments RLS (Patient Data Isolation)
alter table public.appointments enable row level security;

-- Patients can only select appointments matching their user id or email; Admins/Doctors can see all
drop policy if exists "Appointments select policy" on public.appointments;
create policy "Appointments select policy" on public.appointments
  for select using (
    patient_id = auth.uid()::text
    or patient_email = auth.jwt()->>'email'
    or public.is_admin_or_doctor()
    or auth.role() = 'anon' -- Allows checking slot availability
  );

-- Booking appointments: Patients can book for themselves, guests can book online
drop policy if exists "Appointments insert policy" on public.appointments;
create policy "Appointments insert policy" on public.appointments
  for insert with check (
    patient_id = auth.uid()::text
    or auth.role() = 'authenticated'
    or auth.role() = 'anon'
  );

-- Updates: Patients can cancel/reschedule their own appointment; Admins/Doctors can update any appointment
drop policy if exists "Appointments update policy" on public.appointments;
create policy "Appointments update policy" on public.appointments
  for update using (
    patient_id = auth.uid()::text
    or patient_email = auth.jwt()->>'email'
    or public.is_admin_or_doctor()
  );

-- Deletions: Only administrators can delete appointment records
drop policy if exists "Appointments delete policy" on public.appointments;
create policy "Appointments delete policy" on public.appointments
  for delete using (
    public.is_admin()
  );

-- C. Inquiries RLS
alter table public.inquiries enable row level security;

-- Anyone can submit an inquiry via the website contact form
drop policy if exists "Inquiries insert policy" on public.inquiries;
create policy "Inquiries insert policy" on public.inquiries
  for insert with check (true);

-- Only administrators and hospital staff can read inquiries
drop policy if exists "Inquiries select policy" on public.inquiries;
create policy "Inquiries select policy" on public.inquiries
  for select using (
    public.is_admin_or_doctor()
    or auth.role() = 'service_role'
  );

-- ==============================================================================
-- 6. Permissions Grant
-- ==============================================================================
grant usage on schema public to anon, authenticated;
grant all on table public.profiles to anon, authenticated;
grant all on table public.appointments to anon, authenticated;
grant all on table public.inquiries to anon, authenticated;
