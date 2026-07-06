import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, error } = useAuthStore();

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="glass max-w-md rounded-2xl p-6 text-center shadow-soft">
          <p className="mb-2 font-display font-semibold text-accent-red">Erro de conexão</p>
          <p className="text-sm text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
