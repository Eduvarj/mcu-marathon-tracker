import { formatDuration } from '../utils/format';

export default function NextMoviePanel({ movie, movieProgress }) {
  if (!movie) {
    return (
      <section className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          Maratón completo
        </p>
        <h2 className="mt-2 text-lg font-black text-white">Terminaste todo el catálogo cronológico.</h2>
        <p className="mt-1 text-sm text-emerald-100/70">
          Puedes reiniciar el progreso o conservarlo como registro de tu recorrido.
        </p>
      </section>
    );
  }

  const watchedMinute = movieProgress?.minute ?? 0;
  const hasStarted = watchedMinute > 0;
  const remainingMinutes = Math.max(0, movie.duracionMinutos - watchedMinute);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/70 shadow-[0_16px_45px_rgba(0,0,0,0.18)]">
      <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">
            {hasStarted ? 'Continúa con' : 'Siguiente película'}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-black text-zinc-300">
              #{String(movie.numero).padStart(2, '0')}
            </span>
            <h2 className="min-w-0 text-xl font-black leading-tight text-white sm:text-2xl">
              {movie.titulo}
            </h2>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            Orden cronológico: {movie.año} · {formatDuration(movie.duracionMinutos)} · {movie.plataforma}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3 md:min-w-56">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Progreso de esta película
          </p>
          <p className="mt-1 text-lg font-black text-white">
            {watchedMinute} / {movie.duracionMinutos} min
          </p>
          <p className="text-xs text-zinc-500">
            {remainingMinutes} min restantes
          </p>
        </div>
      </div>
    </section>
  );
}
