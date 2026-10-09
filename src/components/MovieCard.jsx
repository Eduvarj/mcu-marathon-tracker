import PosterFrame from './PosterFrame';
import { formatDuration } from '../utils/format';

export default function MovieCard({ movie, movieProgress, onToggle, onMinuteChange, onOpenMovie }) {
  const isComplete = movieProgress.completed;
  const watchedPercent = Math.min(100, (movieProgress.minute / movie.duracionMinutos) * 100);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-zinc-950/80 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-red-500/40 ${isComplete ? 'border-red-500/40' : 'border-white/10'}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/80 to-transparent opacity-70" />

      <PosterFrame movie={movie} variant="backdrop" className="rounded-none border-0" />

      <div className="p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black ${isComplete ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/[0.03] text-zinc-300'}`}
          >
            {String(movie.numero).padStart(2, '0')}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">
              {movie.añoCronologico} · estreno {movie.añoEstreno}
            </p>
            <h2 className="mt-1 line-clamp-2 text-base font-extrabold leading-tight text-white">{movie.titulo}</h2>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-200/80">
          {movie.fase}
        </span>
        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          {movie.tipoContinuidad}
        </span>
        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          {movie.plataforma}
        </span>
      </div>

      <div className="mb-4 rounded-xl border border-white/5 bg-gradient-to-br from-red-500/[0.08] via-transparent to-white/[0.03] p-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Duración</p>
            <p className="mt-1 text-lg font-black text-white">{formatDuration(movie.duracionMinutos)}</p>
          </div>
          <span className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-bold text-zinc-500">
            {movie.calidad}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400 transition-all duration-500"
            style={{ width: `${watchedPercent}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">{Math.round(watchedPercent)}% de esta película registrado</p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onToggle(movie.id)}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${isComplete ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]'}`}
          aria-pressed={isComplete}
          aria-label={`${isComplete ? 'Marcar como pendiente' : 'Marcar como completada'}: ${movie.titulo}`}
        >
          <span>
            <span className="block text-sm font-bold text-white">
              {isComplete ? 'Película completada' : 'Marcar como completada'}
            </span>
            <span className="mt-0.5 block text-xs text-zinc-500">
              {isComplete
                ? 'El minuto quedó fijado en la duración total.'
                : 'El tiempo se sumará automáticamente al dashboard.'}
            </span>
          </span>
          <span
            className={`relative flex h-7 w-12 shrink-0 items-center rounded-full border transition ${isComplete ? 'border-red-400 bg-red-500' : 'border-white/15 bg-zinc-800'}`}
            aria-hidden="true"
          >
            <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${isComplete ? 'translate-x-6' : 'translate-x-1'}`} />
          </span>
        </button>

        <label className="block">
          <span className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            <span>Minuto pausado</span>
            <span className="text-zinc-600">máx. {movie.duracionMinutos}</span>
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              max={movie.duracionMinutos}
              step="1"
              value={movieProgress.minute}
              onChange={(event) => onMinuteChange(movie.id, event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 pr-20 text-base font-bold text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/15"
              aria-label={`Minuto pausado de ${movie.titulo}`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-zinc-600">
              minutos
            </span>
          </div>
        </label>

        <button
          type="button"
          onClick={() => onOpenMovie(movie.id)}
          className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:border-red-400/50 hover:bg-red-500/10"
        >
          Abrir ficha
        </button>
      </div>

      <div className={`mt-4 rounded-xl border px-3 py-2 text-[11px] leading-relaxed ${movie.fueraDeLineaPrincipal ? 'border-amber-500/20 bg-amber-500/[0.05] text-amber-200/70' : 'border-white/10 bg-white/[0.025] text-zinc-500'}`}>
        {movie.notas}
      </div>
      </div>
    </article>
  );
}
