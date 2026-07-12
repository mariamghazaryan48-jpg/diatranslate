import type { AppSettings, TranslationMatch, TranslationPair } from "@/types/translation";

export const SETTINGS_STORAGE_KEY = "dia-translate-settings";
export const MEMORY_STORAGE_KEY = "dia-translate-memory";

const DEFAULT_API_KEY = import.meta.env.VITE_DEEPL_API_KEY ?? "";

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: DEFAULT_API_KEY,
  sourceLang: "EN",
  targetLang: "ZH",
};

function safeParse<T>(value: string | null, fallback: T) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadSettings() {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const stored = safeParse<Partial<AppSettings>>(window.localStorage.getItem(SETTINGS_STORAGE_KEY), {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveSettings(settings: AppSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function loadTranslationMemory() {
  if (typeof window === "undefined") {
    return [] as TranslationPair[];
  }

  return safeParse<TranslationPair[]>(window.localStorage.getItem(MEMORY_STORAGE_KEY), []);
}

export function saveTranslationMemory(pairs: TranslationPair[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(pairs));
}

export function createTranslationPair(input: Omit<TranslationPair, "id" | "createdAt" | "updatedAt">): TranslationPair {
  const timestamp = new Date().toISOString();

  return {
    ...input,
    id: `${timestamp}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function upsertTranslationPair(
  pairs: TranslationPair[],
  entry: Omit<TranslationPair, "id" | "createdAt" | "updatedAt">,
) {
  const normalizedSource = entry.sourceText.trim().toLowerCase();
  const normalizedTarget = entry.targetText.trim().toLowerCase();
  const existingIndex = pairs.findIndex((pair) => {
    return (
      pair.sourceLang === entry.sourceLang &&
      pair.targetLang === entry.targetLang &&
      pair.sourceText.trim().toLowerCase() === normalizedSource &&
      pair.targetText.trim().toLowerCase() === normalizedTarget
    );
  });

  if (existingIndex >= 0) {
    return pairs.map((pair, index) => {
      if (index !== existingIndex) {
        return pair;
      }

      return {
        ...pair,
        sourceText: entry.sourceText,
        targetText: entry.targetText,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  return [createTranslationPair(entry), ...pairs].slice(0, 24);
}

export function findTranslationMatches(
  pairs: TranslationPair[],
  sourceText: string,
  sourceLang: AppSettings["sourceLang"],
  targetLang: AppSettings["targetLang"],
) {
  const query = sourceText.trim().toLowerCase();

  if (!query) {
    return [] as TranslationMatch[];
  }

  const candidates = pairs.filter((pair) => pair.sourceLang === sourceLang && pair.targetLang === targetLang);
  const exactMatches = candidates
    .filter((pair) => pair.sourceText.trim().toLowerCase() === query)
    .map((pair) => ({ ...pair, matchType: "exact" as const }));

  const relatedMatches = candidates
    .filter((pair) => {
      const normalized = pair.sourceText.trim().toLowerCase();
      return normalized !== query && (normalized.includes(query) || query.includes(normalized));
    })
    .slice(0, 5)
    .map((pair) => ({ ...pair, matchType: "related" as const }));

  return [...exactMatches, ...relatedMatches];
}
