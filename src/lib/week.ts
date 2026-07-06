export function getWeekKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

export function getWeekLabel(weekKey: string): string {
  return `Semana ${weekKey.split('-W')[1]} · ${weekKey.split('-W')[0]}`;
}

export function getNextResetDate(from: Date = new Date()): Date {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const dia = d.getUTCDay();
  let diasAte = (1 - dia + 7) % 7;
  if (diasAte === 0) diasAte = 7;
  d.setUTCDate(d.getUTCDate() + diasAte);
  return d;
}

export function getMsAteReset(from: Date = new Date()): number {
  return Math.max(getNextResetDate(from).getTime() - from.getTime(), 0);
}

export function formatCountdown(ms: number): { dias: number; horas: number; minutos: number; segundos: number } {
  const totalSegundos = Math.floor(ms / 1000);
  const dias = Math.floor(totalSegundos / 86400);
  const horas = Math.floor((totalSegundos % 86400) / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  return { dias, horas, minutos, segundos };
}
