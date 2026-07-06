export type Difficulty = 'facil' | 'media' | 'dificil';

export interface Phase {
  id: string;
  nome: string;
  descricao: string;
  dificuldade: Difficulty;
  texto: string;
  tempoRecomendado: number;
  ordem: number;
}

export interface UserProfile {
  uid: string;
  nome: string;
  avatarUrl?: string;
  partidasJogadas: number;
  melhorWpm: number;
  precisaoMedia: number;
  criadoEm: number;
  medalhas?: Record<string, number>;
}

export interface ScoreEntry {
  id?: string;
  uid: string;
  nome: string;
  avatarUrl?: string;
  phaseId: string;
  dificuldade: Difficulty;
  tempo: number;
  wpm: number;
  cpm: number;
  precisao: number;
  erros: number;
  weekKey: string;
  criadoEm: number;
}

export interface RunStats {
  tempo: number;
  wpm: number;
  cpm: number;
  precisao: number;
  erros: number;
  totalCaracteres: number;
}
