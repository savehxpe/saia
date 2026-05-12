import { useState } from "react";
import { useStudio } from "../store/StudioContext";

export default function ReferenceLab() {
  const { referenceTracks, addReferenceTrack, removeReferenceTrack } = useStudio();
  const [form, setForm] = useState({ title: "", artist: "", url: "", notes: "", tags: "" });

  function handleAdd() {
    if (!form.title || !form.artist) return;
    addReferenceTrack({
      title: form.title,
      artist: form.artist,
      url: form.url,
      notes: form.notes,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setForm({ title: "", artist: "", url: "", notes: "", tags: "" });
  }

  return (
    <div className="p-8">
      <div className="text-[10px] tracking-[0.4em] text-[#444] mb-2">MODULE</div>
      <h2 className="text-xl font-bold tracking-widest mb-6">REFERENCE LAB</h2>

      {/* Add form */}
      <div className="border border-[#1a1a1a] p-6 mb-6">
        <div className="text-[10px] tracking-[0.25em] text-[#555] mb-4">ADD REFERENCE</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { key: "title",  placeholder: "Track title" },
            { key: "artist", placeholder: "Artist / producer" },
            { key: "url",    placeholder: "URL (optional)" },
            { key: "tags",   placeholder: "Tags comma-separated" },
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-xs px-3 py-2 placeholder-[#333] focus:outline-none focus:border-[#555]"
            />
          ))}
        </div>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Production notes..."
          rows={2}
          className="w-full bg-transparent border border-[#1a1a1a] text-[#E0E0E0] text-xs px-3 py-2 mb-3 resize-none placeholder-[#333] focus:outline-none focus:border-[#555]"
        />
        <button
          onClick={handleAdd}
          disabled={!form.title || !form.artist}
          className="px-6 py-2 bg-[#E0E0E0] text-[#050505] text-[10px] font-bold tracking-widest hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ADD REFERENCE
        </button>
      </div>

      {/* Track list */}
      <div className="space-y-2">
        {referenceTracks.length === 0 && (
          <div className="border border-[#111] p-6 text-center text-[#333] text-xs tracking-widest">
            NO REFERENCES YET
          </div>
        )}
        {referenceTracks.map((track) => (
          <div
            key={track.id}
            className="border border-[#1a1a1a] p-4 flex items-start justify-between group hover:border-[#2a2a2a]"
          >
            <div>
              <div className="text-[13px] font-bold text-[#E0E0E0] mb-1">{track.title}</div>
              <div className="text-[11px] text-[#666] mb-2">{track.artist}</div>
              {track.url && (
                <div className="text-[9px] text-[#444] mb-2 truncate max-w-xs">{track.url}</div>
              )}
              {track.notes && (
                <div className="text-[11px] text-[#555] italic mb-2">{track.notes}</div>
              )}
              {track.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {track.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 border border-[#2a2a2a] text-[#555] text-[9px] tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => removeReferenceTrack(track.id)}
              className="text-[#2a2a2a] hover:text-[#ff4444] text-xs ml-4 transition-colors opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
