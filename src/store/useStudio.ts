// SAIA Studio — Global State with autosave + restore

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  PromptConfig,
  PromptControls,
  GeneratedPrompt,
  ReferenceTrack,
  SamplePack,
  PitchDeck,
  ActiveView,
  Genre,
  Mood,
  InstrumentTag,
} from "../types";
import { generatePrompt } from "../lib/mockGenerator";
import { saveSession, loadSession } from "../lib/persistence";

// ── Save status ───────────────────────────────────────────────────────────────
export type SaveStatus = "idle" | "saving" | "saved" | "offline" | "error";

const DEFAULT_CONTROLS: PromptControls = {
  bpm: 140,
  energy: 65,
  darkness: 70,
  complexity: 50,
  spatiality: 60,
};

const DEFAULT_CONFIG: PromptConfig = {
  genres: ["afrohorrorcore"],
  moods: ["dark", "haunted"],
  instruments: ["808", "percussion"],
  controls: DEFAULT_CONTROLS,
  customSeed: "",
};

const DEFAULT_PITCH: PitchDeck = {
  id: crypto.randomUUID(),
  projectName: "",
  logline: "",
  genres: [],
  targetPlacements: [],
  syncNotes: "",
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useStudioState() {
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [config, setConfig] = useState<PromptConfig>(DEFAULT_CONFIG);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<GeneratedPrompt | null>(null);
  const [referenceTracks, setReferenceTracks] = useState<ReferenceTrack[]>([]);
  const [samplePacks, setSamplePacks] = useState<SamplePack[]>([]);
  const [pitchDeck, setPitchDeck] = useState<PitchDeck>(DEFAULT_PITCH);

  // ── Restore on boot ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadSession().then((s) => {
      if (s.config)     setConfig(s.config);
      if (s.generatedPrompts.length) setGeneratedPrompts(s.generatedPrompts);
      if (s.activePrompt)   setActivePrompt(s.activePrompt);
      if (s.referenceTracks.length)  setReferenceTracks(s.referenceTracks);
      if (s.samplePacks.length)      setSamplePacks(s.samplePacks);
      if (s.pitchDeck)  setPitchDeck(s.pitchDeck);
      setActiveView(s.activeView);
      setLastSaved(s.lastSaved);
      setHydrated(true);
    }).catch(() => {
      setHydrated(true); // boot even if restore fails
    });
  }, []);

  // ── Autosave — debounced 800ms after any state change ─────────────────────
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSave = useCallback(async (
    cfg: PromptConfig,
    prompts: GeneratedPrompt[],
    ap: GeneratedPrompt | null,
    refs: ReferenceTrack[],
    packs: SamplePack[],
    pitch: PitchDeck,
    view: ActiveView,
  ) => {
    setSaveStatus("saving");
    try {
      await saveSession({
        config: cfg,
        generatedPrompts: prompts,
        activePrompt: ap,
        referenceTracks: refs,
        samplePacks: packs,
        pitchDeck: pitch,
        activeView: view,
      });
      const now = Date.now();
      setLastSaved(now);
      setSaveStatus("saved");
      // reset to idle after 3s
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus(navigator.onLine ? "error" : "offline");
    }
  }, []);

  // Trigger autosave whenever any persisted state changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(() => {
      doSave(config, generatedPrompts, activePrompt, referenceTracks, samplePacks, pitchDeck, activeView);
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [hydrated, config, generatedPrompts, activePrompt, referenceTracks, samplePacks, pitchDeck, activeView]);

  // Online/offline detection
  useEffect(() => {
    const handleOffline = () => setSaveStatus("offline");
    const handleOnline  = () => {
      if (saveStatus === "offline") setSaveStatus("idle");
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online",  handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online",  handleOnline);
    };
  }, [saveStatus]);

  // ── Manual save ──────────────────────────────────────────────────────────────
  async function manualSave() {
    await doSave(config, generatedPrompts, activePrompt, referenceTracks, samplePacks, pitchDeck, activeView);
  }

  // ── State mutators ───────────────────────────────────────────────────────────
  function setControls(partial: Partial<PromptControls>) {
    setConfig((c) => ({ ...c, controls: { ...c.controls, ...partial } }));
  }

  function toggleGenre(g: Genre) {
    setConfig((c) => ({
      ...c,
      genres: c.genres.includes(g) ? c.genres.filter((x) => x !== g) : [...c.genres, g],
    }));
  }

  function toggleMood(m: Mood) {
    setConfig((c) => ({
      ...c,
      moods: c.moods.includes(m) ? c.moods.filter((x) => x !== m) : [...c.moods, m],
    }));
  }

  function toggleInstrument(i: InstrumentTag) {
    setConfig((c) => ({
      ...c,
      instruments: c.instruments.includes(i) ? c.instruments.filter((x) => x !== i) : [...c.instruments, i],
    }));
  }

  function setCustomSeed(seed: string) {
    setConfig((c) => ({ ...c, customSeed: seed }));
  }

  function generate() {
    const prompt = generatePrompt(config);
    setGeneratedPrompts((prev) => [prompt, ...prev]);
    setActivePrompt(prompt);
  }

  function addReferenceTrack(track: Omit<ReferenceTrack, "id">) {
    setReferenceTracks((prev) => [{ ...track, id: crypto.randomUUID() }, ...prev]);
  }

  function removeReferenceTrack(id: string) {
    setReferenceTracks((prev) => prev.filter((t) => t.id !== id));
  }

  function addSamplePack(pack: Omit<SamplePack, "id" | "createdAt">) {
    setSamplePacks((prev) => [
      { ...pack, id: crypto.randomUUID(), createdAt: Date.now() },
      ...prev,
    ]);
  }

  function removeSamplePack(id: string) {
    setSamplePacks((prev) => prev.filter((p) => p.id !== id));
  }

  function clearHistory() {
    setGeneratedPrompts([]);
    setActivePrompt(null);
  }

  return {
    // hydration
    hydrated,
    // save
    saveStatus, lastSaved, manualSave,
    // nav
    activeView, setActiveView,
    // prompt config
    config, setConfig,
    setControls, toggleGenre, toggleMood, toggleInstrument, setCustomSeed,
    // prompts
    generatedPrompts, activePrompt, setActivePrompt, generate, clearHistory,
    // references
    referenceTracks, addReferenceTrack, removeReferenceTrack,
    // sample packs
    samplePacks, addSamplePack, removeSamplePack,
    // pitch
    pitchDeck, setPitchDeck,
  };
}

export type StudioState = ReturnType<typeof useStudioState>;
