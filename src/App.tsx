import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TileType, EnemyType, Enemy, Position, Bomb, Explosion } from './types/game';
import { GRID_SIZE, BOMB_TIMER, EXPLOSION_DURATION, EXIT_CONDITION } from './constants/game';
import { StartScreen } from './components/StartScreen';
import { GameHUD } from './components/GameHUD';
import { GameBoard } from './components/GameBoard';

export default function App() {
  const [grid, setGrid] = useState<TileType[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [globalCratesDestroyed, setGlobalCratesDestroyed] = useState(0);
  const [level, setLevel] = useState(1);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [isExitVisible, setIsExitVisible] = useState(false);
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);

  // Refs for logic that shouldn't trigger re-renders or needs stable context
  const gridRef = useRef<TileType[][]>([]);
  const bombsRef = useRef<Bomb[]>([]);
  const playerPosRef = useRef<Position>({ x: 1, y: 1 });
  const isGameOverRef = useRef(false);
  const gameStartedRef = useRef(false);
  const enemiesRef = useRef<Enemy[]>([]);
  const exitDoorPosRef = useRef<Position | null>(null);
  const isExitVisibleRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const globalCratesRef = useRef(0);

  const [tileSize, setTileSize] = useState(24);

  // Responsive tile sizing
  useEffect(() => {
    const updateTileSize = () => {
      const paddingX = 24; 
      const paddingY = 40; 
      const availableWidth = window.innerWidth - paddingX;
      const availableHeight = window.innerHeight - paddingY; 
      const targetSize = Math.floor(Math.min(availableWidth, availableHeight) / GRID_SIZE);
      setTileSize(Math.max(20, Math.min(targetSize, 90))); 
    };

    updateTileSize();
    window.addEventListener('resize', updateTileSize);
    return () => window.removeEventListener('resize', updateTileSize);
  }, []);

  // Sync refs with state for use in event listeners without re-binding
  useEffect(() => {
    playerPosRef.current = playerPos;
    isGameOverRef.current = isGameOver;
    gameStartedRef.current = gameStarted;
    enemiesRef.current = enemies;
    isExitVisibleRef.current = isExitVisible;
  }, [playerPos, isGameOver, gameStarted, enemies, isExitVisible]);

  // Initialize Grid / Level
  const initializeLevel = useCallback(() => {
    // Reset state for new level
    setPlayerPos({ x: 1, y: 1 });
    playerPosRef.current = { x: 1, y: 1 };
    setBombs([]);
    bombsRef.current = [];
    setExplosions([]);
    setIsExitVisible(false);
    isExitVisibleRef.current = false;
    setIsLevelCleared(false);
    setIsGameOver(false);
    isGameOverRef.current = false;

    const newGrid: TileType[][] = [];
    const cratePositions: Position[] = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        // Outer walls
        if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) {
          row.push(TileType.STEEL);
        }
        // Inner steel pillars (classic pattern)
        else if (x % 2 === 0 && y % 2 === 0) {
          row.push(TileType.STEEL);
        }
        // Random crates (except starting area for player)
        else if (
          (x > 2 || y > 2) && // Leave 2x2 area open at top-left
          Math.random() > 0.6
        ) {
          row.push(TileType.CRATE);
          cratePositions.push({ x, y });
        } else {
          row.push(TileType.EMPTY);
        }
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    gridRef.current = newGrid;

    // Pick Exit Door Position if RANDOM mode
    if (EXIT_CONDITION === 'RANDOM' && cratePositions.length > 0) {
      const randomCrate = cratePositions[Math.floor(Math.random() * cratePositions.length)];
      exitDoorPosRef.current = randomCrate;
    } else {
      exitDoorPosRef.current = null;
    }

    // Spawn enemies based on level scaling formula: 3 + (Level - 1) * 2
    const newEnemies: Enemy[] = [];
    const enemyCount = 3 + (level - 1) * 2;
    
    // Determine available types based on level
    const availableTypes: EnemyType[] = [EnemyType.A];
    if (level >= 2) availableTypes.push(EnemyType.B);
    if (level >= 3) {
      availableTypes.push(EnemyType.C);
      availableTypes.push(EnemyType.D);
    }
    if (level >= 4) availableTypes.push(EnemyType.E);

    // Limit types at higher levels to phase out Type A
    const currentTypes = level >= 5 
      ? availableTypes.filter(t => t !== EnemyType.A)
      : availableTypes;

    for (let i = 0; i < enemyCount; i++) {
      let spawned = false;
      const type = currentTypes[i % currentTypes.length];
      
      // Ensure we have an empty spot
      const emptySpots: Position[] = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (newGrid[y][x] === TileType.EMPTY && (x > 5 || y > 5)) {
            emptySpots.push({ x, y });
          }
        }
      }

      if (emptySpots.length === 0) break; // No more room

      while (!spawned && emptySpots.length > 0) {
        const spotIdx = Math.floor(Math.random() * emptySpots.length);
        const { x: ex, y: ey } = emptySpots.splice(spotIdx, 1)[0];
        
        if (!newEnemies.some(e => e.x === ex && e.y === ey)) {
          newEnemies.push({
            id: `enemy-${level}-${i}-${Math.random()}`,
            x: ex,
            y: ey,
            type,
            lastMove: Date.now()
          });
          spawned = true;
        }
      }
    }

    setEnemies(newEnemies);
    enemiesRef.current = newEnemies;
  }, [level]);

  useEffect(() => {
    initializeLevel();
  }, [initializeLevel]);

  const handleExplosion = useCallback((x: number, y: number) => {
    const currentCrates = globalCratesRef.current;
    let explosionRadius = 2;
    if (currentCrates >= 1000) explosionRadius = 15;
    else if (currentCrates >= 250) explosionRadius = 5;
    else if (currentCrates >= 15) explosionRadius = 3;

    const explosionTiles: Position[] = [{ x, y }];
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    const currentGrid = [...gridRef.current.map(row => [...row])];
    let cratesDestroyed = 0;

    directions.forEach(({ dx, dy }) => {
      for (let i = 1; i <= explosionRadius; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;

        if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;

        const tile = currentGrid[ny][nx];
        if (tile === TileType.STEEL) break;

        explosionTiles.push({ x: nx, y: ny });

        if (tile === TileType.CRATE) {
          currentGrid[ny][nx] = TileType.EMPTY;
          cratesDestroyed++;
          break;
        }
      }
    });

    setGrid(currentGrid);
    gridRef.current = currentGrid;
    setScore(prev => prev + cratesDestroyed * 10);
    setGlobalCratesDestroyed(prev => {
      const newVal = prev + cratesDestroyed;
      if (cratesDestroyed > 0) {
        console.log(`Crates Destroyed: +${cratesDestroyed} | Total: ${newVal}`);
      }

      const milestones = [
        { threshold: 5, message: 'QUICK FEET UNLOCKED!' },
        { threshold: 15, message: 'FIRE UP UNLOCKED!' },
        { threshold: 100, message: 'TURBO SPEED UNLOCKED!' },
        { threshold: 250, message: 'DOUBLE FIRE UNLOCKED!' },
        { threshold: 500, message: 'SUPER SPRINTER UNLOCKED!' },
        { threshold: 1000, message: 'NUCLEAR FIRE UNLOCKED!' }
      ];

      milestones.forEach(m => {
        if (prev < m.threshold && newVal >= m.threshold) {
          console.log(`REWARD APPLIED: ${m.message}`);
          setMilestoneMessage(m.message);
          setTimeout(() => setMilestoneMessage(null), 3000);
        }
      });

      globalCratesRef.current = newVal;
      return newVal;
    });

    const explosionId = Math.random().toString(36).substr(2, 9);
    setExplosions(prev => [...prev, { id: explosionId, tiles: explosionTiles, createdAt: Date.now() }]);

    // Check if player hit
    const isHit = explosionTiles.some(t => t.x === playerPosRef.current.x && t.y === playerPosRef.current.y);
    if (isHit) setIsGameOver(true);

    // Check if enemies hit
    setEnemies(prev => {
      const filtered = prev.filter(en => !explosionTiles.some(t => t.x === en.x && t.y === en.y));
      if (filtered.length < prev.length) {
        setScore(curr => curr + (prev.length - filtered.length) * 100);
      }
      return filtered;
    });

    // Reveal door logic
    if (EXIT_CONDITION === 'RANDOM') {
      const hitCrateWithDoor = explosionTiles.some(t => 
        exitDoorPosRef.current && t.x === exitDoorPosRef.current.x && t.y === exitDoorPosRef.current.y
      );
      if (hitCrateWithDoor) {
        setIsExitVisible(true);
      }
    } else if (EXIT_CONDITION === 'LAST_CRATE') {
      // Check if any crates remain
      const stillHasCrates = gridRef.current.some(row => row.some(tile => tile === TileType.CRATE));
      if (!stillHasCrates) {
        // Place door where the last crate was (or use current explosion center)
        exitDoorPosRef.current = { x, y };
        setIsExitVisible(true);
      }
    }

    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== explosionId));
    }, EXPLOSION_DURATION);
  }, []);

  const placeBomb = useCallback(() => {
    const { x, y } = playerPosRef.current;
    
    if (bombsRef.current.some(b => b.x === x && b.y === y)) return;

    const newBomb: Bomb = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      placedAt: Date.now(),
    };

    setBombs(prev => [...prev, newBomb]);
    bombsRef.current = [...bombsRef.current, newBomb];

    setTimeout(() => {
      setBombs(prev => prev.filter(b => b.id !== newBomb.id));
      bombsRef.current = bombsRef.current.filter(b => b.id !== newBomb.id);
      handleExplosion(x, y);
    }, BOMB_TIMER);
  }, [handleExplosion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStartedRef.current || isGameOverRef.current || isLevelCleared) return;

      const now = Date.now();
      const currentCrates = globalCratesRef.current;
      
      let moveCooldown = 120; // Improved base responsiveness
      if (currentCrates >= 500) moveCooldown = 40;
      else if (currentCrates >= 100) moveCooldown = 70;
      else if (currentCrates >= 5) moveCooldown = 100;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (now - lastMoveTimeRef.current < moveCooldown) return;
        lastMoveTimeRef.current = now;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      let nextX = playerPosRef.current.x;
      let nextY = playerPosRef.current.y;
      let newDir: 'up' | 'down' | 'left' | 'right' = 'down';

      switch (e.key) {
        case 'ArrowUp': nextY--; newDir = 'up'; break;
        case 'ArrowDown': nextY++; newDir = 'down'; break;
        case 'ArrowLeft': nextX--; newDir = 'left'; break;
        case 'ArrowRight': nextX++; newDir = 'right'; break;
        case ' ': placeBomb(); return;
        default: return;
      }

      setDirection(newDir);

      const isInside = nextX >= 0 && nextX < GRID_SIZE && nextY >= 0 && nextY < GRID_SIZE;
      if (isInside && gridRef.current[nextY][nextX] === TileType.EMPTY) {
        const hasBomb = bombsRef.current.some(b => b.x === nextX && b.y === nextY);
        if (!hasBomb) {
          setPlayerPos({ x: nextX, y: nextY });

          // Check Win Condition (Touch door + enemies dead + door visible)
          if (isExitVisibleRef.current && 
              exitDoorPosRef.current?.x === nextX && 
              exitDoorPosRef.current?.y === nextY && 
              enemiesRef.current.length === 0) {
            setIsLevelCleared(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placeBomb]);

  // Enemy Movement Logic
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const moveInterval = setInterval(() => {
      const now = Date.now();
      const nextEnemies = [...enemiesRef.current];
      let hasChanged = false;

      nextEnemies.forEach((enemy, index) => {
        let interval = 600; // Default Type A
        if (enemy.type === EnemyType.B) interval = 400;
        else if (enemy.type === EnemyType.C) interval = 800;
        else if (enemy.type === EnemyType.D) interval = 200;
        else if (enemy.type === EnemyType.E) interval = 500;

        if (now - enemy.lastMove < interval) return;

        hasChanged = true;
        const directions = [
          { dx: 0, dy: -1 }, // up
          { dx: 0, dy: 1 },  // down
          { dx: -1, dy: 0 }, // left
          { dx: 1, dy: 0 },  // right
        ];

        let bestMove = directions[Math.floor(Math.random() * 4)];
        const px = playerPosRef.current.x;
        const py = playerPosRef.current.y;

        // Specialized Logic per Type
        if (enemy.type === EnemyType.B || enemy.type === EnemyType.E) {
          // Chaser / Smart basic movement toward player
          const dx = Math.sign(px - enemy.x);
          const dy = Math.sign(py - enemy.y);
          
          const possibleDirs = [];
          if (dx !== 0) possibleDirs.push({ dx, dy: 0 });
          if (dy !== 0) possibleDirs.push({ dx: 0, dy });
          
          if (possibleDirs.length > 0) {
            bestMove = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
          }

          // Smart (Type E) Logic: Avoid bombs
          if (enemy.type === EnemyType.E) {
            const dangerBombs = bombsRef.current.filter(b => 
              (Math.abs(b.x - enemy.x) <= 2 && b.y === enemy.y) || 
              (Math.abs(b.y - enemy.y) <= 2 && b.x === enemy.x)
            );

            if (dangerBombs.length > 0) {
              // Try to move away from closest danger
              const b = dangerBombs[0];
              const escapeDirs = directions.filter(d => {
                const nx = enemy.x + d.dx;
                const ny = enemy.y + d.dy;
                const distToBomb = Math.abs(nx - b.x) + Math.abs(ny - b.y);
                const currentDist = Math.abs(enemy.x - b.x) + Math.abs(enemy.y - b.y);
                return distToBomb > currentDist;
              });
              if (escapeDirs.length > 0) {
                bestMove = escapeDirs[Math.floor(Math.random() * escapeDirs.length)];
              }
            }
          }
        }
        else if (enemy.type === EnemyType.D) {
          // Sprinter: Try to maintain current movement if possible, or pick a random straight line
          // For simplicity, just pick a random direction but it moves very fast (already handled by interval)
          // We can favor moves that keep going in the same direction if we tracked it, but random fast is also effective.
          // Let's implement straight line preference:
          const lastDx = enemy.x - (nextEnemies[index].x || enemy.x); // simplistic check
          // Just random for now, the 200ms interval makes it feel like a sprinter
        }

        const nx = enemy.x + bestMove.dx;
        const ny = enemy.y + bestMove.dy;

        // Collision Check for Enemies
        const isGhost = enemy.type === EnemyType.C;
        const isSteel = gridRef.current[ny]?.[nx] === TileType.STEEL;
        const isCrate = gridRef.current[ny]?.[nx] === TileType.CRATE;
        const isBomb = bombsRef.current.some(b => b.x === nx && b.y === ny);
        const isOtherEnemy = nextEnemies.some((other, i) => i !== index && other.x === nx && other.y === ny);

        const canMove = nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && 
                        !isSteel && 
                        (isGhost ? true : !isCrate) && 
                        !isBomb && !isOtherEnemy;

        if (canMove) {
          nextEnemies[index] = { ...enemy, x: nx, y: ny, lastMove: now };
          // Check collision with player
          if (nx === playerPosRef.current.x && ny === playerPosRef.current.y) {
            setIsGameOver(true);
          }
        } else {
          // If can't move, just update timestamp so it tries again next interval
          nextEnemies[index] = { ...enemy, lastMove: now };
        }
      });

      if (hasChanged) {
        setEnemies(nextEnemies);
      }
    }, 100);

    return () => clearInterval(moveInterval);
  }, [gameStarted, isGameOver]);

  const startNextLevel = () => {
    setLevel(prev => prev + 1);
  };

  const resetGame = () => {
    window.location.reload();
  };

  if (!grid.length) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <StartScreen onStart={() => setGameStarted(true)} />
        ) : (
          <motion.div
            key="game-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center w-full min-h-screen justify-center overflow-hidden"
          >
            <GameHUD 
              level={level} 
              score={score} 
              globalCratesDestroyed={globalCratesDestroyed} 
              milestoneMessage={milestoneMessage} 
            />

            <GameBoard 
              grid={grid}
              tileSize={tileSize}
              isExitVisible={isExitVisible}
              exitDoorPos={exitDoorPosRef.current}
              enemies={enemies}
              bombs={bombs}
              explosions={explosions}
              playerPos={playerPos}
              direction={direction}
              globalCratesDestroyed={globalCratesDestroyed}
              isGameOver={isGameOver}
              isLevelCleared={isLevelCleared}
              score={score}
              onResetGame={resetGame}
              onStartNextLevel={startNextLevel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
