import { useState } from "react";
import { ChevronsLeft, ChevronsRight, MessageSquarePlus } from "lucide-react";

export type SidebarPhase = "input" | "loading" | "report" | "error";

interface SidebarProps {
  phase: SidebarPhase;
  onNewPrompt: () => void;
  mockMode?: boolean;
}

export function Sidebar({ phase, onNewPrompt, mockMode }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const newPromptActive = phase === "input";

  return (
    <aside
      className={`transition-ui sticky top-0 flex h-screen shrink-0 flex-col border-r border-white/[0.06] bg-sidebar ${
        collapsed ? "w-[68px] px-2" : "w-[240px] px-3"
      }`}
    >
      <div
        className={`flex items-center gap-2.5 py-4 ${collapsed ? "justify-center" : "px-1"}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent">
          T
        </span>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold tracking-tight text-ink">
              Tokenslash
            </p>
            <p className="truncate text-[11px] text-ink-muted">AI cost workspace</p>
          </div>
        ) : null}
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1">
        <button
          type="button"
          onClick={onNewPrompt}
          title="New prompt"
          className={`transition-ui flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/[0.06] ${
            collapsed ? "justify-center px-0" : ""
          } ${
            newPromptActive
              ? "bg-accent-soft text-accent shadow-[var(--shadow-glow)]"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0" strokeWidth={2} />
          {!collapsed ? <span>New prompt</span> : null}
        </button>
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-white/[0.06] py-3">
        {mockMode && !collapsed ? (
          <span className="mx-1 rounded-full bg-accent-soft px-2.5 py-1 text-center text-[10px] font-semibold tracking-wide text-accent uppercase">
            Mock data
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`transition-ui flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-white/[0.06] hover:text-ink ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" strokeWidth={2} />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
