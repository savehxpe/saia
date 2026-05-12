import type { ReactNode } from "react";
import { useStudio } from "../store/StudioContext";
import SaveIndicator from "./SaveIndicator";
import type { ActiveView } from "../types";

const NAV_ITEMS: { id: ActiveView; label: string }[] = [
  { id: "dashboard",           label: "DASHBOARD" },
  { id: "prompt-generator",    label: "PROMPT GEN" },
  { id: "reference-lab",       label: "REF LAB" },
  { id: "sample-pack-builder", label: "SAMPLE PACK" },
  { id: "pitch-room",          label: "PITCH ROOM" },
  { id: "export-panel",        label: "EXPORT" },
];

interface Props { children: ReactNode }

export default function AppShell({ children }: Props) {
  const { activeView, setActiveView, saveStatus, lastSaved, manualSave, hydrated } = useStudio();

  return (
    <div className="flex h-screen bg-[#050505] text-[#E0E0E0] font-mono overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 border-r border-[#1a1a1a] flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b border-[#1a1a1a]">
          <div className="text-xs tracking-[0.4em] text-[#555] mb-1">OUTWORLD HQ</div>
          <div className="text-lg font-bold tracking-widest text-[#E0E0E0]">SAIA</div>
          <div className="text-[10px] tracking-[0.3em] text-[#444]">STUDIO v0.1</div>
        </div>

        <nav className="flex-1 pt-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={[
                "w-full text-left px-4 py-3 text-[11px] tracking-[0.25em] transition-colors",
                activeView === item.id
                  ? "bg-[#1a1a1a] text-[#E0E0E0] border-l-2 border-[#E0E0E0]"
                  : "text-[#555] hover:text-[#999] hover:bg-[#0d0d0d] border-l-2 border-transparent",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#1a1a1a] space-y-2">
          <div className="text-[9px] tracking-widest text-[#333]">FIELD MODE ACTIVE</div>
          {!hydrated && (
            <div className="text-[9px] tracking-widest text-[#444]">RESTORING…</div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex-shrink-0 h-10 border-b border-[#111] flex items-center justify-end px-6 gap-4">
          <SaveIndicator
            status={saveStatus}
            lastSaved={lastSaved}
            onManualSave={manualSave}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
