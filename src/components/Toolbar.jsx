export default function Toolbar({ search, filter, onSearchChange, onFilterChange }) {
  const filters = [
    ['all', 'Todas'],
    ['pending', 'Pendientes'],
    ['completed', 'Completadas'],
  ];

  return (
    <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-950/60 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Tu maratón</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Sigue desde donde pausaste.</h2>
        <p className="mt-1 text-sm text-zinc-500">Escribe el minuto exacto y el tracker hará el resto.</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative block min-w-64">
          <span className="sr-only">Buscar película</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar película…"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
          />
        </label>

        <div className="flex rounded-2xl border border-white/10 bg-black/20 p-1">
          {filters.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${filter === value ? 'bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.18)]' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
