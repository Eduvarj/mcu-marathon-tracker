import { useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import MovieDetailsModal from './components/MovieDetailsModal';
import MovieGrid from './components/MovieGrid';
import NextMoviePanel from './components/NextMoviePanel';
import Toolbar from './components/Toolbar';
import { MCU_MOVIES, TOTAL_DURATION_MINUTES } from './data/mcuMovies';
import { useMcuProgress } from './hooks/useMcuProgress';
import { calculateStats } from './utils/progress';

export default function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [sagaFilter, setSagaFilter] = useState('all');
  const [selectedMovieId, setSelectedMovieId] = useState('');
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
      const matchesPhase = phaseFilter === 'all' || movie.fase === phaseFilter;
      const matchesSaga = sagaFilter === 'all' || movie.saga === sagaFilter;
      const matchesSearch =
        !normalizedSearch
        || movie.titulo.toLowerCase().includes(normalizedSearch)
        || String(movie.numero).padStart(2, '0').includes(normalizedSearch)
        || movie.año.toLowerCase().includes(normalizedSearch)
        || movie.añoCronologico.toLowerCase().includes(normalizedSearch)
        || String(movie.añoEstreno).includes(normalizedSearch)
        || movie.fase.toLowerCase().includes(normalizedSearch)
        || movie.saga.toLowerCase().includes(normalizedSearch)
        || movie.plataforma.toLowerCase().includes(normalizedSearch)
        || movie.tipoContinuidad.toLowerCase().includes(normalizedSearch)
        || movie.director.toLowerCase().includes(normalizedSearch)
        || movie.castPrincipal.join(' ').toLowerCase().includes(normalizedSearch)
        || movie.compositor.toLowerCase().includes(normalizedSearch)
        || movie.soundtrackDestacado.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesPhase && matchesSaga && matchesSearch;
    });
  }, [filter, phaseFilter, progress, sagaFilter, search]);

  const nextMovie = useMemo(
    () => MCU_MOVIES.find((movie) => !progress[movie.id]?.completed) ?? null,
    [progress],
  );

  const selectedMovie = useMemo(
    () => MCU_MOVIES.find((movie) => movie.id === selectedMovieId) ?? null,
    [selectedMovieId],
  );

  const phaseOptions = useMemo(
    () => [...new Set(MCU_MOVIES.map((movie) => movie.fase))],
    [],
  );

  const sagaOptions = useMemo(
    () => [...new Set(MCU_MOVIES.map((movie) => movie.saga))],
    [],
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-red-500/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(127,29,29,0.28),rgba(9,9,11,0.2)_26%,#09090b_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.5),transparent_18%,transparent_82%,rgba(0,0,0,0.55))]" />
      </div>

      <Dashboard
        stats={stats}
        syncState={syncState}
        userId={userId}
        onReset={resetAll}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <NextMoviePanel
          movie={nextMovie}
          movieProgress={nextMovie ? progress[nextMovie.id] : null}
          onOpenMovie={setSelectedMovieId}
        />

        <Toolbar
          search={search}
          filter={filter}
          phaseFilter={phaseFilter}
          sagaFilter={sagaFilter}
          phaseOptions={phaseOptions}
          sagaOptions={sagaOptions}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onPhaseFilterChange={setPhaseFilter}
          onSagaFilterChange={setSagaFilter}
        />

        <MovieGrid
          movies={filteredMovies}
          progress={progress}
          onToggle={toggleMovie}
          onMinuteChange={setMovieMinute}
          onOpenMovie={setSelectedMovieId}
        />

        <footer className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Tracker personal · localStorage como respaldo + Firestore cuando Firebase está configurado.</p>
          <p>{stats.watchedCount} de {MCU_MOVIES.length} completadas</p>
        </footer>
      </main>

      <MovieDetailsModal
        movie={selectedMovie}
        movieProgress={selectedMovie ? progress[selectedMovie.id] : null}
        onClose={() => setSelectedMovieId('')}
        onToggle={toggleMovie}
        onMinuteChange={setMovieMinute}
      />
    </div>
  );
}
