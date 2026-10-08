import { useCallback, useEffect, useRef, useState } from 'react';
import { MCU_MOVIES } from '../data/mcuMovies';
import {
  authenticateAnonymousUser,
  readLocalProgress,
  saveCloudProgress,
  subscribeToCloudProgress,
  writeLocalProgress,
} from '../services/progressStorage';
import {
  createEmptyProgress,
  normalizeProgress,
  updateMovieProgress,
} from '../utils/progress';
import { isFirebaseConfigured } from '../lib/firebase';

export function useMcuProgress() {
  const [progress, setProgress] = useState(() => normalizeProgress(readLocalProgress(createEmptyProgress())));
  const [syncState, setSyncState] = useState('checking');
  const [userId, setUserId] = useState('');
  const cloudHydratedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};

    const bootstrap = async () => {
      const localProgress = readLocalProgress(createEmptyProgress());

      if (!mounted) return;
      setProgress(localProgress);

      if (!isFirebaseConfigured) {
        setSyncState('local');
        return;
      }

      try {
        const user = await authenticateAnonymousUser();
        if (!mounted || !user) return;

        setUserId(user.uid);

        unsubscribe = subscribeToCloudProgress(user.uid, {
          onChange: async ({ exists, progress: remoteProgress }) => {
            if (!mounted) return;

            if (exists && remoteProgress) {
              setProgress(remoteProgress);
            } else {
              await saveCloudProgress(user.uid, localProgress);
            }

            cloudHydratedRef.current = true;
            setSyncState('synced');
          },
          onError: () => {
            if (!mounted) return;
            cloudHydratedRef.current = true;
            setSyncState('error');
          },
        });
      } catch {
        if (!mounted) return;
        cloudHydratedRef.current = true;
        setSyncState('error');
      }
    };

    bootstrap();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    writeLocalProgress(progress);

    if (!userId || !cloudHydratedRef.current) return undefined;

    setSyncState('syncing');

    const timeoutId = window.setTimeout(async () => {
      try {
        await saveCloudProgress(userId, progress);
        setSyncState('synced');
      } catch {
        setSyncState('error');
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [progress, userId]);

  const toggleMovie = useCallback((movieId) => {
    const movie = MCU_MOVIES.find((item) => item.id === movieId);
    if (!movie) return;

    setProgress((current) => {
      const existing = current[movieId] ?? { completed: false, minute: 0 };
      return updateMovieProgress(current, movie, {
        completed: !existing.completed,
        minute: !existing.completed
          ? movie.duracionMinutos
          : Math.min(Math.max(existing.minute, 0), Math.max(0, movie.duracionMinutos - 1)),
      });
    });
  }, []);

  const setMovieMinute = useCallback((movieId, rawValue) => {
    const movie = MCU_MOVIES.find((item) => item.id === movieId);
    if (!movie) return;

    const numericValue = rawValue === '' ? 0 : Number(rawValue);

    setProgress((current) => updateMovieProgress(current, movie, {
      completed: numericValue >= movie.duracionMinutos,
      minute: Number.isFinite(numericValue) ? numericValue : 0,
    }));
  }, []);

  const resetAll = useCallback(() => {
    const empty = createEmptyProgress();
    setProgress(empty);
  }, []);

  return {
    progress,
    syncState,
    userId,
    toggleMovie,
    setMovieMinute,
    resetAll,
  };
}
