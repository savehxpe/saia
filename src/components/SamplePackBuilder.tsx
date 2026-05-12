import { useState } from "react";
import { useStudio } from "../store/StudioContext";
import TagSelector from "./TagSelector";
import type { Genre, Mood, SamplePack } from "../types";

const ALL_GENRES: Genre[] = [
  "afrohorrorcore","amapiano-trap","drill","afrobeats","darkwave",
  "hyperpop","neo-soul","gqom","kwaito","uk-garage","jungle-terror","industrial-trap",
];
const ALL_MOODS: Mood[] = [
  "eerie","dark","aggressive","melancholic","euphoric","haunted",
  "cold","raw","spiritual","cinematic","hypnotic","grimy",
];
const KEYS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

export default function SamplePackBuilder() {
  const { samplePacks, addSamplePack } = useStudio();
  const [name, setName] = useState("");
  const [bpm, setBpm] = useState(140);
  const [key, setKey] = useState("C");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [format, setFormat] = useState<"wav" | "mp3" | "flac">("wav");

  function toggleGenre(g: Genre) {
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }
  function toggleMood(m: Mood) {
    setMoods((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  }

  function handleCreate() {
    if (!name) return;
    addSamplePack({ name, bpm, key, genres, moods, exportFormat: format, stems: [] } as Omit<SamplePack, "id" | "createdAt">);
    setName("");
  }

  return (
    <div className="p-8">
      <div className="text-[10px] tracking-[0.4em] text-[#444] mb-2">MODULE</div>
      <h2 className="text-xl font-bold tracking-widest mb-6">SAMPLE PACK BUILDER</h2>

      <div className="flex gap-6">
        {/* Builder form */}
        <div className="w-80 flex-shrink-0">
          <div className="border border-[#1a1a1a] p-5 mb-4">
            <div className="text-[10px] tracking-[0.25em] text-[#555] mb-4">NEW PACK</div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pack name"
              className="w-full bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-xs px-3 py-2 mb-3 placeholder-[#333] focus:outline-none focus:border-[#555]"
            />

            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <div className="text-[9px] tracking-widest text-[#555] mb-1">BPM</div>
                <input
                  type="number"
                  value={bpm}
                  min={60} max={200}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-xs px-3 py-2 focus:outline-none focus:border-[#555]"
                />
              </div>
              <div className="flex-1">
                <div className="text-[9px] tracking-widest text-[#555] mb-1">KEY</div>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#E0E0E0] text-xs px-3 py-2 focus:outline-none focus:border-[#555]"
                >
                  {KEYS.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-[9px] tracking-widest text-[#555] mb-2">EXPORT FORMAT</div>
              <div className="flex gap-2">
                {(["wav","mp3","flac"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={[
                      "flex-1 py-1 text-[9px] tracking-widest border transition-colors",
                      format === f ? "border-[#E0E0E0] text-[#050505] bg-[#E0E0E0]" : "border-[#2a2a2a] text-[#555] hover:border-[#555]",
                    ].join(" ")}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-[#1a1a1a] p-4 mb-4">
            <TagSelector<Genre> label="GENRE" options={ALL_GENRES} selected={genres} onToggle={toggleGenre} />
          </div>
          <div className="border border-[#1a1a1a] p-4 mb-4">
            <TagSelector<Mood> label="MOOD" options={ALL_MOODS} selected={moods} onToggle={toggleMood} />
          </div>

          <button
            onClick={handleCreate}
            disabled={!name}
            className="w-full py-3 bg-[#E0E0E0] text-[#050505] text-[11px] font-bold tracking-[0.3em] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            CREATE PACK
          </button>
        </div>

        {/* Pack list */}
        <div className="flex-1">
          <div className="text-[10px] tracking-widest text-[#444] mb-3">CREATED PACKS</div>
          <div className="space-y-2">
            {samplePacks.length === 0 && (
              <div className="border border-[#111] p-6 text-center text-[#333] text-xs tracking-widest">
                NO PACKS CREATED
              </div>
            )}
            {samplePacks.map((pack) => (
              <div key={pack.id} className="border border-[#1a1a1a] p-4 hover:border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-[#E0E0E0] tracking-wide">{pack.name}</div>
                  <div className="text-[9px] text-[#444]">{pack.exportFormat.toUpperCase()}</div>
                </div>
                <div className="text-[11px] text-[#666]">{pack.bpm} BPM · Key of {pack.key}</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {[...pack.genres, ...pack.moods].map((t) => (
                    <span key={t} className="px-2 py-0.5 border border-[#222] text-[#444] text-[9px]">{t}</span>
                  ))}
                </div>
                <div className="text-[9px] text-[#333] mt-2">
                  {new Date(pack.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
