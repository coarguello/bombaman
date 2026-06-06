import { useState, useEffect, useCallback, useRef } from 'react';
import { PowerUp, PowerUpType } from './types/game';
import { AnimatePresence, motion } from 'motion/react';
import { TileType, EnemyType, Enemy, Position, Bomb, Explosion, SkinConfig } from './types/game';
import { GRID_SIZE, BOMB_TIMER, EXPLOSION_DURATION, EXIT_CONDITION } from './constants/game';
import { DEFAULT_SKIN_CONFIG } from './constants/store';
import { StartScreen } from './components/StartScreen';
import { GameHUD } from './components/GameHUD';
import { GameBoard } from './components/GameBoard';
import { StoreScreen } from './components/StoreScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { initAudio, startBattleMusic, startStoreMusic, stopAllMusic, playMenuSelectSFX, playTick, playExplosionSFX, playCrateDestroySFX, playCoinSFX, playVictoryJingle, playDefeatJingle } from './utils/audio';
import { AuthModal } from './components/AuthModal';
import { BugReportModal } from './components/BugReportModal';
import { Bug } from 'lucide-react';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GameTheme, getThemeForLevel } from './types/theme';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'reset' | null>(null);
  const [grid, setGrid] = useState<TileType[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [globalCratesDestroyed, setGlobalCratesDestroyed] = useState(0);
  const [level, setLevel] = useState(7);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [isExitVisible, setIsExitVisible] = useState(false);
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [spikesActive, setSpikesActive] = useState(false);
  const [tileSize, setTileSize] = useState(40);
  const [destroyedCrates, setDestroyedCrates] = useState<{ id: string; x: number; y: number }[]>([]);

  // Max level the player has unlocked (persisted) — all 25 levels unlocked by default
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(
    () => Math.max(25, Number(localStorage.getItem('bombaman_max_level') ?? 25) || 25)
  );
  useEffect(() => { localStorage.setItem('bombaman_max_level', String(maxUnlockedLevel)); }, [maxUnlockedLevel]);

  // Whether we're showing the level selection screen
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  // Bug Report State
  const [showBugReport, setShowBugReport] = useState(false);

  // Store & Customization State — persisted in localStorage
  const [showStore, setShowStore] = useState(false);
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem('bombaman_coins') ?? 0));
  const [inventory, setInventory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('bombaman_inventory') ?? 'null') || ['body_default', 'glasses_sky', 'mouth_none', 'bomb_classic', 'fire_yellow']; }
    catch { return ['body_default', 'glasses_sky', 'mouth_none', 'bomb_classic', 'fire_yellow']; }
  });
  const [equippedSkin, setEquippedSkin] = useState<SkinConfig>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bombaman_skin') ?? 'null');
      return saved ? { ...DEFAULT_SKIN_CONFIG, ...saved } : DEFAULT_SKIN_CONFIG;
    }
    catch { return DEFAULT_SKIN_CONFIG; }
  });

  // Persist coins, inventory and skin to localStorage whenever they change
  useEffect(() => { localStorage.setItem('bombaman_coins', String(coins)); }, [coins]);
  useEffect(() => { localStorage.setItem('bombaman_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('bombaman_skin', JSON.stringify(equippedSkin)); }, [equippedSkin]);

  // Accumulated score (never resets between games, only when cashed)
  const [totalScore, setTotalScore] = useState<number>(() => Number(localStorage.getItem('bombaman_total_score') ?? 0));
  useEffect(() => { localStorage.setItem('bombaman_total_score', String(totalScore)); }, [totalScore]);

  // Handle Auth State & Sync Down
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setPlayerName(currentUser.displayName || null);
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.name !== undefined) setPlayerName(data.name);
            if (data.coins !== undefined) setCoins(data.coins);
            if (data.maxUnlockedLevel !== undefined) setMaxUnlockedLevel(data.maxUnlockedLevel);
            if (data.totalScore !== undefined) setTotalScore(data.totalScore);
            if (data.inventory !== undefined) setInventory(data.inventory);
            if (data.equippedSkin !== undefined) setEquippedSkin(data.equippedSkin);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Up to Firestore
  useEffect(() => {
    if (user) {
      setDoc(doc(db, 'users', user.uid), {
        coins,
        maxUnlockedLevel,
        totalScore,
        inventory,
        equippedSkin
      }, { merge: true }).catch(err => console.error("Error syncing to firestore:", err));
    }
  }, [coins, maxUnlockedLevel, totalScore, inventory, equippedSkin, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle Background Music based on state
  useEffect(() => {
    if (showStore) {
      startStoreMusic();
    } else if (gameStarted && !isGameOver && !isLevelCleared) {
      startBattleMusic();
    } else {
      stopAllMusic();
    }
  }, [showStore, gameStarted, isGameOver, isLevelCleared]);

  useEffect(() => {
    if (isGameOver && gameStarted) {
      playDefeatJingle();
    }
  }, [isGameOver, gameStarted]);

  useEffect(() => {
    if (isLevelCleared && gameStarted) {
      playVictoryJingle();
    }
  }, [isLevelCleared, gameStarted]);

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
  const directionRef = useRef<'up' | 'down' | 'left' | 'right'>('down');
  const powerUpsRef = useRef<PowerUp[]>([]);

  // Power‑up state
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [maxBombs, setMaxBombs] = useState(1); // permite múltiples bombas
  const [bombRadius, setBombRadius] = useState(2); // radio de explosión
  const [hasGlove, setHasGlove] = useState(false);
  const [hasSkate, setHasSkate] = useState(false);
  const triggeredPowerUps = useRef<Set<number>>(new Set()); // umbrales ya disparados (30 y 40)

  // Helper para generar un power‑up en una casilla
  const spawnPowerUp = (x: number, y: number, forcedType?: PowerUpType) => {
    const type = forcedType ?? [PowerUpType.FIRE, PowerUpType.BOMB, PowerUpType.SKATE, PowerUpType.GLOVE][
      Math.floor(Math.random() * 4)
    ];
    const newPower: PowerUp = { id: Math.random().toString(36).substr(2, 9), x, y, type };
    setPowerUps(prev => [...prev, newPower]);
  };

  // Aplicar el efecto del power‑up
  const applyPowerUp = (pu: PowerUp) => {
    switch (pu.type) {
      case PowerUpType.FIRE:
        setBombRadius(r => r + 1);
        break;
      case PowerUpType.BOMB:
        setMaxBombs(m => m + 1);
        break;
      case PowerUpType.SKATE:
        setHasSkate(true);
        break;
      case PowerUpType.GLOVE:
        setHasGlove(true);
        break;
    }
    // Eliminar el power‑up del tablero
    setPowerUps(prev => prev.filter(p => p.id !== pu.id));
  };

  // Extend explosion handling to possibly spawn a power‑up when a crate is destroyed
  // (Insert inside the crate‑destroy block in handleExplosion)
  // After line 310 where a crate is destroyed, add:
  //   spawnPowerUp(nx, ny);

  // Extend movement handling to pick up power‑ups and push bombs when glove is active
  // (Insert after calculating nextX/nextY and before setPlayerPos)
  //   // Pick up power‑up
  //   const puIndex = powerUps.findIndex(p => p.x === nextX && p.y === nextY);
  //   if (puIndex !== -1) {
  //     applyPowerUp(powerUps[puIndex]);
  //   }
  //   // Push bomb if glove active
  //   if (hasGlove) {
  //     const bomb = bombsRef.current.find(b => b.x === nextX && b.y === nextY);
  //     if (bomb) {
  //       const pushX = nextX + (nextX - playerPosRef.current.x);
  //       const pushY = nextY + (nextY - playerPosRef.current.y);
  //       const canPush =
  //         pushX >= 0 && pushX < GRID_SIZE && pushY >= 0 && pushY < GRID_SIZE &&
  //         gridRef.current[pushY][pushX] === TileType.EMPTY &&
  //         !bombsRef.current.some(b => b.x === pushX && b.y === pushY);
  //       if (canPush) {
  //         bomb.x = pushX;
  //         bomb.y = pushY;
  //         setBombs([...bombsRef.current]);
  //       }
  //     }
  //   }

  // Adjust move cooldown when skateboard is active
  // (Replace moveCooldown calculation with a factor)
  //   let baseCooldown = 120;
  //   if (hasGlove) baseCooldown *= 0.9; // slight benefit for having glove
  //   if (hasSkate) baseCooldown = Math.floor(baseCooldown * 0.7);
  //   // then use baseCooldown instead of moveCooldown

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
    directionRef.current = direction;
    powerUpsRef.current = powerUps;
  }, [playerPos, isGameOver, gameStarted, enemies, isExitVisible, direction, powerUps]);

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
        } else if ((x > 2 || y > 2)) {
          row.push(TileType.EMPTY);
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
    playExplosionSFX();
    const currentCrates = globalCratesRef.current;
    let explosionRadius = bombRadius;
    if (currentCrates >= 1000) explosionRadius = Math.max(explosionRadius, 15);
    else if (currentCrates >= 250) explosionRadius = Math.max(explosionRadius, 5);
    else if (currentCrates >= 15) explosionRadius = Math.max(explosionRadius, 3);

    const explosionTiles: Position[] = [{ x, y }];
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    const currentGrid = [...gridRef.current.map(row => [...row])];
    let cratesDestroyed = 0;

    let __lastDestroyed = null;
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
          __lastDestroyed = { x: nx, y: ny };

          const crateId = Math.random().toString(36).substr(2, 9);
          setDestroyedCrates(prev => [...prev, { id: crateId, x: nx, y: ny }]);
          setTimeout(() => {
            setDestroyedCrates(prev => prev.filter(c => c.id !== crateId));
          }, 1000);

          break;
        }
      }
    });

    setGrid(currentGrid);
    gridRef.current = currentGrid;
    setScore(prev => prev + cratesDestroyed * 100);
    setTotalScore(prev => prev + cratesDestroyed * 100);
    setGlobalCratesDestroyed(prev => {
      const newVal = prev + cratesDestroyed;
      if (cratesDestroyed > 0) {
        console.log(`Crates Destroyed: +${cratesDestroyed} | Total: ${newVal}`);
        playCrateDestroySFX();
        playCoinSFX();
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
      // Power‑up spawning según contadores de cajas
      if (__lastDestroyed) {
        const total = newVal;
        // Fire cada 10 cajas
        if (total % 10 === 0) {
          spawnPowerUp(__lastDestroyed.x, __lastDestroyed.y, PowerUpType.FIRE);
        }
        // Bomb cada 20 cajas
        if (total % 20 === 0) {
          spawnPowerUp(__lastDestroyed.x, __lastDestroyed.y, PowerUpType.BOMB);
        }
        // Skate una única vez al cruzar 30
        if (total >= 30 && !triggeredPowerUps.current.has(30)) {
          triggeredPowerUps.current.add(30);
          spawnPowerUp(__lastDestroyed.x, __lastDestroyed.y, PowerUpType.SKATE);
        }
        // Glove una única vez al cruzar 40
        if (total >= 40 && !triggeredPowerUps.current.has(40)) {
          triggeredPowerUps.current.add(40);
          spawnPowerUp(__lastDestroyed.x, __lastDestroyed.y, PowerUpType.GLOVE);
        }
      }
      return newVal;
    });

    const explosionId = Math.random().toString(36).substr(2, 9);
    setExplosions(prev => [...prev, { id: explosionId, tiles: explosionTiles, createdAt: Date.now() }]);

    // Check if player hit
    const isHit = explosionTiles.some(t => t.x === playerPosRef.current.x && t.y === playerPosRef.current.y);
    if (isHit) setIsGameOver(true);

    // Destroy power-ups hit by explosion
    setPowerUps(prev => prev.filter(pu => !explosionTiles.some(t => t.x === pu.x && t.y === pu.y)));

    // Check if enemies hit
    setEnemies(prev => {
      const filtered = prev.filter(en => !explosionTiles.some(t => t.x === en.x && t.y === en.y));
      if (filtered.length < prev.length) {
        setScore(curr => curr + (prev.length - filtered.length) * 500);
          setTotalScore(curr => curr + (prev.length - filtered.length) * 500);
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
    // Permitir colocar múltiplas bombas según el power‑up
    if (bombsRef.current.length >= maxBombs) return;

    let dx = 0, dy = 0;
    switch (directionRef.current) {
      case 'up': dy = -1; break;
      case 'down': dy = 1; break;
      case 'left': dx = -1; break;
      case 'right': dx = 1; break;
    }

    let targetX = playerPosRef.current.x + dx;
    let targetY = playerPosRef.current.y + dy;

    // Validation
    const isTargetBlocked = (x: number, y: number) => {
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return true;
      const t = gridRef.current[y][x];
      if (t === TileType.STEEL || t === TileType.CRATE) return true;
      if (bombsRef.current.some(b => b.x === x && b.y === y)) return true;
      return false;
    };

    if (isTargetBlocked(targetX, targetY)) {
      targetX = playerPosRef.current.x;
      targetY = playerPosRef.current.y;
    }
    
    if (bombsRef.current.some(b => b.x === targetX && b.y === targetY)) return;

    let finalX = targetX;
    let finalY = targetY;
    let flightDuration = 0;
    let isFlying = false;
    let hitCrate = false;
    let flightDist = 0;

    const tile = gridRef.current[targetY]?.[targetX];
    if (tile === TileType.CONVEYOR_LEFT || tile === TileType.CONVEYOR_RIGHT || tile === TileType.CONVEYOR_UP || tile === TileType.CONVEYOR_DOWN) {
      isFlying = true;
      let fdx = 0, fdy = 0;
      if (tile === TileType.CONVEYOR_LEFT) fdx = -1;
      else if (tile === TileType.CONVEYOR_RIGHT) fdx = 1;
      else if (tile === TileType.CONVEYOR_UP) fdy = -1;
      else if (tile === TileType.CONVEYOR_DOWN) fdy = 1;

      let currX = targetX;
      let currY = targetY;
      
      while (true) {
        const nx = currX + fdx;
        const ny = currY + fdy;
        if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
        const nTile = gridRef.current[ny][nx];
        if (nTile === TileType.CRATE) {
          hitCrate = true;
          finalX = nx;
          finalY = ny;
          flightDist++;
          break;
        }
        if (nTile === TileType.STEEL || bombsRef.current.some(b => b.x === nx && b.y === ny && !b.isFlying)) {
          break;
        }
        currX = nx;
        currY = ny;
        flightDist++;
      }
      if (!hitCrate) {
        finalX = currX;
        finalY = currY;
      }
      flightDuration = flightDist * 80;
    }

    const newBomb: Bomb = {
      id: Math.random().toString(36).substr(2, 9),
      x: finalX,
      y: finalY,
      startX: isFlying ? targetX : undefined,
      startY: isFlying ? targetY : undefined,
      isFlying: isFlying,
      placedAt: Date.now(),
    };

    setBombs(prev => [...prev, newBomb]);
    bombsRef.current = [...bombsRef.current, newBomb];
    
    playTick();

    const detonationTime = (isFlying && hitCrate) ? flightDuration : Math.min(BOMB_TIMER, flightDuration > 0 && BOMB_TIMER < flightDuration ? BOMB_TIMER : BOMB_TIMER);

    if (isFlying && !hitCrate && flightDuration < BOMB_TIMER) {
      setTimeout(() => {
        setBombs(prev => prev.map(b => b.id === newBomb.id ? { ...b, isFlying: false } : b));
        bombsRef.current = bombsRef.current.map(b => b.id === newBomb.id ? { ...b, isFlying: false } : b);
      }, flightDuration);
    }

    setTimeout(() => {
      setBombs(prev => prev.filter(b => b.id !== newBomb.id));
      bombsRef.current = bombsRef.current.filter(b => b.id !== newBomb.id);
      
      // Calculate mid-air explosion coordinate if BOMB_TIMER ran out mid-flight
      let expX = finalX;
      let expY = finalY;
      if (isFlying && BOMB_TIMER < flightDuration) {
        const ratio = BOMB_TIMER / flightDuration;
        expX = Math.round(targetX + (finalX - targetX) * ratio);
        expY = Math.round(targetY + (finalY - targetY) * ratio);
      }
      
      handleExplosion(expX, expY);
    }, detonationTime);
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
      
      if (hasGlove) moveCooldown = Math.floor(moveCooldown * 0.9);
      if (hasSkate) moveCooldown = Math.floor(moveCooldown * 0.7);

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
      // Recoger power‑up si hay uno en la casilla destino
      const puIdx = powerUpsRef.current.findIndex(p => p.x === nextX && p.y === nextY);
      if (puIdx !== -1) {
        applyPowerUp(powerUpsRef.current[puIdx]);
      }
      // Empujar bomba si glove activo y hay bomba en la casilla destino
      if (hasGlove) {
        const bomb = bombsRef.current.find(b => b.x === nextX && b.y === nextY);
        if (bomb) {
          const pushX = nextX + (nextX - playerPosRef.current.x);
          const pushY = nextY + (nextY - playerPosRef.current.y);
          const canPush =
            pushX >= 0 && pushX < GRID_SIZE && pushY >= 0 && pushY < GRID_SIZE &&
            gridRef.current[pushY][pushX] === TileType.EMPTY &&
            !bombsRef.current.some(b => b.x === pushX && b.y === pushY);
          if (canPush) {
            bomb.x = pushX;
            bomb.y = pushY;
            setBombs([...bombsRef.current]);
          }
        }
      }

      setDirection(newDir);

      const isInside = nextX >= 0 && nextX < GRID_SIZE && nextY >= 0 && nextY < GRID_SIZE;
      if (isInside) {
        const targetTile = gridRef.current[nextY][nextX];
        const isSteelOrCrate = targetTile === TileType.STEEL || targetTile === TileType.CRATE;
        
        // Bloquear entrada por la "salida" de la cinta
        const isWrongConveyorEntry = 
          (targetTile === TileType.CONVEYOR_LEFT && newDir === 'right') ||
          (targetTile === TileType.CONVEYOR_RIGHT && newDir === 'left') ||
          (targetTile === TileType.CONVEYOR_UP && newDir === 'down') ||
          (targetTile === TileType.CONVEYOR_DOWN && newDir === 'up');

        if (!isSteelOrCrate && !isWrongConveyorEntry) {
          const hasBomb = bombsRef.current.some(b => b.x === nextX && b.y === nextY);
          if (!hasBomb) {
            setPlayerPos({ x: nextX, y: nextY });

            if (spikesActive && targetTile === TileType.SPIKE) {
              setIsGameOver(true);
            }

            // Check Win Condition (Touch door + enemies dead + door visible)
            if (isExitVisibleRef.current && 
                exitDoorPosRef.current?.x === nextX && 
                exitDoorPosRef.current?.y === nextY && 
                enemiesRef.current.length === 0) {
              setIsLevelCleared(true);
            }
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
          // Sprinter: Move fast in straight lines until blocked, then pick new direction.
          const dx = enemy.x - (nextEnemies[index].x || enemy.x);
          const dy = enemy.y - (nextEnemies[index].y || enemy.y);
          
          let preferredMoves = directions.filter(d => d.dx === -dx && d.dy === -dy);
          if (preferredMoves.length === 0 || (dx === 0 && dy === 0)) {
            preferredMoves = directions;
          }
          
          // Try preferred move first, if it fails, it will hit the wall and next interval will pick random
          bestMove = preferredMoves[Math.floor(Math.random() * preferredMoves.length)];
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
        enemiesRef.current = nextEnemies;
      }
    }, 150);

    return () => clearInterval(moveInterval);
  }, [gameStarted, isGameOver]);

  // Trap Logic: Spikes
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    let timeout: number;
    const cycleSpikes = (isActive: boolean) => {
      setSpikesActive(isActive);
      
      if (isActive) {
        // Kill player if on spike
        if (gridRef.current[playerPosRef.current.y]?.[playerPosRef.current.x] === TileType.SPIKE) {
          setIsGameOver(true);
        }
        // Kill enemies on spike
        setEnemies(prev => prev.filter(e => gridRef.current[e.y]?.[e.x] !== TileType.SPIKE));
      }

      timeout = window.setTimeout(() => cycleSpikes(!isActive), isActive ? 2000 : 1000);
    };

    timeout = window.setTimeout(() => cycleSpikes(true), 1000); // Start off for 1s, then on
    return () => clearTimeout(timeout);
  }, [gameStarted, isGameOver]);

  // Trap Logic: Conveyor Belts
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const pushDist = level >= 7 ? 3 : level >= 5 ? 2 : 1;

    const conveyorInterval = setInterval(() => {
      // Helper function to push an entity
      const pushEntity = (x: number, y: number): { x: number, y: number } | null => {
        const tile = gridRef.current[y]?.[x];
        let dx = 0, dy = 0;
        if (tile === TileType.CONVEYOR_LEFT) dx = -1;
        else if (tile === TileType.CONVEYOR_RIGHT) dx = 1;
        else if (tile === TileType.CONVEYOR_UP) dy = -1;
        else if (tile === TileType.CONVEYOR_DOWN) dy = 1;
        else return null; // Not on a conveyor

        let currX = x;
        let currY = y;
        
        for (let step = 0; step < pushDist; step++) {
          const nx = currX + dx;
          const ny = currY + dy;
          // Stop if out of bounds
          if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
          // Stop if obstacle
          const nTile = gridRef.current[ny][nx];
          if (nTile === TileType.STEEL || nTile === TileType.CRATE) break;
          // Stop if bomb (only for player/enemy, not bomb pushing bomb for simplicity)
          if (bombsRef.current.some(b => b.x === nx && b.y === ny && !b.isFlying)) break;

          currX = nx;
          currY = ny;
          
          // Check if the new tile is also a conveyor pointing elsewhere? 
          // For simplicity, we just keep pushing in the original direction for this tick, 
          // or stop if it enters another conveyor. Let's just push straight.
        }

        if (currX !== x || currY !== y) return { x: currX, y: currY };
        return null;
      };

      // Push Player
      const newPlayerPos = pushEntity(playerPosRef.current.x, playerPosRef.current.y);
      if (newPlayerPos) {
        setPlayerPos(newPlayerPos);
        // Check spike immediately after being pushed
        if (spikesActive && gridRef.current[newPlayerPos.y]?.[newPlayerPos.x] === TileType.SPIKE) {
          setIsGameOver(true);
        }
        // Recoger power‑up
        const puIdx = powerUpsRef.current.findIndex(p => p.x === newPlayerPos.x && p.y === newPlayerPos.y);
        if (puIdx !== -1) {
          applyPowerUp(powerUpsRef.current[puIdx]);
        }
      }

      // Push Enemies
      setEnemies(prev => prev.map(e => {
        const newEPos = pushEntity(e.x, e.y);
        if (newEPos) return { ...e, x: newEPos.x, y: newEPos.y };
        return e;
      }).filter(e => !(spikesActive && gridRef.current[e.y]?.[e.x] === TileType.SPIKE)));

      // Push static bombs (not flying)
      setBombs(prev => {
        const updated = [...prev];
        let changed = false;
        for (let i = 0; i < updated.length; i++) {
          if (updated[i].isFlying) continue;
          const newBPos = pushEntity(updated[i].x, updated[i].y);
          if (newBPos) {
            updated[i] = { ...updated[i], x: newBPos.x, y: newBPos.y };
            changed = true;
          }
        }
        if (changed) bombsRef.current = updated;
        return updated;
      });

    }, 300);

    return () => clearInterval(conveyorInterval);
  }, [gameStarted, isGameOver, level, spikesActive]);

  const startNextLevel = () => {
    if (level >= 25) {
      goToMenu(); // Reached max level
      return;
    }
    const nextLevel = level + 1;
    setLevel(nextLevel);
    // Unlock the next level if it wasn't unlocked yet
    setMaxUnlockedLevel(prev => Math.max(prev, nextLevel));
  };

  // Restart at the current level — fresh grid, player at start, no going back to menu
  const restartCurrentLevel = useCallback(() => {
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
    setScore(0);
    setGlobalCratesDestroyed(0);
    globalCratesRef.current = 0;
    // Calling initializeLevel() directly re-generates the grid for current level
    initializeLevel();
  }, [initializeLevel]);

  // Full reset back to start screen
  const goToMenu = () => {
    playMenuSelectSFX();
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
    setScore(0);
    setLevel(1);
    setGameStarted(false);
    setShowLevelSelect(false);
  };

  // Called when the user presses JUGAR on start screen
  const handleStartGame = () => {
    initAudio();
    playMenuSelectSFX();
    if (maxUnlockedLevel > 1) {
      // Has unlocked more than level 1 → show level selector
      setShowLevelSelect(true);
    } else {
      // First time / only level 1 unlocked → go straight to level 1
      setLevel(1);
      setGameStarted(true);
    }
  };

  // Called when a level is selected from LevelSelectScreen
  const handleSelectLevel = (selectedLevel: number) => {
    playMenuSelectSFX();
    setLevel(selectedLevel);
    setShowLevelSelect(false);
    setGameStarted(true);
  };

  const handleBuyItem = (itemId: string, price: number) => {
    if (coins >= price) {
      setCoins(prev => prev - price);
      setInventory(prev => [...prev, itemId]);
      return true;
    }
    return false;
  };

  const handleEquipSkin = (skin: SkinConfig) => {
    setEquippedSkin(skin);
    setShowStore(false);
  };

  const handleExchangePoints = (pointsToExchange: number) => {
    // The StoreScreen calculates the coin amount based on the tier
    // We need to handle the exchange tiers here too
    const EXCHANGE_TIERS: Record<number, number> = { 100: 10, 500: 55, 1000: 120, 5000: 750 };
    const coinsToAdd = EXCHANGE_TIERS[pointsToExchange] ?? Math.floor(pointsToExchange / 10);
    if (totalScore >= pointsToExchange) {
      setTotalScore(prev => prev - pointsToExchange);
      setCoins(prev => prev + coinsToAdd);
    }
  };

  if (!grid.length) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950">
      <AnimatePresence mode="wait">
        {!gameStarted && !showLevelSelect ? (
          <StartScreen 
            onStart={handleStartGame} 
            onOpenStore={() => {
              initAudio();
              playMenuSelectSFX();
              setShowStore(true);
            }} 
            userEmail={playerName || user?.email}
            onLoginClick={() => setAuthModal('login')}
            onRegisterClick={() => setAuthModal('register')}
            onLogoutClick={handleLogout}
          />
        ) : !gameStarted && showLevelSelect ? (
          <LevelSelectScreen
            maxUnlockedLevel={maxUnlockedLevel}
            onSelectLevel={handleSelectLevel}
            onBack={() => setShowLevelSelect(false)}
          />
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
              theme={getThemeForLevel(level)}
              grid={grid}
              tileSize={tileSize}
              isExitVisible={isExitVisible}
              exitDoorPos={exitDoorPosRef.current}
              enemies={enemies}
              bombs={bombs}
              explosions={explosions}
              powerUps={powerUps}
              playerPos={playerPos}
              direction={direction}
              skin={equippedSkin}
              globalCratesDestroyed={globalCratesDestroyed}
              isGameOver={isGameOver}
              isLevelCleared={isLevelCleared}
              score={score}
              level={level}
              spikesActive={spikesActive}
              onRestartLevel={restartCurrentLevel}
              onGoToMenu={goToMenu}
              onStartNextLevel={startNextLevel}
              destroyedCrates={destroyedCrates}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStore && (
          <StoreScreen
            onClose={() => setShowStore(false)}
            coins={coins}
            score={totalScore}
            inventory={inventory}
            equippedSkin={equippedSkin}
            onBuyItem={handleBuyItem}
            onEquipSkin={handleEquipSkin}
            onExchangePoints={handleExchangePoints}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {authModal && (
          <AuthModal
            mode={authModal}
            onChangeMode={setAuthModal}
            onClose={() => setAuthModal(null)}
            onSuccess={() => setAuthModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBugReport && (
          <BugReportModal
            onClose={() => setShowBugReport(false)}
            user={user}
            playerName={playerName}
            gameState={{
              level,
              score,
              coins,
              playerPos,
              equippedSkin: equippedSkin.id
            }}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowBugReport(true)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-700/50 hover:border-emerald-500/50 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 group"
        title="Reportar Bug o Soporte"
      >
        <Bug className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    </div>
  );
}
