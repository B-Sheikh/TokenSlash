import type { FinalReport } from "@/shared/types";
import mockFinalReport from "@/mocks/mockFinalReport.json";

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" ||
  !import.meta.env.VITE_API_BASE_URL;

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class AnalyzeError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AnalyzeError";
    this.status = status;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Analyze a prompt. Uses mock FinalReport when VITE_USE_MOCK=true
 * or when VITE_API_BASE_URL is unset (pre–Checkpoint 2).
 * Swap is automatic once the env points at the live backend.
 */
export async function analyzePrompt(
  prompt: string,
  options?: { monthlyRequests?: number; currentModel?: string },
): Promise<FinalReport> {
  if (USE_MOCK) {
    await delay(650);
    return {
      ...(mockFinalReport as FinalReport),
      originalPrompt: prompt,
      assumedMonthlyRequests:
        options?.monthlyRequests ?? mockFinalReport.assumedMonthlyRequests,
      currentModel: options?.currentModel ?? mockFinalReport.currentModel,
    };
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        monthlyRequests: options?.monthlyRequests,
        currentModel: options?.currentModel,
      }),
    });
  } catch {
    throw new AnalyzeError(
      "Can't reach the Tokenslash backend. Check that the API is running, or set VITE_USE_MOCK=true for a local demo.",
    );
  }

  if (!response.ok) {
    let detail = `Backend returned ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      detail = body.error ?? body.message ?? detail;
    } catch {
      /* ignore JSON parse failures */
    }
    throw new AnalyzeError(detail, response.status);
  }

  return (await response.json()) as FinalReport;
}

export function isMockMode(): boolean {
  return USE_MOCK;
}
