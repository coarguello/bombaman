import { SkinConfig } from '../types/game';
import { STORE_CATALOG } from '../constants/store';

interface PlayerAvatarProps {
  skin: SkinConfig;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  animate?: boolean;
}

// --- Per-character traits ---
// eye style: 'round' | 'angry' | 'narrow'
// buckle shape: 'rect' | 'heart' | 'star' | 'circle'
// pantsColor: Tailwind bg class for the pants area
// beltColor:  Tailwind bg class for the belt stripe
const CHARACTER_TRAITS: Record<string, { eyeStyle: string; buckleShape: string; pantsColor: string; beltColor: string }> = {
  body_default: { eyeStyle: 'round',  buckleShape: 'rect',   pantsColor: 'bg-blue-600',   beltColor: 'bg-black'       },  // White Bomber
  body_black:   { eyeStyle: 'angry',  buckleShape: 'star',   pantsColor: 'bg-gray-900',   beltColor: 'bg-gray-700'    },  // Black Bomber
  body_red:     { eyeStyle: 'angry',  buckleShape: 'rect',   pantsColor: 'bg-blue-700',   beltColor: 'bg-black'       },  // Red Bomber
  body_blue:    { eyeStyle: 'round',  buckleShape: 'heart',  pantsColor: 'bg-blue-800',   beltColor: 'bg-blue-950'    },  // Blue Bomber
  body_green:   { eyeStyle: 'round',  buckleShape: 'circle', pantsColor: 'bg-white',      beltColor: 'bg-gray-300'    },  // Green Bomber
  body_yellow:  { eyeStyle: 'narrow', buckleShape: 'star',   pantsColor: 'bg-amber-50',   beltColor: 'bg-yellow-200'  },  // Yellow Bomber
  body_pink:    { eyeStyle: 'round',  buckleShape: 'heart',  pantsColor: 'bg-pink-200',   beltColor: 'bg-pink-300'    },  // Pink Bomber
  body_purple:  { eyeStyle: 'round',  buckleShape: 'circle', pantsColor: 'bg-purple-700', beltColor: 'bg-purple-900'  },  // Purple Bomber
};

