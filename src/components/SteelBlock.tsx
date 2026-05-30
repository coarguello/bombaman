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
    const coreColors = [
      'from-orange-600 to-yellow-400 shadow-[0_0_5px_rgba(234,179,8,0.8)]',
      'from-cyan-600 to-blue-400 shadow-[0_0_5px_rgba(56,189,248,0.8)]',
      'from-green-600 to-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]',
      'from-purple-600 to-fuchsia-400 shadow-[0_0_5px_rgba(232,121,249,0.8)]',
      'from-rose-600 to-pink-400 shadow-[0_0_5px_rgba(244,114,182,0.8)]',
      'from-red-600 to-red-400 shadow-[0_0_5px_rgba(248,113,113,0.8)]',
      'from-yellow-600 to-yellow-300 shadow-[0_0_5px_rgba(253,224,71,0.8)]',
      'from-indigo-600 to-indigo-400 shadow-[0_0_5px_rgba(129,140,248,0.8)]',
      'from-lime-600 to-lime-400 shadow-[0_0_5px_rgba(163,230,53,0.8)]',
      'from-teal-600 to-teal-400 shadow-[0_0_5px_rgba(45,212,191,0.8)]',
    ];

    const hasTopStripes = v % 2 === 0;
    const hasBottomStripes = v % 3 !== 0;

    return (
      <div className="w-full h-full bg-zinc-700 border-[4px] border-t-zinc-400 border-l-zinc-500 border-b-zinc-900 border-r-zinc-800 flex items-center justify-center relative overflow-hidden">
        {hasTopStripes && <div className="absolute top-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,#eab308,#eab308_4px,#000_4px,#000_8px)] opacity-80" />}
        {hasBottomStripes && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(-45deg,#eab308,#eab308_4px,#000_4px,#000_8px)] opacity-80" />}
        
        <div className="w-[60%] h-[60%] bg-zinc-950 border-2 border-zinc-900 rounded-sm shadow-[inset_0_0_8px_rgba(0,0,0,1)] flex flex-col justify-evenly p-1 relative">
           <div className={`absolute inset-0 bg-white/10 blur-sm animate-pulse`} />
           <div className={`w-full h-[20%] bg-gradient-to-r rounded-full ${coreColors[v]}`} />
           <div className={`w-full h-[20%] bg-gradient-to-r rounded-full ${coreColors[(v+1)%10]}`} />
           <div className={`w-full h-[20%] bg-gradient-to-r rounded-full ${coreColors[(v+2)%10]}`} />
        </div>
        
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-zinc-300 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.8)] border border-zinc-900 flex items-center justify-center"><div className={`w-full h-[1px] bg-zinc-800 ${v%2===0?'rotate-45':''}`}/></div>
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-zinc-300 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.8)] border border-zinc-900 flex items-center justify-center"><div className={`w-full h-[1px] bg-zinc-800 ${v%3===0?'rotate-90':''}`}/></div>
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-zinc-300 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.8)] border border-zinc-900 flex items-center justify-center"><div className={`w-full h-[1px] bg-zinc-800 ${v%4===0?'-rotate-45':''}`}/></div>
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-zinc-300 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.8)] border border-zinc-900 flex items-center justify-center"><div className={`w-full h-[1px] bg-zinc-800 ${v%5===0?'rotate-12':''}`}/></div>
      </div>
    );
  }

  if (theme === 'jungle') {
    const runeVG = [
      <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="4" />, // Diamond
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="4" />, // Circle
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="4" />, // Square
      <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="4" />, // Triangle
      <path d="M 20 50 L 80 50 M 50 20 L 50 80" stroke="currentColor" strokeWidth="4" />, // Cross
      <path d="M 30 30 Q 50 10 70 30 T 70 70 T 30 70 T 30 30" fill="none" stroke="currentColor" strokeWidth="4" />, // Curved shape
      <polygon points="50,20 80,80 20,80" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="2" />, // Solid Tri
      <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="2" />, // Solid Circle
      <rect x="30" y="30" width="40" height="40" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="2" />, // Solid Rect
      <path d="M 50 10 L 60 40 L 90 50 L 60 60 L 50 90 L 40 60 L 10 50 L 40 40 Z" fill="none" stroke="currentColor" strokeWidth="4" /> // Star
    ];

    const runeColors = [
      'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]',
      'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]',
      'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]',
      'text-lime-500 drop-shadow-[0_0_5px_rgba(132,204,22,0.8)]',
      'text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]'
    ];

    return (
      <div className="w-full h-full bg-[#4a5344] border-[4px] border-t-[#66725c] border-l-[#56614f] border-b-[#2e332a] border-r-[#383f33] relative flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 flex items-center justify-center opacity-80 animate-pulse ${runeColors[v % 5]}`}>
           <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
             {runeVG[v]}
             <circle cx="50" cy="50" r="5" fill="currentColor" />
           </svg>
        </div>
        
        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100">
          <path d={`M 0 ${10+v*5} L 30 35 L ${40-v} 10 L 60 50 L 100 ${40+v*2}`} fill="none" stroke="#1c1f19" strokeWidth="2" />
          {v % 2 === 0 && <path d="M 20 100 L 40 70 L 30 50" fill="none" stroke="#1c1f19" strokeWidth="2" />}
        </svg>

        <svg className="absolute inset-0 w-full h-full drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)]" viewBox="0 0 40 40" fill="none">
          {v % 2 !== 0 && <path d="M-5 -5 Q 15 5 10 20 Q 5 15 -5 -5 Z" fill="#14532d" />}
          {v % 3 !== 0 && <path d="M-5 -5 Q 5 15 0 25 Q -5 15 -5 -5 Z" fill="#166534" />}
          {v % 4 !== 0 && <path d="M45 -5 Q 25 5 30 20 Q 35 15 45 -5 Z" fill="#14532d" />}
          {v % 5 !== 0 && <path d="M-5 45 Q 10 30 25 45 Z" fill="#14532d" />}
          {v % 2 === 0 && <path d="M45 45 Q 30 30 15 45 Z" fill="#166534" />}
          <path d="M5 -5 Q 20 0 15 15 Q 10 5 5 -5 Z" fill="#15803d" />
        </svg>
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
