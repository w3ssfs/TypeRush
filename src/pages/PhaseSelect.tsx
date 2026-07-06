import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import DifficultyBadge from '../components/DifficultyBadge';
import { PHASES_BY_DIFFICULTY } from '../data/phases';
import type { Difficulty } from '../types';

const GROUPS: { key: Difficulty; titulo: string }[] = [
  { key: 'facil', titulo: 'Fácil' },
  { key: 'media', titulo: 'Média' },
  { key: 'dificil', titulo: 'Difícil' },
];

export default function PhaseSelect() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-8 font-display text-2xl font-bold text-slate-50 sm:text-3xl">Escolha uma fase</h1>

        {GROUPS.map(({ key, titulo }, groupIndex) => (
          <section key={key} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-slate-100">{titulo}</h2>
              <DifficultyBadge dificuldade={key} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PHASES_BY_DIFFICULTY[key].map((fase, i) => (
                <motion.div
                  key={fase.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.05 + i * 0.04, duration: 0.3 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/jogo/${fase.id}`}
                    className="glass flex h-full flex-col gap-2 rounded-xl p-4 shadow-soft"
                  >
                    <span className="font-display font-semibold text-slate-50">{fase.nome}</span>
                    <p className="text-sm text-slate-400">{fase.descricao}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>~{fase.tempoRecomendado}s</span>
                      <span>{fase.texto.length} caracteres</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
