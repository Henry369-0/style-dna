# AGENTS.md

## Product intent

Style DNA is a visual-style parser, not an image-content describer and not a style-transfer editor.

## Invariants

- Separate CONTENT from STYLE.
- Prefer executable visual rules over generic labels.
- Keep API keys server-side.
- Deterministic image facts should come from code when practical.
- Do not identify exact fonts unless there is strong evidence; describe font personality instead.
- Do not encourage literal copying of people, logos, objects, places or text from the reference.
- Demo mode must remain useful without an API key.

## Visual direction

The product itself should feel like an editorial art-direction tool: warm paper field, dark ink, one acid accent, large serif typography, strong images, restrained borders and low decorative noise.

## Before changing the schema

Update all of these together:

1. `schemas/style_dna.schema.json`
2. `lib/types.ts`
3. `app/api/analyze/route.ts`
4. `prompts/style-analysis.md`
5. demo objects under `lib/demo.ts`
6. README examples if user-facing fields change
