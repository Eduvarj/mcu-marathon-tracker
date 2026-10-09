import ProgressRing from './ProgressRing';
import StatCard from './StatCard';
import SyncBadge from './SyncBadge';
import { MOVIE_COUNT } from '../data/mcuMovies';
import { formatDurationVerbose } from '../utils/format';

export default function Dashboard({ stats, syncState, userId, onReset }) {
  const resetProgress = () => {
    const confirmed = window.confirm(
      'Esto borrará el progreso del maratón en este dispositivo y en la nube. ¿Deseas continuar?',
    );
    if (confirmed) onReset();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/88 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.12)]">
              <span className="text-xl font-black text-red-400">M</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">MCU Marathon Tracker</h1>
                <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
                  {MOVIE_COUNT} películas
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Maratón cronológico · progreso por minuto · respaldo local y nube
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <SyncBadge state={syncState} />
            <button
              type="button"
              onClick={resetProgress}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-semibold text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/[0.05] hover:text-red-300"
            >
              Reiniciar progreso
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Tiempo invertido"
            value={formatDurationVerbose(stats.investedMinutes)}
            detail={`${stats.percentage.toFixed(1)}% del tiempo total`}
            wide
          />
          <StatCard
            label="Tiempo restante"
            value={formatDurationVerbose(stats.remainingMinutes)}
            detail={`de ${formatDurationVerbose(stats.totalMinutes)}`}
            wide
          />

          <div className="col-span-2 rounded-2xl border border-white/10 bg-zinc-950/60 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl md:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Películas vistas</span>
                  <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.7)]" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white">
                  {stats.watchedCount} <span className="text-zinc-600">/ {MOVIE_COUNT}</span>
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {MOVIE_COUNT - stats.watchedCount} pendientes por completar
                </div>
              </div>
              <ProgressRing percentage={stats.percentage} />
            </div>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-800 via-red-500 to-red-300 transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>

        <p className="mt-2 text-right text-[11px] text-zinc-600">
          {userId ? `Sesión anónima: ${userId.slice(0, 8)}…` : 'Sesión local'}
        </p>
      </div>
    </header>
  );
}
