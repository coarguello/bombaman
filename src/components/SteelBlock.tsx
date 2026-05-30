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
    // 10 hyper-realistic jungle rock variants — stone base + layered organic vegetation

    // Stone base colors per variant (dark mossy rocks)
    const stoneBase = [
      '#2e3529','#323a2c','#2c3427','#35402e','#303830','#2a3226','#363e30','#2d372a','#323b2d','#2b3428'
    ];
    const stoneLightEdge = [
      '#4a5542','#4f5c46','#475240','#56644a','#4c5a4c','#445040','#57614a','#4a5843','#4f5d46','#455241'
    ];
    const stoneDarkEdge = [
      '#181e15','#1a2018','#171d14','#1c221a','#191f19','#161c14','#1d2119','#181f16','#1a2017','#171c15'
    ];

    const blocks = [

      // 0: MOSSY BOULDER — thick green moss carpet on a cracked dark stone
      <svg key="0" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="stone0" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a5542"/>
            <stop offset="100%" stopColor="#1e2419"/>
          </radialGradient>
        </defs>
        {/* Stone body */}
        <rect width="100" height="100" fill="url(#stone0)"/>
        {/* Main cracks */}
        <path d="M20 0 L35 28 L22 55 L40 100" fill="none" stroke="#111" strokeWidth="2.5" opacity="0.8"/>
        <path d="M35 28 L55 40" fill="none" stroke="#111" strokeWidth="1.5" opacity="0.6"/>
        {/* Wet sheen top-left */}
        <ellipse cx="28" cy="22" rx="18" ry="12" fill="white" opacity="0.04"/>
        {/* Moss carpet — heavy top coverage */}
        <ellipse cx="12" cy="8" rx="16" ry="11" fill="#1a5c2a" opacity="0.95"/>
        <ellipse cx="38" cy="5" rx="18" ry="10" fill="#166534" opacity="0.95"/>
        <ellipse cx="62" cy="7" rx="16" ry="11" fill="#15803d" opacity="0.95"/>
        <ellipse cx="85" cy="9" rx="14" ry="10" fill="#1a5c2a" opacity="0.9"/>
        <ellipse cx="10" cy="20" rx="10" ry="8" fill="#14532d" opacity="0.8"/>
        <ellipse cx="70" cy="18" rx="12" ry="7" fill="#166534" opacity="0.7"/>
        {/* Moss textures - bumps */}
        <circle cx="15" cy="6" r="3" fill="#22c55e" opacity="0.3"/>
        <circle cx="38" cy="4" r="4" fill="#4ade80" opacity="0.2"/>
        <circle cx="60" cy="5" r="3" fill="#22c55e" opacity="0.25"/>
        {/* Water drip */}
        <path d="M35 15 Q36 28 35 38 Q34 45 36 55" stroke="#93c5fd" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <ellipse cx="36" cy="56" rx="2" ry="3" fill="#bfdbfe" opacity="0.3"/>
      </svg>,

      // 1: VINE-WRAPPED STONE — thick vines coiling around a rough stone block
      <svg key="1" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="stone1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#404b38"/>
            <stop offset="100%" stopColor="#1e2419"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone1)"/>
        {/* Stone cracks */}
        <path d="M60 0 L50 30 L70 60 L55 100" fill="none" stroke="#0f130d" strokeWidth="3" opacity="0.7"/>
        <path d="M50 30 L30 45" fill="none" stroke="#0f130d" strokeWidth="1.5" opacity="0.5"/>
        {/* Left vine main stem */}
        <path d="M8 0 Q12 25 8 50 Q5 75 10 100" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M8 0 Q12 25 8 50 Q5 75 10 100" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"/>
        {/* Left vine leaves */}
        <path d="M8 18 Q-5 14 -2 8 Q4 12 8 18Z" fill="#15803d"/>
        <path d="M8 18 Q18 10 20 4 Q14 10 8 18Z" fill="#16a34a"/>
        <path d="M8 38 Q-4 32 -3 26 Q3 32 8 38Z" fill="#14532d"/>
        <path d="M8 55 Q-6 48 -5 40 Q2 48 8 55Z" fill="#15803d"/>
        <path d="M8 55 Q20 50 22 42 Q15 50 8 55Z" fill="#166534"/>
        <path d="M9 75 Q0 68 2 60 Q7 68 9 75Z" fill="#15803d"/>
        {/* Right vine */}
        <path d="M90 0 Q86 30 90 60 Q93 80 88 100" stroke="#1a5c2a" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M90 22 Q100 16 98 10 Q94 16 90 22Z" fill="#15803d"/>
        <path d="M90 45 Q102 38 100 30 Q95 38 90 45Z" fill="#166534"/>
        <path d="M90 68 Q102 60 100 54 Q94 62 90 68Z" fill="#14532d"/>
        {/* Top moss */}
        <ellipse cx="50" cy="4" rx="35" ry="8" fill="#166534" opacity="0.8"/>
        <ellipse cx="50" cy="4" rx="20" ry="5" fill="#16a34a" opacity="0.6"/>
      </svg>,

      // 2: CRACKED ANCIENT STONE — deep cracks with glowing moss inside them
      <svg key="2" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="stone2" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#3d4835"/>
            <stop offset="100%" stopColor="#1a1f17"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone2)"/>
        {/* Major cracks */}
        <path d="M15 0 L30 22 L18 48 L35 70 L20 100" fill="none" stroke="#0d1109" strokeWidth="4" opacity="0.9"/>
        <path d="M30 22 L60 30 L85 20" fill="none" stroke="#0d1109" strokeWidth="3" opacity="0.7"/>
        <path d="M60 30 L72 55 L90 70" fill="none" stroke="#0d1109" strokeWidth="2.5" opacity="0.6"/>
        {/* Glowing moss inside cracks */}
        <path d="M15 0 L30 22 L18 48 L35 70 L20 100" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.35"/>
        <path d="M30 22 L60 30 L85 20" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.25"/>
        {/* Lichen patches */}
        <ellipse cx="72" cy="60" rx="14" ry="10" fill="#4d7c0f" opacity="0.7"/>
        <ellipse cx="72" cy="60" rx="8" ry="6" fill="#65a30d" opacity="0.6"/>
        <circle cx="72" cy="60" r="3" fill="#84cc16" opacity="0.5"/>
        <ellipse cx="20" cy="75" rx="12" ry="9" fill="#3f6212" opacity="0.6"/>
        <ellipse cx="55" cy="85" rx="15" ry="8" fill="#4d7c0f" opacity="0.5"/>
        {/* Top wet surface */}
        <rect x="0" y="0" width="100" height="6" fill="#22c55e" opacity="0.15"/>
        <ellipse cx="50" cy="3" rx="42" ry="4" fill="white" opacity="0.04"/>
        {/* Water in cracks */}
        <path d="M30 22 L60 30" stroke="#7dd3fc" strokeWidth="0.8" opacity="0.4"/>
        <path d="M35 70 L20 100" stroke="#93c5fd" strokeWidth="0.7" opacity="0.3"/>
      </svg>,

      // 3: MUSHROOM ROCK — stone covered with tiny jungle mushrooms and heavy bottom moss
      <svg key="3" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="stone3" x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#424e3a"/>
            <stop offset="100%" stopColor="#1d2319"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone3)"/>
        {/* Crack */}
        <path d="M50 0 L45 35 L60 70 L50 100" fill="none" stroke="#111" strokeWidth="2" opacity="0.6"/>
        {/* Bottom heavy moss */}
        <ellipse cx="15" cy="96" rx="18" ry="10" fill="#166534" opacity="0.95"/>
        <ellipse cx="42" cy="98" rx="20" ry="9" fill="#15803d" opacity="0.95"/>
        <ellipse cx="68" cy="97" rx="18" ry="9" fill="#14532d" opacity="0.9"/>
        <ellipse cx="90" cy="96" rx="14" ry="9" fill="#166534" opacity="0.9"/>
        <ellipse cx="50" cy="88" rx="40" ry="8" fill="#1a5c2a" opacity="0.5"/>
        {/* Mushroom 1 */}
        <ellipse cx="22" cy="62" rx="9" ry="5" fill="#c2410c" opacity="0.9"/>
        <ellipse cx="22" cy="62" rx="6" ry="3" fill="#ea580c" opacity="0.7"/>
        <circle cx="22" cy="62" r="2" fill="#fed7aa" opacity="0.5"/>
        <rect x="20" y="62" width="4" height="9" rx="2" fill="#f5f0e8" opacity="0.8"/>
        {/* Mushroom 2 */}
        <ellipse cx="55" cy="45" rx="7" ry="4" fill="#92400e" opacity="0.9"/>
        <ellipse cx="55" cy="45" rx="4" ry="2.5" fill="#b45309" opacity="0.7"/>
        <rect x="53" y="45" width="3" height="7" rx="1.5" fill="#fef3c7" opacity="0.8"/>
        {/* Mushroom 3 */}
        <ellipse cx="78" cy="72" rx="8" ry="4.5" fill="#7c2d12" opacity="0.9"/>
        <rect x="76" y="72" width="4" height="8" rx="2" fill="#f5f0e8" opacity="0.8"/>
        {/* White spots on mushrooms */}
        <circle cx="20" cy="61" r="1.2" fill="white" opacity="0.7"/>
        <circle cx="24" cy="63" r="1" fill="white" opacity="0.6"/>
        <circle cx="75" cy="72" r="1" fill="white" opacity="0.6"/>
        <circle cx="80" cy="73" r="0.8" fill="white" opacity="0.5"/>
        {/* Moss patches */}
        <ellipse cx="35" cy="30" rx="10" ry="7" fill="#166534" opacity="0.5"/>
        <ellipse cx="80" cy="35" rx="9" ry="6" fill="#15803d" opacity="0.4"/>
      </svg>,

      // 4: FERN-COVERED STONE — large tropical fern fronds cascading over the rock
      <svg key="4" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="stone4" cx="60%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#3e4a36"/>
            <stop offset="100%" stopColor="#1b2018"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone4)"/>
        {/* Stone crack */}
        <path d="M80 0 L68 30 L80 60 L65 100" fill="none" stroke="#0e1209" strokeWidth="2.5" opacity="0.7"/>
        {/* Main fern stems from bottom-left */}
        <path d="M5 100 Q10 70 25 50" stroke="#166534" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M0 100 Q15 65 35 40" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M10 100 Q5 75 15 55" stroke="#14532d" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Fern fronds left side */}
        <path d="M10 85 Q-5 78 -6 70 Q4 76 10 85Z" fill="#15803d"/>
        <path d="M10 85 Q22 76 24 68 Q16 76 10 85Z" fill="#16a34a"/>
        <path d="M12 72 Q0 65 -2 56 Q6 64 12 72Z" fill="#14532d"/>
        <path d="M18 58 Q6 50 5 42 Q12 50 18 58Z" fill="#15803d"/>
        <path d="M18 58 Q28 48 30 40 Q23 50 18 58Z" fill="#166534"/>
        <path d="M22 46 Q10 38 10 30 Q17 38 22 46Z" fill="#16a34a"/>
        <path d="M25 52 Q35 42 38 34 Q30 44 25 52Z" fill="#15803d"/>
        {/* Right fern */}
        <path d="M100 100 Q88 72 70 52" stroke="#1a5c2a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M88 75 Q100 68 101 60 Q94 68 88 75Z" fill="#15803d"/>
        <path d="M80 62 Q92 55 92 46 Q85 55 80 62Z" fill="#166534"/>
        {/* Leaf veins */}
        <path d="M10 85 L18 76" stroke="#22c55e" strokeWidth="0.6" opacity="0.4"/>
        <path d="M12 72 L20 64" stroke="#22c55e" strokeWidth="0.6" opacity="0.4"/>
        {/* Dew drops */}
        <circle cx="24" cy="68" r="1.5" fill="#bfdbfe" opacity="0.6"/>
        <circle cx="30" cy="40" r="1.2" fill="#bfdbfe" opacity="0.5"/>
      </svg>,

      // 5: WATER-SOAKED ROCK — glistening wet stone with algae and water drips
      <svg key="5" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="stone5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a4532"/>
            <stop offset="100%" stopColor="#161c13"/>
          </linearGradient>
          <linearGradient id="wet5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone5)"/>
        {/* Wet overlay */}
        <rect width="100" height="100" fill="url(#wet5)"/>
        {/* Cracks */}
        <path d="M40 0 L32 20 L48 45 L30 80 L42 100" fill="none" stroke="#0c100a" strokeWidth="3" opacity="0.8"/>
        <path d="M32 20 L10 35" fill="none" stroke="#0c100a" strokeWidth="2" opacity="0.5"/>
        {/* Algae patches — yellowish-green */}
        <ellipse cx="70" cy="25" rx="18" ry="12" fill="#65a30d" opacity="0.55"/>
        <ellipse cx="70" cy="25" rx="10" ry="7" fill="#84cc16" opacity="0.4"/>
        <ellipse cx="18" cy="60" rx="16" ry="11" fill="#4d7c0f" opacity="0.5"/>
        <ellipse cx="80" cy="70" rx="14" ry="9" fill="#65a30d" opacity="0.45"/>
        {/* Water drips - multiple streams */}
        <path d="M25 0 Q26 15 25 30 Q24 45 26 60" stroke="#93c5fd" strokeWidth="1.2" fill="none" opacity="0.5"/>
        <ellipse cx="25.5" cy="61" rx="2.5" ry="3.5" fill="#bfdbfe" opacity="0.45"/>
        <path d="M60 0 Q61 20 60 40 Q59 58 61 75" stroke="#7dd3fc" strokeWidth="1" fill="none" opacity="0.45"/>
        <ellipse cx="60.5" cy="76" rx="2" ry="3" fill="#bfdbfe" opacity="0.4"/>
        <path d="M82 10 Q83 28 81 45" stroke="#93c5fd" strokeWidth="0.8" fill="none" opacity="0.4"/>
        {/* Wet highlight top */}
        <ellipse cx="50" cy="8" rx="40" ry="7" fill="white" opacity="0.06"/>
        {/* Small moss tufts */}
        <circle cx="55" cy="60" r="5" fill="#166534" opacity="0.6"/>
        <circle cx="55" cy="60" r="3" fill="#16a34a" opacity="0.5"/>
        <circle cx="12" cy="18" r="4" fill="#15803d" opacity="0.55"/>
      </svg>,

      // 6: LICHEN-ENCRUSTED ROCK — pale grey-green lichen spreading across dark stone
      <svg key="6" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="stone6" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#3b4633"/>
            <stop offset="100%" stopColor="#181e14"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone6)"/>
        {/* Fine stone texture lines */}
        <path d="M0 30 Q50 28 100 32" fill="none" stroke="#232a1e" strokeWidth="1" opacity="0.4"/>
        <path d="M0 60 Q50 58 100 62" fill="none" stroke="#232a1e" strokeWidth="1" opacity="0.3"/>
        {/* Main crack */}
        <path d="M70 0 L58 35 L72 70 L60 100" fill="none" stroke="#0e1209" strokeWidth="3" opacity="0.7"/>
        {/* Lichen patches — pale lime/grey-green */}
        <ellipse cx="20" cy="35" rx="22" ry="16" fill="#7c9a2e" opacity="0.6"/>
        <ellipse cx="20" cy="35" rx="14" ry="10" fill="#a3c644" opacity="0.45"/>
        <ellipse cx="20" cy="35" rx="7" ry="5" fill="#bdd860" opacity="0.35"/>
        <ellipse cx="75" cy="55" rx="18" ry="14" fill="#6e8c28" opacity="0.55"/>
        <ellipse cx="75" cy="55" rx="10" ry="8" fill="#96b83a" opacity="0.4"/>
        <ellipse cx="40" cy="80" rx="20" ry="12" fill="#7c9a2e" opacity="0.5"/>
        <ellipse cx="40" cy="80" rx="11" ry="7" fill="#a3c644" opacity="0.4"/>
        {/* Tiny lichen spots */}
        <circle cx="50" cy="18" r="4" fill="#8fb030" opacity="0.5"/>
        <circle cx="90" cy="22" r="3" fill="#7c9a2e" opacity="0.55"/>
        <circle cx="8" cy="75" r="5" fill="#8fb030" opacity="0.5"/>
        <circle cx="88" cy="85" r="4" fill="#7c9a2e" opacity="0.45"/>
        {/* Dark patches between lichen */}
        <circle cx="50" cy="50" r="6" fill="#111508" opacity="0.4"/>
        {/* Light highlight */}
        <ellipse cx="35" cy="18" rx="15" ry="8" fill="white" opacity="0.04"/>
      </svg>,

      // 7: ROOT-INVADED STONE — tree roots cracking and growing through the rock
      <svg key="7" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="stone7" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#3f4a36"/>
            <stop offset="100%" stopColor="#1a2016"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone7)"/>
        {/* Crack lines around roots */}
        <path d="M20 0 L28 15" fill="none" stroke="#0c0f09" strokeWidth="2.5" opacity="0.7"/>
        <path d="M50 0 L45 20 L50 40 L42 65 L50 100" fill="none" stroke="#0c0f09" strokeWidth="2" opacity="0.6"/>
        {/* Main thick root from top-left */}
        <path d="M5 0 Q20 20 15 45 Q10 65 25 85 Q35 95 50 100" stroke="#7c5c3a" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M5 0 Q20 20 15 45 Q10 65 25 85 Q35 95 50 100" stroke="#a07850" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5"/>
        {/* Root branch 1 */}
        <path d="M15 45 Q35 42 55 50" stroke="#7c5c3a" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M15 45 Q35 42 55 50" stroke="#96704a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45"/>
        {/* Root branch 2 */}
        <path d="M55 50 Q70 48 85 55 Q95 62 100 75" stroke="#6b4e32" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Root branch 3 */}
        <path d="M25 85 Q40 80 60 85" stroke="#7c5c3a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Thin secondary roots */}
        <path d="M20 30 Q30 25 38 30" stroke="#8b6840" strokeWidth="2" fill="none" opacity="0.6"/>
        <path d="M55 70 Q68 65 78 70" stroke="#7c5c3a" strokeWidth="2" fill="none" opacity="0.6"/>
        {/* Moss around roots */}
        <ellipse cx="8" cy="35" rx="8" ry="5" fill="#15803d" opacity="0.55"/>
        <ellipse cx="28" cy="78" rx="9" ry="5" fill="#166534" opacity="0.5"/>
        <ellipse cx="80" cy="68" rx="8" ry="5" fill="#14532d" opacity="0.5"/>
        {/* Root bark texture marks */}
        <path d="M8 12 Q10 8 12 12" stroke="#6b4e32" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M12 28 Q14 24 16 28" stroke="#6b4e32" strokeWidth="0.8" fill="none" opacity="0.4"/>
      </svg>,

      // 8: OVERGROWN RUIN STONE — ancient carved stone buried under tropical growth
      <svg key="8" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="stone8" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#404b38"/>
            <stop offset="100%" stopColor="#1c2319"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#stone8)"/>
        {/* Ancient carved lines (horizontal) */}
        <line x1="0" y1="33" x2="100" y2="33" stroke="#252c20" strokeWidth="2" opacity="0.5"/>
        <line x1="0" y1="66" x2="100" y2="66" stroke="#252c20" strokeWidth="2" opacity="0.5"/>
        <line x1="33" y1="0" x2="33" y2="100" stroke="#252c20" strokeWidth="2" opacity="0.5"/>
        <line x1="66" y1="0" x2="66" y2="100" stroke="#252c20" strokeWidth="2" opacity="0.5"/>
        {/* Main crack diagonally */}
        <path d="M10 0 L30 40 L15 80 L30 100" fill="none" stroke="#0a0d08" strokeWidth="3.5" opacity="0.8"/>
        {/* Heavy corner vegetation */}
        <path d="M-5 -5 Q22 2 18 22 Q8 12 -5 -5Z" fill="#15803d" opacity="0.9"/>
        <path d="M-5 -5 Q2 18 -4 28 Q-6 16 -5 -5Z" fill="#166534" opacity="0.85"/>
        <path d="M105 -5 Q80 3 82 22 Q92 12 105 -5Z" fill="#14532d" opacity="0.9"/>
        <path d="M-5 105 Q20 82 22 68 Q10 80 -5 105Z" fill="#15803d" opacity="0.85"/>
        <path d="M105 105 Q80 82 78 68 Q90 80 105 105Z" fill="#166534" opacity="0.85"/>
        {/* Center tropical flower */}
        <circle cx="50" cy="50" r="6" fill="#7c1d1d" opacity="0.7"/>
        <circle cx="50" cy="50" r="3" fill="#f97316" opacity="0.6"/>
        <circle cx="50" cy="50" r="1.5" fill="#fef08a" opacity="0.8"/>
        <path d="M50 44 Q54 47 50 50Z" fill="#dc2626" opacity="0.6"/>
        <path d="M56 50 Q53 54 50 50Z" fill="#dc2626" opacity="0.6"/>
        <path d="M50 56 Q46 53 50 50Z" fill="#ef4444" opacity="0.5"/>
        <path d="M44 50 Q47 46 50 50Z" fill="#ef4444" opacity="0.5"/>
        {/* Vines over carved lines */}
        <path d="M0 33 Q20 30 40 33" stroke="#15803d" strokeWidth="2" fill="none" opacity="0.5"/>
        <path d="M60 66 Q80 64 100 66" stroke="#166534" strokeWidth="2" fill="none" opacity="0.5"/>
        <circle cx="40" cy="33" r="2.5" fill="#16a34a" opacity="0.6"/>
        <circle cx="80" cy="66" r="2.5" fill="#15803d" opacity="0.6"/>
      </svg>,

      // 9: DARK JUNGLE STONE — deep, almost black rock with neon-bright bioluminescent moss
      <svg key="9" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="stone9" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#2e3829"/>
            <stop offset="100%" stopColor="#111510"/>
          </radialGradient>
          <filter id="glow9">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#stone9)"/>
        {/* Deep cracks */}
        <path d="M30 0 L22 28 L38 55 L20 100" fill="none" stroke="#070a06" strokeWidth="4" opacity="0.9"/>
        <path d="M22 28 L55 38 L75 28" fill="none" stroke="#070a06" strokeWidth="3" opacity="0.7"/>
        <path d="M55 38 L65 65 L80 100" fill="none" stroke="#070a06" strokeWidth="2.5" opacity="0.6"/>
        {/* Bioluminescent moss — bright glowing green */}
        <ellipse cx="50" cy="8" rx="30" ry="10" fill="#14532d" opacity="0.9"/>
        <ellipse cx="50" cy="6" rx="20" ry="7" fill="#16a34a" opacity="0.7" filter="url(#glow9)"/>
        <ellipse cx="50" cy="5" rx="12" ry="4" fill="#4ade80" opacity="0.5" filter="url(#glow9)"/>
        {/* Side glow patches */}
        <ellipse cx="8" cy="50" rx="10" ry="18" fill="#15803d" opacity="0.7"/>
        <ellipse cx="8" cy="50" rx="5" ry="10" fill="#22c55e" opacity="0.5" filter="url(#glow9)"/>
        <ellipse cx="92" cy="60" rx="10" ry="16" fill="#14532d" opacity="0.7"/>
        <ellipse cx="92" cy="60" rx="5" ry="9" fill="#22c55e" opacity="0.45" filter="url(#glow9)"/>
        {/* Bottom glow */}
        <ellipse cx="50" cy="94" rx="32" ry="9" fill="#166534" opacity="0.8"/>
        <ellipse cx="50" cy="96" rx="18" ry="5" fill="#16a34a" opacity="0.5" filter="url(#glow9)"/>
        {/* Glowing crack moss */}
        <path d="M30 0 L22 28 L38 55" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.3" filter="url(#glow9)"/>
        {/* Water drip from top moss */}
        <path d="M42 14 Q43 30 42 48" stroke="#7dd3fc" strokeWidth="0.8" fill="none" opacity="0.35"/>
        <ellipse cx="42" cy="49" rx="1.8" ry="2.5" fill="#bfdbfe" opacity="0.3"/>
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
