import { MCU_MOVIES } from '../data/mcuMovies';

export function createEmptyProgress() {
  return MCU_MOVIES.reduce((progress, movie) => {
    progress[movie.id] = { completed: false, minute: 0 };
    return progress;
  }, {});
}

export function normalizeProgress(source = {}) {
  return MCU_MOVIES.reduce((progress, movie) => {
    const saved = source?.[movie.id] ?? {};
    const parsedMinute = Number(saved.minute);
    const safeMinute = Number.isFinite(parsedMinute)
      ? Math.min(movie.duracionMinutos, Math.max(0, Math.floor(parsedMinute)))
      : 0;
    const completed = Boolean(saved.completed) || safeMinute >= movie.duracionMinutos;

    progress[movie.id] = {
      completed,
      minute: completed ? movie.duracionMinutos : safeMinute,
    };

    return progress;
  }, {});
}

export function updateMovieProgress(current, movie, { completed, minute }) {
  const boundedMinute = Math.min(
    movie.duracionMinutos,
    Math.max(0, Math.floor(Number(minute) || 0)),
  );

  const finalCompleted = Boolean(completed) || boundedMinute >= movie.duracionMinutos;

  return {
    ...current,
    [movie.id]: {
      completed: finalCompleted,
      minute: finalCompleted ? movie.duracionMinutos : boundedMinute,
    },
  };
}

export function calculateStats(progress, totalDurationMinutes) {
  const values = MCU_MOVIES.reduce(
    (stats, movie) => {
      const item = progress[movie.id] ?? { completed: false, minute: 0 };
      stats.watchedCount += item.completed ? 1 : 0;
      stats.investedMinutes += item.completed
        ? movie.duracionMinutos
        : Math.min(movie.duracionMinutos, item.minute);
      return stats;
    },
    { watchedCount: 0, investedMinutes: 0 },
  );

  const remainingMinutes = Math.max(0, totalDurationMinutes - values.investedMinutes);
  const percentage = totalDurationMinutes === 0
    ? 0
    : (values.investedMinutes / totalDurationMinutes) * 100;

  return {
    ...values,
    remainingMinutes,
    percentage,
    completedPercentage: (values.watchedCount / MCU_MOVIES.length) * 100,
  };
}
