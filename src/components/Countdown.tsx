import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Countdown({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState<number | 'GO!'>(3);

  useEffect(() => {
    if (value === 'GO!') {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    if (value === 0) return;
    const t = setTimeout(() => {
      setValue((v) => (typeof v === 'number' && v > 1 ? v - 1 : 'GO!'));
    }, 700);
    return () => clearTimeout(t);
  }, [value, onDone]);

  return (
    <div className="flex h-64 items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={String(value)}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={`font-display text-8xl font-bold ${
            value === 'GO!' ? 'text-accent-green' : 'text-accent-blue'
          }`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
