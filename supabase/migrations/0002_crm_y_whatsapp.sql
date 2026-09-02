-- VentaBot IA — CRM de contactos y conexión de WhatsApp.
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run.
-- Se puede volver a ejecutar sin duplicar nada.

-- ---------------------------------------------------------------------------
-- Contactos del CRM. Hoy se cargan a mano; cuando exista la integración de
-- WhatsApp, el bot escribe acá cada persona con la que conversa.
-- ---------------------------------------------------------------------------
create table if not exists public.contactos (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  nombre            text not null default '',
  telefono          text not null default '',
  estado            text not null default 'nuevo'
                      check (estado in ('nuevo', 'conversando', 'calificado', 'cliente', 'perdido')),
  canal             text not null default 'manual'
                      check (canal in ('manual', 'whatsapp', 'web', 'simulador')),
  notas             text not null default '',
  ultima_actividad  timestamptz not null default now(),
  creado_at         timestamptz not null default now()
);

alter table public.contactos enable row level security;

drop policy if exists "contactos propios: leer" on public.contactos;
create policy "contactos propios: leer" on public.contactos
  for select using (auth.uid() = user_id);

drop policy if exists "contactos propios: crear" on public.contactos;
create policy "contactos propios: crear" on public.contactos
  for insert with check (auth.uid() = user_id);

drop policy if exists "contactos propios: actualizar" on public.contactos;
create policy "contactos propios: actualizar" on public.contactos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "contactos propios: borrar" on public.contactos;
create policy "contactos propios: borrar" on public.contactos
  for delete using (auth.uid() = user_id);

-- El listado siempre filtra por usuario y ordena por actividad reciente.
create index if not exists contactos_user_actividad_idx
  on public.contactos (user_id, ultima_actividad desc);

-- ---------------------------------------------------------------------------
-- Conexión de WhatsApp: una fila por usuario.
--
-- El estado arranca en 'no_conectado' y hoy sólo puede llegar a 'pendiente'
-- (el usuario dejó su número y pidió que lo conectemos). El paso a 'conectado'
-- lo hará la integración con la API de Meta, que todavía no existe: ninguna
-- pantalla lo marca como conectado por su cuenta.
-- ---------------------------------------------------------------------------
create table if not exists public.conexion_whatsapp (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  numero           text not null default '',
  estado           text not null default 'no_conectado'
                     check (estado in ('no_conectado', 'pendiente', 'conectado')),
  solicitado_at    timestamptz,
  actualizado_at   timestamptz not null default now()
);

alter table public.conexion_whatsapp enable row level security;

drop policy if exists "whatsapp propio: leer" on public.conexion_whatsapp;
create policy "whatsapp propio: leer" on public.conexion_whatsapp
  for select using (auth.uid() = user_id);

drop policy if exists "whatsapp propio: crear" on public.conexion_whatsapp;
create policy "whatsapp propio: crear" on public.conexion_whatsapp
  for insert with check (auth.uid() = user_id);

drop policy if exists "whatsapp propio: actualizar" on public.conexion_whatsapp;
create policy "whatsapp propio: actualizar" on public.conexion_whatsapp
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
