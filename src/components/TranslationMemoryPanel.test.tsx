import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TranslationMemoryPanel } from "@/components/TranslationMemoryPanel";
import type { TranslationMatch, TranslationPair } from "@/types/translation";

const pair: TranslationPair = {
  id: "pair-1",
  sourceText: "Financial statement",
  targetText: "财务报表",
  sourceLang: "EN",
  targetLang: "ZH",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("TranslationMemoryPanel", () => {
  it("renders saved pairs and allows reuse", () => {
    const onApplyPair = vi.fn();
    render(<TranslationMemoryPanel matches={[]} pairs={[pair]} onApplyPair={onApplyPair} />);

    fireEvent.click(screen.getByRole("button", { name: /financial statement/i }));

    expect(screen.getByText(/1 saved pairs/i)).toBeInTheDocument();
    expect(onApplyPair).toHaveBeenCalledWith("pair-1");
  });

  it("shows exact match badge when matches are provided", () => {
    const match: TranslationMatch = {
      ...pair,
      matchType: "exact",
    };

    render(<TranslationMemoryPanel matches={[match]} pairs={[pair]} onApplyPair={vi.fn()} />);

    expect(screen.getByText(/exact/i)).toBeInTheDocument();
  });
});
