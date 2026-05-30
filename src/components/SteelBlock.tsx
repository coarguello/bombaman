import { GameTheme } from '../types/theme';

interface SteelBlockProps {
  theme: GameTheme;
  x: number;
  y: number;
}

export function SteelBlock({ theme, x, y }: SteelBlockProps) {
  // Deterministic random number between 0 and 9 based on grid position
  const v = (x * 13 + y * 31) % 10;

  if (theme === 'industrial') {
    return (
      <div className="w-full h-full tile-steel" />
    );
  }

  if (theme === 'jungle') {
    // 10 variations of jungle rocks: different combinations of moss, leaves and vines, NO symbols
    const baseBg = ['#3d4a38','#424e3c','#3a4535','#455040','#3f4b3a','#465142','#3c4837','#435040','#3b4636','#46523f'];
    const borderT = ['#5a6854','#5f6e58','#576451','#627060','#5c6a55','#647265','#596654','#617060','#576452','#667471'];
    const borderB = ['#232a20','#252d22','#20271e','#282f24','#242b21','#2a3026','#222920','#272e24','#222820','#2b3227'];

    // Each variation: a distinct foliage/moss pattern using only SVG shapes (no symbols)
    const foliagePatterns = [
      // 0: Heavy top overgrowth
      <svg key="0" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M-5 -5 Q 20 2 20 18 Q 10 10 -5 -5Z" fill="#15803d"/>
        <path d="M0 -5 Q 30 0 28 16 Q 18 8 0 -5Z" fill="#16a34a"/>
        <path d="M20 -5 Q 45 5 42 22 Q 30 12 20 -5Z" fill="#14532d"/>
        <path d="M35 -5 Q 45 8 40 20 Q 35 10 35 -5Z" fill="#166534"/>
        <path d="M-5 12 Q 5 25 2 35 Q -3 28 -5 12Z" fill="#15803d" opacity="0.7"/>
      </svg>,
      // 1: Vines on sides
      <svg key="1" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M-3 0 Q 5 10 3 20 Q 1 30 -3 40Z" fill="#14532d"/>
        <path d="M-3 5 Q 8 15 6 25Z" fill="#15803d"/>
        <path d="M43 0 Q 35 10 37 20 Q 39 30 43 40Z" fill="#166534"/>
        <path d="M43 8 Q 32 18 34 28Z" fill="#15803d"/>
        <path d="M10 -3 Q 15 5 12 10Z" fill="#16a34a"/>
        <path d="M25 -3 Q 30 5 27 10Z" fill="#14532d"/>
      </svg>,
      // 2: Bottom dense bush
      <svg key="2" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M-5 45 Q 5 28 15 43 Z" fill="#15803d"/>
        <path d="M5 45 Q 18 25 28 43 Z" fill="#16a34a"/>
        <path d="M20 45 Q 30 27 45 44 Z" fill="#14532d"/>
        <path d="M30 45 Q 40 30 45 42 Z" fill="#166534"/>
        <path d="M-5 35 Q 8 22 12 35Z" fill="#15803d" opacity="0.8"/>
      </svg>,
      // 3: Corner clusters
      <svg key="3" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M-5 -5 Q 12 2 8 16 Q 2 8 -5 -5Z" fill="#15803d"/>
        <path d="M-5 -5 Q 3 14 -2 22 Q -5 14 -5 -5Z" fill="#166534"/>
        <path d="M45 -5 Q 28 3 32 16 Q 38 8 45 -5Z" fill="#14532d"/>
        <path d="M45 45 Q 28 35 30 25 Q 40 32 45 45Z" fill="#16a34a"/>
        <path d="M-5 45 Q 8 32 12 28 Q 4 38 -5 45Z" fill="#15803d"/>
      </svg>,
      // 4: Spiky fern leaves
      <svg key="4" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M20 5 Q 8 15 10 25 Q 15 18 20 5Z" fill="#16a34a"/>
        <path d="M20 5 Q 32 15 30 25 Q 25 18 20 5Z" fill="#14532d"/>
        <path d="M20 5 Q 5 20 8 32 Q 14 22 20 5Z" fill="#15803d"/>
        <path d="M20 5 Q 35 20 32 32 Q 26 22 20 5Z" fill="#166534"/>
        <path d="M20 5 L 20 38" stroke="#1a6b2e" strokeWidth="1.5"/>
      </svg>,
      // 5: Thick moss carpet
      <svg key="5" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <ellipse cx="8" cy="6" rx="10" ry="8" fill="#15803d" opacity="0.9"/>
        <ellipse cx="22" cy="4" rx="9" ry="7" fill="#16a34a" opacity="0.9"/>
        <ellipse cx="34" cy="7" rx="9" ry="8" fill="#14532d" opacity="0.9"/>
        <ellipse cx="4" cy="34" rx="8" ry="7" fill="#166534" opacity="0.9"/>
        <ellipse cx="36" cy="35" rx="8" ry="6" fill="#15803d" opacity="0.9"/>
      </svg>,
      // 6: Draping vines from top
      <svg key="6" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M5 -2 Q 7 10 5 22 Q 3 30 6 40" stroke="#15803d" strokeWidth="2" fill="none"/>
        <path d="M5 8 Q 0 14 -3 18" fill="#16a34a"/>
        <path d="M5 18 Q 10 22 8 26" fill="#14532d"/>
        <path d="M18 -2 Q 20 12 18 24 Q 16 32 19 40" stroke="#166534" strokeWidth="2" fill="none"/>
        <path d="M18 6 Q 12 12 10 16" fill="#15803d"/>
        <path d="M32 -2 Q 34 14 32 26 Q 30 34 33 40" stroke="#14532d" strokeWidth="2" fill="none"/>
        <path d="M32 10 Q 38 16 40 20" fill="#16a34a"/>
      </svg>,
      // 7: Big tropical leaves
      <svg key="7" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M2 2 Q 25 5 22 28 Q 10 18 2 2Z" fill="#15803d"/>
        <path d="M38 2 Q 15 5 18 28 Q 30 18 38 2Z" fill="#14532d"/>
        <path d="M2 38 Q 20 20 38 38 Q 20 30 2 38Z" fill="#166534"/>
        <path d="M2 2 L 22 28" stroke="#22c55e" strokeWidth="0.8" opacity="0.5"/>
        <path d="M38 2 L 18 28" stroke="#22c55e" strokeWidth="0.8" opacity="0.5"/>
      </svg>,
      // 8: Flower buds
      <svg key="8" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <circle cx="8" cy="8" r="5" fill="#15803d"/>
        <circle cx="32" cy="8" r="5" fill="#16a34a"/>
        <circle cx="8" cy="32" r="5" fill="#166534"/>
        <circle cx="32" cy="32" r="5" fill="#14532d"/>
        <circle cx="20" cy="20" r="4" fill="#15803d"/>
        <circle cx="8" cy="8" r="2" fill="#4ade80" opacity="0.8"/>
        <circle cx="32" cy="8" r="2" fill="#86efac" opacity="0.8"/>
        <circle cx="8" cy="32" r="2" fill="#4ade80" opacity="0.8"/>
        <circle cx="32" cy="32" r="2" fill="#86efac" opacity="0.8"/>
        <circle cx="20" cy="20" r="2" fill="#bbf7d0" opacity="0.8"/>
      </svg>,
      // 9: Mixed overgrowth all sides
      <svg key="9" className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
        <path d="M-5 -5 Q 18 0 16 14 Q 6 6 -5 -5Z" fill="#15803d"/>
        <path d="M45 -5 Q 22 0 24 14 Q 34 6 45 -5Z" fill="#166534"/>
        <path d="M-5 45 Q 18 40 16 26 Q 6 34 -5 45Z" fill="#14532d"/>
        <path d="M45 45 Q 22 40 24 26 Q 34 34 45 45Z" fill="#16a34a"/>
        <path d="M-5 18 Q 4 20 2 28 Q -2 24 -5 18Z" fill="#15803d"/>
        <path d="M45 18 Q 36 20 38 28 Q 42 24 45 18Z" fill="#166534"/>
      </svg>
    ];

    return (
      <div
        className="w-full h-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: baseBg[v],
          borderTop: `4px solid ${borderT[v]}`,
          borderLeft: `4px solid ${borderT[v]}`,
          borderBottom: `4px solid ${borderB[v]}`,
          borderRight: `4px solid ${borderB[v]}`,
        }}
      >
        {/* Stone cracks - subtle, vary by variant */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
          <path d={`M ${5+v*8} 0 L ${20+v*5} ${30+v*2} L ${10+v*3} ${60+v} L ${35+v*4} 100`} fill="none" stroke="#1c1f19" strokeWidth="2"/>
          {v % 3 === 0 && <path d="M 0 40 L 25 55 L 15 80" fill="none" stroke="#1c1f19" strokeWidth="1.5"/>}
          {v % 2 === 0 && <path d="M 70 0 L 80 30 L 60 50" fill="none" stroke="#1c1f19" strokeWidth="1.5"/>}
        </svg>

        {/* Foliage overlay - 10 unique patterns, no symbols */}
        {foliagePatterns[v]}
      </div>
    );
  }

  if (theme === 'underworld') {
    const crackPaths = [
      <path key="0" d="M 10 0 L 30 40 L 15 70 L 40 100" fill="none" stroke="currentColor" strokeWidth="4" className="drop-shadow-[0_0_8px_currentColor] animate-pulse" />,
      <path key="1" d="M 60 0 L 50 30 L 80 60 L 60 100" fill="none" stroke="currentColor" strokeWidth="3" className="drop-shadow-[0_0_6px_currentColor] animate-pulse" />,
      <path key="2" d="M 100 20 L 70 40 L 90 80" fill="none" stroke="currentColor" strokeWidth="2" className="drop-shadow-[0_0_5px_currentColor] animate-pulse" />,
      <path key="3" d="M 0 50 L 40 40 L 60 80 L 100 90" fill="none" stroke="currentColor" strokeWidth="4" className="drop-shadow-[0_0_8px_currentColor] animate-pulse" />,
      <path key="4" d="M 20 0 L 10 50 L 50 100" fill="none" stroke="currentColor" strokeWidth="5" className="drop-shadow-[0_0_10px_currentColor] animate-pulse" />,
    ];

    const lavaColors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-rose-600', 'text-amber-500'];

    return (
      <div className="w-full h-full bg-[#111] border-[3px] border-t-[#333] border-l-[#222] border-b-[#000] border-r-[#000] relative overflow-hidden flex items-center justify-center">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,currentColor_0%,rgba(0,0,0,1)_80%)] opacity-30 ${lavaColors[v%5]}`} />
        
        <svg className={`absolute w-[120%] h-[120%] -left-[10%] -top-[10%] ${lavaColors[v%5]}`} viewBox="0 0 100 100">
           {crackPaths[v % 5]}
           {crackPaths[(v + 1) % 5]}
           {crackPaths[(v + 2) % 5]}
           
           <circle cx="50" cy="50" r={v+5} fill="url(#magmaGrad)" className="animate-pulse drop-shadow-[0_0_15px_rgba(255,100,0,1)]"/>
           <defs>
             <radialGradient id="magmaGrad">
               <stop offset="0%" stopColor="#fef08a" />
               <stop offset="50%" stopColor="#f97316" />
               <stop offset="100%" stopColor="#991b1b" />
             </radialGradient>
           </defs>
        </svg>

        <div className={`absolute top-0 left-0 w-[${40+v}%] h-[${30+v}%] bg-zinc-900 border-b-2 border-r-2 border-zinc-700 shadow-[2px_2px_10px_rgba(0,0,0,0.9)]`} />
        <div className={`absolute bottom-0 right-0 w-[${50-v}%] h-[${40-v}%] bg-zinc-950 border-t-2 border-l-2 border-zinc-800 shadow-[-2px_-2px_10px_rgba(0,0,0,0.9)]`} />
        {v % 2 === 0 && <div className="absolute top-[20%] right-0 w-[30%] h-[30%] bg-black border-l-2 border-b-2 border-zinc-800 rounded-bl-lg" />}
      </div>
    );
  }

  if (theme === 'desert') {
    const glyphs = [
      // 0: Eye
      <g key="0"><path d="M 20 50 Q 50 20 80 50 Q 50 80 20 50" fill="none" stroke="currentColor" strokeWidth="6"/><circle cx="50" cy="50" r="10" fill="currentColor"/></g>,
      // 1: Ankh
      <g key="1"><path d="M 50 35 L 50 85 M 35 50 L 65 50 M 50 35 Q 35 15 50 15 Q 65 15 50 35" fill="none" stroke="currentColor" strokeWidth="6"/></g>,
      // 2: Scarab
      <g key="2"><ellipse cx="50" cy="55" rx="15" ry="25" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M 35 45 Q 15 20 35 10 M 65 45 Q 85 20 65 10" fill="none" stroke="currentColor" strokeWidth="4"/></g>,
      // 3: Pyramid
      <g key="3"><polygon points="50,20 85,80 15,80" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M 30 60 L 70 60 M 40 40 L 60 40" stroke="currentColor" strokeWidth="4"/></g>,
      // 4: Sun
      <g key="4"><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M 50 15 L 50 5 M 50 85 L 50 95 M 15 50 L 5 50 M 85 50 L 95 50 M 25 25 L 15 15 M 75 75 L 85 85 M 25 75 L 15 85 M 75 25 L 85 15" stroke="currentColor" strokeWidth="4"/></g>,
      // 5: Snake
      <g key="5"><path d="M 30 80 Q 70 80 70 60 Q 70 40 30 40 Q 30 20 70 20 L 70 10" fill="none" stroke="currentColor" strokeWidth="6"/></g>,
      // 6: Staff
      <g key="6"><path d="M 40 90 L 40 30 Q 40 10 60 20 Q 50 30 40 30" fill="none" stroke="currentColor" strokeWidth="6"/></g>,
      // 7: Water
      <g key="7"><path d="M 10 40 Q 25 20 40 40 T 70 40 T 100 40 M 10 60 Q 25 40 40 60 T 70 60 T 100 60" fill="none" stroke="currentColor" strokeWidth="6"/></g>,
      // 8: Hourglass
      <g key="8"><polygon points="30,20 70,20 30,80 70,80" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M 20 20 L 80 20 M 20 80 L 80 80" stroke="currentColor" strokeWidth="6"/></g>,
      // 9: Diamond/Jewel
      <g key="9"><polygon points="50,15 80,50 50,85 20,50" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M 20 50 L 80 50 M 50 15 L 50 85" stroke="currentColor" strokeWidth="4"/></g>
    ];

    return (
      <div className="w-full h-full bg-gradient-to-br from-[#e6cc98] to-[#c29b62] border-[4px] border-t-[#fdf1d6] border-l-[#fdf1d6] border-b-[#8b6534] border-r-[#a67c52] relative flex flex-col items-center justify-center p-1 overflow-hidden">
         <div className="absolute inset-1 border-[2px] border-[#d4af37] shadow-[inset_0_0_5px_rgba(139,69,19,0.8),0_0_3px_rgba(255,215,0,0.6)] flex items-center justify-center text-[#b8860b]">
            <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] drop-shadow-[0_2px_1px_rgba(255,255,255,0.4)]">
              {glyphs[v]}
            </svg>
         </div>
         {v % 2 === 0 && <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-[#ffd700] rounded-sm shadow-sm" />}
         {v % 3 === 0 && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ffd700] rounded-sm shadow-sm" />}
         {v % 4 === 0 && <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#ffd700] rounded-sm shadow-sm" />}
         {v % 5 === 0 && <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#ffd700] rounded-sm shadow-sm" />}
      </div>
    );
  }

  // Cosmic
  const cosmicCores = [
    <div key="0" className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1),0_0_25px_rgba(34,211,238,1)] animate-ping absolute" />,
    <div key="1" className="w-3 h-3 bg-fuchsia-300 rotate-45 shadow-[0_0_15px_currentColor] animate-pulse absolute" />,
    <div key="2" className="w-4 h-1 bg-cyan-200 rotate-45 shadow-[0_0_15px_currentColor] animate-spin absolute" />,
    <div key="3" className="w-1 h-4 bg-purple-200 shadow-[0_0_15px_currentColor] animate-bounce absolute" />,
    <div key="4" className="w-3 h-3 bg-yellow-200 rounded-full shadow-[0_0_15px_currentColor] animate-ping absolute" />,
    <div key="5" className="w-3 h-3 bg-rose-300 rounded-sm shadow-[0_0_15px_currentColor] animate-pulse absolute" />,
    <div key="6" className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-cyan-300 shadow-[0_0_15px_currentColor] animate-spin absolute" />,
    <div key="7" className="w-4 h-4 bg-transparent border-2 border-fuchsia-400 rounded-full shadow-[0_0_15px_currentColor] animate-ping absolute" />,
    <div key="8" className="w-3 h-3 bg-white rotate-45 shadow-[0_0_15px_currentColor] animate-pulse absolute" />,
    <div key="9" className="w-2 h-2 bg-indigo-300 rounded-full shadow-[0_0_15px_currentColor] animate-bounce absolute" />,
  ];

  const ringColors = ['border-cyan-400', 'border-fuchsia-500', 'border-lime-400', 'border-rose-500', 'border-amber-400', 'border-emerald-400', 'border-blue-500', 'border-purple-400', 'border-yellow-300', 'border-red-500'];

  return (
    <div className="w-full h-full bg-[#0a0514] border-[3px] border-purple-600 relative flex items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(168,85,247,0.8)]">
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.2)_1px,transparent_1px)] bg-[size:${4+(v%5)*2}px_${4+(v%5)*2}px]`} />
      
      <div className={`absolute w-[80%] h-[80%] border-[${1+(v%3)}px] ${ringColors[v]} rounded-full border-t-transparent border-b-transparent animate-[spin_3s_linear_infinite] drop-shadow-[0_0_5px_currentColor]`} />
      <div className={`absolute w-[60%] h-[60%] border-[${1+(v%2)}px] ${ringColors[(v+5)%10]} rounded-full border-l-transparent border-r-transparent animate-[spin_2s_linear_infinite_reverse] drop-shadow-[0_0_5px_currentColor]`} />
      
      {cosmicCores[v]}
      <div className="w-2.5 h-2.5 bg-cyan-200 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)] absolute" />
      
      {v % 2 === 0 && <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />}
      {v % 3 === 0 && <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />}
      {v % 4 === 0 && <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />}
      {v % 5 !== 0 && <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />}
    </div>
  );
}
