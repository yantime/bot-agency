import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";


export const runtime = "nodejs";

// Demo genérica: el visitante comparte su web, el bot la lee con web_fetch y
// después actúa como el bot de WhatsApp de ESE negocio.
//
// El prompt no menciona herramientas de carrito/catálogo porque no existen:
// la única herramienta real es web_fetch. El estado del pedido lo lleva el
// modelo en el contexto de la conversación.
const SYSTEM_PROMPT = `Eres el asistente de la demo de VentaBot IA. Objetivo único: que el visitante, con solo compartir el link de su web, vea en vivo que un bot puede vender por su WhatsApp.

## Flujo
1. Si todavía no compartió una URL, pedísela en una línea. Nada más.
2. En cuanto la comparta, leé esa web con web_fetch de inmediato, sin pedir permiso ni preguntar antes.
3. Leela UNA SOLA VEZ por conversación. Si ya la leíste en un mensaje anterior, no la vuelvas a leer: usá lo que ya sabés.
4. Después de leerla, confirmá en un mensaje corto el nombre del negocio y cuántos productos o servicios encontraste. No listes el catálogo completo: rompe el efecto de la demo.
5. Invitá a probar: "Escríbeme como si fueras un cliente tuyo pidiendo por WhatsApp."
6. Desde ahí en adelante, respondé como si fueras EL bot de WhatsApp de ESE negocio.
7. Si la web no muestra precios claros, decilo en una frase y ofrecé simular igual con lo que sí hay.

## Longitud — la regla más importante
- Máximo 40 palabras por respuesta. Casi siempre menos.
- Nunca más de 3 líneas.
- Una sola pregunta por mensaje.
- Sin viñetas ni listas numeradas, salvo que pidan explícitamente el catálogo ("qué tienen", "mándame el menú"): ahí sí, lista corta.
- Sin markdown, sin negritas, sin encabezados. Es WhatsApp, no un documento.
- Si querés mandar dos mensajes cortos seguidos, separalos con una línea en blanco.
- Única excepción: el resumen final del pedido puede ser algo más largo.

## Tono
- Español de Perú, con "tú". Nunca "vos".
- Variá la apertura. No arranques siempre con "Perfecto" ni "Anotado".
- Reflejá el registro del cliente: si escribe corto y seco, respondé igual de directo.
- No fuerces emojis si el cliente no los usa.
- Combiná confirmación y siguiente pregunta en una frase fluida, no en tres oraciones mecánicas.
- Si te da varios datos juntos (producto, talla, dirección, pago), registralos todos de una y preguntá solo lo que falte.

## El pedido
- Llevás el pedido en la cabeza. Cada vez que agregues, saques o cambies algo, recapitulá el pedido completo acumulado, no solo el último ítem.
- Bajar una cantidad a 0 es eliminar el ítem.
- Si algo se vende en presentación fija (pack, docena, combo) y piden menos, aclaralo. Nunca inventes un precio fraccionado.
- Si piden una cantidad total repartida entre varios productos sin decir cuánto de cada uno, preguntá cómo repartirla antes de agregar nada.
- Si cambian dirección o método de pago después de haberlos dado, actualizalo sin objetar y recapitulá.
- Aceptá la ubicación de WhatsApp en vez de la dirección escrita, y una captura de Yape o Plin como confirmación de pago. Ofrecelo como la opción más rápida.
- Si un nombre puede ser un producto que se vende o un regalo de promoción, preguntá cuál de los dos quiere.

## Nunca inventes
- Productos, precios, promociones, stock, plazos de entrega, horarios ni políticas que no salieron de la web.
- Si falta un dato, decilo en una frase, integrado en la respuesta y no como un aviso legal aparte: "eso se confirmaría con el negocio real".
- Si preguntan por algo que no está, decilo ("ese no lo tengo") y sugerí una o dos alternativas reales del catálogo.
- Si hay variantes (talla, color) y no viste stock por variante, preguntá cuál quiere pero no confirmes disponibilidad.
- Si un producto figura agotado, no lo ofrezcas como disponible.

## Adaptate al rubro
Puede ser restaurante, tienda de ropa, barbería, consultorio, ferretería, lo que sea. Usá el vocabulario del rubro: si son servicios, hablá de "reserva", "cita" o "atención", no de "carrito" ni "delivery".

## Cierre y límites
- Cerrá con el resumen del pedido y UNA sola línea invitando a seguir: "Así atendería tu bot 24/7 en tu WhatsApp real. ¿Lo activamos?". No la repitas.
- Pedidos al por mayor, factura con RUC, reclamos reales o pedido de hablar con una persona: aclaralo en una frase ("esto es una simulación, no hay pedido real todavía") y volvé al cierre.
- Si saludan de nuevo a mitad de la conversación, no reinicies el flujo ni repitas la bienvenida: seguí con el pedido como está.
- Nunca confirmes una venta real.`;

// La ruta gasta la API key de Anthropic en cada llamada, así que no puede
// quedar abierta: el chat vive en /dashboard, que ya exige sesión.
const MAX_MENSAJES_HISTORIAL = 40;

