import { motion, AnimatePresence } from 'motion/react';

interface GameHUDProps {
  level: number;
  score: number;
  globalCratesDestroyed: number;
  milestoneMessage: string | null;
}

export function GameHUD({ level, score, globalCratesDestroyed, milestoneMessage }: GameHUDProps) {
  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col items-start gap-2">
      <div className="flex gap-2">
        <div className="text-zinc-400 font-mono text-xs bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-700/30 backdrop-blur-md shadow-lg">
          LEVEL: <span className="text-white font-bold">{level}</span>
        </div>
        <div className="text-zinc-400 font-mono text-xs bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-700/30 backdrop-blur-md shadow-lg">
          SCORE: <span className="text-emerald-400 font-bold tracking-tight">{score.toString().padStart(6, '0')}</span>
        </div>
      </div>
      
      {/* Milestone HUD */}
      <div className="bg-zinc-900/90 p-3 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-2 min-w-[240px]">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Crates Blown</span>
          <span className="text-xs font-mono font-bold text-white">
            {globalCratesDestroyed} <span className="text-zinc-600">/ 1000</span>
          </span>
        </div>
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (globalCratesDestroyed / 1000) * 100)}%` }}
            className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-emerald-400"
          />
          {/* Milestone markers */}
          {[5, 15, 100, 250, 500].map(m => (
            <div 
              key={m} 
              className={`absolute top-0 bottom-0 w-0.5 bg-black/40 z-10 ${globalCratesDestroyed >= m ? 'opacity-100' : 'opacity-30'}`}
              style={{ left: `${(m / 1000) * 100}%` }}
            />
          ))}
        </div>
        
        {/* Active Buffs (Horizontal) */}
        <div className="flex flex-wrap gap-1 mt-1">
          {globalCratesDestroyed >= 5 && (
            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">
              Quick {globalCratesDestroyed >= 500 ? 'MAX' : globalCratesDestroyed >= 100 ? 'Turbo' : 'Feet'}
            </div>
          )}
          {globalCratesDestroyed >= 15 && (
            <div className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded text-[9px] font-bold text-orange-400 uppercase tracking-tighter">
              Fire {globalCratesDestroyed >= 1000 ? 'NUCLEAR' : globalCratesDestroyed >= 250 ? 'x3' : 'Up'}
            </div>
          )}
        </div>

        {/* Milestone Message - Relocated below counter within HUD context */}
        <AnimatePresence>
          {milestoneMessage && (
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 1.1 }}
              className="mt-2 p-3 bg-white text-black rounded-xl border-2 border-emerald-500 shadow-xl"
            >
              <div className="text-xs font-black italic tracking-tighter uppercase leading-none">
                UPGRADE UNLOCKED!
              </div>
              <div className="text-lg font-black tracking-tighter uppercase leading-tight">
                {milestoneMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
