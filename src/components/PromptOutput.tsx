import { useState } from "react";
import type { GeneratedPrompt } from "../types";

interface Props {
  prompt: GeneratedPrompt | null;
}

export default function PromptOutput({ prompt }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleSave() {
    if (!prompt) return;
    const blob = new Blob([prompt.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saia-prompt-${prompt.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportJSON() {
    if (!prompt) return;
    const blob = new Blob([JSON.stringify(prompt, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saia-prompt-${prompt.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="border border-[#1a1a1a] flex flex-col h-full min-h-[280px]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a]">
        <span className="text-[10px] tracking-[0.3em] text-[#555]">OUTPUT</span>
        {prompt && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-[9px] tracking-widest px-3 py-1 border border-[#2a2a2a] text-[#777] hover:border-[#E0E0E0] hover:text-[#E0E0E0] transition-colors"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
            <button
              onClick={handleSave}
              className="text-[9px] tracking-widest px-3 py-1 border border-[#2a2a2a] text-[#777] hover:border-[#E0E0E0] hover:text-[#E0E0E0] transition-colors"
            >
              SAVE .TXT
            </button>
            <button
              onClick={handleExportJSON}
              className="text-[9px] tracking-widest px-3 py-1 border border-[#2a2a2a] text-[#777] hover:border-[#E0E0E0] hover:text-[#E0E0E0] transition-colors"
            >
              EXPORT JSON
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 p-4">
        {prompt ? (
          <>
            <p className="text-[#E0E0E0] text-sm leading-relaxed">{prompt.text}</p>
            <div className="mt-4 text-[9px] tracking-widest text-[#333]">
              ID: {prompt.id.slice(0, 16)}... &nbsp;·&nbsp;{" "}
              {new Date(prompt.timestamp).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-[#333] text-xs tracking-widest">
              CONFIGURE AND GENERATE →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
