const SYNC_META = {
  checking: { label: 'Conectando…', dot: 'bg-amber-400', pulse: true },
  syncing: { label: 'Guardando…', dot: 'bg-amber-400', pulse: true },
  synced: { label: 'Sincronizado', dot: 'bg-emerald-400', pulse: false },
  local: { label: 'Modo local', dot: 'bg-sky-400', pulse: false },
  error: { label: 'Revisa Firebase', dot: 'bg-red-400', pulse: false },
};

export default function SyncBadge({ state }) {
  const meta = SYNC_META[state] ?? SYNC_META.checking;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-semibold text-zinc-400">
      <span className={`h-2 w-2 rounded-full ${meta.dot} ${meta.pulse ? 'animate-pulse' : ''}`} />
      {meta.label}
    </span>
  );
}
