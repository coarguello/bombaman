export enum TileType {
  EMPTY = 0,
  STEEL = 1,
  CRATE = 2,
}

export enum EnemyType {
  A = 'ballom',   // Basic: Random movement every 0.6s
  B = 'onil',     // Chaser: Moves toward player every 0.4s
  C = 'ghost',    // Ghost: Moves slow (0.8s), passes through crates
  D = 'sprinter', // Sprinter: Very fast (0.2s), straight lines
  E = 'smart',    // Smart: Chases player, avoids bombs every 0.5s
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  type: EnemyType;
  lastMove: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Bomb {
  id: string;
  x: number;
  y: number;
  placedAt: number;
}

export interface Explosion {
  id: string;
  tiles: Position[];
  createdAt: number;
}
