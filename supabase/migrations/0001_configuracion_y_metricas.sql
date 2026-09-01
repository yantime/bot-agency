-- VentaBot IA — configuración del bot y registro de conversaciones.
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run.

-- ---------------------------------------------------------------------------
-- Configuración del bot: una fila por usuario.
-- ---------------------------------------------------------------------------
create table if not exists public.configuracion_bot (
  user_id              uuid primary key references auth.users (id) on delete cascade,
  nombre_vendedor      text not null default '',
  genero_vendedor      text not null default 'neutro'
                         check (genero_vendedor in ('femenino', 'masculino', 'neutro')),
  pais                 text not null default 'PE',
  nombre_empresa       text not null default '',
  descripcion_empresa  text not null default '',
  tono                 text not null default 'cercano'
                         check (tono in ('cercano', 'formal', 'directo')),
  actualizado_at       timestamptz not null default now()
);

alter table public.configuracion_bot enable row level security;

-- Cada usuario ve y edita únicamente su propia configuración.
drop policy if exists "config propia: leer" on public.configuracion_bot;
create policy "config propia: leer" on public.configuracion_bot
  for select using (auth.uid() = user_id);

drop policy if exists "config propia: crear" on public.configuracion_bot;
create policy "config propia: crear" on public.configuracion_bot
  for insert with check (auth.uid() = user_id);

drop policy if exists "config propia: actualizar" on public.configuracion_bot;
create policy "config propia: actualizar" on public.configuracion_bot
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Conversaciones gestionadas por el bot. Alimenta la página de métricas.
-- Hoy nadie escribe acá: se llena cuando exista la integración con WhatsApp
-- (fase 2). La tabla existe para que /dashboard/metricas consulte datos
-- reales desde el día uno en lugar de números inventados.
-- ---------------------------------------------------------------------------
create table if not exists public.conversaciones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  creado_at   timestamptz not null default now(),
  canal       text not null default 'simulador'
                check (canal in ('simulador', 'whatsapp', 'web')),
  mensajes    integer not null default 0,
  convirtio   boolean not null default false,
  monto       numeric(12, 2) not null default 0
);

alter table public.conversaciones enable row level security;

drop policy if exists "conversaciones propias: leer" on public.conversaciones;
create policy "conversaciones propias: leer" on public.conversaciones
  for select using (auth.uid() = user_id);

drop policy if exists "conversaciones propias: crear" on public.conversaciones;
create policy "conversaciones propias: crear" on public.conversaciones
  for insert with check (auth.uid() = user_id);

-- El simulador hace upsert sobre la misma fila a medida que avanza la charla
-- (para ir actualizando el contador de mensajes), así que necesita update.
-- El using() impide tocar la fila de otro usuario aunque se adivine el id.
drop policy if exists "conversaciones propias: actualizar" on public.conversaciones;
create policy "conversaciones propias: actualizar" on public.conversaciones
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Las métricas siempre filtran por usuario y rango de fechas.
create index if not exists conversaciones_user_fecha_idx
  on public.conversaciones (user_id, creado_at desc);
