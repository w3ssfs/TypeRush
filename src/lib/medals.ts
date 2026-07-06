import { doc, collection, query, where, getDocs, updateDoc, increment, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { getWeekKey } from './week';
import type { Difficulty, ScoreEntry } from '../types';

const MODOS: Difficulty[] = ['facil', 'media', 'dificil'];

async function getTop3ForWeek(dificuldade: Difficulty, weekKey: string): Promise<string[]> {
  const q = query(
    collection(db, 'scores'),
    where('dificuldade', '==', dificuldade),
    where('weekKey', '==', weekKey)
  );
  const snap = await getDocs(q);

  const bestByUser = new Map<string, ScoreEntry>();
  snap.docs.forEach((d) => {
    const data = d.data() as ScoreEntry;
    const existing = bestByUser.get(data.uid);
    if (!existing || data.wpm > existing.wpm) bestByUser.set(data.uid, data);
  });

  return Array.from(bestByUser.values())
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 3)
    .map((e) => e.uid);
}

export async function processWeeklyMedalsIfNeeded() {
  const metaRef = doc(db, 'meta', 'weekly-medals');
  const semanaAnterior = getWeekKey(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const podeProcessar = await runTransaction(db, async (tx) => {
    const snap = await tx.get(metaRef);
    const ultima = snap.exists() ? (snap.data().ultimaSemanaProcessada as string | undefined) : undefined;
    if (ultima === semanaAnterior) return false;
    tx.set(metaRef, { ultimaSemanaProcessada: semanaAnterior }, { merge: true });
    return true;
  });

  if (!podeProcessar) return;

  for (const modo of MODOS) {
    const top3 = await getTop3ForWeek(modo, semanaAnterior);
    for (let i = 0; i < top3.length; i++) {
      const posicao = i + 1;
      const campo = `medalhas.${modo}-${posicao}`;
      await updateDoc(doc(db, 'users', top3[i]), { [campo]: increment(1) });
    }
  }
}
