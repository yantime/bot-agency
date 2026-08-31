"use client";

import { useEffect, useState } from "react";

type Turno = { rol: "cliente" | "bot"; texto: string };

const GUION: Turno[] = [
  { rol: "cliente", texto: "Hola, ¿tienen planes para equipos chicos?" },
  {
    rol: "bot",
    texto: "¡Sí! El plan Pro incluye 5 bots y 2.500 conversaciones/mes. ¿Cuántos son en tu equipo?",
  },
  { rol: "cliente", texto: "Somos 3, vendemos productos de belleza." },
  {
    rol: "bot",
    texto: "Perfecto para tu rubro. Te agendo una demo de 15 min esta semana, ¿te viene bien el jueves?",
  },
];

const VELOCIDAD_TIPEO = 22;

export default function ChatPreview() {
  const [turnosVisibles, setTurnosVisibles] = useState(0);
  const [textoParcial, setTextoParcial] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);

  useEffect(() => {
    let cancelado = false;
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    function correrGuion() {
      setTurnosVisibles(0);
      setTextoParcial("");
      let acumulado = 0;

      GUION.forEach((turno, i) => {
        const pausaAntes = i === 0 ? 500 : 700;
        acumulado += pausaAntes;

        timeouts.push(
          setTimeout(() => {
            if (cancelado) return;
            setEscribiendo(true);
            let caracter = 0;

            const intervalo = setInterval(() => {
              if (cancelado) {
                clearInterval(intervalo);
                return;
              }
              caracter += 1;
              setTextoParcial(turno.texto.slice(0, caracter));

              if (caracter >= turno.texto.length) {
                clearInterval(intervalo);
                setEscribiendo(false);
                setTurnosVisibles(i + 1);
                setTextoParcial("");
              }
            }, VELOCIDAD_TIPEO);
          }, acumulado)
        );

        acumulado += turno.texto.length * VELOCIDAD_TIPEO;
      });

      timeouts.push(setTimeout(correrGuion, acumulado + 3200));
    }

    correrGuion();

    return () => {
      cancelado = true;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-brand-ink/10 bg-white p-4 shadow-2xl shadow-brand-ink/10">
      <div className="mb-3 flex items-center gap-2 border-b border-brand-ink/10 pb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-yellow-deep" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-yellow-deep" />
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-brand-ink/50">
          Agente de ventas · en línea
        </span>
      </div>

      <div className="flex min-h-[220px] flex-col gap-3">
        {GUION.slice(0, turnosVisibles).map((turno, i) => (
          <Burbuja key={i} turno={turno} />
        ))}

        {escribiendo && (
          <Burbuja
            turno={{
              rol: GUION[turnosVisibles].rol,
              texto: textoParcial,
            }}
            cursor
          />
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
