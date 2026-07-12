import { create } from "zustand";

import type { AppSettings, TranslationMatch, TranslationPair } from "@/types/translation";
import { DEFAULT_SETTINGS, loadSettings, loadTranslationMemory } from "@/services/translationMemory";

type TranslationStore = {
  settings: AppSettings;
  sourceText: string;
  targetText: string;
  matches: TranslationMatch[];
  memoryPairs: TranslationPair[];
  isTranslating: boolean;
  isSettingsOpen: boolean;
  speechStatus: string;
  lastUpdatedBy: "user" | "memory" | "deepl" | "speech";
  error: string | null;
  setSourceText: (value: string, updatedBy?: TranslationStore["lastUpdatedBy"]) => void;
  setTargetText: (value: string, updatedBy?: TranslationStore["lastUpdatedBy"]) => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  setMatches: (matches: TranslationMatch[]) => void;
  setMemoryPairs: (pairs: TranslationPair[]) => void;
  setIsTranslating: (value: boolean) => void;
  setIsSettingsOpen: (value: boolean) => void;
  setSpeechStatus: (value: string) => void;
  setError: (value: string | null) => void;
  hydrate: () => void;
};

export const useTranslationStore = create<TranslationStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  sourceText: "",
  targetText: "",
  matches: [],
  memoryPairs: [],
  isTranslating: false,
  isSettingsOpen: false,
  speechStatus: "Idle",
  lastUpdatedBy: "user",
  error: null,
  setSourceText: (value, updatedBy = "user") => set({ sourceText: value, lastUpdatedBy: updatedBy }),
  setTargetText: (value, updatedBy = "user") => set({ targetText: value, lastUpdatedBy: updatedBy }),
  setSettings: (incoming) =>
    set((state) => {
      const nextSource = incoming.sourceLang ?? state.settings.sourceLang;
      const nextTarget = incoming.targetLang ?? state.settings.targetLang;

      return {
        settings: {
          ...state.settings,
          ...incoming,
          sourceLang: nextSource,
          targetLang: nextSource === nextTarget ? state.settings.sourceLang : nextTarget,
        },
      };
    }),
  setMatches: (matches) => set({ matches }),
  setMemoryPairs: (pairs) => set({ memoryPairs: pairs }),
  setIsTranslating: (value) => set({ isTranslating: value }),
  setIsSettingsOpen: (value) => set({ isSettingsOpen: value }),
  setSpeechStatus: (value) => set({ speechStatus: value }),
  setError: (value) => set({ error: value }),
  hydrate: () =>
    set({
      settings: loadSettings(),
      memoryPairs: loadTranslationMemory(),
    }),
}));
