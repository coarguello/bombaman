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

  if (theme === 'ocean') {
    // Stone base colors per variant (dark underwater rocks)
    const stoneBase = [
      '#1a2a38','#162232','#1c2d3e','#152030','#1f3040','#131e2c','#1b2b3a','#17243a','#1e2f40','#141f2e'
    ];
    const stoneLightEdge = [
      '#2e4a60','#264056','#325268','#243c52','#375870','#1e3448','#2c4862','#284258','#336070','#203648'
    ];
    const stoneDarkEdge = [
      '#080e14','#060c10','#0a1018','#05090e','#0c1218','#040810','#080e16','#060a12','#0a1218','#04080e'
    ];

    const blocks = [

      // 0: CORAL BOULDER — dark rock smothered in vivid orange/pink coral branches
      <svg key="0" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="oc0" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2a4a60"/>
            <stop offset="100%" stopColor="#0a1520"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oc0)"/>
        {/* Rock cracks */}
        <path d="M30 0 L42 30 L28 60 L45 100" fill="none" stroke="#060d14" strokeWidth="3" opacity="0.8"/>
        <path d="M42 30 L65 42" fill="none" stroke="#060d14" strokeWidth="2" opacity="0.5"/>
        {/* Coral branches — orange/red */}
        <path d="M15 100 Q18 75 15 60 Q12 48 18 35" stroke="#ea580c" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M18 35 Q10 25 8 15" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M18 35 Q25 22 28 12" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M15 55 Q5 50 2 42" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M15 55 Q22 48 26 40" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Coral tips */}
        <circle cx="8" cy="15" r="3" fill="#fb923c" opacity="0.9"/>
        <circle cx="28" cy="12" r="3" fill="#fed7aa" opacity="0.8"/>
        <circle cx="2" cy="42" r="2.5" fill="#fb923c" opacity="0.9"/>
        <circle cx="26" cy="40" r="2" fill="#fed7aa" opacity="0.8"/>
        {/* Right pink coral */}
        <path d="M80 100 Q78 80 82 65 Q85 52 78 38" stroke="#db2777" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M78 38 Q72 25 75 12" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M78 38 Q88 28 92 18" stroke="#f9a8d4" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="75" cy="12" r="3" fill="#fce7f3" opacity="0.9"/>
        <circle cx="92" cy="18" r="2.5" fill="#fbcfe8" opacity="0.8"/>
        {/* Algae at base */}
        <ellipse cx="50" cy="97" rx="40" ry="6" fill="#065f46" opacity="0.7"/>
        <ellipse cx="50" cy="95" rx="25" ry="4" fill="#059669" opacity="0.5"/>
        {/* Bubble */}
        <circle cx="55" cy="30" r="3" fill="none" stroke="#bae6fd" strokeWidth="1" opacity="0.5"/>
        <circle cx="70" cy="15" r="2" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.4"/>
      </svg>,

      // 1: KELP ROCK — dark stone draped with flowing kelp strands
      <svg key="1" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="oc1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#091420"/>
            <stop offset="100%" stopColor="#1a3346"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oc1)"/>
        {/* Rock crack */}
        <path d="M60 0 L50 35 L65 65 L55 100" fill="none" stroke="#04090e" strokeWidth="2.5" opacity="0.7"/>
        {/* Kelp strands — dark green, wavy */}
        <path d="M12 100 Q16 85 10 70 Q6 55 14 40 Q18 25 12 10" stroke="#166534" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M12 100 Q16 85 10 70 Q6 55 14 40 Q18 25 12 10" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M22 100 Q26 82 20 65 Q15 50 22 35 Q27 20 22 5" stroke="#14532d" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M75 100 Q71 82 78 65 Q83 48 76 32 Q70 16 78 2" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M88 100 Q85 80 90 62 Q94 45 86 28 Q80 14 88 0" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Kelp blades (wider sections) */}
        <ellipse cx="14" cy="40" rx="8" ry="3" fill="#166534" opacity="0.8" transform="rotate(-15 14 40)"/>
        <ellipse cx="10" cy="65" rx="7" ry="2.5" fill="#14532d" opacity="0.8" transform="rotate(10 10 65)"/>
        <ellipse cx="76" cy="32" rx="7" ry="2.5" fill="#15803d" opacity="0.8" transform="rotate(20 76 32)"/>
        <ellipse cx="86" cy="55" rx="8" ry="3" fill="#166534" opacity="0.7" transform="rotate(-10 86 55)"/>
        {/* Barnacles on rock */}
        <circle cx="40" cy="50" r="4" fill="#374151" opacity="0.8"/>
        <circle cx="40" cy="50" r="2" fill="#6b7280" opacity="0.6"/>
        <circle cx="50" cy="35" r="3" fill="#374151" opacity="0.7"/>
        <circle cx="50" cy="35" r="1.5" fill="#9ca3af" opacity="0.5"/>
        {/* Bubbles */}
        <circle cx="35" cy="20" r="2.5" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.45"/>
        <circle cx="45" cy="8" r="1.8" fill="none" stroke="#e0f2fe" strokeWidth="0.7" opacity="0.4"/>
        <circle cx="60" cy="25" r="2" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.35"/>
      </svg>,

      // 2: BARNACLE ROCK — rough stone completely covered in barnacle clusters
      <svg key="2" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="oc2" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#243848"/>
            <stop offset="100%" stopColor="#08121c"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oc2)"/>
        {/* Rock crack */}
        <path d="M20 0 L35 28 L22 60 L38 100" fill="none" stroke="#050b12" strokeWidth="3" opacity="0.8"/>
        {/* Barnacle clusters — grey/white cone shapes */}
        {[
          [15,20],[30,15],[50,22],[68,18],[82,25],
          [10,42],[28,48],[45,45],[62,50],[80,44],
          [18,65],[35,70],[55,68],[72,72],[88,65],
          [22,85],[40,90],[60,88],[78,85]
        ].map(([cx,cy], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={5-i%2} ry={7-i%2} fill="#4b5563" opacity="0.85"/>
            <ellipse cx={cx} cy={cy-2} rx={3} ry={2} fill="#9ca3af" opacity="0.6"/>
            <line x1={cx-2} y1={cy-4} x2={cx+2} y2={cy-4} stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
          </g>
        ))}
        {/* Algae patches between barnacles */}
        <ellipse cx="50" cy="55" rx="10" ry="6" fill="#064e3b" opacity="0.4"/>
        <ellipse cx="30" cy="78" rx="8" ry="5" fill="#065f46" opacity="0.4"/>
        {/* Water shimmer */}
        <ellipse cx="50" cy="8" rx="42" ry="6" fill="white" opacity="0.03"/>
        {/* Bubbles */}
        <circle cx="55" cy="15" r="2" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.4"/>
        <circle cx="70" cy="5" r="1.5" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.35"/>
      </svg>,

      // 3: SEA ANEMONE ROCK — dark rock with vivid red/purple anemone tentacles
      <svg key="3" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="oc3" cx="45%" cy="55%" r="65%">
            <stop offset="0%" stopColor="#1e3040"/>
            <stop offset="100%" stopColor="#07111c"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oc3)"/>
        {/* Stone crack */}
        <path d="M70 0 L60 30 L75 65 L62 100" fill="none" stroke="#040a10" strokeWidth="2.5" opacity="0.7"/>
        {/* Anemone base */}
        <ellipse cx="25" cy="85" rx="18" ry="8" fill="#7f1d1d" opacity="0.8"/>
        <ellipse cx="25" cy="83" rx="12" ry="5" fill="#991b1b" opacity="0.7"/>
        {/* Anemone tentacles — wavy upward */}
        {[10,15,20,25,30,35,40].map((x, i) => (
          <path key={i} d={`M${x} 83 Q${x+(i%2?3:-3)} ${70-i*3} ${x+(i%2?2:-2)} ${58-i*2}`}
            stroke={i%2?"#dc2626":"#be185d"} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        ))}
        {/* Tentacle tips */}
        {[10,15,20,25,30,35,40].map((x, i) => (
          <ellipse key={i} cx={x+(i%2?2:-2)} cy={58-i*2} rx="3" ry="2"
            fill={i%2?"#fca5a5":"#fbcfe8"} opacity="0.9"/>
        ))}
        {/* Second anemone — smaller, purple */}
        <ellipse cx="75" cy="70" rx="14" ry="6" fill="#4c1d95" opacity="0.8"/>
        {[65,70,75,80,85].map((x, i) => (
          <path key={i} d={`M${x} 68 Q${x+(i%2?2:-2)} ${58-i*2} ${x+(i%2?1:-1)} ${48-i*2}`}
            stroke={i%2?"#7c3aed":"#a855f7"} strokeWidth="2" fill="none" strokeLinecap="round"/>
        ))}
        {[65,70,75,80,85].map((x, i) => (
          <ellipse key={i} cx={x+(i%2?1:-1)} cy={48-i*2} rx="2.5" ry="1.8"
            fill={i%2?"#c4b5fd":"#e9d5ff"} opacity="0.9"/>
        ))}
        {/* Coral accent */}
        <path d="M50 100 Q52 88 48 78 Q44 68 50 58" stroke="#0891b2" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="58" r="3" fill="#67e8f9" opacity="0.8"/>
        {/* Bubbles */}
        <circle cx="30" cy="40" r="2.5" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="45" cy="25" r="2" fill="none" stroke="#e0f2fe" strokeWidth="0.7" opacity="0.4"/>
        <circle cx="15" cy="15" r="1.5" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.35"/>
      </svg>,

      // 4: STARFISH ROCK — volcanic ocean rock with starfish and urchins
      <svg key="4" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="oc4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1c3040"/>
            <stop offset="100%" stopColor="#06101a"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oc4)"/>
        {/* Crack */}
        <path d="M40 0 L32 25 L48 50 L35 80 L45 100" fill="none" stroke="#040c14" strokeWidth="3" opacity="0.8"/>
        {/* Starfish — orange, 5 arms */}
        {[0,1,2,3,4].map(i => {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const cx = 30, cy = 35, r = 14;
          return <path key={i} d={`M${cx} ${cy} L${cx + r*Math.cos(angle)} ${cy + r*Math.sin(angle)}`}
            stroke="#f97316" strokeWidth="8" strokeLinecap="round" opacity="0.9"/>;
        })}
        <circle cx="30" cy="35" r="6" fill="#fb923c" opacity="0.9"/>
        <circle cx="30" cy="35" r="3" fill="#fed7aa" opacity="0.7"/>
        {/* Sea urchin — dark spiky ball */}
        <circle cx="72" cy="68" r="10" fill="#1f2937" opacity="0.9"/>
        <circle cx="72" cy="68" r="7" fill="#374151" opacity="0.8"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
          const angle = deg * Math.PI / 180;
          return <line key={i} x1={72 + 7*Math.cos(angle)} y1={68 + 7*Math.sin(angle)}
            x2={72 + 14*Math.cos(angle)} y2={68 + 14*Math.sin(angle)}
            stroke="#9ca3af" strokeWidth="1.2" opacity="0.7"/>;
        })}
        {/* Algae */}
        <ellipse cx="55" cy="95" rx="30" ry="6" fill="#064e3b" opacity="0.6"/>
        <path d="M20 95 Q22 80 18 68 Q15 58 20 48" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M85 95 Q83 78 87 62" stroke="#065f46" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Bubbles */}
        <circle cx="60" cy="20" r="3" fill="none" stroke="#bae6fd" strokeWidth="1" opacity="0.5"/>
        <circle cx="80" cy="35" r="2" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.4"/>
        <circle cx="50" cy="8" r="2.5" fill="none" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.35"/>
      </svg>,

      // 5: BIOLUMINESCENT DEEP ROCK — pitch-black abyssal stone with glowing patches
      <svg key="5" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="oc5" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0e1f2c"/>
            <stop offset="100%" stopColor="#030810"/>
          </radialGradient>
          <filter id="glow5">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#oc5)"/>
        {/* Deep cracks */}
        <path d="M50 0 L38 30 L55 60 L40 100" fill="none" stroke="#020508" strokeWidth="4" opacity="0.9"/>
        <path d="M38 30 L15 45" fill="none" stroke="#020508" strokeWidth="2.5" opacity="0.6"/>
        {/* Bioluminescent cyan patches */}
        <ellipse cx="20" cy="30" rx="15" ry="10" fill="#0e7490" opacity="0.6"/>
        <ellipse cx="20" cy="30" rx="8" ry="5" fill="#06b6d4" opacity="0.5" filter="url(#glow5)"/>
        <ellipse cx="20" cy="30" rx="4" ry="2.5" fill="#67e8f9" opacity="0.7" filter="url(#glow5)"/>
        {/* Bioluminescent blue patches */}
        <ellipse cx="78" cy="55" rx="14" ry="9" fill="#1d4ed8" opacity="0.5"/>
        <ellipse cx="78" cy="55" rx="7" ry="4.5" fill="#3b82f6" opacity="0.5" filter="url(#glow5)"/>
        <ellipse cx="78" cy="55" rx="3" ry="2" fill="#93c5fd" opacity="0.8" filter="url(#glow5)"/>
        {/* Green glow at bottom */}
        <ellipse cx="50" cy="92" rx="35" ry="10" fill="#065f46" opacity="0.6"/>
        <ellipse cx="50" cy="94" rx="20" ry="6" fill="#10b981" opacity="0.4" filter="url(#glow5)"/>
        {/* Tiny glowing dots */}
        <circle cx="62" cy="18" r="2" fill="#67e8f9" opacity="0.8" filter="url(#glow5)"/>
        <circle cx="30" cy="70" r="2.5" fill="#34d399" opacity="0.7" filter="url(#glow5)"/>
        <circle cx="85" cy="22" r="1.8" fill="#818cf8" opacity="0.8" filter="url(#glow5)"/>
        <circle cx="15" cy="78" r="2" fill="#06b6d4" opacity="0.7" filter="url(#glow5)"/>
        {/* Crack glow */}
        <path d="M50 0 L38 30 L55 60" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" filter="url(#glow5)"/>
        {/* Bubbles */}
        <circle cx="25" cy="10" r="3" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="65" cy="5" r="2" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.4"/>
      </svg>,

      // 6: MOSSY ANCHOR ROCK — stone with algae, clams, and an old rusted anchor
      <svg key="6" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="oc6" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#22384c"/>
            <stop offset="100%" stopColor="#080f18"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oc6)"/>
        {/* Crack */}
        <path d="M25 0 L38 35 L25 70 L38 100" fill="none" stroke="#050c14" strokeWidth="3" opacity="0.7"/>
        {/* Old rusted anchor — center */}
        <line x1="60" y1="15" x2="60" y2="70" stroke="#92400e" strokeWidth="5" strokeLinecap="round"/>
        <line x1="48" y1="25" x2="72" y2="25" stroke="#92400e" strokeWidth="4" strokeLinecap="round"/>
        <path d="M60 70 Q48 75 46 85 M60 70 Q72 75 74 85" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="60" cy="15" r="6" fill="none" stroke="#92400e" strokeWidth="4"/>
        {/* Rust patches */}
        <ellipse cx="60" cy="45" rx="4" ry="6" fill="#7c2d12" opacity="0.5"/>
        <ellipse cx="60" cy="25" rx="5" ry="3" fill="#78350f" opacity="0.4"/>
        {/* Clams */}
        <ellipse cx="20" cy="75" rx="10" ry="6" fill="#374151" opacity="0.9"/>
        <path d="M10 75 Q20 68 30 75" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
        <ellipse cx="78" cy="82" rx="8" ry="5" fill="#4b5563" opacity="0.9"/>
        <path d="M70 82 Q78 76 86 82" stroke="#9ca3af" strokeWidth="1.2" fill="none"/>
        {/* Algae base */}
        <ellipse cx="50" cy="97" rx="42" ry="5" fill="#064e3b" opacity="0.7"/>
        <path d="M10 95 Q12 82 8 70 Q6 60 12 50" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Bubbles */}
        <circle cx="48" cy="10" r="2" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="35" cy="5" r="1.5" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.4"/>
      </svg>,

      // 7: CRYSTAL ROCK — underwater geode with blue/teal crystal formations
      <svg key="7" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="oc7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2f40"/>
            <stop offset="100%" stopColor="#070e16"/>
          </linearGradient>
          <filter id="glow7">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#oc7)"/>
        {/* Rock crack - geode opening */}
        <path d="M30 0 L45 30 L30 65 L45 100" fill="none" stroke="#04090e" strokeWidth="3.5" opacity="0.8"/>
        {/* Geode cavity - dark center */}
        <ellipse cx="50" cy="50" rx="22" ry="28" fill="#050d14" opacity="0.7"/>
        {/* Crystal clusters inside */}
        <polygon points="40,72 36,45 44,45" fill="#0891b2" opacity="0.9"/>
        <polygon points="40,72 44,45 48,45" fill="#06b6d4" opacity="0.8"/>
        <polygon points="50,70 46,40 54,40" fill="#22d3ee" opacity="0.9" filter="url(#glow7)"/>
        <polygon points="50,70 54,40 58,40" fill="#67e8f9" opacity="0.8"/>
        <polygon points="60,72 56,48 64,48" fill="#0e7490" opacity="0.9"/>
        <polygon points="60,72 64,48 68,48" fill="#0891b2" opacity="0.7"/>
        <polygon points="44,68 41,52 47,52" fill="#a5f3fc" opacity="0.7" filter="url(#glow7)"/>
        <polygon points="56,68 53,52 59,52" fill="#a5f3fc" opacity="0.7" filter="url(#glow7)"/>
        {/* Crystal glow */}
        <ellipse cx="50" cy="52" rx="14" ry="16" fill="#06b6d4" opacity="0.1" filter="url(#glow7)"/>
        {/* Barnacles on outer rock */}
        <circle cx="12" cy="30" r="4" fill="#374151" opacity="0.8"/>
        <circle cx="12" cy="30" r="2" fill="#9ca3af" opacity="0.6"/>
        <circle cx="88" cy="70" r="3.5" fill="#374151" opacity="0.8"/>
        <circle cx="88" cy="70" r="1.8" fill="#9ca3af" opacity="0.5"/>
        {/* Bubbles */}
        <circle cx="25" cy="18" r="3" fill="none" stroke="#bae6fd" strokeWidth="1" opacity="0.5"/>
        <circle cx="75" cy="10" r="2" fill="none" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.45"/>
        <circle cx="85" cy="25" r="1.5" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.35"/>
      </svg>,

      // 8: SHIPWRECK ROCK — stone merged with old wood planks and rope
      <svg key="8" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="oc8" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1d3044"/>
            <stop offset="100%" stopColor="#081220"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oc8)"/>
        {/* Rock cracks */}
        <path d="M15 0 L28 25 L15 55 L30 100" fill="none" stroke="#040c14" strokeWidth="3" opacity="0.8"/>
        {/* Old wooden planks embedded in rock */}
        <rect x="42" y="10" width="40" height="8" rx="1" fill="#78350f" opacity="0.85" transform="rotate(-5 62 14)"/>
        <rect x="45" y="22" width="38" height="7" rx="1" fill="#92400e" opacity="0.8" transform="rotate(-3 64 25)"/>
        <rect x="40" y="34" width="35" height="6" rx="1" fill="#78350f" opacity="0.75" transform="rotate(-6 57 37)"/>
        {/* Plank grain lines */}
        <line x1="50" y1="11" x2="50" y2="17" stroke="#451a03" strokeWidth="0.8" opacity="0.5" transform="rotate(-5 50 14)"/>
        <line x1="62" y1="11" x2="62" y2="17" stroke="#451a03" strokeWidth="0.8" opacity="0.5" transform="rotate(-5 62 14)"/>
        {/* Iron nails */}
        <circle cx="47" cy="14" r="2" fill="#374151" opacity="0.9"/>
        <circle cx="78" cy="13" r="2" fill="#374151" opacity="0.9"/>
        <circle cx="49" cy="26" r="2" fill="#4b5563" opacity="0.8"/>
        {/* Rope wrapped around */}
        <path d="M35 50 Q50 45 65 50 Q80 55 95 50" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8"/>
        <path d="M35 55 Q50 50 65 55 Q80 60 95 55" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
        {/* Algae growth on planks */}
        <ellipse cx="60" cy="14" rx="8" ry="3" fill="#065f46" opacity="0.4"/>
        <ellipse cx="55" cy="26" rx="6" ry="2.5" fill="#064e3b" opacity="0.4"/>
        {/* Bottom algae */}
        <ellipse cx="50" cy="97" rx="42" ry="5" fill="#064e3b" opacity="0.7"/>
        {/* Bubbles */}
        <circle cx="25" cy="35" r="2.5" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="20" cy="20" r="1.8" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.4"/>
        <circle cx="35" cy="8" r="2" fill="none" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.35"/>
      </svg>,

      // 9: DEEP VENT ROCK — hydrothermal rock with glowing orange vents and mineral deposits
      <svg key="9" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="oc9" cx="50%" cy="60%" r="65%">
            <stop offset="0%" stopColor="#1c2a36"/>
            <stop offset="100%" stopColor="#060d14"/>
          </radialGradient>
          <filter id="glow9b">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#oc9)"/>
        {/* Rock cracks */}
        <path d="M60 0 L48 30 L62 60 L50 100" fill="none" stroke="#030a10" strokeWidth="3" opacity="0.8"/>
        <path d="M48 30 L20 40" fill="none" stroke="#030a10" strokeWidth="2" opacity="0.6"/>
        {/* Vent openings */}
        <ellipse cx="30" cy="70" rx="10" ry="7" fill="#0c0604" opacity="0.9"/>
        <ellipse cx="30" cy="70" rx="6" ry="4" fill="#1c0a06" opacity="0.8"/>
        <ellipse cx="70" cy="55" rx="8" ry="6" fill="#0c0604" opacity="0.9"/>
        <ellipse cx="70" cy="55" rx="5" ry="3.5" fill="#1c0a06" opacity="0.8"/>
        {/* Vent glow — hot orange */}
        <ellipse cx="30" cy="70" rx="8" ry="5" fill="#ea580c" opacity="0.3" filter="url(#glow9b)"/>
        <ellipse cx="70" cy="55" rx="6" ry="4" fill="#f97316" opacity="0.3" filter="url(#glow9b)"/>
        {/* Smoke/steam from vents */}
        <path d="M28 65 Q25 55 27 45 Q29 35 26 25" stroke="#d1d5db" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.2"/>
        <path d="M32 64 Q35 52 32 40" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.15"/>
        <path d="M70 50 Q67 38 69 28 Q71 18 68 8" stroke="#d1d5db" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.2"/>
        {/* Mineral deposits — yellow/white sulfur */}
        <ellipse cx="18" cy="40" rx="10" ry="6" fill="#854d0e" opacity="0.7"/>
        <ellipse cx="18" cy="40" rx="6" ry="3.5" fill="#d97706" opacity="0.5"/>
        <ellipse cx="82" cy="30" rx="9" ry="5" fill="#78350f" opacity="0.6"/>
        <ellipse cx="82" cy="30" rx="5" ry="3" fill="#b45309" opacity="0.45"/>
        {/* White mineral veins */}
        <path d="M0 35 Q25 32 40 38" stroke="#e5e7eb" strokeWidth="1" fill="none" opacity="0.2"/>
        <path d="M55 28 Q75 25 100 30" stroke="#f3f4f6" strokeWidth="1" fill="none" opacity="0.2"/>
        {/* Tube worms near vent */}
        <rect x="22" y="55" width="3" height="14" rx="1.5" fill="#b45309" opacity="0.8"/>
        <rect x="27" y="58" width="3" height="12" rx="1.5" fill="#92400e" opacity="0.8"/>
        <ellipse cx="23.5" cy="55" rx="3" ry="2" fill="#dc2626" opacity="0.7"/>
        <ellipse cx="28.5" cy="58" rx="3" ry="2" fill="#b91c1c" opacity="0.7"/>
      </svg>,
    ];

    return (
      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          backgroundColor: stoneBase[v],
          borderTop: `4px solid ${stoneLightEdge[v]}`,
          borderLeft: `4px solid ${stoneLightEdge[v]}`,
          borderBottom: `4px solid ${stoneDarkEdge[v]}`,
          borderRight: `4px solid ${stoneDarkEdge[v]}`,
        }}
      >
        {blocks[v]}
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
