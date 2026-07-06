import type { RunStats } from '../types';

export function calculateStats(
  typedText: string,
  targetText: string,
  elapsedSeconds: number,
  errorCount: number
): RunStats {
  const totalCaracteres = targetText.length;
  const minutos = Math.max(elapsedSeconds / 60, 1 / 60);

  let corretos = 0;
  for (let i = 0; i < typedText.length && i < targetText.length; i++) {
    if (typedText[i] === targetText[i]) corretos++;
  }

  const palavras = totalCaracteres / 5;
  const wpm = Math.round(palavras / minutos);
  const cpm = Math.round(totalCaracteres / minutos);
  const tentativas = corretos + errorCount;
  const precisao = tentativas > 0 ? Math.round((corretos / tentativas) * 100) : 100;

  return {
    tempo: Math.round(elapsedSeconds * 10) / 10,
    wpm: Math.max(wpm, 0),
    cpm: Math.max(cpm, 0),
    precisao: Math.min(Math.max(precisao, 0), 100),
    erros: errorCount,
    totalCaracteres,
  };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
