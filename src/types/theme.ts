export type GameTheme = 'industrial' | 'jungle' | 'underworld' | 'desert' | 'cosmic';

export function getThemeForLevel(level: number): GameTheme {
  if (level <= 5) return 'industrial';
  if (level <= 10) return 'jungle';
  if (level <= 15) return 'underworld';
  if (level <= 20) return 'desert';
  return 'cosmic';
}
