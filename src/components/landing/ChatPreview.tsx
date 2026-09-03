"use client";

import { useEffect, useState } from "react";

type Turno = { rol: "cliente" | "bot"; texto: string };

const GUION: Turno[] = [
  { rol: "cliente", texto: "Hola, ¿tienen planes para equipos chicos?" },
  {
    rol: "bot",
    texto: "¡Sí! 🙌 El plan Pro incluye 5 Angies y 2.500 conversaciones/mes. ¿Cuántos son en tu equipo?",
  },
  { rol: "cliente", texto: "Somos 3, vendemos productos de belleza." },
  {
    rol: "bot",
    texto: "Perfecto para tu rubro 💛 Te agendo una demo de 15 min esta semana, ¿te viene bien el jueves?",
  },
];

const VELOCIDAD_TIPEO = 22;
const PAUSA_INICIAL = 500;
const PAUSA_ENTRE_TURNOS = 700;
const PAUSA_ANTES_DE_REINICIAR = 3200;

export default function ChatPreview() {
  const [turnosVisibles, setTurnosVisibles] = useState(0);
  const [indiceEscribiendo, setIndiceEscribiendo] = useState<number | null>(null);
  const [textoParcial, setTextoParcial] = useState("");

  useEffect(() => {
    let cancelado = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Un solo timer vivo a la vez y espera secuencial: los pasos no pueden
    // solaparse aunque el navegador throttlee los timers (pestaña en segundo
    // plano, CPU cargada). La versión anterior pre-agendaba todos los turnos
    // con offsets calculados y los ciclos se pisaban entre sí.
    const esperar = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    async function correrGuion() {
      while (!cancelado) {
        setTurnosVisibles(0);
        setIndiceEscribiendo(null);
        setTextoParcial("");

        for (let i = 0; i < GUION.length; i += 1) {
          await esperar(i === 0 ? PAUSA_INICIAL : PAUSA_ENTRE_TURNOS);
          if (cancelado) return;

          const { texto } = GUION[i];
          setIndiceEscribiendo(i);
          setTextoParcial("");

          for (let caracter = 1; caracter <= texto.length; caracter += 1) {
            await esperar(VELOCIDAD_TIPEO);
            if (cancelado) return;
            setTextoParcial(texto.slice(0, caracter));
          }

          setIndiceEscribiendo(null);
          setTextoParcial("");
          setTurnosVisibles(i + 1);
        }

        await esperar(PAUSA_ANTES_DE_REINICIAR);
        if (cancelado) return;
      }
    }

    correrGuion();

    return () => {
      cancelado = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const turnoEnCurso = indiceEscribiendo === null ? null : GUION[indiceEscribiendo];

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-brand-ink/10 bg-white p-4 shadow-2xl shadow-brand-ink/10">
      <div className="mb-3 flex items-center gap-2 border-b border-brand-ink/10 pb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-yellow-deep" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-yellow-deep" />
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-brand-ink/50">
          Angie · en línea
        </span>
      </div>

      <div className="flex min-h-[220px] flex-col gap-3">
        {GUION.slice(0, turnosVisibles).map((turno, i) => (
          <Burbuja key={i} turno={turno} />
        ))}

        {turnoEnCurso && (
          <Burbuja turno={{ rol: turnoEnCurso.rol, texto: textoParcial }} cursor />
        )}
      </div>
    </div>
  );
}

function Burbuja({ turno, cursor = false }: { turno: Turno; cursor?: boolean }) {
  const esBot = turno.rol === "bot";
  return (
    <div className={`flex ${esBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-snug ${
          esBot
            ? "bg-brand-mist text-brand-ink"
            : "bg-brand-yellow text-brand-ink"
        }`}
      >
        {turno.texto}
        {cursor && <span className="ml-0.5 inline-block animate-blink">▍</span>}
      </div>
    </div>
  );
}
