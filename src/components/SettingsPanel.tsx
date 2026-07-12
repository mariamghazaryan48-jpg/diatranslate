import { KeyRound, ShieldCheck, X } from "lucide-react";

import type { AppSettings } from "@/types/translation";

type SettingsPanelProps = {
  isOpen: boolean;
  settings: AppSettings;
  speechMessage: string;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
};

export function SettingsPanel({ isOpen, settings, speechMessage, onClose, onUpdateSettings }: SettingsPanelProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className="fixed inset-y-4 right-4 z-20 w-[min(420px,calc(100vw-2rem))] rounded-[28px] border border-emerald-900/10 bg-white/90 p-6 shadow-[0_32px_90px_rgba(6,78,59,0.18)] backdrop-blur transition dark:border-white/10 dark:bg-emerald-950/90 dark:shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-800/70 dark:text-emerald-100/60">
            Settings
          </p>
          <h2 className="font-display text-3xl text-slate-900 dark:text-white">Workspace controls</h2>
        </div>
        <button
          type="button"
          className="rounded-2xl border border-emerald-900/10 p-2 text-slate-700 transition hover:border-emerald-700/30 hover:text-emerald-800 dark:border-white/10 dark:text-slate-200"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5">
        <section className="rounded-[24px] border border-emerald-900/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">DeepL API Key</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">Stored locally in your browser for this prototype.</p>
            </div>
          </div>
          <input
            type="password"
            value={settings.apiKey}
            placeholder="Paste your DeepL key"
            className="w-full rounded-2xl border border-emerald-900/15 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
            onChange={(event) => onUpdateSettings({ apiKey: event.target.value })}
          />
        </section>

        <section className="rounded-[24px] border border-emerald-900/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Speech recognition</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">{speechMessage}</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            Best results come from Chrome or Edge. Recorded speech is transcribed into the source pane and translated
            automatically after the text settles.
          </p>
        </section>
      </div>
    </aside>
  );
}
