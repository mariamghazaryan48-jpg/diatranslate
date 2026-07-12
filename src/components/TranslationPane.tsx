import { Copy, Save, Volume2 } from "lucide-react";

type TranslationPaneProps = {
  actionLabel: string;
  caption: string;
  helperText: string;
  onAction: () => void;
  onChange?: (value: string) => void;
  onSecondaryAction?: () => void;
  placeholder: string;
  readOnly?: boolean;
  secondaryActionLabel?: string;
  title: string;
  value: string;
};

export function TranslationPane({
  actionLabel,
  caption,
  helperText,
  onAction,
  onChange,
  onSecondaryAction,
  placeholder,
  readOnly,
  secondaryActionLabel,
  title,
  value,
}: TranslationPaneProps) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-emerald-900/10 bg-white/80 p-5 shadow-[0_24px_70px_rgba(6,78,59,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-800/70 dark:text-emerald-100/60">
            {caption}
          </p>
          <h2 className="font-display text-2xl text-slate-900 dark:text-white">{title}</h2>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-300">{helperText}</p>
        </div>

        <div className="flex items-center gap-2">
          {onSecondaryAction ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/10 px-3 py-2 text-sm text-slate-700 transition hover:border-emerald-700/30 hover:text-emerald-800 dark:border-white/10 dark:text-slate-200 dark:hover:border-emerald-300/30"
              onClick={onSecondaryAction}
            >
              <Save className="h-4 w-4" />
              {secondaryActionLabel}
            </button>
          ) : null}

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/10 px-3 py-2 text-sm text-slate-700 transition hover:border-emerald-700/30 hover:text-emerald-800 dark:border-white/10 dark:text-slate-200 dark:hover:border-emerald-300/30"
            onClick={onAction}
          >
            {readOnly ? <Copy className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {actionLabel}
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-[24px] border border-emerald-900/10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(238,248,244,0.78))] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_46%),linear-gradient(180deg,rgba(7,24,20,0.88),rgba(8,18,16,0.92))]">
        <textarea
          className="h-full min-h-[320px] w-full resize-none bg-transparent px-5 py-5 text-[15px] leading-7 text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder={placeholder}
          readOnly={readOnly}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{value.trim().length} characters</span>
        <span>{readOnly ? "Machine output or TM suggestion" : "Typing or speech feeds this pane"}</span>
      </div>
    </article>
  );
}
