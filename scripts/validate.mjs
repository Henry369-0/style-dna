import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "app/page.tsx",
  "app/api/analyze/route.ts",
  "schemas/style_dna.schema.json",
  "prompts/style-analysis.md",
  "skill/SKILL.md",
  "public/demo/editorial-poster.svg",
  "public/demo/nordic-data.svg",
  "public/demo/soft-tech.svg",
  "docs/assets/cover.svg",
  "docs/assets/architecture.svg",
  "docs/assets/translation.svg",
];

for (const relative of required) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) throw new Error(`Missing required project file: ${relative}`);
}

for (const relative of ["schemas/style_dna.schema.json", "examples/quiet-editorial.json", "examples/nordic-data-minimal.json", "examples/soft-tech-blue.json"]) {
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
}

const schema = JSON.parse(fs.readFileSync(path.join(root, "schemas/style_dna.schema.json"), "utf8"));
const requiredKeys = ["style_name", "media_type", "snapshot", "composition", "color", "typography", "texture", "hierarchy", "mood", "avoid", "why_it_works"];
for (const key of requiredKeys) {
  if (!schema.properties?.[key]) throw new Error(`Schema is missing property: ${key}`);
}

const NESTED_REQUIRED = {
  composition: ["structure", "alignment", "whitespace", "density", "focal_points", "spatial_rhythm"],
  color: ["temperature", "saturation", "contrast", "strategy", "palette"],
  typography: ["headline", "body", "hierarchy", "alignment", "confidence"],
  texture: ["base", "finish", "image_treatment"],
};
const HEX = /^#[0-9a-f]{6}$/i;
const ARRAYS = ["content_summary", "snapshot", "hierarchy", "avoid"];

const exampleFiles = ["examples/quiet-editorial.json", "examples/nordic-data-minimal.json", "examples/soft-tech-blue.json"];
for (const file of exampleFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  for (const key of requiredKeys) {
    if (!(key in data)) throw new Error(`${file} is missing top-level key: ${key}`);
  }
  for (const [group, keys] of Object.entries(NESTED_REQUIRED)) {
    const obj = data[group];
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      throw new Error(`${file} is missing the "${group}" object`);
    }
    for (const key of keys) {
      if (!(key in obj)) throw new Error(`${file}.${group} is missing key: ${key}`);
    }
  }
  for (const key of ARRAYS) {
    if (!Array.isArray(data[key])) throw new Error(`${file}.${key} must be an array`);
  }
  if (!Array.isArray(data.color.palette) || data.color.palette.some((hex) => typeof hex !== "string" || !HEX.test(hex))) {
    throw new Error(`${file}.color.palette must be an array of hex colors`);
  }
  if (!Array.isArray(data.mood) || data.mood.some((m) => !m || typeof m.label !== "string" || typeof m.because !== "string")) {
    throw new Error(`${file}.mood must be an array of {label, because} objects`);
  }
  if (!["high", "medium", "low"].includes(data.confidence) || !["high", "medium", "low"].includes(data.typography?.confidence)) {
    throw new Error(`${file} has an invalid confidence value`);
  }
  console.log(`  checked ${file}`);
}

console.log(`Style DNA validation passed (${required.length} required assets checked, ${exampleFiles.length} examples validated).`);
