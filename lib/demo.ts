import type { StyleDNA } from "./types";

export type DemoStyle = {
  id: string;
  name: string;
  subtitle: string;
  media: string;
  image: string;
  analysis: StyleDNA;
};

export const DEMO_ANALYSIS: StyleDNA = {
  style_name: "Quiet Editorial",
  media_type: "Poster",
  confidence: "high",
  content_summary: ["Architectural photograph", "Travel title", "Small editorial metadata"],
  snapshot: ["Editorial", "Warm neutral", "Asymmetric", "High whitespace", "Restrained accent"],
  composition: {
    structure: "Asymmetric editorial grid",
    alignment: "Strong left alignment with an offset image block",
    whitespace: "High — large outer margins and generous subject breathing room",
    density: "Medium-low visual density; information remains compact",
    focal_points: "One dominant headline, then the image",
    spatial_rhythm: "Large-to-small spacing contrast creates a calm reading tempo"
  },
  color: {
    temperature: "Warm-neutral",
    saturation: "Low",
    contrast: "Medium",
    strategy: "Warm ivory field + muted navy text + one mustard accent",
    palette: ["#F2EEE5", "#243447", "#7A838A", "#C5A04B", "#D9D1C3"]
  },
  typography: {
    headline: "Large editorial serif; high stroke contrast; confident scale",
    body: "Small modern sans-serif; regular weight; restrained tracking",
    hierarchy: "Strong size contrast between display type and metadata",
    alignment: "Left aligned",
    confidence: "high"
  },
  texture: {
    base: "Subtle paper grain",
    finish: "Matte, slightly printed",
    image_treatment: "Soft contrast, muted saturation, restrained sharpness"
  },
  hierarchy: ["Main headline", "Hero image", "Accent marker", "Supporting copy", "Footer metadata"],
  mood: [
    { label: "Calm", because: "low saturation + generous whitespace + soft contrast" },
    { label: "Premium", because: "controlled palette + strong typographic hierarchy" },
    { label: "Editorial", because: "asymmetric grid + serif display type + print-like texture" }
  ],
  avoid: ["Neon colors", "Heavy gradients", "Plastic 3D", "Over-sharpening", "Large glossy cards", "Excessive glow"],
  why_it_works: "The design feels premium because it is restrained rather than decorative. A limited warm-neutral palette keeps visual noise low, while the oversized serif headline establishes an immediate hierarchy. The asymmetric grid prevents the page from feeling generic, and generous negative space gives both the type and image room to breathe. Subtle paper texture adds tactility without competing with the content."
};

const NORDIC_DATA: StyleDNA = {
  style_name: "Nordic Data Minimal",
  media_type: "Dashboard",
  confidence: "high",
  content_summary: ["Performance metrics", "Trend chart", "Category breakdown"],
  snapshot: ["Analytical", "Cool neutral", "Grid-led", "Airy density", "Precise accent"],
  composition: {
    structure: "Strict modular grid with one oversized KPI anchor",
    alignment: "Left aligned text with chart baselines locked to a shared grid",
    whitespace: "High between modules, compact within data groups",
    density: "Medium information density with low decorative density",
    focal_points: "Primary KPI first, trend line second, supporting cards third",
    spatial_rhythm: "Consistent 8/16/32 spacing rhythm creates disciplined pacing"
  },
  color: {
    temperature: "Cool-neutral",
    saturation: "Low",
    contrast: "Medium-high",
    strategy: "Soft grey canvas + near-black type + one cobalt signal color",
    palette: ["#F4F6F5", "#151A1D", "#8A959B", "#2E68FF", "#DDE3E2"]
  },
  typography: {
    headline: "Large neo-grotesk numerals; compact and technical",
    body: "Neutral sans-serif with tabular-feeling labels",
    hierarchy: "Scale and weight, not decoration, create hierarchy",
    alignment: "Left aligned with numeric columns visually aligned",
    confidence: "high"
  },
  texture: {
    base: "None; clean digital surface",
    finish: "Flat and precise",
    image_treatment: "Charts use crisp strokes and restrained labels"
  },
  hierarchy: ["Primary KPI", "Trend movement", "Supporting metrics", "Category detail", "Annotations"],
  mood: [
    { label: "Analytical", because: "strict grid + aligned numerals + low decoration" },
    { label: "Calm", because: "wide module spacing prevents dashboard compression" },
    { label: "Modern", because: "neutral surfaces + one functional signal color" }
  ],
  avoid: ["Rainbow charts", "Heavy card shadows", "Oversized rounded pills", "Decorative gradients", "Dense chart labels", "Multiple accent colors"],
  why_it_works: "The dashboard looks disciplined because every visual choice supports comparison. Large numbers create a fast entry point, repeated alignment makes scanning effortless, and the single cobalt accent is reserved for information that deserves attention. The interface carries plenty of data without feeling busy because spacing is generous at the module level and decoration is nearly absent."
};

