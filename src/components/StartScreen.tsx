import { motion } from 'motion/react';
import { Play, Store, User, LogOut } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onOpenStore: () => void;
  userEmail?: string | null;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogoutClick?: () => void;
}

export function StartScreen({ onStart, onOpenStore, userEmail, onLoginClick, onRegisterClick, onLogoutClick }: StartScreenProps) {
  return (
    <motion.div
      key="start-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center max-w-md w-full relative"
      id="start-screen"
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12 pt-12">
        
        {/* Auth Top Bar */}
        <div className="absolute top-[-20px] w-full flex justify-end px-4">
          {userEmail ? (
            <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-full py-2 px-4 shadow-lg">
              <span className="text-xs font-bold text-zinc-400">{userEmail}</span>
              <button
                onClick={onLogoutClick}
                className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-full transition-colors active:scale-95"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-yellow-400/10 backdrop-blur border border-yellow-400/50 hover:bg-yellow-400 hover:text-black rounded-full py-2 px-4 text-xs font-bold text-yellow-400 transition-all active:scale-95 shadow-lg"
              >
                <User className="w-4 h-4" />
                INICIAR SESIÓN
              </button>
              <button
                onClick={onRegisterClick}
                className="flex items-center gap-2 bg-yellow-400/10 backdrop-blur border border-yellow-400/50 hover:bg-yellow-400 hover:text-black rounded-full py-2 px-4 text-xs font-bold text-yellow-400 transition-all active:scale-95 shadow-lg"
              >
                CREAR CUENTA
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white">
            BOMBAMAN
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.3em]">
            Classic Arcade Action
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <button
            onClick={onStart}
            className="group relative w-full py-5 bg-white text-black font-black rounded-2xl overflow-hidden active:scale-95 transition-transform cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 text-xl">
              <Play className="w-6 h-6 fill-black" />
              COMENZAR JUEGO
            </div>
            <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {userEmail && (
            <button
              onClick={onOpenStore}
              className="w-full py-4 bg-zinc-900 border-2 border-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5 text-yellow-400" />
              TIENDA DE SKINS
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
