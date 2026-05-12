// SAIA Studio — Core Type Definitions

export type Genre =
  | "afrohorrorcore"
  | "amapiano-trap"
  | "drill"
  | "afrobeats"
  | "darkwave"
  | "hyperpop"
  | "neo-soul"
  | "gqom"
  | "kwaito"
  | "uk-garage"
  | "jungle-terror"
  | "industrial-trap";

export type Mood =
  | "eerie"
  | "dark"
  | "aggressive"
  | "melancholic"
  | "euphoric"
  | "haunted"
  | "cold"
  | "raw"
  | "spiritual"
  | "cinematic"
  | "hypnotic"
  | "grimy";

export type InstrumentTag =
  | "808"
  | "hi-hats"
  | "snare"
  | "piano"
  | "strings"
  | "brass"
  | "synth-lead"
  | "sub-bass"
  | "percussion"
  | "flute"
  | "choir"
  | "log-drum";

export interface PromptControls {
  bpm: number;
  energy: number;
  darkness: number;
  complexity: number;
  spatiality: number;
}

export interface PromptConfig {
  genres: Genre[];
  moods: Mood[];
  instruments: InstrumentTag[];
  controls: PromptControls;
  customSeed: string;
}

export interface GeneratedPrompt {
  id: string;
  text: string;
  timestamp: number;
  config: PromptConfig;
}

export interface ReferenceTrack {
  id: string;
  title: string;
  artist: string;
  url?: string;
  notes?: string;
  tags: string[];
}

export interface SamplePack {
  id: string;
  name: string;
  bpm: number;
  key: string;
  genres: Genre[];
  moods: Mood[];
  exportFormat: "wav" | "mp3" | "flac";
  createdAt: number;
}

export interface PitchDeck {
  id: string;
  projectName: string;
  logline: string;
  genres: Genre[];
  targetPlacements: string[];
  syncNotes: string;
}

export type ActiveView =
  | "dashboard"
  | "prompt-generator"
  | "reference-lab"
  | "sample-pack-builder"
  | "pitch-room"
  | "export-panel";
