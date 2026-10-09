export default function PosterFrame({ movie, variant = 'poster', className = '', showContent = true }) {
  const isBackdrop = variant === 'backdrop';
  const label = String(movie.numero).padStart(2, '0');

  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-zinc-950 ${isBackdrop ? 'aspect-[16/9] rounded-2xl' : 'aspect-[2/3] rounded-xl'} ${className}`}
      aria-label={`${isBackdrop ? 'Backdrop' : 'Póster'} pendiente para ${movie.titulo}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.16),transparent_20%),linear-gradient(135deg,rgba(127,29,29,0.95),rgba(24,24,27,0.92)_48%,rgba(0,0,0,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />
      {showContent ? (
        <>
          <div className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/35 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
            MCU {label}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200/90">
              {movie.fase}
            </p>
            <p className={`${isBackdrop ? 'text-xl sm:text-2xl' : 'text-sm'} mt-1 font-black uppercase leading-none text-white`}>
              {movie.titulo}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
