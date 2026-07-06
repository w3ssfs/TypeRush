import type { Difficulty } from '../types';

const STYLES: Record<Difficulty, { label: string; classes: string }> = {
  facil: { label: 'Fácil', classes: 'bg-accent-green/15 text-accent-green border-accent-green/30' },
  media: { label: 'Média', classes: 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/30' },
  dificil: { label: 'Difícil', classes: 'bg-accent-red/15 text-accent-red border-accent-red/30' },
};

export default function DifficultyBadge({ dificuldade }: { dificuldade: Difficulty }) {
  const s = STYLES[dificuldade];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.classes}`}>
      {s.label}
    </span>
  );
}
