import { StoreItem } from '../types/game';

export const STORE_CATALOG: StoreItem[] = [
  // CUERPOS (Personajes clásicos de Bomberman)
  { id: 'body_default', category: 'body', name: 'White Bomber', price: 0, value: 'bg-white border-zinc-300' },
  { id: 'body_black', category: 'body', name: 'Black Bomber', price: 100, value: 'bg-zinc-800 border-black' },
  { id: 'body_red', category: 'body', name: 'Red Bomber', price: 150, value: 'bg-red-500 border-red-700' },
  { id: 'body_blue', category: 'body', name: 'Blue Bomber', price: 150, value: 'bg-sky-400 border-sky-600' },
  { id: 'body_green', category: 'body', name: 'Green Bomber', price: 200, value: 'bg-emerald-400 border-emerald-600' },
  { id: 'body_yellow', category: 'body', name: 'Yellow Bomber', price: 250, value: 'bg-yellow-300 border-yellow-500' },
  { id: 'body_pink', category: 'body', name: 'Pink Bomber', price: 300, value: 'bg-pink-300 border-pink-500' },
  { id: 'body_purple', category: 'body', name: 'Purple Bomber', price: 400, value: 'bg-purple-500 border-purple-700' },
  
  // LENTES (fijo, no se cambia)
  { id: 'glasses_yellow', category: 'glasses', name: 'Visor Clásico', price: 0, value: 'bg-yellow-400 border-yellow-500' },

  // BOCAS
  { id: 'mouth_none', category: 'mouth', name: 'Sin Boca', price: 0, value: 'none' },
  { id: 'mouth_marker', category: 'mouth', name: 'Marcador', price: 20, value: 'marker' },
  { id: 'mouth_smile', category: 'mouth', name: 'Sonrisa Feliz', price: 40, value: 'smile' },
  { id: 'mouth_sad', category: 'mouth', name: 'Triste', price: 40, value: 'sad' },
  { id: 'mouth_robot', category: 'mouth', name: 'Rejilla Robot', price: 100, value: 'robot' },

  // BOMBAS
  { id: 'bomb_classic', category: 'bomb', name: 'Bomba Negra',   price: 0,   value: 'bg-[#222222]' },
  { id: 'bomb_purple',  category: 'bomb', name: 'Bomba Violeta', price: 200, value: 'bg-[#7b73b5]' },
  { id: 'bomb_blue',    category: 'bomb', name: 'Bomba Azul',    price: 200, value: 'bg-[#1b204d]' },

  // FUEGOS
  { id: 'fire_yellow', category: 'fire', name: 'Fuego Clásico', price: 0, value: 'bg-yellow-400' }, // Amarillo/Naranja
  { id: 'fire_red', category: 'fire', name: 'Fuego Carmesí', price: 150, value: 'bg-red-500' },
  { id: 'fire_blue', category: 'fire', name: 'Fuego Azul', price: 300, value: 'bg-cyan-400' },
  { id: 'fire_purple', category: 'fire', name: 'Fuego Violeta', price: 450, value: 'bg-purple-500' },
];

export const DEFAULT_SKIN_CONFIG = {
  body: 'body_default',
  glasses: 'glasses_yellow',
  mouth: 'mouth_none',
  bomb: 'bomb_classic',
  fire: 'fire_yellow'
};
