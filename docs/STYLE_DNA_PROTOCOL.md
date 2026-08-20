# Style DNA Protocol

The protocol exists to stop a vision model from answering the wrong question.

## Step 1 — Identify the medium

Poster, presentation, dashboard, web UI, mobile UI, illustration, photography or data visualization.

Different media imply different emphasis. A dashboard needs density, grid and chart treatment; a poster needs composition, typography, texture and subject placement.

## Step 2 — Separate content from style

The analyzer explicitly lists content only to prove it has separated it from the reusable style.

**Content examples**

- a building;
- a person;
- literal title copy;
- a brand logo;
- a specific KPI value.

**Style examples**

- asymmetric grid;
- muted warm-neutral palette;
- high whitespace;
- oversized serif display type;
- subtle paper grain;
- one restrained accent.

## Step 3 — Convert judgments into rules

Bad output:

```text
Minimal
Modern
Premium
```

Useful output:

```text
High outer whitespace
Low decorative density
One focal accent color
Strong display/body size contrast
Left-dominant alignment
Soft image contrast
```

## Step 4 — Explain Why It Works

Mood labels are not enough. “Calm” should be tied to observable visual evidence such as low saturation, high whitespace and soft contrast.

## Step 5 — Generate Negative Style DNA

Avoid lists are first-class output because generation failures often come from adding the wrong visual tropes: heavy glow, glossy 3D, rainbow gradients, oversized rounded cards or over-sharpening.

## Step 6 — Translate, do not clone

A style rule can change implementation by medium:

- paper grain in a poster → subtle background texture on web;
- editorial serif hierarchy → presentation headline/body hierarchy;
- rounded UI language → chart label and legend treatment;
- accent yellow → highlighted data signal.

The protocol transfers logic, not literal pixels.
