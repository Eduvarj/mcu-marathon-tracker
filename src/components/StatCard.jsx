export default function StatCard({ label, value, detail, wide = false }) {
  return (
    <div className={`${wide ? 'md:col-span-2' : ''} rounded-2xl border border-white/10 bg-zinc-950/60 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
        <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.7)]" />
      </div>
      <div className="text-2xl font-black tracking-tight text-white">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{detail}</div>
    </div>
  );
}
