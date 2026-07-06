import { motion } from 'framer-motion';
import { BoltIcon } from '@heroicons/react/24/solid';

export default function LoadingScreen({
  label = 'Carregando...'
}: {
  label?: string;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-slate-400">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/20 text-accent-blue"
      >
        <BoltIcon className="h-7 w-7" />
      </motion.span>

      <p className="text-sm">{label}</p>
    </div>
  );
}