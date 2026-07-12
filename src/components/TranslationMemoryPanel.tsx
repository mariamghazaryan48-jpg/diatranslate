import { BookOpenText, Sparkles } from "lucide-react";

import type { TranslationMatch, TranslationPair } from "@/types/translation";
import { formatTimestamp, truncateText } from "@/utils/format";
import { getLanguageLabel } from "@/utils/language";

type TranslationMemoryPanelProps = {
  matches: TranslationMatch[];
  pairs: TranslationPair[];
  onApplyPair: (pairId: string) => void;
};

function getMatchLabel(pair: TranslationMatch | TranslationPair) {
  return "matchType" in pair ? pair.matchType : "saved";
}

export function TranslationMemoryPanel({ matches, pairs, onApplyPair }: TranslationMemoryPanelProps) {
  const visibleItems = matches.length > 0 ? matches : pairs.slice(0, 4);

  return (
    <section className="rounded-[28px] border border-emerald-900/10 bg-white/80 p-5 shadow-[0_24px_70px_rgba(6,78,59,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-800/70 dark:text-emerald-100/60">
            Translation memory
          </p>
          <h3 className="font-display text-2xl text-slate-900 dark:text-white">Corpus matches</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-emerald-100">
          <BookOpenText className="h-4 w-4" />
          {pairs.length} saved pairs
        </div>
      </div>

      <div className="space-y-3">
        {visibleItems.length > 0 ? (
          visibleItems.map((pair) => (
            <button
              key={pair.id}
              type="button"
              className="w-full rounded-[24px] border border-emerald-900/10 bg-white/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-700/30 hover:shadow-[0_16px_36px_rgba(6,78,59,0.12)] dark:border-white/10 dark:bg-emerald-950/45 dark:hover:border-emerald-300/30"
              onClick={() => onApplyPair(pair.id)}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  {getMatchLabel(pair)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatTimestamp(pair.updatedAt)}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {truncateText(pair.sourceText)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{truncateText(pair.targetText)}</p>
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {getLanguageLabel(pair.sourceLang)} to {getLanguageLabel(pair.targetLang)}
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-emerald-900/20 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            Save a translation pair to start building your reusable corpus.
          </div>
        )}
      </div>
    </section>
  );
}
