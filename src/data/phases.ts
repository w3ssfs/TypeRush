import type { Phase } from '../types';

export const PHASES: Phase[] = [
  {
    id: 'facil-1',
    nome: 'Primeiros Passos',
    descricao: 'Uma frase curta e simples para aquecer os dedos.',
    dificuldade: 'facil',
    texto: 'O rato roeu a roupa do rei de Roma.',
    tempoRecomendado: 20,
    ordem: 1,
  },
  {
    id: 'facil-2',
    nome: 'Ritmo Constante',
    descricao: 'Palavras curtas, foco em não errar.',
    dificuldade: 'facil',
    texto: 'A prática leva à perfeição em qualquer área da vida.',
    tempoRecomendado: 22,
    ordem: 2,
  },
  {
    id: 'facil-3',
    nome: 'Mãos Leves',
    descricao: 'Uma frase tranquila sobre o dia a dia.',
    dificuldade: 'facil',
    texto: 'Hoje o sol nasceu cedo e o café ficou pronto na hora certa.',
    tempoRecomendado: 25,
    ordem: 3,
  },
  {
    id: 'facil-4',
    nome: 'Passo a Passo',
    descricao: 'Frase com pontuação simples para praticar vírgulas.',
    dificuldade: 'facil',
    texto: 'Primeiro acorde, depois se espreguice, e só então comece o dia.',
    tempoRecomendado: 25,
    ordem: 4,
  },
  {
    id: 'facil-5',
    nome: 'Quase Lá',
    descricao: 'Última fase do modo fácil, um pouco mais longa.',
    dificuldade: 'facil',
    texto: 'Digitar rápido é bom, mas digitar certo é o que realmente importa no fim.',
    tempoRecomendado: 28,
    ordem: 5,
  },

  {
    id: 'media-1',
    nome: 'Ganhando Ritmo',
    descricao: 'Frase mais longa, com números e pontuação.',
    dificuldade: 'media',
    texto: 'Em 2024, mais de 3 mil jogadores competiram pelo topo do ranking global.',
    tempoRecomendado: 30,
    ordem: 6,
  },
  {
    id: 'media-2',
    nome: 'Curva Técnica',
    descricao: 'Palavras acentuadas para testar precisão.',
    dificuldade: 'media',
    texto: 'A árvore genealógica da família revelava histórias incríveis e pouco conhecidas.',
    tempoRecomendado: 32,
    ordem: 7,
  },
  {
    id: 'media-3',
    nome: 'Reta de Chegada',
    descricao: 'Frase com símbolos e maiúsculas.',
    dificuldade: 'media',
    texto: 'ATENÇÃO: o servidor será reiniciado às 22h — salve seu progresso antes disso!',
    tempoRecomendado: 32,
    ordem: 8,
  },
  {
    id: 'media-4',
    nome: 'Fôlego Extra',
    descricao: 'Um parágrafo curto sobre tecnologia.',
    dificuldade: 'media',
    texto:
      'A tecnologia avança tão rápido que o que parecia impossível ontem se torna comum hoje.',
    tempoRecomendado: 35,
    ordem: 9,
  },
  {
    id: 'media-5',
    nome: 'Última Curva',
    descricao: 'Fecha o modo médio com uma frase mais densa.',
    dificuldade: 'media',
    texto:
      'Entre erros e acertos, cada partida ensina algo novo sobre paciência, foco e constância.',
    tempoRecomendado: 35,
    ordem: 10,
  },

  {
    id: 'dificil-1',
    nome: 'Alta Velocidade',
    descricao: 'Texto longo, sem pausas naturais.',
    dificuldade: 'dificil',
    texto:
      'Programar exige lógica, paciência e atenção aos detalhes, pois um único ponto e vírgula fora do lugar pode quebrar tudo.',
    tempoRecomendado: 40,
    ordem: 11,
  },
  {
    id: 'dificil-2',
    nome: 'Zona de Risco',
    descricao: 'Frase com números, símbolos e parênteses.',
    dificuldade: 'dificil',
    texto:
      'O resultado final foi 87,5% de precisão (recorde pessoal!) e 142 WPM em apenas 30 segundos.',
    tempoRecomendado: 40,
    ordem: 12,
  },
  {
    id: 'dificil-3',
    nome: 'Sem Freios',
    descricao: 'Parágrafo denso, exige concentração total.',
    dificuldade: 'dificil',
    texto:
      'Quando a contagem regressiva termina e o cronômetro começa, não existe espaço para hesitação: cada tecla certa aproxima você da vitória.',
    tempoRecomendado: 42,
    ordem: 13,
  },
  {
    id: 'dificil-4',
    nome: 'Modo Insano',
    descricao: 'Frase com citação e pontuação variada.',
    dificuldade: 'dificil',
    texto:
      '"A velocidade sem controle não vale nada", dizia o campeão antes de bater, mais uma vez, seu próprio recorde.',
    tempoRecomendado: 42,
    ordem: 14,
  },
  {
    id: 'dificil-5',
    nome: 'Recorde ou Nada',
    descricao: 'A fase mais desafiadora do TypeRush.',
    dificuldade: 'dificil',
    texto:
      'Entre milhares de teclas pressionadas por segundo em todo o mundo, poucas pessoas alcançam o equilíbrio perfeito entre velocidade e precisão — essa é a fase que separa os bons dos melhores.',
    tempoRecomendado: 48,
    ordem: 15,
  },
];

export const PHASES_BY_DIFFICULTY = {
  facil: PHASES.filter((p) => p.dificuldade === 'facil'),
  media: PHASES.filter((p) => p.dificuldade === 'media'),
  dificil: PHASES.filter((p) => p.dificuldade === 'dificil'),
};

export function getPhaseById(id: string): Phase | undefined {
  return PHASES.find((p) => p.id === id);
}
