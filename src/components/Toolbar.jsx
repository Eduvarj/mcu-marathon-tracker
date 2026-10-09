export default function Toolbar({
  search,
  filter,
  phaseFilter,
  sagaFilter,
  phaseOptions,
  sagaOptions,
  onSearchChange,
  onFilterChange,
  onPhaseFilterChange,
  onSagaFilterChange,
}) {
  const filters = [
    ['all', 'Todas'],
    ['pending', 'Pendientes'],
    ['completed', 'Completadas'],
  ];

  return (
    <section className="mb-6 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Tu maratón</p>
        <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">Sigue desde donde pausaste.</h2>
        <p className="mt-1 text-sm text-zinc-500">Escribe el minuto exacto y el tracker hará el resto.</p>
      </div>

      <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_auto] xl:min-w-[760px]">
        <label className="relative block">
          <span className="sr-only">Buscar película</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar película…"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
          />
        </label>

        <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
          {filters.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${filter === value ? 'bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.18)]' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">Fase</span>
          <select
            value={phaseFilter}
            onChange={(event) => onPhaseFilterChange(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
          >
            <option value="all">Todas las fases</option>
            {phaseOptions.map((phase) => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">Saga</span>
          <select
            value={sagaFilter}
            onChange={(event) => onSagaFilterChange(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
          >
            <option value="all">Todas las sagas</option>
            {sagaOptions.map((saga) => (
              <option key={saga} value={saga}>{saga}</option>
            ))}
          </select>
        </label>
      </div>
      </div>
    </section>
  );
}
