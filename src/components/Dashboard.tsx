import { useStudio } from "../store/StudioContext";
import type { ActiveView } from "../types";

const TILES: { id: ActiveView; title: string; sub: string }[] = [
  { id: "prompt-generator",   title: "PROMPT GENERATOR",    sub: "Build AI music generation prompts" },
  { id: "reference-lab",      title: "REFERENCE LAB",       sub: "Curate tracks and sonic references" },
  { id: "sample-pack-builder",title: "SAMPLE PACK BUILDER", sub: "Define and export sample kits" },
  { id: "pitch-room",         title: "PITCH ROOM",          sub: "Sync, licensing, placement decks" },
  { id: "export-panel",       title: "EXPORT PANEL",        sub: "Export prompts, packs, and pitch decks" },
];

export default function Dashboard() {
  const { setActiveView, generatedPrompts, referenceTracks, samplePacks } = useStudio();

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-2">COMMAND CENTER</div>
        <h1 className="text-3xl font-bold tracking-widest text-[#E0E0E0]">SAIA STUDIO</h1>
        <p className="text-[#555] text-sm tracking-widest mt-1">AI-AUGMENTED MUSIC PRODUCTION WORKSTATION</p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-10 border-b border-[#111] pb-6">
        {[
          { label: "PROMPTS GENERATED", val: generatedPrompts.length },
          { label: "REFERENCES", val: referenceTracks.length },
          { label: "SAMPLE PACKS", val: samplePacks.length },
          { label: "STATUS", val: "ACTIVE" },
        ].map((s) => (
          <div key={s.label} className="flex-1 border border-[#1a1a1a] p-4">
            <div className="text-[9px] tracking-[0.3em] text-[#444] mb-1">{s.label}</div>
            <div className="text-xl font-bold text-[#E0E0E0]">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Navigation tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {TILES.map((tile) => (
          <button
            key={tile.id}
            onClick={() => setActiveView(tile.id)}
            className="border border-[#1a1a1a] p-6 text-left hover:border-[#E0E0E0] hover:bg-[#0a0a0a] transition-all group"
          >
            <div className="text-[11px] tracking-[0.3em] text-[#E0E0E0] font-bold mb-2 group-hover:text-white">
              {tile.title}
            </div>
            <div className="text-[#444] text-xs group-hover:text-[#777]">{tile.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
