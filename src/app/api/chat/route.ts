import Anthropic from "@anthropic-ai/sdk";
import { StreamingTextResponse } from "ai";

export const runtime = "nodejs";

// Prompt de sistema: el bot de prueba de la plataforma. Primero ayuda a
// crear el bot del visitante pidiéndole su web, la lee con web_fetch y
// después actúa en el personaje del bot de ventas de ESE negocio.
const SYSTEM_PROMPT = `Eres el asistente de VentaBot IA. Tu tarea es ayudar a la persona a crear su propio bot de ventas para WhatsApp, mostrándole una simulación en vivo con su propio negocio.

Flujo a seguir:
1. Si todavía no compartió la URL de su web, salúdala, explicá en una o dos líneas que la ayudarás a crear su bot de ventas para WhatsApp, y pedile que comparta el link de su página web.
2. En cuanto comparta una URL, usa la herramienta de lectura web para revisar esa página (qué vende, sus productos o servicios, el tono de la marca).
3. Después de leerla, métete en personaje: a partir de ese mensaje respondé como si fueras EL bot de ventas de WhatsApp de ESE negocio específico. Saludá como lo haría el bot de esa empresa, mencioná su nombre y presentá sus productos o servicios reales.
4. Seguí la conversación en ese personaje: respondé preguntas sobre productos, precios o disponibilidad usando lo que leíste de la web (si falta un dato como precio exacto, aclará que es un ejemplo), y guiá la charla hacia el cierre de la venta o el agendamiento de una demo.

Hablá en español de Perú, con "tú" (nunca "vos"), en tono cercano y profesional.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Se instancia acá adentro (no en el scope del módulo) para no fallar
  // en build time cuando ANTHROPIC_API_KEY todavía no está configurada.
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const respuesta = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1536,
    stream: true,
    system: SYSTEM_PROMPT,
    tools: [
      {
        type: "web_fetch_20260209",
        name: "web_fetch",
        max_uses: 2,
        max_content_tokens: 6000,
      },
    ],
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  });

  // Convierte los eventos de streaming de Claude en un stream de texto plano
  // compatible con el cliente (useChat de la librería "ai").
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const event of respuesta) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}
