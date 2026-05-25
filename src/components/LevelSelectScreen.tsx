import { motion } from 'motion/react';
import { Lock, ArrowLeft, Star } from 'lucide-react';

interface LevelSelectScreenProps {
  maxUnlockedLevel: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

// Show unlocked levels + a few locked ones ahead
const TOTAL_VISIBLE = 20;

export function LevelSelectScreen({ maxUnlockedLevel, onSelectLevel, onBack }: LevelSelectScreenProps) {
  const levels = Array.from({ length: TOTAL_VISIBLE }, (_, i) => i + 1);

  return (
    <motion.div
      key="level-select"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl px-4"
      id="level-select-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">NIVELES</h2>
          <p className="text-zinc-500 text-sm font-mono">
            {maxUnlockedLevel - 1} nivel{maxUnlockedLevel - 1 !== 1 ? 'es' : ''} completado{maxUnlockedLevel - 1 !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-5 gap-3">
        {levels.map(lvl => {
          const isUnlocked = lvl <= maxUnlockedLevel;
          const isCompleted = lvl < maxUnlockedLevel;

          return (
            <motion.button
              key={lvl}
              whileHover={isUnlocked ? { scale: 1.08 } : {}}
              whileTap={isUnlocked ? { scale: 0.94 } : {}}
              onClick={() => isUnlocked && onSelectLevel(lvl)}
              disabled={!isUnlocked}
              className={`
                relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1
                border-2 transition-colors font-black text-xl
                ${isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 cursor-pointer hover:bg-emerald-500/30'
                  : isUnlocked
                    ? 'bg-white text-black border-white cursor-pointer hover:bg-zinc-100'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed'
                }
              `}
            >
              {isUnlocked ? (
                <>
                  <span>{lvl}</span>
                  {isCompleted && (
                    <Star className="w-3 h-3 fill-emerald-400 text-emerald-400 absolute top-2 right-2" />
                  )}
                </>
              ) : (
                <Lock className="w-5 h-5 text-zinc-700" />
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-zinc-600 text-xs font-mono mt-6">
        Jugá niveles para desbloquear los siguientes
      </p>
    </motion.div>
  );
}
