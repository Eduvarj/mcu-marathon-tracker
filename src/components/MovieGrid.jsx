import MovieCard from './MovieCard';

export default function MovieGrid({ movies, progress, onToggle, onMinuteChange, onOpenMovie }) {
  if (movies.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/40 px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-zinc-500">
          ⌕
        </div>
        <h3 className="mt-4 text-lg font-bold text-white">No encontramos esa película</h3>
        <p className="mt-1 text-sm text-zinc-600">Prueba con otro título, número o cambia el filtro.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          movieProgress={progress[movie.id]}
          onToggle={onToggle}
          onMinuteChange={onMinuteChange}
          onOpenMovie={onOpenMovie}
        />
      ))}
    </section>
  );
}
