import { useEffect, useState, type ReactNode } from 'react';
import Navbar from '../components/Navbar';
import DifficultyBadge from '../components/DifficultyBadge';
import ResetCountdown from '../components/ResetCountdown';
import { PHASES } from '../data/phases';
import { getModeRanking, getPhaseRanking } from '../lib/firestore';
import { getWeekLabel, getWeekKey } from '../lib/week';
import { useAuthStore } from '../store/authStore';
import type { Difficulty, ScoreEntry } from '../types';
import { Link } from 'react-router-dom';

const MODOS: { key: Difficulty; label: string }[] = [
  { key: 'facil', label: 'Fácil' },
  { key: 'media', label: 'Média' },
  { key: 'dificil', label: 'Difícil' },
];

export default function Rankings() {
  const { user } = useAuthStore();
  const [tipo, setTipo] = useState<'fase' | 'modo'>('modo');
  const [modo, setModo] = useState<Difficulty>('facil');
  const [phaseId, setPhaseId] = useState(PHASES[0].id);
  const [ranking, setRanking] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const carregar = tipo === 'modo' ? getModeRanking(modo) : getPhaseRanking(phaseId);
    carregar.then((r) => {
      setRanking(r);
      setLoading(false);
    });
  }, [tipo, modo, phaseId]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-bold text-slate-50">Rankings</h1>
            <p className="text-sm text-slate-400">{getWeekLabel(getWeekKey())}</p>
          </div>
          <ResetCountdown />
        </div>

        <div className="mb-6 flex gap-2">
          <TabButton active={tipo === 'modo'} onClick={() => setTipo('modo')}>
            Por modo
          </TabButton>
          <TabButton active={tipo === 'fase'} onClick={() => setTipo('fase')}>
            Por fase
          </TabButton>
        </div>

        {tipo === 'modo' ? (
          <div className="mb-6 flex gap-2">
            {MODOS.map((m) => (
              <button
                key={m.key}
                onClick={() => setModo(m.key)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors focus-ring ${modo === m.key
                    ? 'border-accent-blue bg-accent-blue/15 text-accent-blue'
                    : 'border-border text-slate-400 hover:text-slate-200'
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        ) : (
          <select
            value={phaseId}
            onChange={(e) => setPhaseId(e.target.value)}
            className="mb-6 w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm text-slate-100 outline-none focus-ring"
          >
            {PHASES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome} ({f.dificuldade})
              </option>
            ))}
          </select>
        )}

        <div className="glass overflow-hidden rounded-2xl shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Jogador</th>
                <th className="px-4 py-3">WPM</th>
                <th className="px-4 py-3 hidden sm:table-cell">Precisão</th>
                <th className="px-4 py-3 hidden sm:table-cell">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Carregando ranking...
                  </td>
                </tr>
              )}
              {!loading && ranking.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Ninguém pontuou aqui ainda essa semana. Seja o primeiro!
                  </td>
                </tr>
              )}
              {ranking.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-border/60 last:border-0 ${r.uid === user?.uid ? 'bg-accent-blue/10' : ''
                    }`}
                >
                  <td className="px-4 py-3 font-display font-semibold">
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/perfil/${r.uid}`} className="hover:text-accent-blue hover:underline">
                      {r.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-accent-blue">{r.wpm}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{r.precisao}%</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{r.tempo}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tipo === 'fase' && (
          <div className="mt-2 flex justify-end">
            <DifficultyBadge dificuldade={PHASES.find((p) => p.id === phaseId)!.dificuldade} />
          </div>
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring ${active ? 'bg-card text-slate-50' : 'text-slate-400 hover:text-slate-200'
        }`}
    >
      {children}
    </button>
  );
}
