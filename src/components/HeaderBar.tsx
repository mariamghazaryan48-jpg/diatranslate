import { ArrowRightLeft, MoonStar, Mic, Settings2, SunMedium, WandSparkles } from "lucide-react";

import { LanguageSelector } from "@/components/LanguageSelector";
import type { AppSettings } from "@/types/translation";

type HeaderBarProps = {
  isDark: boolean;
  isListening: boolean;
  isSpeechSupported: boolean;
  isTranslating: boolean;
  settings: AppSettings;
  speechStatus: string;
  onOpenSettings: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSwapLanguages: () => void;
  onToggleTheme: () => void;
  onTranslate: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
};

export function HeaderBar({
  isDark,
  isListening,
  isSpeechSupported,
  isTranslating,
  settings,
  speechStatus,
  onOpenSettings,
  onStartRecording,
  onStopRecording,
  onSwapLanguages,
  onToggleTheme,
  onTranslate,
  onUpdateSettings,
}: HeaderBarProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white/75 px-6 py-6 shadow-[0_30px_80px_rgba(6,78,59,0.12)] backdrop-blur dark:border-white/10 dark:bg-emerald-950/55 dark:shadow-[0_32px_100px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
            Dia Translate Studio
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-4xl text-slate-900 dark:text-white md:text-[2.8rem]">
              Translate with memory, speech, and a calmer workflow.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              A refined bilingual workspace for English and Chinese translation with DeepL delivery, live speech
              transcription, and reusable corpus memory.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:min-w-[600px]">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
            <LanguageSelector
              label="Source language"
              value={settings.sourceLang}
              onChange={(value) => onUpdateSettings({ sourceLang: value })}
            />
            <button
              type="button"
              className="mt-auto inline-flex h-[52px] items-center justify-center rounded-2xl border border-emerald-900/15 bg-white/80 px-4 text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-700/40 hover:text-emerald-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-emerald-300/35"
              onClick={onSwapLanguages}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
            <LanguageSelector
              label="Target language"
              value={settings.targetLang}
              onChange={(value) => onUpdateSettings({ targetLang: value })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
              onClick={onTranslate}
              disabled={isTranslating}
            >
              <WandSparkles className="h-4 w-4" />
              {isTranslating ? "Translating..." : "Translate now"}
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-700/40 dark:border-white/10 dark:bg-white/5 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={isListening ? onStopRecording : onStartRecording}
              disabled={!isSpeechSupported}
            >
              <Mic className={isListening ? "h-4 w-4 text-rose-500" : "h-4 w-4"} />
              {isListening ? "Stop recording" : "Start recording"}
            </button>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-emerald-100">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isListening ? "animate-pulse bg-rose-500" : "bg-emerald-500"}`}
              />
              {speechStatus}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-700/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
              onClick={onOpenSettings}
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-700/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
              onClick={onToggleTheme}
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {isDark ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
