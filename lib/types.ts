export type Confidence = "high" | "medium" | "low";

export type StyleDNA = {
  style_name: string;
  media_type: string;
  confidence: Confidence;
  content_summary: string[];
  snapshot: string[];
  composition: {
    structure: string;
    alignment: string;
    whitespace: string;
    density: string;
    focal_points: string;
    spatial_rhythm: string;
  };
  color: {
    temperature: string;
    saturation: string;
    contrast: string;
    strategy: string;
    palette: string[];
  };
  typography: {
    headline: string;
    body: string;
    hierarchy: string;
    alignment: string;
    confidence: Confidence;
  };
  texture: {
    base: string;
    finish: string;
    image_treatment: string;
  };
  hierarchy: string[];
  mood: Array<{ label: string; because: string }>;
  avoid: string[];
  why_it_works: string;
};

export type ClientImageMetrics = {
  width: number;
  height: number;
  aspect_ratio: string;
  palette: string[];
};
