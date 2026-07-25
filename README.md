# TokenSlash — 15-Hour War Room Hackathon Project
*An Agentic MCP Pipeline for AI Prompt Cost Reduction & Token Waste Optimization.*

---

## ⚡ Overview
**TokenSlash** is an agentic MCP (Model Context Protocol) multi-tool system built on the **NitroStack** framework. When a developer submits a bloated AI prompt, TokenSlash automatically:
1. **Estimates Token Overhead**: Uses a real `tiktoken` tokenizer to calculate exact token count.
2. **Classifies Task Complexity**: Evaluates structural heuristics to score difficulty (Simple / Moderate / Complex) and tag taxonomy (`code-generation`, `data-analysis`, etc.).
3. **Analyzes User Spend History**: Evaluates past volume against a realistic user profile to project annualized savings.
4. **Recommends Model Downgrades**: Safely routes simple tasks from expensive flagship models (like `gpt-4o`) to lighter models (`gpt-4.1-mini`) using verified provider pricing tables.
5. **Rewrites for Token Efficiency**: Strips redundant conversational fluff and filler without losing intent.
6. **Synthesizes & Visualizes**: Renders an interactive report dashboard with side-by-side diffs, Recharts cost comparisons, and monthly dollar projections.

---

## 📂 Repository Structure & Team Ownership

```
packages/
  server/   ← Backend MCP Server (@tokenslash/server)
              ├── Member A: token-estimator.tool.ts, complexity-classifier.tool.ts, taxonomy.ts
              ├── Member B: model-recommender.tool.ts, history-analyzer.tool.ts, pricing-table.json
              └── Member C: prompt-rewriter.tool.ts, meta-synthesizer.tool.ts, orchestration, types.ts
  web/      ← Frontend Web Dashboard (@tokenslash/web)
              └── Member D: Vite + React + TS UI, Vanilla CSS design system, Recharts cost charts
.github/    ← Collaboration Rules (PR templates, branch protection notes)
DEMO.md     ← 3-minute pitch script for judges & backup instructions
```

---

## 🚀 Quick Start & Verification

### 1. Install Workspace Dependencies
```bash
npm install
```

### 2. Run Backend Verification (46 Unit Tests & End-to-End Smoke Test)
```bash
# Run all unit tests across tools
npm test

# Run pipeline smoke test (verifies FinalReport contract without server boot)
npm run smoke -w @tokenslash/server
```

### 3. Launch Frontend Dashboard (Member D)
```bash
npm run dev -w @tokenslash/web
```
Open `http://localhost:5173` in your browser. You can toggle between **⚡ Demo Snapshot** (instant simulated multi-tool execution) and **🌐 Live Backend Seam** (connecting to the MCP backend).

---

## 🏗️ Architecture & Pipeline Execution

```
                              ┌───────────────────────┐
                              │      Raw User Prompt      │
                              └────────────┬──────────────┘
                                           │
              ┌─────────────────────┬──────┴───────┬─────────────────────┐
              ▼                     ▼               ▼                     ▼
   ┌───────────────────┐ ┌────────────────────┐            ┌──────────────────────┐
   │  Token Estimator    │ │ Complexity Classifier │            │   History Analyzer     │
   │     (Member A)       │ │      (Member A)         │            │      (Member B)          │
   └──────────┬──────────┘ └───────────┬──────────┘            └───────────┬──────────┘
              │                        │                                    │
              └────────────┬───────────┘                                    │
                            ▼                                                │
                 ┌────────────────────┐                                     │
                 │  Model Recommender   │                                     │
                 │     (Member B)         │                                     │
                 └──────────┬──────────┘                                     │
                            │                                                │
                            ▼                                                │
                 ┌────────────────────┐                                     │
                 │   Prompt Rewriter     │                                     │
                 │     (Member C)         │                                     │
                 └──────────┬──────────┘                                     │
                            │                                                │
                            └───────────────────┬────────────────────────────┘
                                                 ▼
                                      ┌────────────────────┐
                                      │   Meta-Synthesizer    │
                                      │     (Member C)          │
                                      └──────────┬──────────┘
                                                 ▼
                                      ┌────────────────────┐
                                      │   Dashboard / UI      │
                                      │     (Member D)          │
                                      └────────────────────┘
```

* **Phase 1 (Concurrent)**: Token Estimator, Complexity Classifier, and History Analyzer execute simultaneously via `Promise.all`.
* **Phase 2 (Sequential)**: Model Recommender consumes token counts and complexity scores; Prompt Rewriter consumes task classification.
* **Phase 3 (Synthesis)**: Meta-Synthesizer aggregates all tool outputs with graceful fallback degradation if any upstream tool fails.

---

## 📜 Documentation & Demo Guides
* **[Shared TypeScript Contract](packages/server/src/shared/types.ts)**: The frozen interface layer connecting all modules.
* **[Branch Protection & Merge Rules](.github/branch-protection-notes.md)**: Gatekeeping and cross-review guidelines.
* **[Live Demo Script (DEMO.md)](DEMO.md)**: Step-by-step choreography and Q&A prep for stage presentation.
