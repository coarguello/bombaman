// A simple retro 8-bit sound and music engine using Web Audio API

let audioCtx: AudioContext | null = null;
let currentBGMInterval: number | null = null;
let currentBGMStep = 0;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

// Generic tone player
const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

// White noise generator for explosions
const playNoise = (duration: number, vol: number = 0.5, lowpassFreq: number = 1000) => {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = lowpassFreq;
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noiseSource.start();
};

// SFX Methods
export const playTick = () => playTone(800, 'square', 0.05, 0.05);
export const playExplosionSFX = () => playNoise(0.6, 0.4, 600);
export const playCrateDestroySFX = () => playNoise(0.2, 0.2, 800);
export const playCoinSFX = () => {
  if (!audioCtx) return;
  playTone(987.77, 'square', 0.1, 0.05); // B5
  setTimeout(() => playTone(1318.51, 'square', 0.2, 0.05), 100); // E6
};
export const playMenuSelectSFX = () => playTone(440, 'sine', 0.1, 0.1);
export const playBuySFX = () => {
  if (!audioCtx) return;
  playTone(523.25, 'square', 0.1, 0.05); // C5
  setTimeout(() => playTone(659.25, 'square', 0.1, 0.05), 100); // E5
  setTimeout(() => playTone(783.99, 'square', 0.2, 0.05), 200); // G5
};

// Music Sequencer
interface Note { freq: number | null; duration: number }

const stopMusic = () => {
  if (currentBGMInterval !== null) {
    clearInterval(currentBGMInterval);
    currentBGMInterval = null;
  }
};

const playSequence = (sequence: Note[], tempoMs: number) => {
  stopMusic();
  currentBGMStep = 0;
  
  currentBGMInterval = window.setInterval(() => {
    const note = sequence[currentBGMStep];
    if (note.freq !== null) {
      playTone(note.freq, 'square', note.duration, 0.03); // Low volume for BGM
    }
    currentBGMStep = (currentBGMStep + 1) % sequence.length;
  }, tempoMs);
};

// Action BGM (Bomberman style fast bassline)
export const startBattleMusic = () => {
  // C minor pentatonic bassline
  const seq: Note[] = [
    { freq: 130.81, duration: 0.15 }, // C3
    { freq: null, duration: 0.15 },
    { freq: 155.56, duration: 0.15 }, // Eb3
    { freq: 174.61, duration: 0.15 }, // F3
    { freq: 130.81, duration: 0.15 }, // C3
    { freq: 196.00, duration: 0.15 }, // G3
    { freq: null, duration: 0.15 },
    { freq: 174.61, duration: 0.15 }, // F3
  ];
  playSequence(seq, 180);
};

// Chill Store Music (Arpeggio)
export const startStoreMusic = () => {
  // C major / A minor arpeggio
  const seq: Note[] = [
    { freq: 261.63, duration: 0.2 }, // C4
    { freq: 329.63, duration: 0.2 }, // E4
    { freq: 392.00, duration: 0.2 }, // G4
    { freq: 523.25, duration: 0.2 }, // C5
    { freq: 220.00, duration: 0.2 }, // A3
    { freq: 261.63, duration: 0.2 }, // C4
    { freq: 329.63, duration: 0.2 }, // E4
    { freq: 440.00, duration: 0.2 }, // A4
  ];
  playSequence(seq, 250);
};

export const stopAllMusic = () => {
  stopMusic();
};
