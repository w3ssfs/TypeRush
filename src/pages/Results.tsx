import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrophyIcon, ArrowPathIcon, ForwardIcon, HomeIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import { getPhaseById, PHASES } from '../data/phases';
import { submitScore, getPhaseRanking } from '../lib/firestore';
import { useAuthStore } from '../store/authStore';
import type { RunStats } from '../types';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Results() {
  const { phaseId } = useParams();
  const location = useLocation() as { state?: { stats: RunStats; suspeitaDeTrapaca?: boolean } };
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuthStore();

  const phase = phaseId ? getPhaseById(phaseId) : undefined;
  const stats = location.state?.stats;
  const suspeitaDeTrapaca = location.state?.suspeitaDeTrapaca;

  const [posicao, setPosicao] = useState<number | null>(null);
  const [enviado, setEnviado] = useState(false);
  const recordeAnterior = profile?.melhorWpm ?? 0;

  useEffect(() => {
    async function enviar() {
      if (!phase || !stats || !user || !profile || enviado || suspeitaDeTrapaca) return;
      await submitScore({
        uid: user.uid,
        nome: profile.nome,
        avatarUrl: profile.avatarUrl,
        phaseId: phase.id,
        dificuldade: phase.dificuldade,
        tempo: stats.tempo,
        wpm: stats.wpm,
        cpm: stats.cpm,
        precisao: stats.precisao,
        erros: stats.erros,
      });
      setEnviado(true);
      await refreshProfile();
      const ranking = await getPhaseRanking(phase.id);
      const idx = ranking.findIndex((r) => r.uid === user.uid);
      setPosicao(idx >= 0 ? idx + 1 : null);
    }
    enviar();
    
  }, [phase, stats, user, profile]);

  if (!phase || !stats) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-xl px-4 py-16 text-center text-slate-300">
          Nenhum resultado para mostrar. <Link to="/fases" className="text-accent-blue">Escolher uma fase</Link>
        </main>
      </div>
    );
  }

  const proximaFase = PHASES.find((p) => p.ordem === phase.ordem + 1);
  const bateuRecorde = stats.wpm > recordeAnterior;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 text-center shadow-soft"
        >
          {posicao && posicao <= 3 ? (
            <div className="mb-2 text-5xl">{MEDALS[posicao - 1]}</div>
          ) : (
            <TrophyIcon className="mx-auto mb-2 h-10 w-10 text-accent-yellow" />
          )}

          <h1 className="font-display text-2xl font-bold text-slate-50">
            {suspeitaDeTrapaca ? 'Partida não contabilizada' : 'Fase concluída!'}
          </h1>

          {suspeitaDeTrapaca ? (
            <p className="mt-2 text-sm text-accent-red">
              Detectamos uma tentativa de colar texto. Essa pontuação não entra no ranking — jogue de novo digitando de verdade!
            </p>
          ) : (
            <>
              {bateuRecorde && (
                <p className="mt-2 text-sm font-medium text-accent-green">🎉 Novo recorde pessoal de WPM!</p>
              )}
              {posicao && (
                <p className="mt-1 text-sm text-slate-400">Você ficou em <span className="text-slate-100">#{posicao}</span> no ranking desta fase esta semana.</p>
              )}
            </>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat label="Tempo" value={`${stats.tempo}s`} />
            <ResultStat label="WPM" value={stats.wpm} />
            <ResultStat label="CPM" value={stats.cpm} />
            <ResultStat label="Precisão" value={`${stats.precisao}%`} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <ResultStat label="Erros" value={stats.erros} />
            <ResultStat label="Recorde pessoal (WPM)" value={Math.max(recordeAnterior, stats.wpm)} />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate(`/jogo/${phase.id}`, { replace: true })}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-slate-200 hover:bg-card focus-ring"
            >
              <ArrowPathIcon className="h-4 w-4" /> Jogar novamente
            </button>
            {proximaFase && (
              <Link
                to={`/jogo/${proximaFase.id}`}
                className="flex items-center gap-1.5 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white focus-ring"
              >
                <ForwardIcon className="h-4 w-4" /> Próxima fase
              </Link>
            )}
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-slate-200 hover:bg-card focus-ring"
            >
              <HomeIcon className="h-4 w-4" /> Início
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-bg/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-display text-lg font-bold text-slate-100">{value}</p>
    </div>
  );
}