// SAIA Studio — Mock Prompt Generation Engine

import type { PromptConfig, GeneratedPrompt } from "../types";

const GENRE_DESCRIPTORS: Record<string, string> = {
  "afrohorrorcore": "ritualistic, unsettling, ceremonial African percussion textures",
  "amapiano-trap": "log drum-driven amapiano groove fused with trap 808 sub pressure",
  "drill": "sliding chromatic bass, menacing minor keys, syncopated hi-hat rolls",
  "afrobeats": "polyrhythmic talking drum patterns, warm bass, call-and-response melody",
  "darkwave": "cold synthesizer pads, post-punk tension, minor chord progressions",
  "hyperpop": "pitch-shifted vocals, blown-out 808s, maximalist texture collisions",
  "neo-soul": "jazz harmony, live-feel drums, warm analog saturation",
  "gqom": "raw warehouse kicks, stripped-back percussion, dark South African club energy",
  "kwaito": "slowed house tempo, mbaqanga influence, deep dub bass",
  "uk-garage": "chopped 2-step rhythms, pitched-up vocal chops, sub-bass pressure",
  "jungle-terror": "breakbeat jungle energy, pitched percussion, tribal motifs",
  "industrial-trap": "metallic percussive hits, distorted 808s, machine-room textures",
};

const MOOD_DESCRIPTORS: Record<string, string> = {
  "eerie": "unsettling",
  "dark": "shadowed and foreboding",
  "aggressive": "high-tension, confrontational",
  "melancholic": "emotionally weighted, longing",
  "euphoric": "peak-moment elevation",
  "haunted": "ghost-frequency reverb trails",
  "cold": "emotionally detached, sterile",
  "raw": "unpolished, authentic grit",
  "spiritual": "ancestral resonance, transcendent",
  "cinematic": "wide-scope, scene-setting",
  "hypnotic": "loop-locked, trance-inducing",
  "grimy": "low-fidelity dirt, street-level",
};

const INSTRUMENT_LINES: Record<string, string> = {
  "808": "sub-frequency 808 bass",
  "hi-hats": "intricate hi-hat programming",
  "snare": "sharp snare transients",
  "piano": "piano chords",
  "strings": "string orchestration",
  "brass": "brass stabs",
  "synth-lead": "lead synthesizer",
  "sub-bass": "deep sub-bass foundation",
  "percussion": "percussive layering",
  "flute": "melodic flute phrases",
  "choir": "choral textures",
  "log-drum": "log drum rhythms",
};

function energyToLabel(val: number): string {
  if (val < 25) return "minimal, spacious";
  if (val < 50) return "moderate energy, room to breathe";
  if (val < 75) return "high energy, dense arrangement";
  return "maximum intensity, wall-of-sound";
}

function darknessToLabel(val: number): string {
  if (val < 25) return "warm and bright";
  if (val < 50) return "neutral with slight shadow";
  if (val < 75) return "dark and weighted";
  return "pitch-black, nihilistic tone";
}

function complexityToLabel(val: number): string {
  if (val < 25) return "stripped-back, minimal layers";
  if (val < 50) return "moderate layering";
  if (val < 75) return "complex arrangement with counter-melodies";
  return "dense, orchestral complexity";
}

function spatialityToLabel(val: number): string {
  if (val < 25) return "dry, close-mic presence";
  if (val < 50) return "light room ambience";
  if (val < 75) return "wide stereo field with reverb depth";
  return "vast, cavernous spatial atmosphere";
}

export function generatePrompt(config: PromptConfig): GeneratedPrompt {
  const { genres, moods, instruments, controls, customSeed } = config;

  const genreLines = genres.map((g) => GENRE_DESCRIPTORS[g] || g).join("; ");
  const moodLines = moods.map((m) => MOOD_DESCRIPTORS[m] || m).join(", ");
  const instrLines =
    instruments.length > 0
      ? instruments.map((i) => INSTRUMENT_LINES[i] || i).join(", ")
      : "standard instrumentation";

  const bpmLine = `${controls.bpm} BPM`;
  const energyLine = energyToLabel(controls.energy);
  const darkLine = darknessToLabel(controls.darkness);
  const complexLine = complexityToLabel(controls.complexity);
  const spatialLine = spatialityToLabel(controls.spatiality);

  let text = `Generate a music production in the style of ${genreLines}.`;

  if (moods.length > 0) {
    text += ` Emotional tone: ${moodLines}.`;
  }

  text += ` Tempo: ${bpmLine}. Energy profile: ${energyLine}. Tonal color: ${darkLine}.`;
  text += ` Arrangement complexity: ${complexLine}. Spatial character: ${spatialLine}.`;

  if (instruments.length > 0) {
    text += ` Core instrumentation: ${instrLines}.`;
  }

  if (customSeed.trim()) {
    text += ` Additional direction: ${customSeed.trim()}.`;
  }

  text += " Render as a full production-ready composition.";

  return {
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
    config,
  };
}
