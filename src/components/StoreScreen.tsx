import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Coins, PackageOpen, ArrowRightLeft } from 'lucide-react';
import { SkinConfig, StoreItem, StoreCategory } from '../types/game';
import { STORE_CATALOG } from '../constants/store';
import { PlayerAvatar } from './PlayerAvatar';
import { playMenuSelectSFX, playBuySFX, playExplosionSFX } from '../utils/audio';

interface StoreScreenProps {
  onClose: () => void;
  coins: number;
  score: number;
  inventory: string[];
  equippedSkin: SkinConfig;
  onBuyItem: (itemId: string, price: number) => boolean;
  onEquipSkin: (skin: SkinConfig) => void;
  onExchangePoints: (pointsToExchange: number) => void;
}

export function StoreScreen({
  onClose,
  coins,
  score,
  inventory,
  equippedSkin,
  onBuyItem,
  onEquipSkin,
  onExchangePoints
}: StoreScreenProps) {
  const [activeTab, setActiveTab] = useState<'skin' | 'bombs' | 'bank'>('skin');
  // Merge with defaults to handle skins saved before bomb/fire fields existed
  const [previewSkin, setPreviewSkin] = useState<SkinConfig>({
    bomb: 'bomb_classic',
    fire: 'fire_yellow',
    ...equippedSkin,
  });
  const [isExploding, setIsExploding] = useState(false);

  // Press SPACE to trigger explosion preview when on bombs tab
  const triggerExplosion = useCallback(() => {
    if (isExploding) return;
    playMenuSelectSFX();
    setIsExploding(true);
    setTimeout(() => {
      playExplosionSFX();
    }, 300); // sync with animation delay or fuse

    setTimeout(() => {
      setIsExploding(false);
    }, 1200);
  }, [isExploding]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeTab === 'bombs') {
        e.preventDefault();
        triggerExplosion();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeTab, triggerExplosion]);

  // Separate catalog by categories
  const bodyItems = STORE_CATALOG.filter(i => i.category === 'body');
  const mouthItems = STORE_CATALOG.filter(i => i.category === 'mouth');

  // Helpers to handle cycling
  const cycleItem = (category: StoreCategory, direction: 1 | -1) => {
    playMenuSelectSFX();
    const items = STORE_CATALOG.filter(i => i.category === category);
    const currentIndex = items.findIndex(i => i.id === previewSkin[category]);
    let newIndex = currentIndex + direction;
    if (newIndex >= items.length) newIndex = 0;
    if (newIndex < 0) newIndex = items.length - 1;
    
    setPreviewSkin({ ...previewSkin, [category]: items[newIndex].id });
  };

  // Calculate missing items and total price
  const { missingItems, totalPrice } = useMemo(() => {
    const missing: StoreItem[] = [];
    let price = 0;
    
    [previewSkin.body, previewSkin.glasses, previewSkin.mouth, previewSkin.bomb, previewSkin.fire].forEach(id => {
      // If not in inventory and not a free default item (price = 0 are considered always owned or free)
      const item = STORE_CATALOG.find(i => i.id === id);
      if (item && item.price > 0 && !inventory.includes(item.id)) {
        missing.push(item);
        price += item.price;
      }
    });

    return { missingItems: missing, totalPrice: price };
  }, [previewSkin, inventory]);

  const handleApply = () => {
    if (totalPrice > 0) {
      if (coins >= totalPrice) {
        // Try to buy all missing items
        let success = true;
        for (const item of missingItems) {
          if (!onBuyItem(item.id, item.price)) {
            success = false;
            break;
          }
        }
        if (success) {
          playBuySFX();
          onEquipSkin(previewSkin);
        }
      }
    } else {
      // Just equip
      playMenuSelectSFX();
      onEquipSkin(previewSkin);
    }
  };

  // Exchange tiers: [points needed, coins received]
  const EXCHANGE_TIERS = [
    { points: 100,  coins: 10,  label: 'Starter' },
    { points: 500,  coins: 55,  label: 'Ahorro (+10%)' },
    { points: 1000, coins: 120, label: 'Oferta (+20%)' },
    { points: 5000, coins: 750, label: 'Mega (+50%)' },
  ];

  const getItemName = (category: StoreCategory) => {
    return STORE_CATALOG.find(i => i.id === previewSkin[category])?.name || 'Desconocido';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-5xl h-[80vh] bg-zinc-900 rounded-3xl border-2 border-zinc-800 flex overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors text-white cursor-pointer">
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar */}
        <div className="w-64 bg-zinc-950 p-6 flex flex-col gap-8 border-r border-zinc-800">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter">TIENDA</h2>
            <div className="flex flex-col gap-2 mt-4 text-sm font-mono">
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-2 rounded-lg">
                <Coins className="w-4 h-4" />
                <span>{coins} Monedas</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-2 rounded-lg">
                <PackageOpen className="w-4 h-4" />
                <span>{score} Puntos</span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => { playMenuSelectSFX(); setActiveTab('skin'); }}
              className={`p-4 text-left font-bold rounded-xl transition-colors cursor-pointer ${activeTab === 'skin' ? 'bg-white text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}
            >
              Personalizar Skin
            </button>
            <button 
              onClick={() => { playMenuSelectSFX(); setActiveTab('bank'); }}
              className={`p-4 text-left font-bold rounded-xl transition-colors cursor-pointer ${activeTab === 'bank' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}
            >
              Banco (Canje)
            </button>
            <button 
              onClick={() => { playMenuSelectSFX(); setActiveTab('bombs'); }}
              className={`p-4 text-left font-bold rounded-xl transition-colors cursor-pointer ${activeTab === 'bombs' ? 'bg-white text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}
            >
              Bombas y Fuego
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'skin' && (
              <motion.div 
                key="skin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Left: Mannequin Preview */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-72 h-72 relative bg-zinc-800/50 rounded-3xl border border-zinc-700/50 flex items-center justify-center shadow-inner">
                    {/* Giant Avatar */}
                    <div className="w-[70%] h-[70%]">
                       <PlayerAvatar skin={previewSkin} direction="down" />
                    </div>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex-1 flex flex-col gap-6 w-full max-w-sm">
                  {/* Selectors */}
                  <div className="space-y-4">
                    <SelectorRow 
                      label="Cuerpo" 
                      value={getItemName('body')} 
                      onPrev={() => cycleItem('body', -1)} 
                      onNext={() => cycleItem('body', 1)} 
                    />

                    <SelectorRow 
                      label="Boca" 
                      value={getItemName('mouth')} 
                      onPrev={() => cycleItem('mouth', -1)} 
                      onNext={() => cycleItem('mouth', 1)} 
                    />
                  </div>

                  <div className="mt-8 pt-8 border-t border-zinc-800">
                    <button
                      onClick={handleApply}
                      disabled={totalPrice > 0 && coins < totalPrice}
                      className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                        totalPrice === 0 
                          ? 'bg-white text-black hover:bg-zinc-200' 
                          : coins >= totalPrice 
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed active:scale-100'
                      }`}
                    >
                      {totalPrice === 0 ? 'Equipar (Gratis)' : (
                        <>
                          <Coins className="w-5 h-5" />
                          Comprar por {totalPrice}
                        </>
                      )}
                    </button>
                    {totalPrice > 0 && coins < totalPrice && (
                      <p className="text-red-400 text-sm text-center mt-3 font-medium">No tienes suficientes monedas.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bombs' && (
              <motion.div 
                key="bombs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Left: Bomb & Fire Preview */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                  {/* Bomb & Explosion Preview */}
                  <div 
                    className="relative w-72 h-72 bg-zinc-800/50 rounded-3xl border border-zinc-700/50 flex items-center justify-center shadow-inner overflow-hidden cursor-pointer select-none"
                    onClick={triggerExplosion}
                    title="Clic o Espacio para explotar"
                  >
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                    {/* Idle ambient glow (only when NOT exploding) */}
                    <AnimatePresence>
                      {!isExploding && (
                        <motion.div
                          key="glow"
                          initial={{ opacity: 0 }}
                          animate={{ scale: [0.8, 1.1, 0.9], opacity: [0.25, 0.4, 0.25] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className={`absolute w-40 h-40 rounded-full blur-2xl ${STORE_CATALOG.find(i => i.id === previewSkin.fire)?.value || 'bg-yellow-400'}`}
                        />
                      )}
                    </AnimatePresence>

                    {/* EXPLOSION ANIMATION */}
                    <AnimatePresence>
                      {isExploding && (() => {
                        const fireClass = STORE_CATALOG.find(i => i.id === previewSkin.fire)?.value || 'bg-yellow-400';
                        const arms = [
                          { rotate: '0deg',   length: 90 },   // up
                          { rotate: '180deg', length: 90 },   // down
                          { rotate: '90deg',  length: 90 },   // right
                          { rotate: '-90deg', length: 90 },   // left
                          { rotate: '45deg',  length: 60 },   // diagonals
                          { rotate: '-45deg', length: 60 },
                          { rotate: '135deg', length: 60 },
                          { rotate: '-135deg',length: 60 },
                        ];
                        return (
                          <>
                            {/* Central Flash */}
                            <motion.div
                              key="flash"
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: [0, 3, 2.5], opacity: [1, 0.8, 0] }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className={`absolute w-16 h-16 rounded-full blur-md z-20 ${fireClass}`}
                            />
                            {/* White core pop */}
                            <motion.div
                              key="core"
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: [0, 1.5, 1], opacity: [1, 1, 0] }}
                              transition={{ duration: 0.4 }}
                              className="absolute w-8 h-8 bg-white rounded-full blur-sm z-30"
                            />
                            {/* Fire arms */}
                            {arms.map((arm, idx) => (
                              <motion.div
                                key={`arm-${idx}`}
                                initial={{ scaleY: 0, opacity: 1 }}
                                animate={{ scaleY: [0, 1, 0.8], opacity: [1, 1, 0] }}
                                transition={{ duration: 0.7, delay: 0.05, ease: 'easeOut' }}
                                style={{
                                  position: 'absolute',
                                  width: 18,
                                  height: arm.length,
                                  rotate: arm.rotate,
                                  originY: '100%',
                                  bottom: '50%',
                                  left: 'calc(50% - 9px)',
                                  transformOrigin: 'bottom center',
                                }}
                                className={`rounded-t-full blur-[2px] z-10 ${fireClass}`}
                              />
                            ))}
                            {/* Outer shockwave ring */}
                            <motion.div
                              key="ring"
                              initial={{ scale: 0, opacity: 0.8 }}
                              animate={{ scale: 2.5, opacity: 0 }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`absolute w-24 h-24 rounded-full border-4 z-5 ${fireClass.replace('bg-', 'border-')}`}
                            />
                          </>
                        );
                      })()}
                    </AnimatePresence>

                    {/* Bomb (hidden during explosion) */}
                    <AnimatePresence>
                      {!isExploding && (
                        <motion.div
                          key="bomb"
                          initial={{ scale: 1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="relative w-32 h-32 flex items-center justify-center"
                        >
                          {/* Bomb Body — same markup as GameBoard.tsx */}
                          <div className={`relative w-[80%] h-[80%] rounded-full shadow-2xl border-4 flex justify-center ${STORE_CATALOG.find(i => i.id === previewSkin.bomb)?.value || 'bg-zinc-800 border-zinc-950'}`}>
                            {/* Highlight */}
                            <div className="absolute top-[10%] left-[20%] w-[25%] h-[15%] bg-white/20 rounded-full rotate-[-30deg]" />

                            {/* Fuse & Fire Container — IDENTICAL to GameBoard */}
                            <div className="absolute -top-[50%] w-0 h-[50%] flex justify-center rotate-[60deg] origin-bottom">
                              {/* The Fuse */}
                              <div className="absolute w-[4px] h-full bg-[#8B5A2B] rounded-t-sm" />

                              {/* Spark at tip — static in preview (not timer-driven) */}
                              <div className="absolute top-0 z-10 flex items-center justify-center">
                                <motion.div
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                                  transition={{ duration: 0.15, repeat: Infinity }}
                                  className={`w-4 h-4 rounded-full blur-[2px] absolute ${STORE_CATALOG.find(i => i.id === previewSkin.fire)?.value || 'bg-yellow-400'}`}
                                />
                                <div className="w-2 h-2 bg-white rounded-full relative z-10" />
                                <div className={`w-3 h-3 rounded-full absolute mix-blend-screen opacity-80 ${STORE_CATALOG.find(i => i.id === previewSkin.fire)?.value || 'bg-yellow-400'}`} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Press SPACE hint */}
                    {!isExploding && (
                      <div className="absolute bottom-4 text-zinc-500 text-xs font-mono flex items-center gap-1">
                        <kbd className="bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-300 text-[10px]">SPACE</kbd>
                        <span>o click para explotar</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex-1 flex flex-col gap-6 w-full max-sm:max-w-none max-w-sm">
                  <div className="space-y-4">
                    <SelectorRow 
                      label="Diseño de Bomba" 
                      value={getItemName('bomb')} 
                      onPrev={() => cycleItem('bomb', -1)} 
                      onNext={() => cycleItem('bomb', 1)} 
                    />
                    <SelectorRow 
                      label="Color de Fuego" 
                      value={getItemName('fire')} 
                      onPrev={() => cycleItem('fire', -1)} 
                      onNext={() => cycleItem('fire', 1)} 
                    />
                  </div>

                  <div className="mt-8 pt-8 border-t border-zinc-800">
                    <button
                      onClick={handleApply}
                      disabled={totalPrice > 0 && coins < totalPrice}
                      className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                        totalPrice === 0 
                          ? 'bg-white text-black hover:bg-zinc-200' 
                          : coins >= totalPrice 
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed active:scale-100'
                      }`}
                    >
                      {totalPrice === 0 ? 'Equipar (Gratis)' : (
                        <>
                          <Coins className="w-5 h-5" />
                          Comprar por {totalPrice}
                        </>
                      )}
                    </button>
                    {totalPrice > 0 && coins < totalPrice && (
                      <p className="text-red-400 text-sm text-center mt-3 font-medium">No tienes suficientes monedas.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bank' && (
              <motion.div 
                key="bank"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col justify-center max-w-lg mx-auto gap-6"
              >
                {/* Header */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ArrowRightLeft className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Casa de Canje</h3>
                  <p className="text-zinc-400 text-sm mt-1">Convertí tus Puntos en Monedas. ¡Más puntos a la vez, mejor precio!</p>
                </div>

                {/* Balance */}
                <div className="w-full bg-zinc-950 px-6 py-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-zinc-500 text-xs uppercase font-bold">Tus Puntos</span>
                    <div className="text-2xl font-mono text-emerald-400">{score}</div>
                  </div>
                  <ArrowRightLeft className="w-5 h-5 text-zinc-600" />
                  <div className="text-right">
                    <span className="text-zinc-500 text-xs uppercase font-bold">Tus Monedas</span>
                    <div className="text-2xl font-mono text-yellow-400">{coins}</div>
                  </div>
                </div>

                {/* Exchange Tiers */}
                <div className="flex flex-col gap-3">
                  {EXCHANGE_TIERS.map(tier => {
                    const canAfford = score >= tier.points;
                    return (
                      <button
                        key={tier.points}
                        onClick={() => canAfford && onExchangePoints(tier.points)}
                        disabled={!canAfford}
                        className={`w-full px-5 py-4 rounded-2xl font-bold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-zinc-800 hover:bg-yellow-400 hover:text-black text-white active:scale-95'
                            : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-mono font-black">{tier.points} pts</span>
                          <span className="text-xs text-zinc-500 bg-zinc-700/50 px-2 py-0.5 rounded-full">{tier.label}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono font-black">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span>{tier.coins}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Subcomponent for the carousel selectors
function SelectorRow({ label, value, onPrev, onNext }: { label: string, value: string, onPrev: () => void, onNext: () => void }) {
  return (
    <div className="bg-zinc-950 rounded-2xl p-4 flex flex-col gap-2 border border-zinc-800/50">
      <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</span>
      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-zinc-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-white text-center flex-1">{value}</span>
        <button onClick={onNext} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-zinc-400 hover:text-white">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
