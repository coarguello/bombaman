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
  // 64-step sequence (150ms per step = 9.6 seconds loop)
  const motif1 = [
    { freq: 130.81, duration: 0.15 }, { freq: null, duration: 0.15 },
    { freq: 155.56, duration: 0.15 }, { freq: 174.61, duration: 0.15 },
    { freq: 130.81, duration: 0.15 }, { freq: 196.00, duration: 0.15 },
    { freq: null, duration: 0.15 }, { freq: 174.61, duration: 0.15 },
  ];
  const motif2 = [
    { freq: 130.81, duration: 0.15 }, { freq: null, duration: 0.15 },
    { freq: 155.56, duration: 0.15 }, { freq: 174.61, duration: 0.15 },
    { freq: 130.81, duration: 0.15 }, { freq: 233.08, duration: 0.15 }, // Bb3
    { freq: null, duration: 0.15 }, { freq: 196.00, duration: 0.15 }, // G3
  ];
  const seq: Note[] = [
    ...motif1, ...motif2, ...motif1, ...motif2,
    ...motif1, ...motif2, ...motif1, ...motif2
  ];
  playSequence(seq, 150);
};

// Chill Store Music (Arpeggio)
export const startStoreMusic = () => {
  // 64-step sequence (150ms per step = 9.6 seconds loop)
  const cMaj = [
    { freq: 261.63, duration: 0.2 }, { freq: 329.63, duration: 0.2 },
    { freq: 392.00, duration: 0.2 }, { freq: 523.25, duration: 0.2 },
    { freq: 392.00, duration: 0.2 }, { freq: 329.63, duration: 0.2 },
    { freq: 261.63, duration: 0.2 }, { freq: null, duration: 0.2 },
  ];
  const aMin = [
    { freq: 220.00, duration: 0.2 }, { freq: 261.63, duration: 0.2 },
    { freq: 329.63, duration: 0.2 }, { freq: 440.00, duration: 0.2 },
    { freq: 329.63, duration: 0.2 }, { freq: 261.63, duration: 0.2 },
    { freq: 220.00, duration: 0.2 }, { freq: null, duration: 0.2 },
  ];
  const seq: Note[] = [
    ...cMaj, ...aMin, ...cMaj, ...aMin,
    ...cMaj, ...aMin, ...cMaj, ...aMin
  ];
  playSequence(seq, 150);
};

export const playVictoryJingle = () => {
  stopAllMusic();
  if (!audioCtx) return;
  // C major arpeggio up
  const notes = [261.63, 329.63, 392.00, 523.25];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'square', 0.15, 0.1), i * 150);
  });
  setTimeout(() => playTone(523.25, 'square', 0.4, 0.1), 600); // Hold top C
};

export const playDefeatJingle = () => {
  stopAllMusic();
  if (!audioCtx) return;
  // Diminished descending
  const notes = [311.13, 293.66, 277.18, 261.63];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'triangle', 0.2, 0.1), i * 200);
  });
  setTimeout(() => playTone(246.94, 'triangle', 0.6, 0.1), 800); // Low B
};

export const stopAllMusic = () => {
  stopMusic();
};
