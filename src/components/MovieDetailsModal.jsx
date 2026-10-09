import PosterFrame from './PosterFrame';
import { formatDuration } from '../utils/format';

function MetadataItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value || 'Pendiente por completar'}</p>
    </div>
  );
}

export default function MovieDetailsModal({ movie, movieProgress, onClose, onToggle, onMinuteChange }) {
  if (!movie) return null;

  const watchedPercent = Math.min(100, (movieProgress.minute / movie.duracionMinutos) * 100);
  const cast = movie.castPrincipal.length > 0 ? movie.castPrincipal.join(', ') : '';

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/78 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="movie-details-title">
      <div className="mx-auto my-4 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl">
        <div className="relative">
          <PosterFrame movie={movie} variant="backdrop" className="rounded-none border-0" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-red-400 hover:text-red-200"
          >
            Cerrar
          </button>
        </div>

        <div className="grid gap-5 p-4 md:grid-cols-[220px_1fr] md:p-6">
          <PosterFrame movie={movie} className="hidden md:block" />

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
              {movie.fase} · {movie.saga}
            </p>
            <h2 id="movie-details-title" className="mt-2 text-2xl font-black uppercase leading-none text-white sm:text-4xl">
              {movie.titulo}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300">
              {movie.sinopsisCorta}
            </p>

            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-200/80">Progreso</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {movieProgress.minute} / {movie.duracionMinutos} min
                  </p>
                  <p className="text-xs text-zinc-400">{Math.round(watchedPercent)}% registrado</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggle(movie.id)}
                  className="rounded-xl border border-red-400/40 bg-red-500 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-red-400"
                >
                  {movieProgress.completed ? 'Marcar pendiente' : 'Marcar completada'}
                </button>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/35">
                <div className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-white" style={{ width: `${watchedPercent}%` }} />
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Minuto pausado</span>
                <input
                  type="number"
                  min="0"
                  max={movie.duracionMinutos}
                  step="1"
                  value={movieProgress.minute}
                  onChange={(event) => onMinuteChange(movie.id, event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-base font-bold text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <MetadataItem label="Duración" value={formatDuration(movie.duracionMinutos)} />
              <MetadataItem label="Cronología" value={movie.añoCronologico} />
              <MetadataItem label="Estreno" value={movie.añoEstreno} />
              <MetadataItem label="Director" value={movie.director} />
              <MetadataItem label="Cast principal" value={cast} />
              <MetadataItem label="Compositor" value={movie.compositor} />
              <MetadataItem label="Soundtrack" value={movie.soundtrackDestacado} />
              <MetadataItem label="Post-créditos" value={movie.escenasPostCreditos} />
              <MetadataItem label="Disponibilidad" value={`${movie.disponibilidad.plataforma} · ${movie.disponibilidad.calidad}`} />
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Notas de continuidad</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{movie.notasContinuidad}</p>
              </div>
              <a
                href={movie.trailerUrl || undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!movie.trailerUrl}
                className={`flex items-center justify-center rounded-xl border px-4 py-3 text-center text-sm font-black uppercase tracking-[0.1em] ${movie.trailerUrl ? 'border-white/15 bg-white text-black hover:bg-red-100' : 'pointer-events-none border-white/10 bg-white/[0.03] text-zinc-600'}`}
              >
                Trailer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
