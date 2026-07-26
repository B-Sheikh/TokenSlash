# TokenSlash — Enterprise AI Workspace & Prompt Optimization Platform ⚡

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-NitroStack_MCP-00F2FE?style=for-the-badge&logo=google-deepmind&logoColor=black)](https://github.com/B-Sheikh/TokenSlash)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3B82F6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite + React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev)
[![UI Polish](https://img.shields.io/badge/UI_Design-%24100M_SaaS_Grade-10B981?style=for-the-badge)](https://tailwindcss.com)

**TokenSlash** is an award-winning, AI-first developer workspace designed to eliminate prompt bloat, enforce Zod schema validation rules, and dynamically route compute across LLM tiers using our custom **NitroStack MCP Engine**.

---

## 🌟 Key Features & Workspace Modules

TokenSlash includes a full suite of interactive enterprise views accessible via the sidebar navigation:

1. **⚡ Hero Optimization Console (`Dashboard`)**:
   - Live AST syntactic prompt parsing, token reduction estimation, and real-time ROI calculation.
   - Instantly compares token savings (e.g. 62.5% reduction) and projects monthly enterprise cost savings.

2. **📜 Optimization History (`History`)**:
   - Inspect, filter, and compare past prompt optimization sessions by model, date, or category.
   - 1-click re-running of historical prompts directly inside the console.

3. **📊 Enterprise Telemetry & Analytics (`Analytics`)**:
   - Recharts-powered interactive charts for 6-month token reduction growth, model route allocation (Gemini, Claude, GPT-4o, Llama), and latency distribution histogram.

4. **🔖 Saved Prompt Library (`Saved Prompts`)**:
   - Curated enterprise prompt template library with tag filtering, category management, and custom template creation modal.

5. **⭐ Favorites & Routing Presets (`Favorites`)**:
   - Configure default compute routing presets (`Max Cost Optimization`, `Balanced Quality`, `Ultra Low Latency`).

6. **⏱️ Recent Sessions & Audit Trail (`Recent Sessions`)**:
   - Real-time audit log of MCP server tool calls, cache hits, latency metrics, and raw payload inspection drawer.

7. **⚙️ Platform Settings & MCP Config (`Settings`)**:
   - Configure local REST API bridge URL (`http://localhost:3001`), provider API keys (Google Gemini, Anthropic, OpenAI), and target latency/savings thresholds.

8. **📚 Help & Documentation Hub (`Help & Docs`)**:
   - Interactive Quickstart guide, REST API reference (cURL, Python, TS snippets), and architectural FAQs.

9. **ℹ️ About NitroStack Architecture (`About`)**:
   - System specifications, AST prompt compression benchmarks, and ML satisfaction classifier details.

---

## 🏗️ Monorepo Structure

```text
TokenSlash/
├── packages/
│   ├── web/                     # React 18 + Vite + Tailwind UI Dashboard
│   │   ├── src/
│   │   │   ├── components/      # Dashboard, HistoryView, AnalyticsView, SavedPromptsView, 
│   │   │   │                    # FavoritesView, RecentSessionsView, SettingsView, HelpDocsView, AboutView
│   │   │   ├── mocks/           # Checkpoint Mock FinalReport Data (mockFinalReport.json)
│   │   │   └── types/           # Synced Server Contracts (serverTypes.ts)
│   └── server/                  # NitroStack MCP Server Tools & REST API Server
│       └── src/
│           ├── api_server.ts    # REST API Bridge Server (Port 3001)
│           ├── tools/           # Model-Recommender & History-Analyzer MCP tools
│           ├── ml/              # Python Logistic Regression Satisfaction Classifier
│           └── shared/          # TypeScript Interfaces & Model Pricing Tables
├── run_tokenslash.py             # Standalone Python Usage Intelligence Inference Engine
├── DEMO.md                      # Hackathon Presentation Script
└── README.md                    # Project Documentation
```

---

## 🚀 Local Setup & Quickstart Guide

### 1. Install Workspace Dependencies

Run `npm install` in the root workspace as well as in `packages/server` and `packages/web`:

```cmd
:: Install root dependencies
cmd.exe /c npm install

:: Install backend server dependencies
cmd.exe /c cd packages/server && npm install

:: Install frontend web dependencies
cmd.exe /c cd packages/web && npm install
```

### 2. Start the Backend API Bridge Server (Port 3001)

```cmd
cmd.exe /c npx tsx packages/server/src/api_server.ts
```
The REST API server will start listening at `http://localhost:3001`.

### 3. Start the Frontend Web Dashboard (Port 3000)

In a second terminal:

```cmd
cmd.exe /c npm --prefix packages/web run dev
```
Open your browser to `http://localhost:3000` to interact with the full TokenSlash application.

---

## 🐍 Standalone Python Inference Runner

TokenSlash includes a standalone Python ML runner for prompt analysis:

```bash
python run_tokenslash.py "Refactor this React component step by step using Next.js Server Actions and Zod validation."
```

---

## 🛡️ Architecture & Resilience

- **Sub-3 Second Execution**: Real-time AST prompt analysis, token reduction telemetry, and cost trade-off comparisons.
- **Resilient Graceful Degradation**: If the local backend server is offline during a demonstration, the frontend seamlessly falls back to formatted mock reports (`mockFinalReport.json`) with zero console errors.
- **Strict Separation of Concerns**: Monorepo structure separating UI presentation (`packages/web`) from backend MCP tools (`packages/server`).
