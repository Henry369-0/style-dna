import { NextRequest, NextResponse } from "next/server";
import type { ClientImageMetrics, StyleDNA } from "../../../lib/types";

export const runtime = "nodejs";

const ANALYSIS_PROMPT = `You are a professional art director and visual systems designer.

Analyze the uploaded reference image for reusable visual style. Do NOT primarily describe image content. Separate CONTENT from STYLE.

Return JSON only, with exactly these fields:
{
  "style_name": string,
  "media_type": string,
  "confidence": "high" | "medium" | "low",
  "content_summary": string[],
  "snapshot": string[],
  "composition": {
    "structure": string,
    "alignment": string,
    "whitespace": string,
    "density": string,
    "focal_points": string,
    "spatial_rhythm": string
  },
  "color": {
    "temperature": string,
    "saturation": string,
    "contrast": string,
    "strategy": string,
    "palette": string[]
  },
  "typography": {
    "headline": string,
    "body": string,
    "hierarchy": string,
    "alignment": string,
    "confidence": "high" | "medium" | "low"
  },
  "texture": {
    "base": string,
    "finish": string,
    "image_treatment": string
  },
  "hierarchy": string[],
  "mood": [{"label": string, "because": string}],
  "avoid": string[],
  "why_it_works": string
}

Guidelines:
- Prefer executable rules over generic labels.
- Keep content_summary short; it exists only to prove content/style separation.
- For typography, describe font personality rather than guessing an exact font.
- Mood labels must include a visual reason in "because".
- Explain "why_it_works" in clear, non-jargony language.
- Do not over-identify brands.
- Do not recommend copying specific objects, people, places, text, logos, or layout content from the reference.
- Keep the whole answer compact and useful for reuse.`;


const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["style_name", "media_type", "confidence", "content_summary", "snapshot", "composition", "color", "typography", "texture", "hierarchy", "mood", "avoid", "why_it_works"],
  properties: {
    style_name: { type: "string" },
    media_type: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    content_summary: { type: "array", items: { type: "string" } },
    snapshot: { type: "array", items: { type: "string" } },
    composition: {
      type: "object", additionalProperties: false,
      required: ["structure", "alignment", "whitespace", "density", "focal_points", "spatial_rhythm"],
      properties: {
        structure: { type: "string" }, alignment: { type: "string" }, whitespace: { type: "string" },
        density: { type: "string" }, focal_points: { type: "string" }, spatial_rhythm: { type: "string" }
      }
    },
    color: {
      type: "object", additionalProperties: false,
      required: ["temperature", "saturation", "contrast", "strategy", "palette"],
      properties: {
        temperature: { type: "string" }, saturation: { type: "string" }, contrast: { type: "string" },
        strategy: { type: "string" }, palette: { type: "array", items: { type: "string" } }
      }
    },
    typography: {
      type: "object", additionalProperties: false,
      required: ["headline", "body", "hierarchy", "alignment", "confidence"],
      properties: {
        headline: { type: "string" }, body: { type: "string" }, hierarchy: { type: "string" }, alignment: { type: "string" },
        confidence: { type: "string", enum: ["high", "medium", "low"] }
      }
    },
    texture: {
      type: "object", additionalProperties: false,
      required: ["base", "finish", "image_treatment"],
      properties: { base: { type: "string" }, finish: { type: "string" }, image_treatment: { type: "string" } }
    },
    hierarchy: { type: "array", items: { type: "string" } },
    mood: {
      type: "array", items: {
        type: "object", additionalProperties: false, required: ["label", "because"],
        properties: { label: { type: "string" }, because: { type: "string" } }
      }
    },
    avoid: { type: "array", items: { type: "string" } },
    why_it_works: { type: "string" }
  }
} as const;

