import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  isMuted: boolean;
  musicVolume: number;
  sfxVolume: number;
  toggleMute: () => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      isMuted: false,
      musicVolume: 0.3,
      sfxVolume: 0.5,
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setSfxVolume: (volume) => set({ sfxVolume: volume }),
    }),
    {
      name: 'rocket-science-audio',
    }
  )
);
