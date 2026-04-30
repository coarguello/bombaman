import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      key="start-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center max-w-md w-full"
      id="start-screen"
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white">
            BOMBAMAN
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.3em]">
            Classic Arcade Action
          </p>
        </div>

        <button
          onClick={onStart}
          className="group relative w-full max-w-sm py-5 bg-white text-black font-black rounded-2xl overflow-hidden active:scale-95 transition-transform cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <div className="relative z-10 flex items-center justify-center gap-3 text-xl">
            <Play className="w-6 h-6 fill-black" />
            COMENZAR JUEGO
          </div>
          <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </motion.div>
  );
}
