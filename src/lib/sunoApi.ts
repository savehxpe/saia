// SAIA Studio — Suno API integration (apibox.erweima.ai)

const SUNO_API_BASE = "https://apibox.erweima.ai/api/v1";
const WEBHOOK_BASE =
  import.meta.env.VITE_APP_URL ?? "https://saia-omega.vercel.app";

function getKey(): string {
  const key = import.meta.env.VITE_SUNO_API_KEY;
  if (!key) throw new Error("VITE_SUNO_API_KEY not set");
  return key;
}

export interface SunoGenerateParams {
  prompt: string;
  model?: "V4" | "V3_5";
  instrumental?: boolean;
  title?: string;
  tags?: string;
}

export interface SunoTaskResult {
  taskId: string;
}

export interface SunoTrack {
  id: string;
  title: string;
  audio_url: string;
  image_url?: string;
  duration?: number;
  status: string;
}

export interface SunoPollResult {
  status: "pending" | "complete";
  taskId: string;
  tracks?: SunoTrack[];
}

// Submit generation job — returns taskId
export async function sunoGenerate(
  params: SunoGenerateParams
): Promise<SunoTaskResult> {
  const callBackUrl = `${WEBHOOK_BASE}/api/suno-webhook`;

  const res = await fetch(`${SUNO_API_BASE}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: params.prompt,
      model: params.model ?? "V4",
      instrumental: params.instrumental ?? true,
      customMode: false,
      callBackUrl,
      ...(params.title ? { title: params.title } : {}),
      ...(params.tags ? { tags: params.tags } : {}),
    }),
  });

  const json = await res.json();

  if (json.code !== 200) {
    throw new Error(`Suno API error: ${json.msg}`);
  }

  return { taskId: json.data.taskId };
}

// Poll our own webhook endpoint for completion
export async function sunoPoll(taskId: string): Promise<SunoPollResult> {
  const res = await fetch(
    `${WEBHOOK_BASE}/api/suno-webhook?taskId=${taskId}`
  );
  const json = await res.json();

  if (json.status === "complete") {
    const tracks: SunoTrack[] = (json.data?.data ?? []).map((t: SunoTrack) => ({
      id: t.id,
      title: t.title,
      audio_url: t.audio_url,
      image_url: t.image_url,
      duration: t.duration,
      status: t.status,
    }));
    return { status: "complete", taskId, tracks };
  }

  return { status: "pending", taskId };
}

// Poll with retries (max 5 min, every 10s)
export async function sunoWaitForResult(
  taskId: string,
  onProgress?: (attempt: number) => void
): Promise<SunoTrack[]> {
  const MAX_ATTEMPTS = 30;
  const INTERVAL_MS = 10_000;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    onProgress?.(i + 1);
    const result = await sunoPoll(taskId);
    if (result.status === "complete" && result.tracks?.length) {
      return result.tracks;
    }
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }

  throw new Error("Suno generation timed out after 5 minutes");
}
