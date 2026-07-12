import { AlertTriangle, Database, Languages, Mic, Sparkles } from "lucide-react";

import { HeaderBar } from "@/components/HeaderBar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { TranslationMemoryPanel } from "@/components/TranslationMemoryPanel";
import { TranslationPane } from "@/components/TranslationPane";
import { useTranslationWorkspace } from "@/hooks/useTranslationWorkspace";
import { useTheme } from "@/hooks/useTheme";

function speakText(value: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !value.trim()) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(value);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

async function copyText(value: string) {
  if (!value.trim()) {
    return;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
  }
}

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const {
    applyPair,
    error,
    isSettingsOpen,
    isSpeechSupported,
    isTranslating,
    matches,
    memoryPairs,
    runTranslation,
    saveCurrentPair,
    setIsSettingsOpen,
    setSettings,
    setSourceText,
    setTargetText,
    settings,
    sourceText,
    speech,
    speechMessage,
    speechStatus,
    switchLanguages,
    targetText,
  } = useTranslationWorkspace();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5fbf7_0%,#edf6f2_42%,#f8faf9_100%)] text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_32%),linear-gradient(180deg,#041411_0%,#071b17_48%,#0a1110_100%)] dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-[1480px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <HeaderBar
          isDark={isDark}
          isListening={speech.isListening}
          isSpeechSupported={isSpeechSupported}
          isTranslating={isTranslating}
          settings={settings}
          speechStatus={speechStatus}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onStartRecording={speech.startListening}
          onStopRecording={speech.stopListening}
          onSwapLanguages={switchLanguages}
          onToggleTheme={toggleTheme}
          onTranslate={() => void runTranslation(sourceText)}
          onUpdateSettings={setSettings}
        />

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-emerald-900/10 bg-white/80 p-4 shadow-[0_18px_50px_rgba(6,78,59,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <div className="mb-3 inline-flex rounded-2xl bg-emerald-100 p-2 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-300">Translation status</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {isTranslating ? "DeepL is working..." : "Ready for translation"}
                </h3>
              </article>

              <article className="rounded-[24px] border border-emerald-900/10 bg-white/80 p-4 shadow-[0_18px_50px_rgba(6,78,59,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <div className="mb-3 inline-flex rounded-2xl bg-emerald-100 p-2 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">
                  <Database className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-300">TM coverage</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {matches.length > 0 ? `${matches.length} match${matches.length > 1 ? "es" : ""} found` : "No current matches"}
                </h3>
              </article>

              <article className="rounded-[24px] border border-emerald-900/10 bg-white/80 p-4 shadow-[0_18px_50px_rgba(6,78,59,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <div className="mb-3 inline-flex rounded-2xl bg-emerald-100 p-2 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">
                  <Languages className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-300">Current pair</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {settings.sourceLang} to {settings.targetLang}
                </h3>
              </article>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-[24px] border border-rose-500/20 bg-rose-50/80 px-4 py-4 text-sm text-rose-900 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                <p>{error}</p>
              </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-2">
              <TranslationPane
                actionLabel={speech.isListening ? "Listening..." : "Read aloud"}
                caption="Source"
                helperText="Type or dictate the original text. Translation memory is checked first, then DeepL fills the gap."
                placeholder="Enter or dictate English or Chinese text here..."
                title="Source text"
                value={sourceText ? `${sourceText}${speech.interimTranscript ? ` ${speech.interimTranscript}` : ""}` : speech.interimTranscript}
                onAction={() => speakText(sourceText)}
                onChange={setSourceText}
              />

              <TranslationPane
                actionLabel="Copy output"
                caption="Target"
                helperText="Review the translated result, make small edits if needed, and save polished pairs back to memory."
                onAction={() => void copyText(targetText)}
                onChange={setTargetText}
                onSecondaryAction={saveCurrentPair}
                placeholder="Translated output appears here..."
                readOnly={false}
                secondaryActionLabel="Save to TM"
                title="Target text"
                value={targetText}
              />
            </div>
          </section>

          <section className="grid gap-4">
            <TranslationMemoryPanel matches={matches} pairs={memoryPairs} onApplyPair={applyPair} />
            <article className="rounded-[28px] border border-emerald-900/10 bg-white/80 p-5 shadow-[0_24px_70px_rgba(6,78,59,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <div className="mb-3 inline-flex rounded-2xl bg-emerald-100 p-2 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">
                <Mic className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-800/70 dark:text-emerald-100/60">
                Voice input
              </p>
              <h3 className="mt-2 font-display text-2xl text-slate-900 dark:text-white">Live dictation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{speechMessage}</p>
              <div className="mt-4 rounded-[22px] border border-emerald-900/10 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-emerald-100">
                Interim transcript: {speech.interimTranscript || "Waiting for speech input..."}
              </div>
            </article>
          </section>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        speechMessage={speechMessage}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
