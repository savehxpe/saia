// SAIA Studio — Persistence layer
// Serializes full session to IndexedDB. One key per concern for granular writes.

import { dbGet, dbSet, lsGet, lsSet } from "./db";
import type {
  PromptConfig,
  GeneratedPrompt,
  ReferenceTrack,
  SamplePack,
  PitchDeck,
  ActiveView,
} from "../types";

// ── Keys ─────────────────────────────────────────────────────────────────────
const KEY_CONFIG          = "config";
const KEY_PROMPTS         = "generatedPrompts";
const KEY_ACTIVE_PROMPT   = "activePrompt";
const KEY_REFERENCES      = "referenceTracks";
const KEY_SAMPLE_PACKS    = "samplePacks";
const KEY_PITCH_DECK      = "pitchDeck";
const LS_KEY_ACTIVE_VIEW  = "saia_activeView";
const LS_KEY_LAST_SAVED   = "saia_lastSaved";

// ── Write ─────────────────────────────────────────────────────────────────────
export async function saveSession(session: {
  config: PromptConfig;
  generatedPrompts: GeneratedPrompt[];
  activePrompt: GeneratedPrompt | null;
  referenceTracks: ReferenceTrack[];
  samplePacks: SamplePack[];
  pitchDeck: PitchDeck;
  activeView: ActiveView;
}): Promise<void> {
  await Promise.all([
    dbSet(KEY_CONFIG,        session.config),
    dbSet(KEY_PROMPTS,       session.generatedPrompts),
    dbSet(KEY_ACTIVE_PROMPT, session.activePrompt),
    dbSet(KEY_REFERENCES,    session.referenceTracks),
    dbSet(KEY_SAMPLE_PACKS,  session.samplePacks),
    dbSet(KEY_PITCH_DECK,    session.pitchDeck),
  ]);
  // active view is tiny — localStorage is fine
  lsSet(LS_KEY_ACTIVE_VIEW, session.activeView);
  lsSet(LS_KEY_LAST_SAVED,  Date.now());
}

// ── Read ──────────────────────────────────────────────────────────────────────
export interface RestoredSession {
  config: PromptConfig | undefined;
  generatedPrompts: GeneratedPrompt[];
  activePrompt: GeneratedPrompt | null;
  referenceTracks: ReferenceTrack[];
  samplePacks: SamplePack[];
  pitchDeck: PitchDeck | undefined;
  activeView: ActiveView;
  lastSaved: number | null;
}

export async function loadSession(): Promise<RestoredSession> {
  const [config, prompts, activePrompt, refs, packs, pitch] = await Promise.all([
    dbGet<PromptConfig>(KEY_CONFIG),
    dbGet<GeneratedPrompt[]>(KEY_PROMPTS),
    dbGet<GeneratedPrompt | null>(KEY_ACTIVE_PROMPT),
    dbGet<ReferenceTrack[]>(KEY_REFERENCES),
    dbGet<SamplePack[]>(KEY_SAMPLE_PACKS),
    dbGet<PitchDeck>(KEY_PITCH_DECK),
  ]);

  return {
    config,
    generatedPrompts:  prompts       ?? [],
    activePrompt:      activePrompt  ?? null,
    referenceTracks:   refs          ?? [],
    samplePacks:       packs         ?? [],
    pitchDeck:         pitch,
    activeView:        lsGet<ActiveView>(LS_KEY_ACTIVE_VIEW, "dashboard"),
    lastSaved:         lsGet<number | null>(LS_KEY_LAST_SAVED, null),
  };
}

export function getLastSaved(): number | null {
  return lsGet<number | null>(LS_KEY_LAST_SAVED, null);
}

// ── Export helpers ─────────────────────────────────────────────────────────────
export interface FullSession {
  exportedAt: string;
  config: PromptConfig;
  generatedPrompts: GeneratedPrompt[];
  activePrompt: GeneratedPrompt | null;
  referenceTracks: ReferenceTrack[];
  samplePacks: SamplePack[];
  pitchDeck: PitchDeck;
}

export function sessionToJSON(s: FullSession): string {
  return JSON.stringify(s, null, 2);
}

