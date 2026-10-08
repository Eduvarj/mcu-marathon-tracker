export function formatDuration(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const days = Math.floor(safeMinutes / 1440);
  const hours = Math.floor((safeMinutes % 1440) / 60);
  const minutes = safeMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
}

export function formatDurationVerbose(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const days = Math.floor(safeMinutes / 1440);
  const hours = Math.floor((safeMinutes % 1440) / 60);
  const minutes = safeMinutes % 60;
  return `${days} días, ${hours} horas y ${minutes} minutos`;
}
