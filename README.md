# Angie (angiebot.com)

Angie es una vendedora con inteligencia artificial que atiende WhatsApp:
responde, califica y cierra ventas 24/7. Landing page + autenticación con
Supabase + dashboard con chat en tiempo real conectado a Claude
(claude-sonnet-5).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth)
- Anthropic API - Claude (streaming)

## Requisitos previos

- Node.js 18.17 o superior
- Una cuenta de [Supabase](https://supabase.com) con un proyecto creado
- Una API key de [Anthropic](https://console.anthropic.com/settings/keys)

## Instalación

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar el archivo de variables de entorno y completarlo:

   ```bash
   cp .env.local.example .env.local
   ```

   Variables requeridas:

   | Variable | Descripción |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto (Project Settings → API) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima/pública (Project Settings → API) |
   | `ANTHROPIC_API_KEY` | API key de Anthropic (Claude) |

3. Configurar Supabase Auth:

   - En **Authentication → Providers → Email**, dejar habilitada la
     confirmación de email ("Confirm email").
   - En **Authentication → URL Configuration**, agregar como Redirect URL:
     `http://localhost:3000/auth/callback` (y la URL de producción cuando
     corresponda).

4. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000).

## Flujo de autenticación

1. El usuario se registra en `/registro` con email y contraseña.
2. Supabase envía un email de confirmación.
3. Hasta confirmar el email, el login (`/login`) rechaza el ingreso.
4. Una vez confirmado, el usuario ingresa y accede a `/dashboard`.
5. `/dashboard` está protegido por middleware (`src/middleware.ts`): sin
   sesión activa, redirige a `/login`.

## Chat con IA

En `/dashboard` hay un chat que envía cada mensaje a la API Route
`/api/chat` (`src/app/api/chat/route.ts`), la cual llama a Claude
(`claude-sonnet-5`) con un system prompt de agente de ventas y devuelve la
respuesta en streaming, mostrada en tiempo real en la UI.

## Estructura de carpetas

```
src/
  app/
    page.tsx                 # Landing page
    login/                   # Login (form + server action)
    registro/                # Registro (form + server action)
    auth/callback/route.ts   # Callback de confirmación de email
    dashboard/                # Ruta protegida con el chat
    api/chat/route.ts         # API Route que llama a Claude (streaming)
  components/
    landing/                  # Secciones de la landing
    dashboard/                 # Componentes del dashboard (ChatBot)
  lib/
    supabase/                  # Clientes de Supabase (browser, server, middleware)
  middleware.ts                # Protección de rutas + refresco de sesión
```
# bot-agency
