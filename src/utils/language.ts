import type { LanguageCode } from "@/types/translation";

export const LANGUAGE_OPTIONS: Array<{ value: LanguageCode; label: string; speechLocale: string }> = [
  { value: "EN", label: "English", speechLocale: "en-US" },
  { value: "ZH", label: "Chinese", speechLocale: "zh-CN" },
];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  EN: "English",
  ZH: "Chinese",
};

export const DEEPL_LANGUAGE_MAP: Record<LanguageCode, string> = {
  EN: "EN",
  ZH: "ZH",
};

export function getLanguageLabel(language: LanguageCode) {
  return LANGUAGE_LABELS[language];
}

export function getSpeechLocale(language: LanguageCode) {
  return LANGUAGE_OPTIONS.find((option) => option.value === language)?.speechLocale ?? "en-US";
}
