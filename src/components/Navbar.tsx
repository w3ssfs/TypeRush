import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BoltIcon,
  HomeIcon,
  TrophyIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/', label: 'Início', icon: HomeIcon },
  { to: '/fases', label: 'Fases', icon: BoltIcon },
  { to: '/rankings', label: 'Rankings', icon: TrophyIcon },
  { to: '/perfil', label: 'Perfil', icon: UserCircleIcon },
];

export default function Navbar() {
  const location = useLocation();
  
  const { profile, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.08 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-blue/20 text-accent-blue"
          >
            <BoltIcon className="h-5 w-5" />
          </motion.span>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-50">
            Type<span className="text-accent-blue">Rush</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring ${
                  active ? 'text-slate-50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-card"
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {profile && (
            <span className="hidden text-sm text-slate-400 sm:inline">
              Olá, <span className="text-slate-200">{profile.nome.split(' ')[0]}</span>
            </span>
          )}
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-accent-red/60 hover:text-accent-red focus-ring"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      <nav className="flex items-center justify-around border-t border-border/70 py-2 sm:hidden">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
                active ? 'text-accent-blue' : 'text-slate-400'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill-mobile"
                  className="absolute inset-0 rounded-lg bg-card"
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                />
              )}
              <Icon className="relative h-5 w-5" />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

