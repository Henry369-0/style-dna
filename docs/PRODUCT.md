# Style DNA — Product Notes

## One-line definition

**Style DNA turns a reference image into reusable visual rules.**

The user does not need to know professional design vocabulary. They only need to know: “I like this.” The product separates literal content from reusable visual language, explains why the reference works, and turns that judgment into a stable specification.

## Problem

People can usually recognize visual quality faster than they can describe it. Prompts like “make it premium,” “use this vibe,” or “make it more editorial” are too vague to reproduce consistently.

Style DNA translates subjective preference into executable rules across:

- composition and spatial rhythm;
- whitespace;
- color roles and contrast;
- typography personality;
- texture and image treatment;
- hierarchy and focal order;
- mood with visual reasons;
- negative constraints — what the style should avoid.

## Core product distinction

### Content recognition

> What is in the image?

### Style DNA

> Why does this visual system feel the way it does, and how can those rules be reused elsewhere?

A landmark, person, literal headline, brand logo, or a specific chart is **content**. Asymmetric composition, low saturation, high whitespace, serif/sans contrast, paper grain, or restrained accent color are **style**.

## MVP

The first complete release includes:

1. image upload;
2. browser-side resize, dimensions, aspect ratio and palette extraction;
3. multimodal analysis;
4. media type recognition;
5. content/style separation;
6. Style Snapshot;
7. composition, color, typography, texture, hierarchy and mood analysis;
8. Why It Works;
9. Negative Style DNA / Avoid;
10. structured JSON output;
11. AI-ready style prompt;
12. three built-in examples that work without an API key;
13. cross-medium translation examples.

## Product principles

### Rules > labels

“Minimal” is weak. “High whitespace, limited palette, strong alignment, low decorative density” is reusable.

### Confidence > fake precision

The product describes typography personality instead of pretending to identify an exact typeface from pixels.

### Translation > cloning

The goal is not to replicate the reference. The goal is to preserve the underlying visual logic when the medium changes.

### Deterministic facts + AI judgment

Code extracts facts that can be measured. The vision model interprets relationships, mood, hierarchy, and visual rationale.

## Built-in visual atlas

The repository includes three deliberately different references:

- **Quiet Editorial** — warm print restraint;
- **Nordic Data Minimal** — analytical, cool and grid-led;
- **Soft Tech Blue** — luminous depth with low visual noise.

This makes the core promise testable without an API key: one protocol should produce useful output across different visual media.

## Future directions

- V2: optimized prompt packs for images, slides, web and charts;
- V3: new-content upload + style application workflow;
- V4: saved Style Library, Compare and Blend;
- V5: Skill, API and richer cross-medium translation.
