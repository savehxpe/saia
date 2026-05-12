// Vercel serverless function — receives Suno generation callback
// POST /api/suno-webhook

import type { VercelRequest, VercelResponse } from "@vercel/node";

interface SunoCallbackTrack {
  id: string;
  title: string;
  audio_url: string;
  video_url?: string;
  image_url?: string;
  lyric?: string;
  prompt?: string;
  model_name?: string;
  status: string;
  duration?: number;
}

interface SunoCallback {
  code: number;
  msg: string;
  data: {
    callbackType: string;
    taskId: string;
    data: SunoCallbackTrack[];
  };
}

// In-memory store for this serverless instance
// For persistence across cold starts, swap for KV store (Vercel KV / Upstash)
const taskStore: Record<string, SunoCallback["data"]> = {};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // GET — poll for result by taskId
  if (req.method === "GET") {
    const { taskId } = req.query;
    if (!taskId || typeof taskId !== "string") {
      return res.status(400).json({ error: "taskId required" });
    }
    const result = taskStore[taskId];
    if (!result) {
      return res.status(202).json({ status: "pending", taskId });
    }
    return res.status(200).json({ status: "complete", taskId, data: result });
  }

  // POST — receive Suno callback
  if (req.method === "POST") {
    try {
      const payload = req.body as SunoCallback;
      if (payload?.data?.taskId) {
        taskStore[payload.data.taskId] = payload.data;
        console.log(`[suno-webhook] received taskId=${payload.data.taskId} type=${payload.data.callbackType}`);
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[suno-webhook] parse error", err);
      return res.status(400).json({ error: "invalid payload" });
    }
  }

  return res.status(405).json({ error: "method not allowed" });
}
