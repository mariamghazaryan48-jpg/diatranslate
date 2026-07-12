import { describe, expect, it } from "vitest";

import { findTranslationMatches, upsertTranslationPair } from "@/services/translationMemory";
import type { TranslationPair } from "@/types/translation";

const basePair: TranslationPair = {
  id: "pair-1",
  sourceText: "Hello world",
  targetText: "你好，世界",
  sourceLang: "EN",
  targetLang: "ZH",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("translationMemory", () => {
  it("returns an exact match before related matches", () => {
    const matches = findTranslationMatches(
      [
        basePair,
        { ...basePair, id: "pair-2", sourceText: "Hello", targetText: "你好" },
      ],
      "Hello world",
      "EN",
      "ZH",
    );

    expect(matches[0]?.matchType).toBe("exact");
    expect(matches[0]?.targetText).toBe("你好，世界");
  });

  it("upserts a new pair and limits the list size", () => {
    const manyPairs = Array.from({ length: 24 }, (_, index) => ({
      ...basePair,
      id: `pair-${index}`,
      sourceText: `Source ${index}`,
      targetText: `Target ${index}`,
    }));

    const nextPairs = upsertTranslationPair(manyPairs, {
      sourceText: "New source",
      targetText: "New target",
      sourceLang: "EN",
      targetLang: "ZH",
    });

    expect(nextPairs).toHaveLength(24);
    expect(nextPairs[0]?.sourceText).toBe("New source");
  });
});