const SOFT_TECH: StyleDNA = {
  style_name: "Soft Tech Blue",
  media_type: "Web UI",
  confidence: "high",
  content_summary: ["Product headline", "Interactive product card", "Feature labels"],
  snapshot: ["Soft tech", "Luminous blue", "Layered", "Rounded restraint", "Quiet depth"],
  composition: {
    structure: "Centered hero with one dominant floating product surface",
    alignment: "Centered macro-layout; left aligned text inside components",
    whitespace: "High outer whitespace with tighter component interiors",
    density: "Low-medium visual density",
    focal_points: "Product surface first, headline second, supporting controls third",
    spatial_rhythm: "Broad empty fields interrupted by compact information islands"
  },
  color: {
    temperature: "Cool",
    saturation: "Medium-low",
    contrast: "Soft",
    strategy: "Mist blue canvas + inky text + electric blue used as a controlled focal glow",
    palette: ["#E8F0F8", "#17212B", "#6E8396", "#4A82FF", "#F8FBFF"]
  },
  typography: {
    headline: "Large modern sans-serif with slightly condensed spacing",
    body: "Clean humanist sans-serif; soft grey supporting text",
    hierarchy: "Size first, weight second, color last",
    alignment: "Centered hero / left aligned interface copy",
    confidence: "high"
  },
  texture: {
    base: "Very subtle luminous haze",
    finish: "Soft digital glass without obvious gloss",
    image_treatment: "Diffused highlights, restrained blur, no hard HDR"
  },
  hierarchy: ["Hero product surface", "Headline", "Primary action", "Feature labels", "Ambient background"],
  mood: [
    { label: "Friendly", because: "soft contrast + open spacing + restrained radius" },
    { label: "Futuristic", because: "luminous blue depth + floating layered surfaces" },
    { label: "Trustworthy", because: "limited palette + controlled hierarchy" }
  ],
  avoid: ["Neon rainbow glow", "Over-blurred glassmorphism", "Huge pill buttons", "Purple-pink gradients", "Excessive floating orbs", "Glossy 3D icons"],
  why_it_works: "The interface feels futuristic without becoming flashy. Depth is created with very soft tonal shifts instead of loud glass effects, and the bright blue is concentrated around the main product surface so attention remains controlled. Large open areas keep the composition calm while compact inner spacing makes the product itself feel information-rich and usable."
};

export const DEMO_STYLES: DemoStyle[] = [
  {
    id: "quiet-editorial",
    name: "Quiet Editorial",
    subtitle: "Warm print restraint",
    media: "POSTER",
    image: "/demo/editorial-poster.svg",
    analysis: DEMO_ANALYSIS,
  },
  {
    id: "nordic-data",
    name: "Nordic Data Minimal",
    subtitle: "Analytical, not sterile",
    media: "DASHBOARD",
    image: "/demo/nordic-data.svg",
    analysis: NORDIC_DATA,
  },
  {
    id: "soft-tech",
    name: "Soft Tech Blue",
    subtitle: "Depth without visual noise",
    media: "WEB UI",
    image: "/demo/soft-tech.svg",
    analysis: SOFT_TECH,
  },
];
