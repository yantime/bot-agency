"use client";

import type Anthropic from "@anthropic-ai/sdk";
import { useEffect, useRef, useState } from "react";

const MENSAJE_BIENVENIDA =
  "¡Hola! Soy Angie. Comparte el link de tu web y te muestro cómo le respondería a un cliente tuyo por WhatsApp.";

const HISTORIAL_INICIAL: Anthropic.MessageParam[] = [
  { role: "assistant", content: MENSAJE_BIENVENIDA },
];

// Los mensajes del assistant traen todos los bloques que devolvió la API
// (incluido el resultado de web_fetch). Para pintar sólo interesa el texto.
function textoDe(mensaje: Anthropic.MessageParam): string {
  if (typeof mensaje.content === "string") return mensaje.content;

  return mensaje.content
    .filter((bloque) => bloque.type === "text")
    .map((bloque) => ("text" in bloque ? bloque.text : ""))
    .join("\n\n");
}

// El bot separa mensajes cortos con una línea en blanco. Cada bloque va en su
// propia burbuja, como en WhatsApp: se lee mucho mejor que un párrafo largo.
function separarEnBurbujas(texto: string): string[] {
  return texto
    .split(/\n\s*\n/)
    .map((bloque) => bloque.trim())
    .filter(Boolean);
}

export default function ChatBot() {
  const [historial, setHistorial] =
    useState<Anthropic.MessageParam[]>(HISTORIAL_INICIAL);
  const [input, setInput] = useState("");
  const [parcial, setParcial] = useState("");
  const [cargando, setCargando] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);
  // Identifica esta conversación para el registro de métricas. Se genera al
  // enviar el primer mensaje, no al renderizar: durante el SSR no existe
  // crypto.randomUUID y un valor distinto en servidor y cliente rompería
  // la hidratación.
  const conversacionRef = useRef<string | null>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [historial, parcial]);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const texto = input.trim();
    if (!texto || cargando) return;

    // Se manda el historial completo con bloques: el servidor no guarda estado.
    const base: Anthropic.MessageParam[] = [
      ...historial,
      { role: "user", content: texto },
    ];

    setHistorial(base);
    setInput("");
    setParcial("");
    setCargando(true);

    let acumulado = "";
    let cerrado = false;

    try {
      const respuesta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: base,
          conversacionId: (conversacionRef.current ??= crypto.randomUUID()),
        }),
      });

      // 401 (sin sesión), 429 (rate limit) y 400 (historial inválido) vienen
      // como JSON con un mensaje pensado para mostrarle a la persona.
      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => null);
        throw new Error(
          detalle?.error ?? `No pudimos responder (HTTP ${respuesta.status}).`
        );
      }

      if (!respuesta.body) {
        throw new Error("La respuesta llegó vacía.");
      }

      const lector = respuesta.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await lector.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lineas = buffer.split("\n");
        // La última puede venir cortada a la mitad: queda para la vuelta siguiente.
        buffer = lineas.pop() ?? "";

        for (const linea of lineas) {
          if (!linea.trim()) continue;
          const suceso = JSON.parse(linea) as { t: string; v: unknown };

          if (suceso.t === "text") {
            acumulado += suceso.v as string;
            setParcial(acumulado);
          } else if (suceso.t === "done") {
            setHistorial([...base, ...(suceso.v as Anthropic.MessageParam[])]);
            cerrado = true;
          } else if (suceso.t === "error") {
            throw new Error(String(suceso.v));
          }
        }
      }

      // El stream se cortó antes del "done": se guarda lo que alcanzó a llegar
      // para no perder el turno del historial.
      if (!cerrado) {
        setHistorial([
          ...base,
          { role: "assistant", content: acumulado || "Se cortó la respuesta." },
        ]);
      }
    } catch (error) {
      console.error("[Angie] Error en el chat:", error);
      setHistorial([
        ...base,
        {
          role: "assistant",
          content:
            error instanceof Error && error.message
              ? error.message
              : "Se cortó la conexión. ¿Probamos de nuevo?",
        },
      ]);
    } finally {
      setParcial("");
      setCargando(false);
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex-1 space-y-2 overflow-y-auto p-6">
        {historial.map((mensaje, indice) => {
          const esUsuario = mensaje.role === "user";
          const texto = textoDe(mensaje);
          if (!texto) return null;

          return (
            <div key={indice} className="space-y-1.5">
              {separarEnBurbujas(texto).map((bloque, i) => (
                <Burbuja key={i} texto={bloque} esUsuario={esUsuario} />
              ))}
            </div>
          );
        })}

        {parcial && <Burbuja texto={parcial} esUsuario={false} />}

        {cargando && !parcial && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-400">
              Escribiendo...
            </div>
          </div>
        )}

        <div ref={finRef} />
      </div>

      <form onSubmit={enviar} className="flex gap-2 border-t border-gray-200 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pega el link de tu web..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-brand-ink"
        />
        <button
          type="submit"
          disabled={cargando || !input.trim()}
          className="rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink-soft disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

function Burbuja({ texto, esUsuario }: { texto: string; esUsuario: boolean }) {
  return (
    <div className={`flex ${esUsuario ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          esUsuario ? "bg-brand-ink text-white" : "bg-brand-mist text-brand-ink"
        }`}
      >
        {texto}
      </div>
    </div>
  );
}
