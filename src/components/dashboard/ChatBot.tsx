"use client";

import { useChat } from "ai/react";

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400">
            Escribí un mensaje para empezar a hablar con tu agente de ventas.
          </p>
        )}

        {messages.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${
              mensaje.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                mensaje.role === "user"
                  ? "bg-brand-ink text-white"
                  : "bg-brand-mist text-brand-ink"
              }`}
            >
              {mensaje.content}
            </div>
          </div>
        ))}

        {isLoading &&
          messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-400">
                Escribiendo...
              </div>
            </div>
          )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-gray-200 p-4"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Escribí tu mensaje..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-brand-ink"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink-soft disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
