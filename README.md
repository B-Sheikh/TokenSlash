# TokenSlash

Nitro Stack Hackathon project repo — an agentic MCP pipeline that analyzes AI prompts, recommends cheaper models, rewrites for token efficiency, and projects monthly savings.

## Repo structure

```
packages/
  server/   ← Member C integration spine (NitroStack MCP server)
  web/      ← Member D dashboard (not yet built)
```

## Member C deliverables (done)

| File | Purpose |
|------|---------|
| `packages/server/src/shared/types.ts` | Shared TypeScript contract for all modules |
| `packages/server/src/tools/prompt-rewriter.tool.ts` | MCP tool + rewrite logic |
| `packages/server/src/tools/meta-synthesizer.tool.ts` | MCP tool + report assembly |
| `packages/server/src/tools/orchestration.tool.ts` | `analyze_prompt` entry point |
| `packages/server/src/orchestration/pipeline.service.ts` | Full pipeline orchestration |
| `packages/server/src/app.module.ts` | NitroStack root module wiring |
| `packages/server/src/main.ts` | Server bootstrap |

Stub placeholders (replace with real implementations):

- `token-estimator.tool.ts` → Member A
- `complexity-classifier.tool.ts` → Member A
- `model-recommender.tool.ts` → Member B
- `history-analyzer.tool.ts` → Member B

## Quick start

```bash
npm install
npm test
npm run dev    # starts MCP server in packages/server
```

## Main MCP tool

Call **`analyze_prompt`** with:

```json
{
  "prompt": "Please kindly write a detailed summary of this report.",
  "userId": "demo-user"
}
```

Returns a `FinalReport` object ready for the dashboard.

## Pipeline

```
Token Estimator ──┐
Complexity Classifier ──┼──► Model Recommender ──► Prompt Rewriter ──► Meta-Synthesizer
History Analyzer ──┘
```

Phase 1 runs in parallel (`Promise.all`). Phases 2–4 run sequentially per the dependency diagram.

## For teammates

- Build against `packages/server/src/shared/types.ts` — do not edit without Member C.
- Register your tool service in `packages/server/src/modules/tokenslash.module.ts` (ask Member C).
- Import shared types from `@tokenslash/server` exports or `src/shared/types.ts` directly.

