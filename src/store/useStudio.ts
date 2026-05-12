// SAIA Studio — Global State (React useState/Context — no external deps)

import { useState } from "react";
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

export function useStudioState() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [config, setConfig] = useState<PromptConfig>(DEFAULT_CONFIG);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<GeneratedPrompt | null>(null);
  const [referenceTracks, setReferenceTracks] = useState<ReferenceTrack[]>([]);
  const [samplePacks, setSamplePacks] = useState<SamplePack[]>([]);
  const [pitchDeck, setPitchDeck] = useState<PitchDeck>({
    id: crypto.randomUUID(),
    projectName: "",
    logline: "",
    genres: [],
    targetPlacements: [],
    syncNotes: "",
  });

  // Controls
  function setControls(partial: Partial<PromptControls>) {
    setConfig((c) => ({ ...c, controls: { ...c.controls, ...partial } }));
  }

  function toggleGenre(g: Genre) {
    setConfig((c) => ({
      ...c,
      genres: c.genres.includes(g)
        ? c.genres.filter((x) => x !== g)
        : [...c.genres, g],
    }));
  }

  function toggleMood(m: Mood) {
    setConfig((c) => ({
      ...c,
      moods: c.moods.includes(m)
        ? c.moods.filter((x) => x !== m)
        : [...c.moods, m],
    }));
  }

  function toggleInstrument(i: InstrumentTag) {
    setConfig((c) => ({
      ...c,
      instruments: c.instruments.includes(i)
        ? c.instruments.filter((x) => x !== i)
        : [...c.instruments, i],
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

  return {
    activeView, setActiveView,
    config, setConfig,
    generatedPrompts,
    activePrompt, setActivePrompt,
    referenceTracks,
    samplePacks,
    pitchDeck, setPitchDeck,
    setControls,
    toggleGenre, toggleMood, toggleInstrument,
    setCustomSeed,
    generate,
    addReferenceTrack, removeReferenceTrack,
    addSamplePack,
  };
}

export type StudioState = ReturnType<typeof useStudioState>;
