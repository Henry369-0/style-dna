# Architecture

## System boundary

Style DNA is intentionally small. It is not an image editor and it does not train a model. The product layer is the analysis protocol, data contract, deterministic preprocessing and rendering experience around a multimodal model.

## Request flow

```text
Reference image
   │
   ├── Browser preprocessing
   │     ├── validate file type / size
   │     ├── preserve original dimensions
   │     ├── calculate aspect ratio
   │     ├── extract coarse palette
   │     └── resize to max 1600px for model input
   │
   └── POST /api/analyze
         ├── fixed visual-analysis protocol
         ├── deterministic metrics as evidence
         ├── image input
         ├── structured JSON schema
         └── normalization / fallback guardrails
                   │
                   ▼
                Style DNA
              ┌────┼─────┐
              ▼    ▼     ▼
            Cards JSON  Prompt
```

## Why browser preprocessing exists

Image dimensions, aspect ratio and coarse palette do not require model judgment. Extracting them locally has three benefits:

- consistent evidence;
- lower image payload after resize;
- a clearer split between measurement and interpretation.

The palette algorithm is intentionally coarse. It quantizes sampled pixels and filters near-duplicate candidates. It is not a replacement for a color-science pipeline; it is deterministic context for the model and UI.

## Why the server route exists

The API key must never be embedded in browser JavaScript. The client sends the resized data URL and metrics to a server-side Next.js route, which then calls the OpenAI Responses API.

## Output contract

`schemas/style_dna.schema.json` is the canonical machine-readable shape. The same concepts are reflected in:

- the analysis route;
- TypeScript types;
- demo examples;
- prompt generator;
- the Skill draft.

This is the core architecture idea: **visual interpretation becomes portable only after it has a stable representation.**

## Failure handling

- unsupported upload → client-side rejection;
- image > 12 MB → client-side rejection;
- JSON body > 6 MB or image data URL > ~5.5 MB → server-side `413`;
- invalid JSON or missing image data URL → server-side `400`;
- more than 20 requests per IP per minute → server-side `429` (in-memory per-instance rate limit);
- missing API key → server returns a clear 503 and the built-in demos remain usable;
- model output → normalized before the UI consumes it;
- invalid palette values → ignored, deterministic client palette retained.

## Privacy

- no login or database;
- uploaded references are not stored by the application;
- image resizing and palette extraction happen in the browser;
- API keys remain server-side;
- demo mode requires no external request.
