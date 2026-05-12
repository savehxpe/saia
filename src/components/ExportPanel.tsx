import { useStudio } from "../store/StudioContext";

export default function ExportPanel() {
  const { generatedPrompts, referenceTracks, samplePacks, pitchDeck } = useStudio();

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
    const lines = generatedPrompts.map((p, i) =>
      `--- PROMPT ${i + 1} [${new Date(p.timestamp).toLocaleString()}] ---\n${p.text}`
    ).join("\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saia-prompts-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const ACTIONS = [
    {
      title: "EXPORT ALL (SESSION JSON)",
      sub: "Full session: prompts, references, packs, pitch deck",
      count: null,
      action: exportAll,
      disabled: false,
    },
    {
      title: "EXPORT PROMPTS (.TXT)",
      sub: "All generated prompts as plain text",
      count: generatedPrompts.length,
      action: exportPrompts,
      disabled: generatedPrompts.length === 0,
    },
    {
      title: "API: SEND TO SUNO [PLACEHOLDER]",
      sub: "Direct Suno API integration — coming soon",
      count: null,
      action: () => alert("Suno API integration placeholder"),
      disabled: false,
    },
    {
      title: "API: SEND TO UDIO [PLACEHOLDER]",
      sub: "Direct Udio API integration — coming soon",
      count: null,
      action: () => alert("Udio API integration placeholder"),
      disabled: false,
    },
    {
      title: "API: SEND TO STABLE AUDIO [PLACEHOLDER]",
      sub: "Stability AI audio generation — coming soon",
      count: null,
      action: () => alert("Stable Audio API integration placeholder"),
      disabled: false,
    },
  ];

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

      {/* Export actions */}
      <div className="space-y-2">
        {ACTIONS.map((action) => (
          <button
            key={action.title}
            onClick={action.action}
            disabled={action.disabled}
            className={[
              "w-full border p-4 text-left flex items-center justify-between group transition-colors",
              action.disabled
                ? "border-[#111] opacity-30 cursor-not-allowed"
                : "border-[#1a1a1a] hover:border-[#E0E0E0] hover:bg-[#0a0a0a]",
            ].join(" ")}
          >
            <div>
              <div className="text-[11px] tracking-[0.2em] text-[#E0E0E0] font-bold mb-1">
                {action.title}
              </div>
              <div className="text-[10px] text-[#555]">{action.sub}</div>
            </div>
            {action.count !== null && (
              <div className="text-[#444] text-sm font-bold">{action.count}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
