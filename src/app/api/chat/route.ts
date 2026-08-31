import Anthropic from "@anthropic-ai/sdk";
import { StreamingTextResponse } from "ai";

export const runtime = "nodejs";

// Prompt de sistema del agente de ventas
const SYSTEM_PROMPT =
  "Eres un agente de ventas amigable y profesional. Tu objetivo es entender las necesidades del cliente, presentar los beneficios del producto de forma clara y guiar la conversación hacia el cierre de la venta o la agenda de una demo.";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Se instancia acá adentro (no en el scope del módulo) para no fallar
  // en build time cuando ANTHROPIC_API_KEY todavía no está configurada.
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const respuesta = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    stream: true,
    system: SYSTEM_PROMPT,
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
