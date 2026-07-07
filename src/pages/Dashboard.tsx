import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BoltIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/solid';
import DifficultyBadge from '../components/DifficultyBadge';
import { PHASES } from '../data/phases';
import { getModeRanking } from '../lib/firestore';
import { useAuthStore } from '../store/authStore';
import type { Difficulty, ScoreEntry } from '../types';

const MODOS: { key: Difficulty; titulo: string }[] = [
  { key: 'facil', titulo: 'Fácil' },
  { key: 'media', titulo: 'Média' },
  { key: 'dificil', titulo: 'Difícil' },
];

export default function Dashboard() {
  const { profile } = useAuthStore();
  const proximaFase = PHASES[0];
  const [rankings, setRankings] = useState<Record<Difficulty, ScoreEntry[]>>({
    facil: [],
    media: [],
    dificil: [],
  });

  useEffect(() => {
    MODOS.forEach(({ key }) => {
      getModeRanking(key).then((entries) => {
        setRankings((prev) => ({ ...prev, [key]: entries.slice(0, 3) }));
      });
    });
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-1"
      >
        <h1 className="font-display text-2xl font-bold text-slate-50 sm:text-3xl">
          E aí, {profile?.nome.split(' ')[0] ?? 'jogador'}! 👋
        </h1>
        <p className="text-slate-400">Pronto pra bater seu recorde hoje?</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Partidas jogadas" value={profile?.partidasJogadas ?? 0} icon={FireIcon} color="blue" delay={0} />
        <StatCard label="Maior WPM" value={profile?.melhorWpm ?? 0} icon={BoltIcon} color="yellow" delay={0.06} />
        <StatCard label="Precisão média" value={`${profile?.precisaoMedia ?? 0}%`} icon={TrophyIcon} color="green" delay={0.12} />
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-100">Continue jogando</h2>
          <Link to="/fases" className="text-sm text-accent-blue hover:underline">
            Ver todas as fases
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <Link
            to={`/jogo/${proximaFase.id}`}
            className="glass flex items-center justify-between rounded-2xl p-5 shadow-soft transition-transform hover:scale-[1.01]"
          >
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="font-display font-semibold text-slate-50">{proximaFase.nome}</span>
                <DifficultyBadge dificuldade={proximaFase.dificuldade} />
              </div>
              <p className="text-sm text-slate-400">{proximaFase.descricao}</p>
            </div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white"
            >
              Jogar
            </motion.span>
          </Link>
        </motion.div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-100">Top da semana</h2>
          <Link to="/rankings" className="text-sm text-accent-blue hover:underline">
            Ver todos os rankings
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MODOS.map(({ key, titulo }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
              className="glass rounded-2xl p-4 shadow-soft"
            >
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-display font-semibold text-slate-100">{titulo}</h3>
                <DifficultyBadge dificuldade={key} />
              </div>
              <div className="flex flex-col gap-2">
                {rankings[key].length === 0 && (
                  <p className="text-xs text-slate-500">Ninguém pontuou ainda essa semana.</p>
                )}
                {rankings[key].map((entry, pos) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                      pos === 0
                        ? 'border-2 border-accent-yellow bg-accent-yellow/10'
                        : 'border border-border/70 bg-bg/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={pos === 0 ? 'text-accent-yellow' : 'text-slate-500'}>
                        {pos === 0 ? '🥇' : pos === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className={pos === 0 ? 'font-semibold text-slate-50' : 'text-slate-300'}>
                        {entry.nome}
                      </span>
                    </span>
                    <span className={pos === 0 ? 'font-semibold text-accent-yellow' : 'text-slate-400'}>
                      {entry.wpm} wpm
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <Link
            to="/rankings"
            className="glass block h-full rounded-2xl p-5 shadow-soft transition-transform hover:scale-[1.01]"
          >
            <TrophyIcon className="mb-2 h-6 w-6 text-accent-yellow" />
            <h3 className="font-display font-semibold text-slate-100">Ranking Global</h3>
            <p className="text-sm text-slate-400">Veja quem lidera cada fase e cada modo essa semana.</p>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Link
            to="/perfil"
            className="glass block h-full rounded-2xl p-5 shadow-soft transition-transform hover:scale-[1.01]"
          >
            <FireIcon className="mb-2 h-6 w-6 text-accent-red" />
            <h3 className="font-display font-semibold text-slate-100">Seu perfil</h3>
            <p className="text-sm text-slate-400">Acompanhe sua evolução partida a partida.</p>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  icon: typeof BoltIcon;
  color: 'blue' | 'yellow' | 'green';
  delay: number;
}) {
  const colors = {
    blue: 'text-accent-blue bg-accent-blue/15',
    yellow: 'text-accent-yellow bg-accent-yellow/15',
    green: 'text-accent-green bg-accent-green/15',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -3 }}
      className="glass flex items-center gap-4 rounded-2xl p-5 shadow-soft"
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-display text-xl font-bold text-slate-50">{value}</p>
      </div>
    </motion.div>
  );
}