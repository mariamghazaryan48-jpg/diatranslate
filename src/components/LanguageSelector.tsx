import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LanguageCode } from "@/types/translation";
import { LANGUAGE_OPTIONS } from "@/utils/language";

type LanguageSelectorProps = {
  label: string;
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
};

export function LanguageSelector({ label, value, onChange }: LanguageSelectorProps) {
  return (
    <label className="flex min-w-[152px] flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-emerald-200/70 dark:text-emerald-100/60">
        {label}
      </span>
      <div className="group flex items-center gap-3 rounded-2xl border border-emerald-900/20 bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(6,78,59,0.08)] transition hover:border-emerald-700/40 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <Languages className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        <select
          aria-label={label}
          className={cn(
            "w-full appearance-none bg-transparent text-sm font-medium text-slate-800 outline-none dark:text-slate-100",
            "cursor-pointer",
          )}
          value={value}
          onChange={(event) => onChange(event.target.value as LanguageCode)}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
