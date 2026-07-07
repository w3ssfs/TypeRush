import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';

function ProtectedLayout() {
  const location = useLocation();
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <BackgroundBlobs />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fases" element={<PhaseSelect />} />
          <Route path="/jogo/:phaseId" element={<TypingGame />} />
          <Route path="/resultado/:phaseId" element={<Results />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/:uid" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}