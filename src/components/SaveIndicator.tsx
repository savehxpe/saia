import { useEffect, useState } from "react";
import type { SaveStatus } from "../store/useStudio";

interface Props {
  status: SaveStatus;
  lastSaved: number | null;
  onManualSave: () => void;
}

const STATUS_CONFIG: Record<SaveStatus, { label: string; dot: string }> = {
  idle:    { label: "",                 dot: "#2a2a2a" },
  saving:  { label: "Saving…",         dot: "#888" },
  saved:   { label: "Changes saved",   dot: "#3a8a3a" },
  offline: { label: "Offline — saved locally", dot: "#8a6a1a" },
  error:   { label: "Save failed",     dot: "#8a2a2a" },
};

export default function SaveIndicator({ status, lastSaved, onManualSave }: Props) {
  const [visible, setVisible] = useState(false);

  // Show indicator whenever there's something to say
  useEffect(() => {
    if (status !== "idle") {
      setVisible(true);
    } else {
      // fade out after 1.5s of idle
      const t = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const cfg = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-3">
      {/* Status pill */}
      <div
        className={[
          "flex items-center gap-1.5 transition-opacity duration-500",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: cfg.dot }}
        />
        <span className="text-[9px] tracking-[0.2em] text-[#555]">{cfg.label}</span>
        {status === "idle" && lastSaved && (
          <span className="text-[9px] text-[#333]">
            {formatRelative(lastSaved)}
          </span>
        )}
      </div>

      {/* Manual save button */}
      <button
        onClick={onManualSave}
        className="text-[9px] tracking-[0.2em] text-[#333] hover:text-[#777] border border-[#1a1a1a] hover:border-[#333] px-2 py-1 transition-colors"
        title="Save project"
      >
        SAVE
      </button>
    </div>
  );
}

function formatRelative(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5)  return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
