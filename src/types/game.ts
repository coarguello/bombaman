export enum TileType {
  EMPTY = 0,
  STEEL = 1,
  CRATE = 2,
  CONVEYOR_LEFT = 3,
  CONVEYOR_RIGHT = 4,
  CONVEYOR_UP = 5,
  CONVEYOR_DOWN = 6,
  SPIKE = 7,
}

export enum PowerUpType {
  FIRE = 'fire',          // Increase explosion radius
  BOMB = 'bomb',          // Extra bomb capacity
  SKATE = 'skate',        // Faster movement
  GLOVE = 'glove',        // Push bombs
}

export enum EnemyType {
  A = 'ballom',   // Basic: Random movement every 0.6s
  B = 'onil',     // Chaser: Moves toward player every 0.4s
  C = 'ghost',    // Ghost: Moves slow (0.8s), passes through crates
  D = 'sprinter', // Sprinter: Very fast (0.2s), straight lines
  E = 'smart',    // Smart: Chases player, avoids bombs every 0.5s
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: PowerUpType;
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
  startX?: number; // Starting position for flight animation
  startY?: number;
  isFlying?: boolean; // Is it currently flying?
}

export interface Explosion {
  id: string;
  tiles: Position[];
  createdAt: number;
}

export type StoreCategory = 'body' | 'glasses' | 'mouth' | 'bomb' | 'fire';

export interface StoreItem {
  id: string;
  category: StoreCategory;
  name: string;
  price: number;
  value: string; // CSS class or internal identifier
}

export interface SkinConfig {
  body: string; // id of the selected StoreItem
  glasses: string;
  mouth: string;
  bomb: string;
  fire: string;
}
