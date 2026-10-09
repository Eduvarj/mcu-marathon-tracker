import PosterFrame from './PosterFrame';
import { formatDuration } from '../utils/format';

export default function NextMoviePanel({ movie, movieProgress, onOpenMovie }) {
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
    <section className="mb-6 overflow-hidden rounded-2xl border border-red-500/25 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
      <div className="relative grid min-h-[320px] gap-5 p-4 sm:p-5 lg:min-h-[360px] lg:grid-cols-[240px_1fr] lg:items-end lg:p-6">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.14),transparent_20%),linear-gradient(135deg,rgba(127,29,29,0.72),rgba(24,24,27,0.82)_48%,rgba(0,0,0,0.98))] opacity-70" />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:18px_18px] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/82 to-black/25" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

        <PosterFrame movie={movie} className="relative z-10 mx-auto hidden w-40 shadow-[0_22px_60px_rgba(0,0,0,0.5)] sm:w-48 lg:block lg:w-full" />

        <div className="relative z-10 min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
            {hasStarted ? 'Continúa el maratón' : 'Siguiente en el maratón'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-white/15 bg-white/[0.08] px-2 py-1 text-xs font-black text-white">
              #{String(movie.numero).padStart(2, '0')}
            </span>
            <span className="rounded-md border border-red-500/30 bg-red-500/15 px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-red-100">
              {movie.fase}
            </span>
          </div>
          <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-[0.92] text-white sm:text-5xl lg:text-6xl">
            {movie.titulo}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Orden cronológico: {movie.añoCronologico} · {formatDuration(movie.duracionMinutos)} · {movie.saga}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
            {movie.sinopsisCorta}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div className="rounded-xl border border-white/10 bg-black/45 p-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500">
                    Progreso de esta película
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {watchedMinute} / {movie.duracionMinutos} min
                  </p>
                </div>
                <p className="text-xs text-zinc-500">
                  {remainingMinutes} min restantes
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-800 via-red-500 to-white transition-all duration-500"
                  style={{ width: `${Math.min(100, (watchedMinute / movie.duracionMinutos) * 100)}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenMovie(movie.id)}
              className="rounded-xl border border-white/15 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-red-100"
            >
              Abrir ficha
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
