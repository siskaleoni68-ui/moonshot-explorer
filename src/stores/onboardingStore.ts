import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  hasAcceptedDisclaimer: boolean;
  setOnboardingComplete: () => void;
  setDisclaimerAccepted: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      hasAcceptedDisclaimer: false,
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setDisclaimerAccepted: () => set({ hasAcceptedDisclaimer: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false, hasAcceptedDisclaimer: false }),
    }),
    {
      name: 'rocket-science-onboarding',
    }
  )
);
