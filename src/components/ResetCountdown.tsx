import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMsAteReset, formatCountdown } from '../lib/week';

export default function ResetCountdown() {
  const [ms, setMs] = useState(() => getMsAteReset());

  useEffect(() => {
    const t = setInterval(() => setMs(getMsAteReset()), 1000);
    return () => clearInterval(t);
  }, []);

  const { dias, horas, minutos, segundos } = formatCountdown(ms);

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-1.5 font-mono text-sm text-slate-300">
      <span className="text-xs text-slate-500">reinicia em</span>
      <Unidade valor={dias} sufixo="d" />
      <Unidade valor={horas} sufixo="h" />
      <Unidade valor={minutos} sufixo="m" />
      <Unidade valor={segundos} sufixo="s" />
    </div>
  );
}

function Unidade({ valor, sufixo }: { valor: number; sufixo: string }) {
  return (
    <span className="flex items-baseline gap-0.5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={valor}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.12 }}
          className="tabular-nums text-accent-blue"
        >
          {valor.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
      <span className="text-slate-500">{sufixo}</span>
    </span>
  );
}
