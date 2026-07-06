import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PhaseSelect from './pages/PhaseSelect';
import TypingGame from './pages/TypingGame';
import Results from './pages/Results';
import Rankings from './pages/Rankings';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import BackgroundBlobs from './components/BackgroundBlobs';
import { useAuthStore } from './store/authStore';

export default function App() {
  const init = useAuthStore((s) => s.init);
  const location = useLocation();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <BackgroundBlobs />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/fases" element={<ProtectedRoute><PhaseSelect /></ProtectedRoute>} />
            <Route path="/jogo/:phaseId" element={<ProtectedRoute><TypingGame /></ProtectedRoute>} />
            <Route path="/resultado/:phaseId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/rankings" element={<ProtectedRoute><Rankings /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/perfil/:uid" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
