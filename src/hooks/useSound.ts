import { useCallback, useEffect, useRef } from 'react';
import { useAudioStore } from '@/stores/audioStore';

type SoundEffect = 'click' | 'success' | 'error' | 'launch' | 'whoosh' | 'complete' | 'notification' | 'hover' | 'unlock';

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Synthesize space-themed sound effects
const playSynthSound = (type: SoundEffect, volume: number) => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.value = volume;

  switch (type) {
    case 'click': {
      // Short blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    }
    
    case 'hover': {
      // Subtle hover
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }
    
    case 'success': {
      // Ascending arpeggio
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = now + i * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
      break;
    }
    
    case 'error': {
      // Descending buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
    
    case 'launch': {
      // Rocket launch rumble with rising pitch
      const noise = ctx.createBufferSource();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;
      
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(2000, now + 1.5);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.linearRampToValueAtTime(0.5, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
      
      noise.start(now);
      noise.stop(now + 2);
      
      // Rising tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 1.5);
      oscGain.gain.setValueAtTime(0.15, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
      osc.start(now);
      osc.stop(now + 2);
      break;
    }
    
    case 'whoosh': {
      // Quick whoosh
      const noise = ctx.createBufferSource();
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.3);
      filter.Q.value = 2;
      
      const gain = ctx.createGain();
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      noise.start(now);
      noise.stop(now + 0.3);
      break;
    }
    
    case 'complete': {
      // Achievement sound - magical chime
      const frequencies = [880, 1108.73, 1318.51, 1760]; // A5, C#6, E6, A6
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = now + i * 0.05;
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
      break;
    }
    
    case 'unlock': {
      // Epic unlock fanfare - triumphant arpeggio with shimmer
      const fanfareNotes = [
        { freq: 523.25, delay: 0, duration: 0.3 },      // C5
        { freq: 659.25, delay: 0.1, duration: 0.3 },    // E5
        { freq: 783.99, delay: 0.2, duration: 0.3 },    // G5
        { freq: 1046.50, delay: 0.3, duration: 0.6 },   // C6
        { freq: 1318.51, delay: 0.35, duration: 0.6 },  // E6
        { freq: 1567.98, delay: 0.4, duration: 0.8 },   // G6
      ];
      
      fanfareNotes.forEach(({ freq, delay, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = now + delay;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
      
      // Add shimmer effect
      for (let i = 0; i < 8; i++) {
        const shimmer = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmer.connect(shimmerGain);
        shimmerGain.connect(masterGain);
        shimmer.type = 'sine';
        shimmer.frequency.value = 2000 + Math.random() * 2000;
        const startTime = now + 0.4 + i * 0.05;
        shimmerGain.gain.setValueAtTime(0, startTime);
        shimmerGain.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        shimmer.start(startTime);
        shimmer.stop(startTime + 0.3);
      }
      break;
    }
    
    case 'notification': {
      // Soft ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
  }
};

// Ambient space music generator
class AmbientMusic {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;
  private intervalId: number | null = null;
  
  start(volume: number) {
    if (this.isPlaying) return;
    
    this.ctx = getAudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = volume;
    
    this.isPlaying = true;
    this.playDrone();
    this.scheduleArpeggio();
  }
  
  private playDrone() {
    if (!this.ctx || !this.masterGain) return;
    
    // Deep bass drone
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);
    bassOsc.type = 'sine';
    bassOsc.frequency.value = 55; // A1
    bassGain.gain.value = 0.15;
    bassOsc.start();
    this.oscillators.push(bassOsc);
    
    // Pad oscillators with slight detuning
    const padFreqs = [110, 165, 220, 330]; // A2, E3, A3, E4
    padFreqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.type = 'sine';
      osc.frequency.value = freq + (Math.random() - 0.5) * 2;
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      gain.gain.value = 0.05;
      
      // Slow LFO for movement
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.frequency.value = 0.1 + i * 0.05;
      lfoGain.gain.value = 2;
      lfo.start();
      
      osc.start();
      this.oscillators.push(osc, lfo);
    });
  }
  
  private scheduleArpeggio() {
    // Random twinkling notes
    const playNote = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      
      const notes = [440, 523.25, 659.25, 783.99, 880, 1046.50];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
      
      osc.start(now);
      osc.stop(now + 2);
    };
    
    // Play random notes at random intervals
    const scheduleNext = () => {
      if (!this.isPlaying) return;
      playNote();
      this.intervalId = window.setTimeout(scheduleNext, 2000 + Math.random() * 4000);
    };
    
    scheduleNext();
  }
  
  stop() {
    this.isPlaying = false;
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.oscillators = [];
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }
  
  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }
}

const ambientMusic = new AmbientMusic();

export function useSound() {
  const { isMuted, sfxVolume, musicVolume } = useAudioStore();
  const musicStarted = useRef(false);
  
  const playSound = useCallback((type: SoundEffect) => {
    if (isMuted) return;
    
    // Resume audio context on user interaction
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
    
    playSynthSound(type, sfxVolume);
  }, [isMuted, sfxVolume]);
  
  const startMusic = useCallback(() => {
    if (isMuted || musicStarted.current) return;
    
    // Resume audio context on user interaction
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
    
    ambientMusic.start(musicVolume);
    musicStarted.current = true;
  }, [isMuted, musicVolume]);
  
  const stopMusic = useCallback(() => {
    ambientMusic.stop();
    musicStarted.current = false;
  }, []);
  
  // Update music volume
  useEffect(() => {
    if (isMuted) {
      ambientMusic.setVolume(0);
    } else {
      ambientMusic.setVolume(musicVolume);
    }
  }, [isMuted, musicVolume]);
  
  // Stop music when muted
  useEffect(() => {
    if (isMuted && musicStarted.current) {
      stopMusic();
    }
  }, [isMuted, stopMusic]);
  
  return { playSound, startMusic, stopMusic };
}
