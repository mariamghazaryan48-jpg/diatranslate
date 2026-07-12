import type { TranslationRequest, TranslationResult } from "@/types/translation";
import { DEEPL_LANGUAGE_MAP } from "@/utils/language";

const FREE_API_BASE_URL = "/api/deepl/free";
const PRO_API_BASE_URL = "/api/deepl/pro";

function resolveBaseUrl(apiKey: string) {
  return apiKey.endsWith(":fx") ? FREE_API_BASE_URL : PRO_API_BASE_URL;
}

export async function translateText({
  text,
  sourceLang,
  targetLang,
  apiKey,
}: TranslationRequest): Promise<TranslationResult> {
  if (!text.trim()) {
    return {
      translatedText: "",
      provider: "deepl",
    };
  }

  if (!apiKey.trim()) {
    throw new Error("Add a DeepL API key in Settings to enable machine translation.");
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
  body.append("source_lang", DEEPL_LANGUAGE_MAP[sourceLang]);
  body.append("target_lang", DEEPL_LANGUAGE_MAP[targetLang]);

  const response = await fetch(resolveBaseUrl(apiKey), {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "DeepL translation failed.");
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
