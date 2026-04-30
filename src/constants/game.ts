export const GRID_SIZE = 15;
export const BOMB_TIMER = 3000;
export const EXPLOSION_DURATION = 800;

export type ExitCondition = 'RANDOM' | 'LAST_CRATE';
export const EXIT_CONDITION: ExitCondition = 'LAST_CRATE'; // CHANGE THIS TO SWITCH MODES
