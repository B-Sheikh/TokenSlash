import { useState } from "react";
import { analyzePrompt, isMockMode, AnalyzeError } from "@/api/analyze";
import { PromptInput } from "@/components/PromptInput";
import { ReportView } from "@/components/ReportView";
import { Sidebar } from "@/components/Sidebar";
import type { FinalReport } from "@/shared/types";

type ViewState =
  | { phase: "input" }
  | { phase: "loading" }
  | { phase: "report"; report: FinalReport }
  | { phase: "error"; message: string };

function LoadingState() {
  return (
    <div
      className="mx-auto flex min-h-[280px] w-full max-w-[840px] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-9 w-9 rounded-full border-2 border-line border-t-accent animate-spin-slow"
        aria-hidden
      />
      <p className="animate-pulse-soft text-sm font-medium text-ink-muted">
        Optimizing your prompt &amp; scoring model costs…
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="card mx-auto flex w-full max-w-[840px] flex-col gap-4 border-warn/20 px-7 py-8"
      role="alert"
      style={{ backgroundColor: "var(--color-warn-soft)" }}
    >
      <h2 className="font-display text-2xl tracking-tight text-warn">
        Something went wrong
      </h2>
      <p className="text-[15px] leading-relaxed text-ink/90">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="transition-ui mt-1 w-fit rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-paper hover:-translate-y-px hover:brightness-110 hover:shadow-[var(--shadow-glow)]"
      >
        Try again
      </button>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<ViewState>({ phase: "input" });

  async function handleAnalyze(prompt: string, monthlyRequests: number) {
    setView({ phase: "loading" });
    try {
      const report = await analyzePrompt(prompt, { monthlyRequests });
      setView({ phase: "report", report });
    } catch (err) {
      const message =
        err instanceof AnalyzeError
          ? err.message
          : "Unexpected error while analyzing. Please try again.";
      setView({ phase: "error", message });
    }
  }

  function reset() {
    setView({ phase: "input" });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        phase={view.phase}
        onNewPrompt={reset}
        mockMode={isMockMode()}
      />

      <main className="min-h-screen flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[840px] px-6 py-12 sm:px-8 sm:py-16">
          {view.phase === "input" || view.phase === "loading" ? (
            <div className="mb-10 flex flex-col items-center gap-3 text-center">
              <h1 className="font-display text-[clamp(2.1rem,4.5vw,3rem)] font-semibold leading-[1.12] tracking-tight text-ink">
                Tokenslash
              </h1>
              <p className="max-w-lg text-[16px] leading-relaxed text-ink-muted">
                Paste a prompt. See the rewrite, the cheaper model, and exactly
                how much you save each month — in under three seconds.
              </p>
            </div>
          ) : null}

          {view.phase === "input" ? (
            <PromptInput onSubmit={handleAnalyze} />
          ) : null}

          {view.phase === "loading" ? <LoadingState /> : null}

          {view.phase === "error" ? (
            <ErrorState message={view.message} onRetry={reset} />
          ) : null}

          {view.phase === "report" ? (
            <ReportView report={view.report} onReset={reset} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
