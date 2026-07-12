export type LanguageCode = "EN" | "ZH";

export interface TranslationPair {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  apiKey: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
}

export interface TranslationMatch extends TranslationPair {
  matchType: "exact" | "related";
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLang?: string;
  provider: "deepl" | "memory";
}

export interface TranslationRequest {
  text: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  apiKey: string;
}

export interface SpeechSupport {
  supported: boolean;
  message: string;
}

export interface SpeechState {
  isListening: boolean;
  interimTranscript: string;
  error: string | null;
}
