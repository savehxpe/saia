import { useStudio } from "../store/StudioContext";
import type { Genre } from "../types";

const ALL_GENRES: Genre[] = [
  "afrohorrorcore","amapiano-trap","drill","afrobeats","darkwave",
  "hyperpop","neo-soul","gqom","kwaito","uk-garage","jungle-terror","industrial-trap",
];

const PLACEMENT_OPTIONS = [
  "Netflix sync","HBO series","Brand campaign","Game OST",
  "Short film","Documentary","Fashion show","Editorial",
];

export default function PitchRoom() {
  const { pitchDeck, setPitchDeck } = useStudio();

  function updateDeck(partial: Partial<typeof pitchDeck>) {
    setPitchDeck((d) => ({ ...d, ...partial }));
  }

  function toggleGenre(g: Genre) {
    const genres = pitchDeck.genres.includes(g)
      ? pitchDeck.genres.filter((x) => x !== g)
      : [...pitchDeck.genres, g];
    updateDeck({ genres });
  }

  function togglePlacement(p: string) {
    const targetPlacements = pitchDeck.targetPlacements.includes(p)
      ? pitchDeck.targetPlacements.filter((x) => x !== p)
      : [...pitchDeck.targetPlacements, p];
    updateDeck({ targetPlacements });
  }

  function exportPitch() {
    const content = [
      `SAIA STUDIO — PITCH DECK`,
      `========================`,
      `Project: ${pitchDeck.projectName}`,
      ``,
      `LOGLINE`,
      pitchDeck.logline,
      ``,
      `GENRES: ${pitchDeck.genres.join(", ")}`,
      ``,
      `TARGET PLACEMENTS`,
      ...pitchDeck.targetPlacements.map((p) => `· ${p}`),
      ``,
      `SYNC NOTES`,
      pitchDeck.syncNotes,
      ``,
      `Generated: ${new Date().toISOString()}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pitch-${pitchDeck.projectName || "draft"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="text-[10px] tracking-[0.4em] text-[#444] mb-2">MODULE</div>
      <h2 className="text-xl font-bold tracking-widest mb-6">PITCH ROOM</h2>

      <div className="space-y-4">
        <div className="border border-[#1a1a1a] p-5">
          <div className="text-[10px] tracking-[0.25em] text-[#555] mb-3">PROJECT INFO</div>
          <input
            value={pitchDeck.projectName}
            onChange={(e) => updateDeck({ projectName: e.target.value })}
            placeholder="Project / track name"
            className="w-full bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-sm px-3 py-2 mb-3 placeholder-[#333] focus:outline-none focus:border-[#555]"
          />
          <textarea
            value={pitchDeck.logline}
            onChange={(e) => updateDeck({ logline: e.target.value })}
            placeholder="One-line description — what is this track? What feeling does it create?"
            rows={3}
            className="w-full bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-xs px-3 py-2 resize-none placeholder-[#333] focus:outline-none focus:border-[#555]"
          />
        </div>

        <div className="border border-[#1a1a1a] p-5">
          <div className="text-[10px] tracking-[0.25em] text-[#555] mb-3">GENRE TAGS</div>
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={[
                  "px-3 py-1 text-[10px] tracking-widest border transition-colors",
                  pitchDeck.genres.includes(g)
                    ? "border-[#E0E0E0] bg-[#E0E0E0] text-[#050505]"
                    : "border-[#2a2a2a] text-[#555] hover:border-[#555] hover:text-[#999]",
                ].join(" ")}
              >
                {g.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[#1a1a1a] p-5">
          <div className="text-[10px] tracking-[0.25em] text-[#555] mb-3">TARGET PLACEMENTS</div>
          <div className="flex flex-wrap gap-2">
            {PLACEMENT_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => togglePlacement(p)}
                className={[
                  "px-3 py-1 text-[10px] tracking-widest border transition-colors",
                  pitchDeck.targetPlacements.includes(p)
                    ? "border-[#E0E0E0] bg-[#E0E0E0] text-[#050505]"
                    : "border-[#2a2a2a] text-[#555] hover:border-[#555] hover:text-[#999]",
                ].join(" ")}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[#1a1a1a] p-5">
          <div className="text-[10px] tracking-[0.25em] text-[#555] mb-3">SYNC NOTES</div>
          <textarea
            value={pitchDeck.syncNotes}
            onChange={(e) => updateDeck({ syncNotes: e.target.value })}
            placeholder="Mood, scene type, BPM range, stems available, licensing notes..."
            rows={4}
            className="w-full bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-xs px-3 py-2 resize-none placeholder-[#333] focus:outline-none focus:border-[#555]"
          />
        </div>

        <button
          onClick={exportPitch}
          className="w-full py-3 bg-[#E0E0E0] text-[#050505] text-[11px] font-bold tracking-[0.3em] hover:bg-white transition-colors"
        >
          EXPORT PITCH DECK
        </button>
      </div>
    </div>
  );
}
