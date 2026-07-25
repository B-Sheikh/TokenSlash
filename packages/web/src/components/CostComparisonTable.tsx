import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  isAvailable,
  type CostComparison,
  type MaybeUnavailable,
} from "@/shared/types";

interface CostComparisonTableProps {
  comparison: MaybeUnavailable<CostComparison>;
}

function formatUsd(value: number): string {
  if (value >= 1) {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${value.toFixed(4)}`;
}

function CellValue({ value }: { value: MaybeUnavailable<number> }) {
  if (!isAvailable(value)) {
    return (
      <span className="text-ink-muted italic" title="Pipeline stage unavailable">
        Unavailable
      </span>
    );
  }
  return <span>{formatUsd(value)}</span>;
}

export function CostComparisonTable({ comparison }: CostComparisonTableProps) {
  if (!isAvailable(comparison)) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-paper px-5 py-8 text-center text-ink-muted">
        Cost comparison unavailable — other report sections still apply.
      </div>
    );
  }

  const { current, recommended } = comparison;

  const chartData = [
    {
      label: "Per request",
      current: isAvailable(current.perRequestUsd) ? current.perRequestUsd : 0,
      recommended: isAvailable(recommended.perRequestUsd)
        ? recommended.perRequestUsd
        : 0,
    },
    {
      label: "Monthly",
      current: isAvailable(current.monthlyUsd) ? current.monthlyUsd : 0,
      recommended: isAvailable(recommended.monthlyUsd)
        ? recommended.monthlyUsd
        : 0,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-[15px]">
          <thead>
            <tr className="border-b border-white/[0.08] text-left text-xs tracking-wider text-ink-muted uppercase">
              <th className="py-3 pr-4 font-medium">Metric</th>
              <th className="py-3 pr-4 text-right font-medium">
                Current · {current.model}
              </th>
              <th className="py-3 text-right font-medium text-accent">
                Recommended · {recommended.model}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            <tr>
              <td className="py-3.5 pr-4 font-medium text-ink-muted">
                Per request
              </td>
              <td className="py-3.5 pr-4 text-right tabular-nums text-ink">
                <CellValue value={current.perRequestUsd} />
              </td>
              <td className="py-3.5 text-right tabular-nums text-accent">
                <CellValue value={recommended.perRequestUsd} />
              </td>
            </tr>
            <tr>
              <td className="py-3.5 pr-4 font-medium text-ink-muted">Monthly</td>
              <td className="py-3.5 pr-4 text-right tabular-nums text-ink">
                <CellValue value={current.monthlyUsd} />
              </td>
              <td className="py-3.5 text-right tabular-nums font-semibold text-accent">
                <CellValue value={recommended.monthlyUsd} />
              </td>
            </tr>
            <tr>
              <td className="py-3.5 pr-4 font-medium text-ink-muted">
                Input / output tokens
              </td>
              <td className="py-3.5 pr-4 text-right tabular-nums text-ink-muted">
                {isAvailable(current.inputTokens) &&
                isAvailable(current.outputTokens)
                  ? `${current.inputTokens} / ${current.outputTokens}`
                  : "Unavailable"}
              </td>
              <td className="py-3.5 text-right tabular-nums text-ink-muted">
                {isAvailable(recommended.inputTokens) &&
                isAvailable(recommended.outputTokens)
                  ? `${recommended.inputTokens} / ${recommended.outputTokens}`
                  : "Unavailable"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a303c" />
            <XAxis dataKey="label" tick={{ fill: "#8b919c", fontSize: 13 }} />
            <YAxis
              tick={{ fill: "#8b919c", fontSize: 12 }}
              tickFormatter={(v: number) => `$${v}`}
              width={56}
            />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? formatUsd(value) : String(value)
              }
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #2a303c",
                background: "#161a22",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                fontSize: 13,
                color: "#f2f3f5",
              }}
            />
            <Legend wrapperStyle={{ color: "#8b919c" }} />
            <Bar
              dataKey="current"
              name={current.model}
              fill="#5c6575"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="recommended"
              name={recommended.model}
              fill="#2ee6a6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
