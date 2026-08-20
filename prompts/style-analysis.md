# Style DNA — Visual Analysis Prompt

Analyze the uploaded reference image as a professional art director and visual systems designer.

Your task is **not** to primarily describe what is depicted. Separate **CONTENT** from **STYLE**, then translate subjective aesthetics into reusable, executable visual rules.

Analyze:

1. Media type
2. Overall visual identity
3. Composition and grid
4. Spatial rhythm and whitespace
5. Color system and functional roles
6. Typography personality and hierarchy (do not assert an exact font unless certain)
7. Texture and image treatment
8. Visual hierarchy
9. Mood, with a visual reason for each mood label
10. Negative constraints / what to avoid
11. Why the design works in plain language

Rules:

- Prefer executable descriptions over style labels.
- Do not copy or recommend copying specific subjects from the reference.
- Do not over-identify brands or exact fonts.
- Express uncertainty through confidence levels.
- Return compact structured JSON matching `schemas/style_dna.schema.json`.
