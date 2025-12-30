import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[];
  simulationCount: number;
  successfulLaunches: number;
  bestAltitude: number;
  addCompletedLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  incrementSimulation: (success: boolean, altitude: number) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      simulationCount: 0,
      successfulLaunches: 0,
      bestAltitude: 0,
      addCompletedLesson: (lessonId) => {
        const current = get().completedLessons;
        if (!current.includes(lessonId)) {
          set({ completedLessons: [...current, lessonId] });
        }
      },
      isLessonCompleted: (lessonId) => get().completedLessons.includes(lessonId),
      incrementSimulation: (success, altitude) => set((state) => ({
        simulationCount: state.simulationCount + 1,
        successfulLaunches: success ? state.successfulLaunches + 1 : state.successfulLaunches,
        bestAltitude: Math.max(state.bestAltitude, altitude),
      })),
      resetProgress: () => set({
        completedLessons: [],
        simulationCount: 0,
        successfulLaunches: 0,
        bestAltitude: 0,
      }),
    }),
    {
      name: 'rocket-science-progress',
    }
  )
);
