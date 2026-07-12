import { useCallback, useEffect, useMemo } from "react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { translateText } from "@/services/deepl";
import {
  findTranslationMatches,
  saveSettings,
  saveTranslationMemory,
  upsertTranslationPair,
} from "@/services/translationMemory";
import { getSpeechSupport } from "@/services/speechRecognition";
import { useTranslationStore } from "@/store/useTranslationStore";

export function useTranslationWorkspace() {
  const settings = useTranslationStore((state) => state.settings);
  const sourceText = useTranslationStore((state) => state.sourceText);
  const targetText = useTranslationStore((state) => state.targetText);
  const matches = useTranslationStore((state) => state.matches);
  const memoryPairs = useTranslationStore((state) => state.memoryPairs);
  const isTranslating = useTranslationStore((state) => state.isTranslating);
  const isSettingsOpen = useTranslationStore((state) => state.isSettingsOpen);
  const speechStatus = useTranslationStore((state) => state.speechStatus);
  const error = useTranslationStore((state) => state.error);
  const hydrate = useTranslationStore((state) => state.hydrate);
  const setSourceText = useTranslationStore((state) => state.setSourceText);
  const setTargetText = useTranslationStore((state) => state.setTargetText);
  const setMatches = useTranslationStore((state) => state.setMatches);
  const setMemoryPairs = useTranslationStore((state) => state.setMemoryPairs);
  const setSettings = useTranslationStore((state) => state.setSettings);
  const setIsTranslating = useTranslationStore((state) => state.setIsTranslating);
  const setIsSettingsOpen = useTranslationStore((state) => state.setIsSettingsOpen);
  const setSpeechStatus = useTranslationStore((state) => state.setSpeechStatus);
  const setError = useTranslationStore((state) => state.setError);
  const debouncedSource = useDebouncedValue(sourceText, 550);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveTranslationMemory(memoryPairs);
  }, [memoryPairs]);

  const runTranslation = useCallback(
    async (incomingText: string) => {
      const trimmed = incomingText.trim();
      const nextMatches = findTranslationMatches(memoryPairs, trimmed, settings.sourceLang, settings.targetLang);
      setMatches(nextMatches);

      if (!trimmed) {
        setTargetText("", "user");
        setError(null);
        return;
      }

      if (nextMatches[0]?.matchType === "exact") {
        setIsTranslating(false);
        setTargetText(nextMatches[0].targetText, "memory");
        setError(null);
        return;
      }

      setIsTranslating(true);
      try {
        const result = await translateText({
          apiKey: settings.apiKey,
          sourceLang: settings.sourceLang,
          targetLang: settings.targetLang,
          text: trimmed,
        });

        setTargetText(result.translatedText, "deepl");
        setError(null);
      } catch (translationError) {
        const message = translationError instanceof Error ? translationError.message : "Translation failed.";
        setError(message);
      } finally {
        setIsTranslating(false);
      }
    },
    [
      memoryPairs,
      setError,
      setIsTranslating,
      setMatches,
      setTargetText,
      settings.apiKey,
      settings.sourceLang,
      settings.targetLang,
    ],
  );

  useEffect(() => {
    void runTranslation(debouncedSource);
  }, [debouncedSource, runTranslation]);

  const speech = useSpeechRecognition({
    sourceLang: settings.sourceLang,
    onTranscript: (value) => {
      const currentText = useTranslationStore.getState().sourceText;
      setSourceText(currentText ? `${currentText} ${value}`.trim() : value, "speech");
    },
    onStateChange: setSpeechStatus,
  });

  useEffect(() => {
    if (speech.error) {
      setError(speech.error);
    }
  }, [setError, speech.error]);

  const saveCurrentPair = useCallback(() => {
    if (!sourceText.trim() || !targetText.trim()) {
      return;
    }

    const updatedPairs = upsertTranslationPair(memoryPairs, {
      sourceText: sourceText.trim(),
      targetText: targetText.trim(),
      sourceLang: settings.sourceLang,
      targetLang: settings.targetLang,
    });

    setMemoryPairs(updatedPairs);
    setMatches(findTranslationMatches(updatedPairs, sourceText, settings.sourceLang, settings.targetLang));
  }, [memoryPairs, setMatches, setMemoryPairs, settings.sourceLang, settings.targetLang, sourceText, targetText]);

  const applyPair = useCallback(
    (pairId: string) => {
      const pair = memoryPairs.find((entry) => entry.id === pairId);
      if (!pair) {
        return;
      }

      setSourceText(pair.sourceText, "memory");
      setTargetText(pair.targetText, "memory");
      setMatches(findTranslationMatches(memoryPairs, pair.sourceText, pair.sourceLang, pair.targetLang));
    },
    [memoryPairs, setMatches, setSourceText, setTargetText],
  );

  const switchLanguages = useCallback(() => {
    setSettings({
      sourceLang: settings.targetLang,
      targetLang: settings.sourceLang,
    });
    setSourceText(targetText, "user");
    setTargetText(sourceText, "user");
  }, [setSettings, setSourceText, setTargetText, settings.sourceLang, settings.targetLang, sourceText, targetText]);

  const speechSupport = useMemo(() => getSpeechSupport(), []);

  return {
    applyPair,
    error,
    isSettingsOpen,
    isSpeechSupported: speechSupport.supported,
    isTranslating,
    matches,
    memoryPairs,
    runTranslation,
    saveCurrentPair,
    setSettings,
    setIsSettingsOpen,
    setSourceText,
    setTargetText,
    settings,
    sourceText,
    speech,
    speechMessage: speechSupport.message,
    speechStatus,
    switchLanguages,
    targetText,
  };
}