function extractOutputText(payload: unknown): string {
  const p = payload as {
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  return (p.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === "output_text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
}

function parseJsonText(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function isHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string" && Boolean(v.trim())).map((v) => v.trim())
    : fallback;
}

function confidence(value: unknown): "high" | "medium" | "low" {
  return value === "high" || value === "low" ? value : "medium";
}

// --- Request hardening -----------------------------------------------------

// The browser already resizes input to a 1600px JPEG before upload, so a JSON
// body larger than ~6 MB is not a legitimate analysis request.
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const MAX_IMAGE_CHARS = 5.5 * 1024 * 1024;

// Cheap per-instance rate limit. It protects the API key from accidental
// abuse; on serverless deployments the counter is per-instance, so treat it
// as a guardrail, not a security boundary.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateBuckets = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateBuckets.size > 5000) {
    for (const [key, hits] of rateBuckets) {
      if (!hits.some((t) => t > now - RATE_LIMIT_WINDOW_MS)) rateBuckets.delete(key);
    }
  }
  const hits = (rateBuckets.get(ip) ?? []).filter((t) => t > now - RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(ip, hits);
  return false;
}

function validateMetrics(value: unknown): ClientImageMetrics | undefined {
  if (!value || typeof value !== "object") return undefined;
  const m = value as Record<string, unknown>;
  const width = typeof m.width === "number" && Number.isFinite(m.width) && m.width > 0 ? m.width : undefined;
  const height = typeof m.height === "number" && Number.isFinite(m.height) && m.height > 0 ? m.height : undefined;
  const aspect = typeof m.aspect_ratio === "string" ? m.aspect_ratio.slice(0, 40) : undefined;
  if (width === undefined || height === undefined || !aspect) return undefined;
  const palette = Array.isArray(m.palette)
    ? m.palette.filter((v): v is string => typeof v === "string" && isHex(v)).slice(0, 8)
    : [];
  return { width, height, aspect_ratio: aspect, palette };
}

function normalize(raw: unknown, metrics?: ClientImageMetrics): StyleDNA {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const composition = (r.composition && typeof r.composition === "object" ? r.composition : {}) as Record<string, unknown>;
  const color = (r.color && typeof r.color === "object" ? r.color : {}) as Record<string, unknown>;
  const typography = (r.typography && typeof r.typography === "object" ? r.typography : {}) as Record<string, unknown>;
  const texture = (r.texture && typeof r.texture === "object" ? r.texture : {}) as Record<string, unknown>;
  const moodRaw = Array.isArray(r.mood) ? r.mood : [];

  const modelPalette = asStringArray(color.palette).filter(isHex);
  const clientPalette = (metrics?.palette ?? []).filter(isHex);
  const palette = Array.from(new Set([...clientPalette, ...modelPalette])).slice(0, 6);

  return {
    style_name: asString(r.style_name, "Untitled Style"),
    media_type: asString(r.media_type, "Visual Reference"),
    confidence: confidence(r.confidence),
    content_summary: asStringArray(r.content_summary, ["Reference content intentionally separated from style"]),
    snapshot: asStringArray(r.snapshot, ["Structured", "Reusable", "Visual system"]).slice(0, 7),
    composition: {
      structure: asString(composition.structure, "Structured composition"),
      alignment: asString(composition.alignment, "Mixed alignment"),
      whitespace: asString(composition.whitespace, "Moderate whitespace"),
      density: asString(composition.density, "Medium density"),
      focal_points: asString(composition.focal_points, "One primary focal point"),
      spatial_rhythm: asString(composition.spatial_rhythm, "Consistent spacing rhythm"),
    },
    color: {
      temperature: asString(color.temperature, "Neutral"),
      saturation: asString(color.saturation, "Medium"),
      contrast: asString(color.contrast, "Medium"),
      strategy: asString(color.strategy, "Restrained palette with functional color roles"),
      palette: palette.length ? palette : ["#F3F1EA", "#252A31", "#A8A8A2"],
    },
    typography: {
      headline: asString(typography.headline, "Display type with clear hierarchy"),
      body: asString(typography.body, "Readable supporting type"),
      hierarchy: asString(typography.hierarchy, "Clear scale contrast"),
      alignment: asString(typography.alignment, "Aligned to the main composition"),
      confidence: confidence(typography.confidence),
    },
    texture: {
      base: asString(texture.base, "Minimal texture"),
      finish: asString(texture.finish, "Clean finish"),
      image_treatment: asString(texture.image_treatment, "Natural image treatment"),
    },
    hierarchy: asStringArray(r.hierarchy, ["Primary focal point", "Supporting content", "Metadata"]),
    mood: moodRaw.slice(0, 5).map((entry) => {
      const m = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
      return {
        label: asString(m.label, "Balanced"),
        because: asString(m.because, "the visual system uses controlled contrast and spacing"),
      };
    }),
    avoid: asStringArray(r.avoid, ["Unrelated decorative effects", "Over-saturation", "Visual clutter"]),
    why_it_works: asString(r.why_it_works, "The visual system works because hierarchy, spacing, color, and image treatment reinforce one another instead of competing for attention."),
  };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured. Use the built-in demo or add the key to your environment." },
        { status: 503 },
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }

    const ip = clientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many analysis requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }

    let body: Record<string, unknown>;
    try {
      const parsed = await request.json();
      body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    const imageDataUrl = typeof body.image === "string" ? body.image : "";
    if (!imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "A valid image data URL is required." }, { status: 400 });
    }
    if (imageDataUrl.length > MAX_IMAGE_CHARS) {
      return NextResponse.json({ error: "Image data is too large. Keep the source image under 12 MB." }, { status: 413 });
    }

    const metrics = validateMetrics(body.metrics);

    const metricsText = metrics
      ? `\nClient-extracted deterministic image facts:\n- dimensions: ${metrics.width} × ${metrics.height}\n- aspect ratio: ${metrics.aspect_ratio}\n- extracted palette: ${metrics.palette.join(", ")}\nUse these as evidence, but still judge visual roles and meaning yourself.`
      : "";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: ANALYSIS_PROMPT + metricsText },
              { type: "input_image", image_url: imageDataUrl },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "style_dna",
            description: "Reusable visual Style DNA extracted from a reference image.",
            strict: true,
            schema: RESPONSE_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      const message = (payload as { error?: { message?: string } })?.error?.message || "The vision model request failed.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const text = extractOutputText(payload);
    if (!text) {
      return NextResponse.json({ error: "The model returned no analysis text." }, { status: 502 });
    }

    const parsed = parseJsonText(text);
    return NextResponse.json({ result: normalize(parsed, metrics) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected analysis error." },
      { status: 500 },
    );
  }
}