// Límite por usuario dentro de una ventana móvil. Es best-effort: en Vercel
// cada instancia serverless tiene su propio Map, así que frena a un usuario
// que martilla contra una instancia, no un ataque distribuido. Para eso haría
// falta un contador compartido (Vercel KV / Upstash).
const LIMITE_POR_VENTANA = 20;
const VENTANA_MS = 60_000;
const usosPorUsuario = new Map<string, number[]>();

function superaLimite(idUsuario: string): boolean {
  const ahora = Date.now();
  const recientes = (usosPorUsuario.get(idUsuario) ?? []).filter(
    (marca) => ahora - marca < VENTANA_MS
  );

  if (recientes.length >= LIMITE_POR_VENTANA) {
    usosPorUsuario.set(idUsuario, recientes);
    return true;
  }

  recientes.push(ahora);
  usosPorUsuario.set(idUsuario, recientes);
  return false;
}

// Parámetros compartidos por cada llamada del turno.
const PARAMETROS = {
  model: "claude-sonnet-5",
  // Techo bajo a propósito: es un chat de WhatsApp, no un informe.
  max_tokens: 400,
  // Sonnet 5 corre thinking adaptativo si no se dice nada. Para una charla
  // de ventas no aporta y agrega segundos antes del primer token.
  thinking: { type: "disabled" },
  output_config: { effort: "low" },
  system: SYSTEM_PROMPT,
  tools: [
    {
      type: "web_fetch_20260209",
      name: "web_fetch",
      max_uses: 2,
      max_content_tokens: 6000,
    },
  ],
} satisfies Omit<Anthropic.MessageCreateParams, "messages">;

// Tope de vueltas por turno cuando el modelo devuelve pause_turn (usa la
// herramienta y sigue). Evita un bucle infinito si algo sale mal.
const MAX_VUELTAS = 4;

// El cliente manda el historial completo con los bloques de contenido tal
// cual salieron de la API: así el resultado de web_fetch sobrevive entre
// turnos y el modelo no tiene que volver a leer la web.
function validarHistorial(valor: unknown): Anthropic.MessageParam[] {
  if (!Array.isArray(valor) || valor.length === 0) {
    throw new Error("messages debe ser un array no vacío");
  }

  // Sin tope, un historial gigante multiplica el costo de cada llamada.
  if (valor.length > MAX_MENSAJES_HISTORIAL) {
    throw new Error("la conversación es demasiado larga, empezá una nueva");
  }

  return valor.map((mensaje) => {
    if (
      typeof mensaje !== "object" ||
      mensaje === null ||
      ((mensaje as Anthropic.MessageParam).role !== "user" &&
        (mensaje as Anthropic.MessageParam).role !== "assistant")
    ) {
      throw new Error("cada mensaje necesita role 'user' o 'assistant'");
    }

    const { role, content } = mensaje as Anthropic.MessageParam;
    if (typeof content !== "string" && !Array.isArray(content)) {
      throw new Error("content debe ser texto o un array de bloques");
    }

    return { role, content } as Anthropic.MessageParam;
  });
}

export async function POST(req: Request) {
  // La sesión se valida contra Supabase (getUser verifica el token con el
  // servidor de auth; getSession sólo lee la cookie y es falsificable).
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { error: "Necesitas iniciar sesión para usar el chat." },
      { status: 401 }
    );
  }

  if (superaLimite(user.id)) {
    return Response.json(
      { error: "Demasiados mensajes seguidos. Espera un momento." },
      { status: 429 }
    );
  }

  let historial: Anthropic.MessageParam[];
  try {
    const cuerpo = await req.json();
    historial = validarHistorial(cuerpo?.messages);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "cuerpo inválido" },
      { status: 400 }
    );
  }

  // Se instancia acá adentro (no en el scope del módulo) para no fallar
  // en build time cuando ANTHROPIC_API_KEY todavía no está configurada.
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Protocolo NDJSON: una línea JSON por evento.
  //   {"t":"text","v":"..."}   fragmento de texto para pintar en vivo
  //   {"t":"done","v":[...]}   mensajes del assistant con TODOS sus bloques
  //   {"t":"error","v":"..."}  falla a mitad del stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emitir = (evento: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(evento)}\n`));

      try {
        const mensajes = [...historial];
        const nuevos: Anthropic.MessageParam[] = [];

        for (let vuelta = 0; vuelta < MAX_VUELTAS; vuelta += 1) {
          const respuesta = anthropic.messages.stream({
            ...PARAMETROS,
            messages: mensajes,
          });

          for await (const evento of respuesta) {
            if (
              evento.type === "content_block_delta" &&
              evento.delta.type === "text_delta"
            ) {
              emitir({ t: "text", v: evento.delta.text });
            }
          }

          const final = await respuesta.finalMessage();
          const turno: Anthropic.MessageParam = {
            role: "assistant",
            content: final.content,
          };
          mensajes.push(turno);
          nuevos.push(turno);

          // pause_turn: el modelo usó web_fetch y quiere seguir. Cualquier
          // otro stop_reason cierra el turno.
          if (final.stop_reason !== "pause_turn") break;
        }

        emitir({ t: "done", v: nuevos });
      } catch (error) {
        console.error("[VentaBot] Error en /api/chat:", error);
        emitir({
          t: "error",
          v: error instanceof Error ? error.message : "error desconocido",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
