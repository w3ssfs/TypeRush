import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ensureUserProfile, getUserProfile } from '../lib/firestore';
import { processWeeklyMedalsIfNeeded } from '../lib/medals';
import type { UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  init: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  init: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await ensureUserProfile(
            user.uid,
            user.displayName ?? 'Jogador',
            user.photoURL ?? undefined
          );
          set({ user, profile, loading: false, error: null });
          processWeeklyMedalsIfNeeded().catch((e) => console.error('Falha ao processar medalhas:', e));
        } catch (e) {
          console.error('Falha ao carregar perfil do Firestore:', e);
          set({
            user,
            profile: null,
            loading: false,
            error: 'Não foi possível conectar ao banco de dados (Firestore). Verifique se o Firestore Database foi criado no console do Firebase e se sua internet/rede não está bloqueando a conexão.',
          });
        }
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  },

  loginWithGoogle: async () => {
    set({ error: null });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      set({ error: traduzErro(e) });
      throw e;
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    set({ profile });
  },
}));

function traduzErro(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/popup-closed-by-user': 'Login com Google cancelado.',
    'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Permita pop-ups e tente de novo.',
  };
  return map[code] ?? 'Ocorreu um erro. Tente novamente.';
}