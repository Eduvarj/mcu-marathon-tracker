import {
  browserLocalPersistence,
  setPersistence,
  signInAnonymously,
} from 'firebase/auth';
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { STORAGE_KEY } from '../data/mcuMovies';
import { normalizeProgress } from '../utils/progress';
import { firebaseAuth, firebaseDb, isFirebaseConfigured } from '../lib/firebase';

const COLLECTION = 'mcuMarathonUsers';

export function readLocalProgress(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeProgress(JSON.parse(raw)) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function authenticateAnonymousUser() {
  if (!isFirebaseConfigured || !firebaseAuth) {
    return null;
  }

  await setPersistence(firebaseAuth, browserLocalPersistence);

  if (firebaseAuth.currentUser) {
    return firebaseAuth.currentUser;
  }

  const credential = await signInAnonymously(firebaseAuth);
  return credential.user;
}

export function subscribeToCloudProgress(userId, { onChange, onError }) {
  if (!firebaseDb) return () => {};

  const progressRef = doc(firebaseDb, COLLECTION, userId);

  return onSnapshot(
    progressRef,
    (snapshot) => {
      onChange({
        exists: snapshot.exists(),
        progress: snapshot.exists()
          ? normalizeProgress(snapshot.data()?.progress)
          : null,
      });
    },
    onError,
  );
}

export async function saveCloudProgress(userId, progress) {
  if (!firebaseDb || !userId) return;

  const progressRef = doc(firebaseDb, COLLECTION, userId);

  await setDoc(
    progressRef,
    {
      progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
