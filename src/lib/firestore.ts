import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile, ScoreEntry, Difficulty } from '../types';
import { getWeekKey } from './week';

const usersCol = collection(db, 'users');
const scoresCol = collection(db, 'scores');

export async function ensureUserProfile(
  uid: string,
  nome: string,
  avatarUrl?: string
): Promise<UserProfile> {
  const ref = doc(usersCol, uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as UserProfile;

  const profile: UserProfile = {
    uid,
    nome,
    partidasJogadas: 0,
    melhorWpm: 0,
    precisaoMedia: 0,
    criadoEm: Date.now(),
    ...(avatarUrl ? { avatarUrl } : {}),
  };
  await setDoc(ref, profile);
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(usersCol, uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function submitScore(entry: Omit<ScoreEntry, 'id' | 'weekKey' | 'criadoEm'>) {
  const weekKey = getWeekKey();
  const { avatarUrl, ...resto } = entry;
  const scoreDoc: Omit<ScoreEntry, 'id'> = {
    ...resto,
    ...(avatarUrl ? { avatarUrl } : {}),
    weekKey,
    criadoEm: Date.now(),
  };
  await addDoc(scoresCol, scoreDoc);

  const profileRef = doc(usersCol, entry.uid);
  const snap = await getDoc(profileRef);
  if (snap.exists()) {
    const p = snap.data() as UserProfile;
    const partidas = p.partidasJogadas + 1;
    const precisaoMedia = Math.round(
      (p.precisaoMedia * p.partidasJogadas + entry.precisao) / partidas
    );
    await updateDoc(profileRef, {
      partidasJogadas: partidas,
      melhorWpm: Math.max(p.melhorWpm, entry.wpm),
      precisaoMedia,
    });
  }
}

export async function getPhaseRanking(phaseId: string): Promise<ScoreEntry[]> {
  const weekKey = getWeekKey();
  const q = query(
    scoresCol,
    where('phaseId', '==', phaseId),
    where('weekKey', '==', weekKey),
    orderBy('wpm', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ScoreEntry) }));
}

export async function getModeRanking(dificuldade: Difficulty): Promise<ScoreEntry[]> {
  const weekKey = getWeekKey();
  const q = query(
    scoresCol,
    where('dificuldade', '==', dificuldade),
    where('weekKey', '==', weekKey),
    orderBy('wpm', 'desc'),
    limit(300)
  );
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as ScoreEntry) }));

  const bestByUser = new Map<string, ScoreEntry>();
  for (const entry of all) {
    const existing = bestByUser.get(entry.uid);
    if (!existing || entry.wpm > existing.wpm) bestByUser.set(entry.uid, entry);
  }
  return Array.from(bestByUser.values())
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 100);
}
