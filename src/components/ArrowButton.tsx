type ArrowButtonProps = {
  className?: string;
  variant?: "ink" | "light";
};

// Botón circular con flecha — motivo tomado de los íconos de flecha
// circular de staffdigital.pe. Al hover se rellena con el color base.
export default function ArrowButton({ className = "", variant = "ink" }: ArrowButtonProps) {
  const styles =
    variant === "ink"
      ? "border-brand-ink text-brand-ink group-hover:bg-brand-ink group-hover:text-white"
      : "border-white/40 text-white group-hover:bg-white group-hover:text-brand-ink";

  return (
    <span
      aria-hidden
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${styles} ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 13L13 3M13 3H5M13 3V11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
