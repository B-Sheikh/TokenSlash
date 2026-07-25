import { lazy, Suspense, type ReactNode } from "react";
import {
  BarChart3,
  FileText,
  Percent,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import {
  isAvailable,
  type FinalReport,
  type MaybeUnavailable,
} from "@/shared/types";

const CostComparisonTable = lazy(() =>
  import("@/components/CostComparisonTable").then((m) => ({
    default: m.CostComparisonTable,
  })),
);

interface ReportViewProps {
  report: FinalReport;
  onReset: () => void;
}

function formatSavings(value: number): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  });
}

function FieldFallback({ label }: { label: string }) {
  return (
    <p className="text-sm text-ink-muted italic">
      {label} unavailable for this run.
    </p>
  );
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Sparkles;
  children: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <h2 className="text-sm font-semibold tracking-wide text-ink-muted uppercase">
        {children}
      </h2>
    </div>
  );
}

function PromptPane({
  title,
  body,
}: {
  title: string;
  body: MaybeUnavailable<string>;
}) {
  return (
    <div className="flex min-h-[160px] flex-1 flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
        {title}
      </h3>
      {isAvailable(body) ? (
        <p className="flex-1 whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-paper px-4 py-3.5 text-[14px] leading-relaxed text-ink/90">
          {body}
        </p>
      ) : (
        <div className="flex flex-1 items-center rounded-xl border border-dashed border-line px-4 py-3">
          <FieldFallback label={title} />
        </div>
      )}
    </div>
  );
}

export function ReportView({ report, onReset }: ReportViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-col gap-5 pb-16">
      {/* Hero: monthly savings — single biggest visual */}
      <section className="card animate-fade-up relative overflow-hidden px-7 py-8 sm:px-9 sm:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 90% 10%, rgba(46, 230, 166, 0.14), transparent 55%)",
          }}
        />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-2 text-accent">
            <TrendingDown className="h-4 w-4" strokeWidth={2} />
            <p className="text-xs font-semibold tracking-[0.14em] uppercase">
              Estimated monthly savings
            </p>
          </div>
          {isAvailable(report.monthlySavingsEstimateUsd) ? (
            <p className="font-display text-[clamp(3.25rem,7vw,5.75rem)] font-semibold leading-none tracking-tight text-accent drop-shadow-[0_0_40px_rgba(46,230,166,0.25)]">
              {formatSavings(report.monthlySavingsEstimateUsd)}
              <span className="ml-2 font-sans text-[0.3em] font-medium tracking-normal text-ink-muted">
                / mo
              </span>
            </p>
          ) : (
            <p className="font-display text-3xl text-ink-muted italic">
              Savings estimate unavailable
            </p>
          )}
          <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Based on{" "}
            <span className="font-semibold text-ink">
              {report.assumedMonthlyRequests.toLocaleString()}
            </span>{" "}
            requests/month on{" "}
            <span className="font-semibold text-ink">{report.currentModel}</span>
            {isAvailable(report.recommendedModel)
              ? `, switching to ${report.recommendedModel}`
              : ""}
            .
          </p>
        </div>
      </section>

      {/* Token savings + recommended model */}
      <section className="animate-fade-up-delay grid gap-5 sm:grid-cols-2">
        <div className="card transition-ui flex flex-col justify-center gap-2 px-6 py-6 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Percent className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
              Token savings
            </p>
          </div>
          {isAvailable(report.tokenSavingsPercent) ? (
            <p className="font-display text-5xl font-semibold leading-none tracking-tight text-accent">
              {report.tokenSavingsPercent}
              <span className="text-2xl">%</span>
            </p>
          ) : (
            <FieldFallback label="Token savings" />
          )}
          <p className="text-sm text-ink-muted">
            Fewer input tokens → lower cost on every call.
          </p>
        </div>

        <div className="card transition-ui flex flex-col gap-2 px-6 py-6 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
              Recommended model
            </p>
          </div>
          {isAvailable(report.recommendedModel) ? (
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">
              {report.recommendedModel}
            </p>
          ) : (
            <FieldFallback label="Recommended model" />
          )}
          {isAvailable(report.recommendedModelReasoning) ? (
            <p className="max-w-prose text-[15px] leading-relaxed text-ink-muted">
              {report.recommendedModelReasoning}
            </p>
          ) : (
            <FieldFallback label="Model reasoning" />
          )}
        </div>
      </section>

      {/* Side-by-side prompts */}
      <section className="card animate-fade-up-delay-2 px-6 py-6">
        <SectionLabel icon={FileText}>Prompt rewrite</SectionLabel>
        <div className="flex flex-col gap-4 lg:flex-row">
          <PromptPane title="Original" body={report.originalPrompt} />
          <PromptPane title="Optimized" body={report.optimizedPrompt} />
        </div>
      </section>

      {/* Cost comparison */}
      <section className="card animate-fade-up-delay-2 px-6 py-6">
        <SectionLabel icon={BarChart3}>Cost comparison</SectionLabel>
        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center text-sm text-ink-muted">
              Loading chart…
            </div>
          }
        >
          <CostComparisonTable comparison={report.costComparison} />
        </Suspense>
      </section>

      <div className="pt-1">
        <button
          type="button"
          onClick={onReset}
          className="transition-ui rounded-xl border border-white/[0.1] bg-transparent px-5 py-2.5 text-sm font-semibold text-ink hover:-translate-y-px hover:border-accent/40 hover:bg-accent-soft hover:text-accent"
        >
          Analyze another prompt
        </button>
      </div>
    </div>
  );
}
