import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import { useAuthStore } from '../store/authStore';
import { getUserProfile } from '../lib/firestore';
import { getTituloAtual } from '../lib/titles';
import type { Difficulty, UserProfile } from '../types';

const METAIS: Record<Difficulty, { nome: string; classes: string }> = {
  dificil: { nome: 'Ouro', classes: 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/40' },
  media: { nome: 'Prata', classes: 'bg-slate-300/15 text-slate-300 border-slate-300/40' },
  facil: { nome: 'Bronze', classes: 'bg-[#CD7F32]/15 text-[#CD7F32] border-[#CD7F32]/40' },
};
const ORDEM: Difficulty[] = ['dificil', 'media', 'facil'];

export default function Profile() {
  const { uid } = useParams();
  const { user, profile: ownProfile } = useAuthStore();
  const [outroPerfil, setOutroPerfil] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(false);

  const vendoOutroPerfil = !!uid && uid !== user?.uid;

  useEffect(() => {
    if (!vendoOutroPerfil || !uid) return;
    setCarregando(true);
    getUserProfile(uid).then((p) => {
      setOutroPerfil(p);
      setCarregando(false);
    });
  }, [uid, vendoOutroPerfil]);

  const profile = vendoOutroPerfil ? outroPerfil : ownProfile;

  if (vendoOutroPerfil && carregando) return <LoadingScreen label="Carregando perfil..." />;

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-400">Perfil não encontrado.</main>
      </div>
    );
  }

  const medalhas = profile.medalhas ?? {};
  const conquistas = ORDEM.flatMap((modo) =>
    [1, 2, 3].map((posicao) => ({ modo, posicao, quantidade: medalhas[`${modo}-${posicao}`] ?? 0 }))
  ).filter((m) => m.quantidade > 0);
  const titulo = getTituloAtual(medalhas);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="glass rounded-2xl p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-4">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-16 w-16 rounded-full border border-border" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-blue/20 font-display text-2xl font-bold text-accent-blue">
                {profile.nome.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-display text-xl font-bold text-slate-50">{profile.nome}</h1>
              <p className={`text-sm font-medium ${titulo.classes}`}>{titulo.label}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Info label="Partidas jogadas" value={profile.partidasJogadas} />
            <Info label="Maior WPM" value={profile.melhorWpm} />
            <Info label="Precisão média" value={`${profile.precisaoMedia}%`} />
          </div>
        </div>

        <div className="glass mt-6 rounded-2xl p-8 shadow-soft">
          <h2 className="mb-1 font-display text-lg font-semibold text-slate-100">Medalhas</h2>
          <p className="mb-5 text-sm text-slate-400">
            Ganhas ao terminar entre os 3 primeiros de um modo quando o ranking semanal reinicia.
          </p>
          {conquistas.length === 0 ? (
            <p className="text-sm text-slate-500">Ainda sem medalhas — jogue e dispute o topo da semana!</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {conquistas.map(({ modo, posicao, quantidade }, i) => {
                const metal = METAIS[modo];
                return (
                  <motion.div
                    key={`${modo}-${posicao}`}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                    whileHover={{ y: -3 }}
                    className="relative flex flex-col items-center gap-1"
                  >
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 font-display text-2xl font-bold shadow-soft ${metal.classes}`}>
                      {posicao}
                    </div>
                    {quantidade > 1 && (
                      <span className="absolute -right-1 -top-1 rounded-full bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 shadow-soft">
                        ×{quantidade}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{metal.nome}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-bg/50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-display text-lg font-bold text-slate-100">{value}</p>
    </div>
  );
}