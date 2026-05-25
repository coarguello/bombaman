import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Sparkles, Trophy } from 'lucide-react';
import { TileType, EnemyType, Position, Bomb, Explosion, Enemy, SkinConfig } from '../types/game';
import { GRID_SIZE, BOMB_TIMER } from '../constants/game';
import { PlayerAvatar } from './PlayerAvatar';
import { STORE_CATALOG } from '../constants/store';

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
  skin: SkinConfig;
  globalCratesDestroyed: number;
  isGameOver: boolean;
  isLevelCleared: boolean;
  score: number;
  level: number;
  spikesActive: boolean;
  onRestartLevel: () => void;
  onGoToMenu: () => void;
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
  skin,
  globalCratesDestroyed,
  isGameOver,
  isLevelCleared,
  score,
  level,
  spikesActive,
  onRestartLevel,
  onGoToMenu,
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
                  tile === TileType.SPIKE ? (spikesActive ? 'bg-zinc-800' : 'bg-zinc-900') :
                  (tile >= TileType.CONVEYOR_LEFT && tile <= TileType.CONVEYOR_DOWN) ? 'bg-zinc-800' :
                  'tile-empty'
                }`}
              >
                {/* Spikes rendering */}
                {tile === TileType.SPIKE && (
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Grid 2x2: cada celda ocupa 50% del tile, el spike se centra dentro */}
                    {[0, 1, 2, 3].map((i) => {
                      const col = i % 2;       // 0 = izquierda, 1 = derecha
                      const row = Math.floor(i / 2); // 0 = arriba, 1 = abajo

                      // Jitter determinístico pequeño (±8% de la mitad del tile)
                      const s1 = Math.sin((x * 17.3 + y * 41.7 + i * 23.9) * 43758.5453);
                      const jitter = (s1 - Math.floor(s1) - 0.5) * 0.16;

                      // Posición central del spike dentro de su cuadrante
                      const cx = (col + 0.5 + jitter) * 50; // porcentaje horizontal
                      const cy = (row + 0.5 + jitter) * 50; // porcentaje vertical

                      // Tamaño del spike: ~35% del tile
                      const sw = tileSize * 0.34;
                      const sh = tileSize * 0.40;

                      // Pequeña rotación aleatoria (±10°)
                      const s2 = Math.sin((x * 5.3 + y * 9.1 + i * 7.7) * 43758.5453);
                      const rot = (s2 - Math.floor(s2) - 0.5) * 20;

                      const activeColor   = '#ff2222';
                      const inactiveColor = '#3f3f46';
                      const activeGlow    = '0 0 6px rgba(255,60,60,0.8), 0 0 12px rgba(255,30,30,0.4)';
                      const inactiveGlow  = '0 1px 3px rgba(0,0,0,0.6)';

                      // IDs de gradiente únicos por tile e índice
                      const gradIdAct = `sg-a-${x}-${y}-${i}`;
                      const gradIdIna = `sg-i-${x}-${y}-${i}`;

                      return (
                        <motion.svg
                          key={i}
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          style={{
                            position: 'absolute',
                            width: sw,
                            height: sh,
                            left: `calc(${cx}% - ${sw / 2}px)`,
                            top: `calc(${cy}% - ${sh / 2}px)`,
                            originX: '50%',
                            originY: '100%',
                            rotate: rot,
                            overflow: 'visible',
                          }}
                          animate={{
                            scaleY: spikesActive ? 1 : 0.12,
                            filter: spikesActive ? `drop-shadow(${activeGlow})` : `drop-shadow(${inactiveGlow})`,
                          }}
                          transition={{ type: 'spring', stiffness: 380, damping: 22, delay: i * 0.04 }}
                        >
                          <defs>
                            {/* Gradiente activo (rojo) */}
                            <linearGradient id={gradIdAct} x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7f0000" />
                              <stop offset="55%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#fca5a5" />
                            </linearGradient>
                            {/* Gradiente inactivo (gris metálico) */}
                            <linearGradient id={gradIdIna} x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#18181b" />
                              <stop offset="55%" stopColor="#52525b" />
                              <stop offset="100%" stopColor="#a1a1aa" />
                            </linearGradient>
                          </defs>
                          {/* Cuerpo del spike - cambia gradiente según estado */}
                          <motion.polygon
                            points="50,2 5,98 95,98"
                            fill={spikesActive ? `url(#${gradIdAct})` : `url(#${gradIdIna})`}
                            stroke={spikesActive ? 'rgba(220,38,38,0.4)' : 'rgba(82,82,91,0.3)'}
                            strokeWidth="1.5"
                            animate={{ opacity: spikesActive ? 1 : 0.55 }}
                            transition={{ duration: 0.3 }}
                          />
                          {/* Brillo especular en la cara izquierda */}
                          <polygon
                            points="50,2 20,55 50,55"
                            fill="rgba(255,255,255,0.14)"
                            style={{ pointerEvents: 'none' }}
                          />
                          {/* Línea de borde afilado en la punta */}
                          <line
                            x1="50" y1="2" x2="50" y2="30"
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="1"
                          />
                        </motion.svg>
                      );
                    })}
                  </div>
                )}

                
                {/* Conveyor rendering */}
                {(tile >= TileType.CONVEYOR_LEFT && tile <= TileType.CONVEYOR_DOWN) && (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-500 opacity-50">
                    <motion.div
                      animate={{
                        x: tile === TileType.CONVEYOR_LEFT ? [-2, 2, -2] : tile === TileType.CONVEYOR_RIGHT ? [2, -2, 2] : 0,
                        y: tile === TileType.CONVEYOR_UP ? [-2, 2, -2] : tile === TileType.CONVEYOR_DOWN ? [2, -2, 2] : 0,
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                    >
                      {tile === TileType.CONVEYOR_LEFT && '←'}
                      {tile === TileType.CONVEYOR_RIGHT && '→'}
                      {tile === TileType.CONVEYOR_UP && '↑'}
                      {tile === TileType.CONVEYOR_DOWN && '↓'}
                    </motion.div>
                  </div>
                )}
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
        {bombs.map(bomb => {
          const bombItem = STORE_CATALOG.find(i => i.id === skin.bomb);
          const fireItem = STORE_CATALOG.find(i => i.id === skin.fire);
          const bombClass = bombItem?.value || 'bg-zinc-900 border-zinc-950';
          const fireClass = fireItem?.value || 'bg-yellow-400';

          return (
            <motion.div
              key={bomb.id}
              initial={bomb.isFlying ? { 
                left: 8 + bomb.startX! * tileSize + (tileSize * 0.1), 
                top: 8 + bomb.startY! * tileSize + (tileSize * 0.1), 
                scale: 0.8 
              } : { 
                left: 8 + bomb.x * tileSize + (tileSize * 0.1), 
                top: 8 + bomb.y * tileSize + (tileSize * 0.1),
                scale: 0 
              }}
              animate={{ 
                left: 8 + bomb.x * tileSize + (tileSize * 0.1), 
                top: 8 + bomb.y * tileSize + (tileSize * 0.1), 
                scale: 1 
              }}
              transition={bomb.isFlying ? { duration: 0.25, ease: "easeOut" } : { duration: 0.15 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className={`absolute flex items-center justify-center ${bomb.isFlying ? 'z-30 shadow-2xl drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]' : 'z-10'}`}
              style={{
                width: tileSize * 0.8,
                height: tileSize * 0.8,
              }}
            >
              {/* Bomb Body */}
              <div className={`relative w-[85%] h-[85%] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.8)] border-[3px] flex justify-center ${bombClass}`}>
                {/* Highlight (Spherical effect) */}
                <div className="absolute top-[10%] left-[20%] w-[25%] h-[15%] bg-white/20 rounded-full rotate-[-30deg]" />
                
                {/* Fuse & Fire Container (Tilted) */}
                <div className="absolute -top-[50%] w-0 h-[50%] flex justify-center rotate-[60deg] origin-bottom">
                  {/* The Fuse */}
                  <div className="absolute w-[4px] h-full bg-[#8B5A2B] rounded-t-sm" />

                  {/* Animated Fire on Fuse */}
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: BOMB_TIMER / 1000, ease: "linear" }}
                    className="absolute z-10 flex items-center justify-center"
                  >
                    {/* Fire Glow/Spark */}
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 0.15, repeat: Infinity }}
                      className={`w-4 h-4 rounded-full blur-[2px] absolute ${fireClass}`}
                    />
                    {/* Fire Core */}
                    <div className="w-2 h-2 bg-white rounded-full relative z-10" />
                    <div className={`w-3 h-3 rounded-full absolute mix-blend-screen ${fireClass} opacity-80`} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Render Explosions */}
      {explosions.map(explosion => {
        const fireItem = STORE_CATALOG.find(i => i.id === skin.fire);
        const fireClass = fireItem?.value || 'bg-yellow-400';
        
        return explosion.tiles.map((tile, idx) => (
          <motion.div
            key={`${explosion.id}-${idx}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute z-10 blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.3)] ${fireClass}`}
            style={{
              left: 8 + tile.x * tileSize + (tileSize * 0.1),
              top: 8 + tile.y * tileSize + (tileSize * 0.1),
              width: tileSize * 0.8,
              height: tileSize * 0.8,
            }}
          />
        ));
      })}

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
          {/* Render avatar at 128px and scale down to fit tile */}
          <div 
            style={{ 
              width: 128, 
              height: 128, 
              transform: `scale(${tileSize / 128})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <PlayerAvatar skin={skin} direction={direction} animate={false} />
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
            <h2 className="text-4xl font-bold text-white mb-1">FIN DE JUEGO</h2>
            <p className="text-zinc-500 text-sm font-mono mb-1">NIVEL {level}</p>
            <p className="text-zinc-400 font-mono mb-8 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              PUNTAJE: {score}
            </p>
            <button 
              onClick={onRestartLevel}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-transform active:scale-95 cursor-pointer mb-3"
            >
              JUGAR DE NUEVO (NIVEL {level})
            </button>
            <button
              onClick={onGoToMenu}
              className="px-6 py-2 text-zinc-400 text-sm hover:text-white transition-colors cursor-pointer"
            >
              Ir al Menú
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
