import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ClipboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Countdown from '../components/Countdown';
import DifficultyBadge from '../components/DifficultyBadge';
import { getPhaseById } from '../data/phases';
import { calculateStats, formatTime } from '../lib/calculations';

type Fase = 'aguardando' | 'contagem' | 'jogando' | 'finalizado';

export default function TypingGame() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const phase = phaseId ? getPhaseById(phaseId) : undefined;

  const [fase, setFase] = useState<Fase>('aguardando');
  const [typed, setTyped] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [cheatFlag, setCheatFlag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastLenRef = useRef(0);

  useEffect(() => {
    if (fase !== 'jogando') return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [fase]);

  useEffect(() => {
    if (fase === 'jogando') inputRef.current?.focus();
  }, [fase]);

  if (!phase) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-slate-300">Fase não encontrada.</p>
        </main>
      </div>
    );
  }
  const currentPhase = phase;
  const elapsed = startTime ? (now - startTime) / 1000 : 0;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value.length - lastLenRef.current > 6) {
      setCheatFlag(true);
    }
    lastLenRef.current = value.length;

    if (value.length > typed.length) {
      const idx = value.length - 1;
      if (value[idx] !== currentPhase.texto[idx]) {
        setErrorCount((c) => c + 1);
      }
    }

    setTyped(value);

    if (value.length >= currentPhase.texto.length) {
      finalizar(value);
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    setCheatFlag(true);
  }

  function iniciar() {
    setFase('contagem');
  }

  function comecarDigitacao() {
    setStartTime(Date.now());
    setFase('jogando');
  }

  function finalizar(valorFinal: string) {
    const finalElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const stats = calculateStats(valorFinal, currentPhase.texto, finalElapsed, errorCount);
    setFase('finalizado');
    navigate(`/resultado/${currentPhase.id}`, {
      state: { stats, suspeitaDeTrapaca: cheatFlag },
      replace: true,
    });
  }

  const liveStats = useMemo(() => {
    if (!startTime) return { wpm: 0, precisao: 100 };
    const s = calculateStats(typed, phase.texto, Math.max(elapsed, 0.1), errorCount);
    return { wpm: s.wpm, precisao: s.precisao };
  }, [typed, elapsed, errorCount, phase.texto, startTime]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <h1 className="font-display text-xl font-bold text-slate-50">{phase.nome}</h1>
          <DifficultyBadge dificuldade={phase.dificuldade} />
        </div>

        {fase === 'aguardando' && (
          <div className="glass rounded-2xl p-8 text-center shadow-soft">
            <p className="mb-6 text-slate-300">
              Você tem cerca de <span className="text-accent-blue">{phase.tempoRecomendado}s</span> para
              digitar o texto abaixo. Colar texto não é permitido.
            </p>
            <p className="mb-8 rounded-xl border border-border bg-bg/50 p-4 font-mono text-sm text-slate-400">
              {phase.texto}
            </p>
            <motion.button
              onClick={iniciar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-lg bg-accent-blue px-6 py-3 font-semibold text-white shadow-glow focus-ring"
            >
              Iniciar
            </motion.button>
          </div>
        )}

        {fase === 'contagem' && (
          <div className="glass rounded-2xl shadow-soft">
            <Countdown onDone={comecarDigitacao} />
          </div>
        )}

        {fase === 'jogando' && (
          <div className="glass rounded-2xl p-6 shadow-soft">
            <div className="mb-5 grid grid-cols-3 gap-3 text-center sm:grid-cols-4">
              <Stat label="Tempo" value={formatTime(elapsed)} />
              <Stat label="WPM" value={liveStats.wpm} />
              <Stat label="Precisão" value={`${liveStats.precisao}%`} />
              <Stat label="Erros" value={errorCount} className="hidden sm:block" />
            </div>

            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-accent-green transition-all"
                style={{ width: `${Math.min((typed.length / phase.texto.length) * 100, 100)}%` }}
              />
            </div>

            <p className="select-none rounded-xl border border-border bg-bg/50 p-5 font-mono text-lg leading-relaxed tracking-wide">
              {phase.texto.split('').map((char, i) => {
                let className = 'text-slate-600';
                if (i < typed.length) {
                  className = typed[i] === char ? 'text-accent-green' : 'text-accent-red bg-accent-red/10';
                } else if (i === typed.length) {
                  className = 'text-slate-100 border-b-2 border-accent-blue animate-caret';
                }
                return (
                  <span key={i} className={className}>
                    {char}
                  </span>
                );
              })}
            </p>

            <input
              ref={inputRef}
              value={typed}
              onChange={handleChange}
              onPaste={handlePaste}
              autoFocus
              className="mt-4 w-full rounded-lg border border-border bg-bg/60 px-3 py-2 font-mono text-sm text-transparent caret-accent-blue outline-none focus-ring"
              placeholder="Comece a digitar aqui..."
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, className = '' }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-slate-500">{label}</p>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="font-display text-lg font-bold text-slate-100"
        >
          {value}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
