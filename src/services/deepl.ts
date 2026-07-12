import type { TranslationRequest, TranslationResult } from "@/types/translation";
import { DEEPL_LANGUAGE_MAP } from "@/utils/language";

export async function translateText({
  text,
  sourceLang,
  targetLang,
}: TranslationRequest): Promise<TranslationResult> {
  if (!text.trim()) {
    return { translatedText: "", provider: "deepl" };
  }

  if (sourceLang === targetLang) {
    return {
      translatedText: text,
      detectedSourceLang: sourceLang,
      provider: "deepl",
    };
  }

  const body = new URLSearchParams();
  body.append("text", text);
  body.append("target_lang", DEEPL_LANGUAGE_MAP[targetLang]);
  body.append("source_lang", DEEPL_LANGUAGE_MAP[sourceLang]);

  // Hit the local Netlify function endpoint instead of proxy rewrites
  const response = await fetch("/.netlify/functions/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "DeepL translation failed.");
  }

  const data = (await response.json()) as {
    translations?: Array<{ text: string; detected_source_language?: string }>;
  };

  return {
    translatedText: data.translations?.[0]?.text ?? "",
    detectedSourceLang: data.translations?.[0]?.detected_source_language,
    provider: "deepl",
  };
}
