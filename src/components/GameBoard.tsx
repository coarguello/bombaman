import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Sparkles, Trophy } from 'lucide-react';
import { TileType, EnemyType, Position, Bomb, Explosion, Enemy } from '../types/game';
import { GRID_SIZE } from '../constants/game';

interface GameBoardProps {
  grid: TileType[][];
  tileSize: number;
  isExitVisible: boolean;
  exitDoorPos: Position | null;
  enemies: Enemy[];
  bombs: Bomb[];
  explosions: Explosion[];
  playerPos: Position;
  direction: 'up' | 'down' | 'left' | 'right';
  globalCratesDestroyed: number;
  isGameOver: boolean;
  isLevelCleared: boolean;
  score: number;
  onResetGame: () => void;
  onStartNextLevel: () => void;
}

export function GameBoard({
  grid,
  tileSize,
  isExitVisible,
  exitDoorPos,
  enemies,
  bombs,
  explosions,
  playerPos,
  direction,
  globalCratesDestroyed,
  isGameOver,
  isLevelCleared,
  score,
  onResetGame,
  onStartNextLevel
}: GameBoardProps) {
  return (
    <div 
      className="relative bg-zinc-900 p-2 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-zinc-800 box-content"
      style={{ width: GRID_SIZE * tileSize, height: GRID_SIZE * tileSize }}
    >
      {/* Render Grid */}
      <div 
        className="grid gap-0"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${tileSize}px)`
        }}
      >
        {grid.map((row, y) => 
          row.map((tile, x) => {
            const isDoor = isExitVisible && exitDoorPos?.x === x && exitDoorPos?.y === y;
            return (
              <div 
                key={`${x}-${y}`}
                style={{ width: tileSize, height: tileSize }}
                className={`transition-colors duration-300 relative ${
                  tile === TileType.STEEL ? 'tile-steel' : 
                  tile === TileType.CRATE ? 'tile-crate' : 
                  'tile-empty'
                }`}
              >
                {isDoor && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-20 flex items-center justify-center p-0.5"
                  >
                    {/* Outer Portal Frame (Metallic/Heavy) */}
                    <div className={`relative w-full h-full rounded-md border-2 shadow-2xl transition-all duration-700 flex items-center justify-center overflow-hidden ${
                      enemies.length === 0 
                        ? 'bg-zinc-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                        : 'bg-zinc-900 border-zinc-700/50'
                    }`}>
                      
                      {/* Inner Energy Void */}
                      <div className={`absolute inset-1 rounded-sm overflow-hidden ${
                        enemies.length === 0 ? 'bg-emerald-950' : 'bg-black/40'
                      }`}>
                        {enemies.length === 0 ? (
                          <>
                            {/* Swirling energy layers */}
                            <motion.div 
                              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,rgba(52,211,153,0.3),transparent)]"
                            />
                            <motion.div 
                              animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
                              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,rgba(34,211,238,0.2),transparent)]"
                            />
                            
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none" />
                          </>
                        ) : (
                          /* Locked pattern */
                          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,black_5px,black_10px)]" />
                        )}
                      </div>

                      {/* Central Core / Keyhole */}
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <motion.div 
                          animate={enemies.length === 0 ? { 
                            boxShadow: ["0 0 10px #10b981", "0 0 20px #34d399", "0 0 10px #10b981"],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${
                            enemies.length === 0 
                              ? 'bg-emerald-400 border-white' 
                              : 'bg-zinc-800 border-zinc-600'
                          }`}
                        >
                          <LogOut className={`w-3.5 h-3.5 ${enemies.length === 0 ? 'text-emerald-950' : 'text-zinc-500'}`} />
                        </motion.div>
                        
                        {/* Small status lights */}
                        <div className="flex gap-1">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={`w-1 h-1 rounded-full ${
                              enemies.length === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-900'
                            }`} />
                          ))}
                        </div>
                      </div>

                      {/* Corner Reinforcements (Brackets) */}
                      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors ${enemies.length === 0 ? 'border-emerald-300' : 'border-zinc-500'}`} />
                      <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-colors ${enemies.length === 0 ? 'border-emerald-300' : 'border-zinc-500'}`} />
                      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 transition-colors ${enemies.length === 0 ? 'border-emerald-300' : 'border-zinc-500'}`} />
                      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors ${enemies.length === 0 ? 'border-emerald-300' : 'border-zinc-500'}`} />
                    </div>

                    {/* Floor glow effect when unlocked */}
                    {enemies.length === 0 && (
                      <motion.div 
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full -z-10"
                      />
                    )}
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Render Bombs */}
      <AnimatePresence>
        {bombs.map(bomb => (
          <motion.div
            key={bomb.id}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1.1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute bomb"
            style={{
              left: 8 + bomb.x * tileSize + (tileSize * 0.1),
              top: 8 + bomb.y * tileSize + (tileSize * 0.1),
              width: tileSize * 0.8,
              height: tileSize * 0.8,
              margin: tileSize * 0.1,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Render Explosions */}
      {explosions.map(explosion => 
        explosion.tiles.map((tile, idx) => (
          <motion.div
            key={`${explosion.id}-${idx}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute explosion"
            style={{
              left: 8 + tile.x * tileSize + (tileSize * 0.1),
              top: 8 + tile.y * tileSize + (tileSize * 0.1),
              width: tileSize * 0.8,
              height: tileSize * 0.8,
            }}
          />
        ))
      )}

      {/* Render Player - SQUARE BLOCK STYLE */}
      {!isGameOver && (
        <motion.div
          className="absolute z-20 flex items-center justify-center"
          animate={{ 
            left: playerPos.x * tileSize + 8,
            top: playerPos.y * tileSize + 8,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          style={{ width: tileSize, height: tileSize }}
        >
          {/* Character Body - Strict Square with rounded-lg */}
          <div className={`relative w-[85%] h-[85%] rounded-lg shadow-lg border-b-4 flex items-center justify-center overflow-hidden transition-colors duration-500 ${
            globalCratesDestroyed >= 500 ? 'bg-emerald-400 border-emerald-600' :
            globalCratesDestroyed >= 100 ? 'bg-cyan-100 border-cyan-300' :
            globalCratesDestroyed >= 5 ? 'bg-zinc-100 border-zinc-400' :
            'bg-white border-zinc-300'
          }`}>
            {/* Trail Effect (Static glow for simplicity) */}
            {globalCratesDestroyed >= 5 && (
              <div className={`absolute inset-0 opacity-20 ${
                globalCratesDestroyed >= 500 ? 'bg-emerald-300 animate-pulse' :
                globalCratesDestroyed >= 100 ? 'bg-cyan-200' :
                'bg-zinc-300'
              }`} />
            )}
            
            {/* Face/Visor Panel - Always Looking Forward, shift on sides */}
            <div className={`absolute w-full h-full transition-all duration-200 flex justify-center ${
              direction === 'left' ? '-translate-x-2' : 
              direction === 'right' ? 'translate-x-2' : 
              ''
            }`}>
              
              {/* The Visor (Las Gafas) - Centered horizontally, slightly higher vertically */}
              <div className="mt-[15%] w-[88%] h-[45%] bg-sky-500 rounded-md border border-sky-600 flex items-center justify-center gap-2 shadow-inner">
                {/* Inner circles - Same color tone */}
                <div className="w-[32%] h-[65%] bg-sky-400/40 rounded-full border border-sky-400/10" />
                <div className="w-[32%] h-[65%] bg-sky-400/40 rounded-full border border-sky-400/10" />
              </div>
            </div>

            {/* Feet/Bottom Detail */}
            <div className="absolute bottom-0 w-full h-[12%] bg-zinc-200 rounded-b-lg" />
          </div>
        </motion.div>
      )}

      {/* Render Enemies */}
      {enemies.map(enemy => (
        <motion.div
          key={enemy.id}
          className="absolute z-10 flex items-center justify-center"
          animate={{ 
            left: enemy.x * tileSize + 8,
            top: enemy.y * tileSize + 8,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{ width: tileSize, height: tileSize }}
        >
          <div className={`relative w-[80%] h-[80%] rounded-lg shadow-md border-b-2 flex overflow-hidden ${
            enemy.type === EnemyType.A ? 'bg-orange-500 border-orange-700' :
            enemy.type === EnemyType.B ? 'bg-blue-600 border-blue-800' :
            enemy.type === EnemyType.C ? 'bg-zinc-400 border-zinc-600 opacity-80' : 
            enemy.type === EnemyType.D ? 'bg-red-600 border-red-800 shadow-[0_0_10px_rgba(220,38,38,0.5)]' :
            'bg-purple-600 border-purple-800'
          }`}>
            {/* Face / Eyes for Enemies */}
            <div className="absolute top-[20%] left-[15%] w-[70%] h-[40%] flex gap-1 justify-center items-center">
              <div className={`w-1.5 h-3 bg-black/80 rounded-full ${enemy.type === EnemyType.D ? 'animate-pulse bg-white' : ''}`} />
              <div className={`w-1.5 h-3 bg-black/80 rounded-full ${enemy.type === EnemyType.D ? 'animate-pulse bg-white' : ''}`} />
            </div>
            
            {/* Specular highlights to differentiate types further */}
            {enemy.type === EnemyType.C && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            )}
            {enemy.type === EnemyType.E && (
              <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full blur-[1px] animate-ping" />
            )}
          </div>
        </motion.div>
      ))}

      {/* Game Over / Level Cleared Overlays */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm"
            id="game-over-screen"
          >
            <Sparkles className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-2">FIN DE JUEGO</h2>
            <p className="text-zinc-400 font-mono mb-8 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              PUNTAJE FINAL: {score}
            </p>
            <button 
              onClick={onResetGame}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-transform active:scale-95 cursor-pointer"
            >
              JUGAR DE NUEVO
            </button>
          </motion.div>
        )}

        {isLevelCleared && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-emerald-950/90 flex flex-col items-center justify-center rounded-lg backdrop-blur-md"
            id="level-cleared-screen"
          >
            <Trophy className="w-20 h-20 text-yellow-400 mb-6 animate-bounce" />
            <h2 className="text-5xl font-black text-white mb-2 tracking-tighter italic">NIVEL COMPLETADO</h2>
            <p className="text-emerald-200 font-mono mb-12 flex items-center gap-2 uppercase tracking-widest text-sm">
               ¡EL PORTAL ESTÁ ABIERTO!
            </p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/10 text-center mb-4">
                <span className="text-zinc-400 text-xs uppercase block mb-1">SCORE TOTAL</span>
                <span className="text-3xl font-black text-white">{score}</span>
              </div>
              <button 
                onClick={onStartNextLevel}
                className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 cursor-pointer shadow-xl"
              >
                SIGUIENTE NIVEL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
