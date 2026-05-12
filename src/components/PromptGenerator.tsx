import { useStudio } from "../store/StudioContext";
import ControlSlider from "./ControlSlider";
import TagSelector from "./TagSelector";
import PromptOutput from "./PromptOutput";
import type { Genre, Mood, InstrumentTag } from "../types";

const ALL_GENRES: Genre[] = [
  "afrohorrorcore","amapiano-trap","drill","afrobeats","darkwave",
  "hyperpop","neo-soul","gqom","kwaito","uk-garage","jungle-terror","industrial-trap",
];
const ALL_MOODS: Mood[] = [
  "eerie","dark","aggressive","melancholic","euphoric","haunted",
  "cold","raw","spiritual","cinematic","hypnotic","grimy",
];
const ALL_INSTRUMENTS: InstrumentTag[] = [
  "808","hi-hats","snare","piano","strings","brass",
  "synth-lead","sub-bass","percussion","flute","choir","log-drum",
];

export default function PromptGenerator() {
  const studio = useStudio();
  const { config, controls } = { config: studio.config, controls: studio.config.controls };

  return (
    <div className="p-8 flex gap-6 h-full">
      {/* LEFT: Controls */}
      <div className="w-80 flex-shrink-0 overflow-y-auto pr-2">
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-2">MODULE</div>
        <h2 className="text-xl font-bold tracking-widest mb-6">PROMPT GENERATOR</h2>

        {/* Sliders */}
        <div className="mb-4 border border-[#1a1a1a] p-4">
          <div className="text-[10px] tracking-[0.25em] text-[#555] mb-4">CONTROLS</div>
          <ControlSlider
            label="BPM"
            value={controls.bpm}
            min={60} max={200} step={1} unit=" BPM"
            onChange={(v) => studio.setControls({ bpm: v })}
          />
          <ControlSlider
            label="ENERGY"
            value={controls.energy}
            min={0} max={100}
            onChange={(v) => studio.setControls({ energy: v })}
          />
          <ControlSlider
            label="DARKNESS"
            value={controls.darkness}
            min={0} max={100}
            onChange={(v) => studio.setControls({ darkness: v })}
          />
          <ControlSlider
            label="COMPLEXITY"
            value={controls.complexity}
            min={0} max={100}
            onChange={(v) => studio.setControls({ complexity: v })}
          />
          <ControlSlider
            label="SPATIALITY"
            value={controls.spatiality}
            min={0} max={100}
            onChange={(v) => studio.setControls({ spatiality: v })}
          />
        </div>

        {/* Genre tags */}
        <div className="border border-[#1a1a1a] p-4 mb-4">
          <TagSelector<Genre>
            label="GENRE"
            options={ALL_GENRES}
            selected={config.genres}
            onToggle={studio.toggleGenre}
          />
        </div>

        {/* Mood tags */}
        <div className="border border-[#1a1a1a] p-4 mb-4">
          <TagSelector<Mood>
            label="MOOD"
            options={ALL_MOODS}
            selected={config.moods}
            onToggle={studio.toggleMood}
          />
        </div>

        {/* Instrument tags */}
        <div className="border border-[#1a1a1a] p-4 mb-4">
          <TagSelector<InstrumentTag>
            label="INSTRUMENTS"
            options={ALL_INSTRUMENTS}
            selected={config.instruments}
            onToggle={studio.toggleInstrument}
          />
        </div>

        {/* Custom seed */}
        <div className="border border-[#1a1a1a] p-4 mb-4">
          <div className="text-[10px] tracking-[0.25em] text-[#555] mb-2">CUSTOM DIRECTION</div>
          <textarea
            value={config.customSeed}
            onChange={(e) => studio.setCustomSeed(e.target.value)}
            placeholder="e.g. influenced by Burial, recorded in a cave..."
            rows={3}
            className="w-full bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-xs p-2 resize-none placeholder-[#333] focus:outline-none focus:border-[#555]"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={studio.generate}
          className="w-full py-3 bg-[#E0E0E0] text-[#050505] text-[11px] font-bold tracking-[0.3em] hover:bg-white transition-colors"
        >
          GENERATE PROMPT
        </button>
      </div>

      {/* RIGHT: Output + History */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <PromptOutput prompt={studio.activePrompt} />

        {studio.generatedPrompts.length > 1 && (
          <div className="border border-[#1a1a1a] flex-shrink-0">
            <div className="px-4 py-2 border-b border-[#1a1a1a] text-[10px] tracking-[0.3em] text-[#555]">
              HISTORY ({studio.generatedPrompts.length})
            </div>
            <div className="max-h-40 overflow-y-auto">
              {studio.generatedPrompts.slice(1).map((p) => (
                <button
                  key={p.id}
                  onClick={() => studio.setActivePrompt(p)}
                  className="w-full text-left px-4 py-2 border-b border-[#0d0d0d] hover:bg-[#0a0a0a] transition-colors"
                >
                  <div className="text-[9px] text-[#444] tracking-widest mb-1">
                    {new Date(p.timestamp).toLocaleTimeString()} · {p.id.slice(0,8)}
                  </div>
                  <div className="text-[11px] text-[#666] truncate">{p.text.slice(0, 80)}…</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
