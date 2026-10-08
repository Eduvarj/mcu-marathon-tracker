import { useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import MovieGrid from './components/MovieGrid';
import Toolbar from './components/Toolbar';
import { MCU_MOVIES, TOTAL_DURATION_MINUTES } from './data/mcuMovies';
import { useMcuProgress } from './hooks/useMcuProgress';
import { calculateStats } from './utils/progress';

export default function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { progress, syncState, userId, toggleMovie, setMovieMinute, resetAll } = useMcuProgress();

  const stats = useMemo(
    () => ({
      ...calculateStats(progress, TOTAL_DURATION_MINUTES),
      totalMinutes: TOTAL_DURATION_MINUTES,
    }),
    [progress],
  );

  const filteredMovies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return MCU_MOVIES.filter((movie) => {
      const item = progress[movie.id];
      const matchesFilter =
        filter === 'all'
        || (filter === 'completed' && item?.completed)
        || (filter === 'pending' && !item?.completed);
      const matchesSearch =
        !normalizedSearch
        || movie.titulo.toLowerCase().includes(normalizedSearch)
        || String(movie.numero).padStart(2, '0').includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [filter, progress, search]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-red-500/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-15rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-red-950/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      </div>

      <Dashboard
        stats={stats}
        syncState={syncState}
        userId={userId}
        onReset={resetAll}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Toolbar
          search={search}
          filter={filter}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
        />

        <MovieGrid
          movies={filteredMovies}
          progress={progress}
          onToggle={toggleMovie}
          onMinuteChange={setMovieMinute}
        />

        <footer className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Tracker personal · localStorage como respaldo + Firestore cuando Firebase está configurado.</p>
          <p>{stats.watchedCount} de {MCU_MOVIES.length} completadas</p>
        </footer>
      </main>
    </div>
  );
}
