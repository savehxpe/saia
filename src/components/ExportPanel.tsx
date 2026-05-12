import { useState } from "react";
import { useStudio } from "../store/StudioContext";
import { sunoGenerate, sunoWaitForResult, type SunoTrack } from "../lib/sunoApi";

type JobStatus = "idle" | "submitting" | "waiting" | "done" | "error";

interface SunoJob {
  taskId: string;
  status: JobStatus;
  attempt: number;
  tracks: SunoTrack[];
  error?: string;
  promptSnippet: string;
}

export default function ExportPanel() {
  const { generatedPrompts, referenceTracks, samplePacks, pitchDeck, activePrompt } = useStudio();
  const [sunoJob, setSunoJob] = useState<SunoJob | null>(null);

  const hasKey = !!import.meta.env.VITE_SUNO_API_KEY;

  async function handleSendToSuno(model: "V4" | "V3_5" = "V4") {
    if (!activePrompt) return;
    setSunoJob({
      taskId: "",
      status: "submitting",
      attempt: 0,
      tracks: [],
      promptSnippet: activePrompt.text.slice(0, 80),
    });

    try {
      const { taskId } = await sunoGenerate({
        prompt: activePrompt.text,
        model,
        instrumental: true,
      });

      setSunoJob((j) => j ? { ...j, taskId, status: "waiting" } : j);

      const tracks = await sunoWaitForResult(taskId, (attempt) => {
        setSunoJob((j) => j ? { ...j, attempt, status: "waiting" } : j);
      });

      setSunoJob((j) => j ? { ...j, status: "done", tracks } : j);
    } catch (err) {
      setSunoJob((j) =>
        j ? { ...j, status: "error", error: String(err) } : j
      );
    }
  }

  function exportAll() {
    const data = {
      exportedAt: new Date().toISOString(),
      prompts: generatedPrompts,
      references: referenceTracks,
      samplePacks,
      pitchDeck,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saia-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPrompts() {
    if (!generatedPrompts.length) return;
    const lines = generatedPrompts
      .map((p, i) => `--- PROMPT ${i + 1} [${new Date(p.timestamp).toLocaleString()}] ---\n${p.text}`)
      .join("\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saia-prompts-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="text-[10px] tracking-[0.4em] text-[#444] mb-2">MODULE</div>
      <h2 className="text-xl font-bold tracking-widest mb-6">EXPORT PANEL</h2>

      {/* Session stats */}
      <div className="border border-[#1a1a1a] p-5 mb-6">
        <div className="text-[10px] tracking-[0.25em] text-[#555] mb-4">SESSION SUMMARY</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "PROMPTS", val: generatedPrompts.length },
            { label: "REFERENCES", val: referenceTracks.length },
            { label: "SAMPLE PACKS", val: samplePacks.length },
          ].map((s) => (
            <div key={s.label} className="text-center border border-[#111] p-3">
              <div className="text-2xl font-bold text-[#E0E0E0]">{s.val}</div>
              <div className="text-[9px] tracking-widest text-[#444] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active prompt preview */}
      {activePrompt && (
        <div className="border border-[#1a1a1a] p-4 mb-6">
          <div className="text-[9px] tracking-widest text-[#444] mb-2">ACTIVE PROMPT</div>
          <p className="text-[#666] text-xs leading-relaxed line-clamp-3">{activePrompt.text}</p>
        </div>
      )}

      {/* Suno API section */}
      <div className="border border-[#1a1a1a] mb-4">
        <div className="px-5 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
          <div>
            <div className="text-[11px] tracking-[0.2em] text-[#E0E0E0] font-bold">SEND TO SUNO</div>
            <div className="text-[10px] text-[#555] mt-0.5">Generate audio from active prompt</div>
          </div>
          <div className={[
            "text-[9px] tracking-widest px-2 py-1 border",
            hasKey ? "border-[#1a3a1a] text-[#3a8a3a]" : "border-[#3a1a1a] text-[#8a3a3a]",
          ].join(" ")}>
            {hasKey ? "KEY LOADED" : "NO KEY"}
          </div>
        </div>

        <div className="p-5">
          {!activePrompt ? (
            <div className="text-[#333] text-xs tracking-widest text-center py-3">
              GENERATE A PROMPT FIRST
            </div>
          ) : sunoJob === null ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSendToSuno("V4")}
                disabled={!hasKey}
                className="flex-1 py-3 bg-[#E0E0E0] text-[#050505] text-[10px] font-bold tracking-[0.25em] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                GENERATE — V4
              </button>
              <button
                onClick={() => handleSendToSuno("V3_5")}
                disabled={!hasKey}
                className="flex-1 py-3 border border-[#2a2a2a] text-[#777] text-[10px] tracking-[0.25em] hover:border-[#E0E0E0] hover:text-[#E0E0E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                GENERATE — V3.5
              </button>
            </div>
          ) : (
            <div>
              {/* Job status */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] tracking-widest text-[#555]">
                    {sunoJob.status === "submitting" && "SUBMITTING..."}
                    {sunoJob.status === "waiting" && `GENERATING... (${sunoJob.attempt * 10}s)`}
                    {sunoJob.status === "done" && "COMPLETE"}
                    {sunoJob.status === "error" && "ERROR"}
                  </div>
                  {sunoJob.taskId && (
                    <div className="text-[9px] text-[#333]">
                      {sunoJob.taskId.slice(0, 12)}...
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {(sunoJob.status === "submitting" || sunoJob.status === "waiting") && (
                  <div className="h-px bg-[#111] w-full overflow-hidden">
                    <div
                      className="h-px bg-[#E0E0E0] transition-all duration-1000"
                      style={{ width: `${Math.min((sunoJob.attempt / 30) * 100, 95)}%` }}
                    />
                  </div>
                )}

                {sunoJob.status === "error" && (
                  <div className="text-[10px] text-[#883333] mt-1">{sunoJob.error}</div>
                )}
              </div>

              {/* Tracks */}
              {sunoJob.tracks.length > 0 && (
                <div className="space-y-3">
                  {sunoJob.tracks.map((track) => (
                    <div key={track.id} className="border border-[#1a1a1a] p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-[12px] font-bold text-[#E0E0E0] mb-1">
                            {track.title || "Untitled"}
                          </div>
                          {track.duration && (
                            <div className="text-[9px] text-[#444]">
                              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, "0")}
                            </div>
                          )}
                        </div>
                        <a
                          href={track.audio_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9px] tracking-widest px-3 py-1 border border-[#E0E0E0] text-[#E0E0E0] hover:bg-[#E0E0E0] hover:text-[#050505] transition-colors"
                        >
                          OPEN
                        </a>
                      </div>
                      {track.audio_url && (
                        <audio
                          controls
                          src={track.audio_url}
                          className="w-full h-8 opacity-80"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reset */}
              {(sunoJob.status === "done" || sunoJob.status === "error") && (
                <button
                  onClick={() => setSunoJob(null)}
                  className="mt-3 text-[9px] tracking-widest text-[#444] hover:text-[#777] transition-colors"
                >
                  ← NEW GENERATION
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Other exports */}
      <div className="space-y-2">
        <button
          onClick={exportAll}
          className="w-full border border-[#1a1a1a] p-4 text-left flex items-center justify-between hover:border-[#E0E0E0] hover:bg-[#0a0a0a] transition-colors"
        >
          <div>
            <div className="text-[11px] tracking-[0.2em] text-[#E0E0E0] font-bold mb-1">EXPORT SESSION JSON</div>
            <div className="text-[10px] text-[#555]">All prompts, references, packs, pitch deck</div>
          </div>
        </button>
        <button
          onClick={exportPrompts}
          disabled={!generatedPrompts.length}
          className="w-full border border-[#1a1a1a] p-4 text-left flex items-center justify-between hover:border-[#E0E0E0] hover:bg-[#0a0a0a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <div>
            <div className="text-[11px] tracking-[0.2em] text-[#E0E0E0] font-bold mb-1">EXPORT PROMPTS .TXT</div>
            <div className="text-[10px] text-[#555]">All generated prompts as plain text</div>
          </div>
          <div className="text-[#444] text-sm font-bold">{generatedPrompts.length}</div>
        </button>
        <button
          className="w-full border border-[#111] p-4 text-left opacity-30 cursor-not-allowed"
        >
          <div className="text-[11px] tracking-[0.2em] text-[#E0E0E0] font-bold mb-1">SEND TO UDIO</div>
          <div className="text-[10px] text-[#555]">Udio API integration — next sprint</div>
        </button>
      </div>
    </div>
  );
}
