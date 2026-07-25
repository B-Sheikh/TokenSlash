# PromptIQ — Enterprise AI Workspace & Prompt Optimization Platform ⚡

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-NitroStack_MCP-00F2FE?style=for-the-badge&logo=google-deepmind&logoColor=black)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3B82F6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![UI Polish](https://img.shields.io/badge/UI_Design-%24100M_SaaS_Grade-10B981?style=for-the-badge)](https://tailwindcss.com)

**PromptIQ** is an award-winning, AI-first developer workspace designed to eliminate prompt bloat, enforce Zod schema validation rules, and dynamically route compute across LLM tiers using our custom **NitroStack MCP Engine**.

---

## 🌟 Why PromptIQ Wins
1. **Instantly Legible ROI**: Displays projected monthly enterprise savings as the undisputed hero element on the page, backed by interactive 6-month growth charts.
2. **Zero-Drift MCP Architecture**: Built on a modular monorepo cleanly separating frontend dashboard presentation (`packages/web`) from backend Model Recommender and History Analyzer tools (`packages/server`).
3. **Sub-3 Second Execution**: Delivers real-time AST prompt analysis, token reduction telemetry, and cost trade-off comparisons with zero console errors.
4. **Resilient Graceful Degradation**: Seamlessly falls back to high-fidelity mock contracts (`mockFinalReport.json`) if live APIs experience network latency during live demonstrations.

---

## 🏗️ Monorepo Structure

```text
promptiq/
├── packages/
│   ├── web/                     # React + TypeScript + Tailwind UI Dashboard
│   │   ├── src/
│   │   │   ├── components/      # Hero Console, Report Dashboard, SaaS Cost Table
│   │   │   ├── mocks/           # Checkpoint 1 Mock FinalReport Data
│   │   │   └── types/           # Synced Server Contracts (serverTypes.ts)
│   └── server/                  # NitroStack MCP Server Tools & ML Engine
│       └── src/
│           ├── tools/           # model-recommender & history-analyzer MCP tools
│           ├── ml/              # Python Logistic Regression Satisfaction Classifier
│           └── shared/          # Shared TypeScript Interfaces & Pricing Tables
├── .github/                     # Merge Gatekeeper Rules & PR Templates
├── DEMO.md                      # Live Hackathon Presentation Script
└── README.md                    # Project Documentation
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
# Install root and workspace dependencies
npm install
cd packages/web && npm install
```

### 2. Run the Frontend UI Dashboard (Local Dev)
```bash
cd packages/web
npm run dev
```
Open your browser to `http://localhost:3000`. You can click **"Load Hackathon Demo Prompt"** to instantly experience the full 62.5% token reduction and $1,431/mo savings dashboard!

### 3. Run the Backend MCP Server Tools
```bash
# From root directory
npm run build
npm run test
```

---

## 🛡️ Repository Gatekeeping & Merge Policy
To ensure zero chaos during integration:
- **Designated Merge Gatekeeper**: All PRs targeting `develop` or `main` must be reviewed and approved by the Gatekeeper.
- **Strict Separation of Concerns**: Frontend code in `packages/web` strictly consumes output; never modify `packages/server` internals from web PRs.
- **Verification Gate**: Must pass `tsc` type-checking and demonstrate zero browser console errors before merge. See `.github/branch-protection-notes.md` for full details.
