import type { Difficulty } from '../types';

interface TituloTier {
  label: string;
  classes: string;
  requisito: (m: Record<string, number>) => boolean;
}

function vitorias(medalhas: Record<string, number>, modo: Difficulty) {
  return medalhas[`${modo}-1`] ?? 0;
}

const TIERS: TituloTier[] = [
  { label: 'Lenda do TypeRush', classes: 'text-accent-yellow', requisito: (m) => vitorias(m, 'dificil') >= 10 },
  { label: 'Mestre do Difícil', classes: 'text-accent-yellow', requisito: (m) => vitorias(m, 'dificil') >= 1 },
  { label: 'Veterano do Médio', classes: 'text-slate-200', requisito: (m) => vitorias(m, 'media') >= 10 },
  { label: 'Competidor', classes: 'text-accent-blue', requisito: (m) => vitorias(m, 'media') >= 1 },
  { label: 'Vencedor', classes: 'text-accent-green', requisito: (m) => vitorias(m, 'facil') >= 1 },
];

const PADRAO: TituloTier = { label: 'Jogador do TypeRush', classes: 'text-slate-400', requisito: () => true };

export function getTituloAtual(medalhas: Record<string, number> = {}) {
  const tier = TIERS.find((t) => t.requisito(medalhas)) ?? PADRAO;
  return { label: tier.label, classes: tier.classes };
}