export function sessionToMarkdown(s: FullSession): string {
  const lines: string[] = [
    `# SAIA Studio Session`,
    `**Exported:** ${s.exportedAt}`,
    ``,
    `---`,
    `## Prompt Config`,
    `- **Genres:** ${s.config.genres.join(", ")}`,
    `- **Moods:** ${s.config.moods.join(", ")}`,
    `- **Instruments:** ${s.config.instruments.join(", ")}`,
    `- **BPM:** ${s.config.controls.bpm}`,
    `- **Energy:** ${s.config.controls.energy}`,
    `- **Darkness:** ${s.config.controls.darkness}`,
    `- **Complexity:** ${s.config.controls.complexity}`,
    `- **Spatiality:** ${s.config.controls.spatiality}`,
    s.config.customSeed ? `- **Custom Direction:** ${s.config.customSeed}` : "",
    ``,
    `---`,
    `## Generated Prompts (${s.generatedPrompts.length})`,
    ...s.generatedPrompts.map((p, i) =>
      `### Prompt ${i + 1}
_${new Date(p.timestamp).toLocaleString()}_

${p.text}`
    ),
    ``,
    `---`,
    `## Reference Tracks (${s.referenceTracks.length})`,
    ...s.referenceTracks.map((t) =>
      `### ${t.title} — ${t.artist}
${t.url ? `URL: ${t.url}
` : ""}${t.notes ? `Notes: ${t.notes}
` : ""}Tags: ${t.tags.join(", ")}`
    ),
    ``,
    `---`,
    `## Sample Packs (${s.samplePacks.length})`,
    ...s.samplePacks.map((p) =>
      `### ${p.name}
- BPM: ${p.bpm} | Key: ${p.key} | Format: ${p.exportFormat}
- Genres: ${p.genres.join(", ")}
- Moods: ${p.moods.join(", ")}`
    ),
    ``,
    `---`,
    `## Pitch Deck`,
    `**Project:** ${s.pitchDeck.projectName}`,
    `**Logline:** ${s.pitchDeck.logline}`,
    `**Target Placements:** ${s.pitchDeck.targetPlacements.join(", ")}`,
    `**Sync Notes:** ${s.pitchDeck.syncNotes}`,
  ];
  return lines.filter((l) => l !== "").join("\n");
}

export function sessionToText(s: FullSession): string {
  const lines: string[] = [
    `SAIA STUDIO SESSION EXPORT`,
    `Exported: ${s.exportedAt}`,
    `${"=".repeat(50)}`,
    ``,
    `PROMPT CONFIG`,
    `Genres: ${s.config.genres.join(", ")}`,
    `Moods: ${s.config.moods.join(", ")}`,
    `Instruments: ${s.config.instruments.join(", ")}`,
    `BPM: ${s.config.controls.bpm}  Energy: ${s.config.controls.energy}  Darkness: ${s.config.controls.darkness}`,
    `Complexity: ${s.config.controls.complexity}  Spatiality: ${s.config.controls.spatiality}`,
    s.config.customSeed ? `Custom: ${s.config.customSeed}` : "",
    ``,
    `GENERATED PROMPTS (${s.generatedPrompts.length})`,
    `${"-".repeat(40)}`,
    ...s.generatedPrompts.map((p, i) =>
      `[${i + 1}] ${new Date(p.timestamp).toLocaleString()}
${p.text}`
    ),
    ``,
    `REFERENCE TRACKS`,
    `${"-".repeat(40)}`,
    ...s.referenceTracks.map((t) =>
      `${t.title} by ${t.artist}${t.url ? `
  URL: ${t.url}` : ""}${t.notes ? `
  Notes: ${t.notes}` : ""}
  Tags: ${t.tags.join(", ")}`
    ),
    ``,
    `SAMPLE PACKS`,
    `${"-".repeat(40)}`,
    ...s.samplePacks.map((p) =>
      `${p.name} | ${p.bpm} BPM | Key: ${p.key} | ${p.exportFormat.toUpperCase()}
  Genres: ${p.genres.join(", ")}`
    ),
    ``,
    `PITCH DECK`,
    `${"-".repeat(40)}`,
    `Project: ${s.pitchDeck.projectName}`,
    `Logline: ${s.pitchDeck.logline}`,
    `Placements: ${s.pitchDeck.targetPlacements.join(", ")}`,
    `Sync Notes: ${s.pitchDeck.syncNotes}`,
  ];
  return lines.filter((l) => l !== "").join("\n");
}

export function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