export function PlayerAvatar({ skin, direction = 'down', className = '', animate = true }: PlayerAvatarProps) {
  const bodyItem = STORE_CATALOG.find(i => i.id === skin.body);
  const glassesItem = STORE_CATALOG.find(i => i.id === skin.glasses);
  const mouthItem = STORE_CATALOG.find(i => i.id === skin.mouth);

  // Strip borders from store items to apply our own thick black borders for the cartoon style
  const bodyClass = (bodyItem?.value || 'bg-white').replace(/border-[a-zA-Z0-9-]+/g, '');
  const visorClass = (glassesItem?.value || 'bg-yellow-400').replace(/border-[a-zA-Z0-9-]+/g, '');

  const traits = CHARACTER_TRAITS[skin.body] || CHARACTER_TRAITS.body_default;

  // --- Eyes renderer ---
  const renderEyes = () => {
    switch (traits.eyeStyle) {
      case 'angry':
        // Slanted angry eyes (Black & Red Bomber)
        return (
          <div className="absolute flex gap-[25%] items-center justify-center w-full h-full z-10">
            <div className="w-[15%] h-[35%] bg-black rounded-full rotate-[-12deg] translate-y-[-5%]" />
            <div className="w-[15%] h-[35%] bg-black rounded-full rotate-[12deg] translate-y-[-5%]" />
          </div>
        );
      case 'cute':
        // Cute eyes with little lashes (Pink Bomber)
        return (
          <div className="absolute flex gap-[20%] items-center justify-center w-full h-full z-10">
            <div className="relative w-[15%] h-[40%]">
              <div className="w-full h-full bg-black rounded-full" />
              <div className="absolute -top-[25%] -right-[20%] w-[50%] h-[35%] bg-black rounded-full rotate-[30deg]" />
            </div>
            <div className="relative w-[15%] h-[40%]">
              <div className="w-full h-full bg-black rounded-full" />
              <div className="absolute -top-[25%] -left-[20%] w-[50%] h-[35%] bg-black rounded-full rotate-[-30deg]" />
            </div>
          </div>
        );
      case 'narrow':
        // Narrow confident eyes (Yellow Bomber)
        return (
          <div className="absolute flex gap-[25%] items-center justify-center w-full h-full z-10">
            <div className="w-[16%] h-[25%] bg-black rounded-full" />
            <div className="w-[16%] h-[25%] bg-black rounded-full" />
          </div>
        );
      case 'round':
      default:
        // Standard round eyes (White, Blue, Green, Purple Bomber)
        return (
          <div className="absolute flex gap-[25%] items-center justify-center w-full h-full z-10">
            <div className="w-[15%] h-[40%] bg-black rounded-full" />
            <div className="w-[15%] h-[40%] bg-black rounded-full" />
          </div>
        );
    }
  };

  // --- Buckle renderer ---
  const renderBuckle = () => {
    switch (traits.buckleShape) {
      case 'heart':
        // Heart-shaped buckle (Blue & Pink Bomber)
        return (
          <svg viewBox="0 0 20 18" className="w-[22%] h-[140%]" fill="#facc15" stroke="black" strokeWidth="1.5">
            <path d="M10 17 C4 11, -2 6, 4 2 C7 0, 10 3, 10 5 C10 3, 13 0, 16 2 C22 6, 16 11, 10 17Z" />
          </svg>
        );
      case 'star':
        // Star-shaped buckle (Black & Yellow Bomber)
        return (
          <svg viewBox="0 0 20 20" className="w-[22%] h-[140%]" fill="#facc15" stroke="black" strokeWidth="1.5">
            <polygon points="10,1 12.5,7 19,7.5 14,12 15.5,19 10,15.5 4.5,19 6,12 1,7.5 7.5,7" />
          </svg>
        );
      case 'circle':
        // Round buckle (Green & Purple Bomber)
        return (
          <div className="w-[20%] h-[130%] bg-yellow-400 border-[2px] border-black rounded-full" />
        );
      case 'rect':
      default:
        // Classic rectangle buckle (White & Red Bomber)
        return (
          <div className="w-[25%] h-[150%] bg-black border-[2px] border-yellow-400 rounded-sm" />
        );
    }
  };

  let mouthContent = null;
  if (mouthItem) {
    switch (mouthItem.value) {
      case 'marker':
        mouthContent = (
          <svg viewBox="0 0 24 10" className="absolute bottom-1 w-[45%] h-[25%] text-zinc-800 opacity-80 -rotate-3 z-20">
            <path d="M 2 3 Q 12 9 22 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
        break;
      case 'smile':
        mouthContent = (
          <div className="absolute bottom-1 w-[30%] h-[15%] border-b-[3px] border-black rounded-b-full z-20" />
        );
        break;
      case 'sad':
        mouthContent = (
          <div className="absolute bottom-1 w-[30%] h-[15%] border-t-[3px] border-black rounded-t-full mb-2 z-20" />
        );
        break;
      case 'robot':
        mouthContent = (
          <div className="absolute bottom-1 w-[40%] h-[20%] bg-zinc-800 border-2 border-black rounded-sm flex justify-evenly items-center z-20">
            <div className="w-[1px] h-full bg-white/30" />
            <div className="w-[1px] h-full bg-white/30" />
          </div>
        );
        break;
      case 'none':
      default:
        mouthContent = null;
    }
  }

  const shiftClass = 
    direction === 'left' ? '-translate-x-1' : 
    direction === 'right' ? 'translate-x-1' : 
    direction === 'up' ? '-translate-y-1' : 'translate-y-1';

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <div className={`relative w-full h-full flex flex-col items-center justify-center ${animate ? 'animate-[bounce_2s_infinite]' : ''}`}>
        
        {/* Antenna */}
        <div className={`relative w-[18%] aspect-square rounded-full border-[3px] border-black z-0 -mb-[2%] transition-transform duration-200 bg-rose-500 ${shiftClass}`}>
          {/* Stalk */}
          <div className="absolute -bottom-[50%] left-[35%] w-[30%] h-[60%] bg-black -z-10" />
        </div>

        {/* Head Cube */}
        <div className={`relative w-[80%] h-[60%] rounded-md border-[3px] border-black shadow-lg flex items-center justify-center z-10 overflow-hidden ${bodyClass}`}>
          
          {/* Visor Area */}
          <div className={`absolute w-[85%] h-[75%] rounded-lg border-[3px] border-black flex items-center justify-center transition-all duration-200 ${visorClass} ${shiftClass}`}>
            
            {direction !== 'up' && (
              <>
                {/* Eyes - unique per character */}
                {renderEyes()}

                {/* Cheeks */}
                <div className="absolute flex justify-between w-[85%] top-[55%] z-0">
                  <div className="w-[25%] aspect-square bg-yellow-400 rounded-full" />
                  <div className="w-[25%] aspect-square bg-yellow-400 rounded-full" />
                </div>
              </>
            )}

            {mouthContent}
          </div>
        </div>

        {/* Belt/Bottom Body */}
        <div className={`relative w-[80%] h-[15%] ${traits.pantsColor} border-[3px] border-t-0 border-black rounded-b-md flex items-center justify-center z-10 -mt-[3px] transition-transform duration-200`}>
          {/* Belt stripe - unique color per character */}
          <div className={`w-full h-[40%] ${traits.beltColor} flex items-center justify-center`}>
            {/* Buckle - unique per character */}
            {direction !== 'up' && renderBuckle()}
          </div>
        </div>

      </div>
    </div>
  );
}
