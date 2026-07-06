import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BoltIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { user, loginWithGoogle, error } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  async function handleGoogleLogin() {
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass w-full max-w-sm rounded-2xl p-8 text-center shadow-soft"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <motion.span
            animate={submitting ? { rotate: 360 } : { rotate: 0 }}
            transition={submitting ? { repeat: Infinity, duration: 1.1, ease: 'linear' } : {}}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/20 text-accent-blue"
          >
            <BoltIcon className="h-7 w-7" />
          </motion.span>
          <h1 className="font-display text-2xl font-bold text-slate-50">TypeRush</h1>
          <p className="text-sm text-slate-400">Entre com sua conta Google para competir com seus amigos</p>
        </div>

        {submitting ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-accent-blue"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                />
              ))}
            </div>
            <p className="text-sm text-slate-400">Entrando...</p>
          </div>
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-border/40 focus-ring"
          >
            <GoogleIcon />
            Entrar com Google
          </button>
        )}

        {error && <p className="mt-4 text-sm text-accent-red">{error}</p>}
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.3 24 12 24z"/>
      <path fill="#FBBC05" d="M5.27 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.27V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l4-3.11z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.3 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"/>
    </svg>
  );
}