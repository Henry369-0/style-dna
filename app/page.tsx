"use client";

import { ChangeEvent, DragEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_STYLES, type DemoStyle } from "../lib/demo";
import { buildStylePrompt } from "../lib/prompt";
import type { ClientImageMetrics, StyleDNA } from "../lib/types";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function Icon({ name }: { name: "upload" | "spark" | "copy" | "download" | "arrow" | "image" | "check" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "upload") return <svg {...common}><path d="M12 16V4m0 0 4 4m-4-4L8 8M5 14v5h14v-5" /></svg>;
  if (name === "spark") return <svg {...common}><path d="m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>;
  if (name === "copy") return <svg {...common}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg>;
  if (name === "download") return <svg {...common}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg>;
  if (name === "arrow") return <svg {...common}><path d="M5 12h14m-5-5 5 5-5 5" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></svg>;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

async function prepareImage(file: File): Promise<{ dataUrl: string; previewUrl: string; metrics: ClientImageMetrics }> {
  const objectUrl = URL.createObjectURL(file);
  try {
    return await readPreparedImage(objectUrl);
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

async function readPreparedImage(objectUrl: string): Promise<{ dataUrl: string; previewUrl: string; metrics: ClientImageMetrics }> {
  const image = document.createElement("img");
  image.src = objectUrl;
  await image.decode();

  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.drawImage(image, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.84);

  const swatch = document.createElement("canvas");
  swatch.width = 72;
  swatch.height = 72;
  const sctx = swatch.getContext("2d", { willReadFrequently: true });
  if (!sctx) throw new Error("Canvas is not available in this browser.");
  sctx.drawImage(image, 0, 0, 72, 72);
  const pixels = sctx.getImageData(0, 0, 72, 72).data;
  const counts = new Map<string, { count: number; rgb: [number, number, number] }>();

  for (let i = 0; i < pixels.length; i += 16) {
    if (pixels[i + 3] < 180) continue;
    const r = Math.min(255, Math.round(pixels[i] / 32) * 32);
    const g = Math.min(255, Math.round(pixels[i + 1] / 32) * 32);
    const b = Math.min(255, Math.round(pixels[i + 2] / 32) * 32);
    const key = `${r},${g},${b}`;
    const current = counts.get(key);
    counts.set(key, { count: (current?.count ?? 0) + 1, rgb: [r, g, b] });
  }

  const candidates = [...counts.values()].sort((a, b) => b.count - a.count);
  const selected: [number, number, number][] = [];
  for (const item of candidates) {
    const farEnough = selected.every(([r, g, b]) => {
      const [rr, gg, bb] = item.rgb;
      return Math.sqrt((r - rr) ** 2 + (g - gg) ** 2 + (b - bb) ** 2) > 52;
    });
    if (farEnough) selected.push(item.rgb);
    if (selected.length === 5) break;
  }

  const divisor = gcd(image.naturalWidth, image.naturalHeight);
  return {
    dataUrl,
    previewUrl: objectUrl,
    metrics: {
      width: image.naturalWidth,
      height: image.naturalHeight,
      aspect_ratio: `${image.naturalWidth / divisor}:${image.naturalHeight / divisor}`,
      palette: selected.map(([r, g, b]) => rgbToHex(r, g, b)),
    },
  };
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function downloadJson(result: StyleDNA) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${result.style_name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "style-dna"}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}

function DetailCard({ label, children }: { label: string; children: ReactNode }) {
  return <section className="detail-card"><p className="eyebrow">{label}</p>{children}</section>;
}

const TRANSLATIONS = [
  { label: "Poster", note: "Texture becomes atmosphere", src: "/translation/poster.svg" },
  { label: "Slides", note: "Hierarchy becomes executive rhythm", src: "/translation/slide.svg" },
  { label: "Web", note: "Print restraint becomes interface spacing", src: "/translation/web.svg" },
  { label: "Charts", note: "Accent becomes information signal", src: "/translation/chart.svg" },
];

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const referenceVersion = useRef(0);
  const previewUrl = useRef<string | null>(null);
  const analysisRequest = useRef<AbortController | null>(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [imageData, setImageData] = useState("");
  const [metrics, setMetrics] = useState<ClientImageMetrics | null>(null);
  const [result, setResult] = useState<StyleDNA | null>(null);
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [dragging, setDragging] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string>("");

  const prompt = useMemo(() => (result ? buildStylePrompt(result) : ""), [result]);

  useEffect(() => () => {
    referenceVersion.current++;
    analysisRequest.current?.abort();
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  }, []);

  const selectReference = () => {
    referenceVersion.current++;
    analysisRequest.current?.abort();
    analysisRequest.current = null;
    setLoading(false);
    setPreparing(false);
    return referenceVersion.current;
  };

  const releasePreview = () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = null;
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Please keep the source image under 12 MB.");
      return;
    }
    const version = selectReference();
    setPreparing(true);
    setError("");
    try {
      const prepared = await prepareImage(file);
      if (version !== referenceVersion.current) {
        URL.revokeObjectURL(prepared.previewUrl);
        return;
      }
      releasePreview();
      previewUrl.current = prepared.previewUrl;
      setResult(null);
      setActiveDemo("");
      setFileName(file.name);
      setPreview(prepared.previewUrl);
      setImageData(prepared.dataUrl);
      setMetrics(prepared.metrics);
      window.setTimeout(() => {
        if (version === referenceVersion.current) document.getElementById("input")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    } catch (e) {
      if (version === referenceVersion.current) setError(`${e instanceof Error ? e.message : "Could not read this image."} Your previous reference is still selected.`);
    } finally {
      if (version === referenceVersion.current) setPreparing(false);
    }
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    return handleFile(file);
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const analyze = async () => {
    if (!imageData || !metrics || loading || preparing) return;
    const version = referenceVersion.current;
    const request = new AbortController();
    analysisRequest.current?.abort();
    analysisRequest.current = request;
    const isCurrent = () => version === referenceVersion.current && analysisRequest.current === request;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, metrics }),
        signal: request.signal,
      });
      const data = await response.json();
      if (!isCurrent()) return;
      if (!response.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data.result);
      window.setTimeout(() => {
        if (version === referenceVersion.current) document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (e) {
      if (isCurrent() && !request.signal.aborted) setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      if (isCurrent()) {
        analysisRequest.current = null;
        setLoading(false);
      }
    }
  };

  const loadDemo = (demo: DemoStyle, shouldScroll = true) => {
    const version = selectReference();
    releasePreview();
    setFileName(`${demo.id}.svg`);
    setPreview(demo.image);
    setImageData("");
    setMetrics({ width: 1200, height: 1500, aspect_ratio: "4:5", palette: demo.analysis.color.palette });
    setResult(demo.analysis);
    setActiveDemo(demo.id);
    setError("");
    if (shouldScroll) window.setTimeout(() => {
      if (version === referenceVersion.current) document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const doCopy = async (text: string, label: string) => {
    await copyText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  };

  const jumpToUpload = () => document.getElementById("input")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="Style DNA home"><span className="brand-mark">S/D</span><span>Style DNA</span></a>
        <div className="nav-links"><a href="#atlas">Examples</a><a href="#how">Method</a><a href="#translate">Translate</a><a href="#input">Analyze</a></div>
        <button className="nav-cta" onClick={jumpToUpload}>Use the tool <Icon name="arrow" /></button>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy-block">
          <div className="hero-kicker"><span className="dot" /> Visual requirement translator</div>
          <h1>See the style.<br /><em>Understand the system.</em><br />Reuse the DNA.</h1>
          <p className="hero-copy">Turn “I like this feeling” into a visual specification that images, slides, websites, charts, designers, and coding agents can actually reuse.</p>
          <div className="hero-actions">
            <button className="primary hero-primary" onClick={jumpToUpload}><Icon name="upload" /> Analyze a reference</button>
            <button className="secondary hero-secondary" onClick={() => loadDemo(DEMO_STYLES[0])}><Icon name="spark" /> Explore sample DNA</button>
          </div>
          <div className="hero-flow" aria-label="Reference to Style DNA to Apply">
            <span>REFERENCE</span><Icon name="arrow" /><span>STYLE DNA</span><Icon name="arrow" /><span>APPLY ANYWHERE</span>
          </div>
        </div>

        <div className="hero-stage" aria-label="Three example visual references">
          <button className="hero-sample hero-sample-a" onClick={() => loadDemo(DEMO_STYLES[0])} aria-label="Open Quiet Editorial example"><img src={DEMO_STYLES[0].image} alt="Quiet Editorial poster example" /></button>
          <button className="hero-sample hero-sample-b" onClick={() => loadDemo(DEMO_STYLES[1])} aria-label="Open Nordic Data Minimal example"><img src={DEMO_STYLES[1].image} alt="Nordic Data Minimal dashboard example" /></button>
          <button className="hero-sample hero-sample-c" onClick={() => loadDemo(DEMO_STYLES[2])} aria-label="Open Soft Tech Blue example"><img src={DEMO_STYLES[2].image} alt="Soft Tech Blue web UI example" /></button>
          <div className="dna-float">
            <span className="dna-index">STYLE / DNA</span>
            <strong>Visual rules,<br />not visual copying.</strong>
            <div className="dna-palette"><i /><i /><i /><i /></div>
            <small>composition · color · type · texture · hierarchy</small>
          </div>
          <span className="stage-note stage-note-top">3 references</span>
          <span className="stage-note stage-note-bottom">∞ reusable directions</span>
        </div>
      </section>

      <section className="atlas shell" id="atlas">
        <div className="section-head">
          <div><p className="eyebrow">01 / VISUAL ATLAS</p><h2>Different references.<br />Different visual systems.</h2></div>
          <p className="side-note">Built-in examples make the product explorable before you connect a model. Click any reference to inspect its full DNA.</p>
        </div>
        <div className="atlas-grid">
          {DEMO_STYLES.map((demo, index) => (
            <button className={`atlas-card ${activeDemo === demo.id ? "active" : ""}`} key={demo.id} onClick={() => loadDemo(demo)}>
              <div className="atlas-image"><img src={demo.image} alt={`${demo.name} example`} /></div>
              <div className="atlas-meta"><span>0{index + 1} · {demo.media}</span><Icon name="arrow" /></div>
              <h3>{demo.name}</h3>
              <p>{demo.subtitle}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="workspace shell" id="input">
        <div className="section-head">
          <div><p className="eyebrow">02 / INPUT</p><h2>Give it something<br />you cannot quite describe.</h2></div>
          <p className="side-note">Style DNA looks beneath the literal objects in the frame and extracts the visual system that makes the reference feel the way it does.</p>
        </div>

        <div className="upload-grid">
          <div
            className={`dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onInput} hidden />
            {preview ? (
              <div className="preview-wrap"><img src={preview} alt="Reference preview" /><div className="preview-meta"><span>{fileName}</span><span>{metrics?.width} × {metrics?.height}</span></div></div>
            ) : (
              <div className="drop-empty"><div className="upload-icon"><Icon name="upload" /></div><h3>Drop an image here</h3><p>Poster, slide, dashboard, UI, illustration or photo</p><span className="text-link">JPG · PNG · WebP · up to 12 MB</span></div>
            )}
          </div>

          <div className="input-panel">
            <p className="eyebrow">WHAT GETS ANALYZED</p>
            <div className="mini-list">
              <div><span>01</span><p>Composition & spatial rhythm</p></div>
              <div><span>02</span><p>Color roles & contrast</p></div>
              <div><span>03</span><p>Typography personality</p></div>
              <div><span>04</span><p>Texture & image treatment</p></div>
              <div><span>05</span><p>Hierarchy, mood & constraints</p></div>
            </div>
            {metrics?.palette?.length ? <div className="palette-block"><p className="eyebrow">DETERMINISTIC PALETTE</p><div className="palette-preview">{metrics.palette.map((hex) => <span key={hex} style={{ background: hex }} title={hex} />)}</div></div> : null}
            <div className="input-actions">
              <button className="primary" onClick={analyze} disabled={!imageData || loading || preparing}>{preparing ? <><span className="spinner" /> Preparing the reference…</> : loading ? <><span className="spinner" /> Reading the visual system…</> : <><Icon name="spark" /> Analyze Style DNA</>}</button>
              <div className="demo-shortcuts">{DEMO_STYLES.map((demo) => <button key={demo.id} onClick={() => loadDemo(demo)}>{demo.name}</button>)}</div>
            </div>
            {error ? <p className="error">{error}</p> : <p className="privacy-note"><Icon name="check" /> Images are resized in-browser. API keys stay server-side. Demo samples need no key.</p>}
          </div>
        </div>
      </section>

      <section className="how shell" id="how">
        <div className="section-head"><div><p className="eyebrow">03 / METHOD</p><h2>Not “what is in the image?”</h2></div><p className="side-note">The useful question is why the composition, color, type, and spacing create a particular feeling — and how to reproduce those rules elsewhere.</p></div>
        <div className="method-grid">
          <article><span>CONTENT</span><h3>What should stay behind</h3><p>Objects, people, places, logos, literal text, subject matter.</p><small>Tokyo Tower · a person · a specific chart</small></article>
          <article className="method-accent"><span>STYLE</span><h3>What becomes reusable</h3><p>Grid, hierarchy, spacing, palette roles, type personality, texture, visual rhythm.</p><small>asymmetric · muted · high whitespace</small></article>
          <article><span>TRANSLATION</span><h3>What gets applied next</h3><p>A compact Style Brief, structured JSON, and AI-ready instruction for another medium.</p><small>poster → slides → web → charts</small></article>
        </div>
      </section>

      <section className="translate shell" id="translate">
        <div className="section-head"><div><p className="eyebrow">04 / CROSS-MEDIUM TRANSLATION</p><h2>Reuse the rule.<br />Not the pixels.</h2></div><p className="side-note">A style should survive a change of medium. Paper grain may become subtle background texture on the web; a mustard accent may become the one highlighted data signal in a chart.</p></div>
        <div className="translate-grid">
          {TRANSLATIONS.map((item) => <article key={item.label}><img src={item.src} alt={`${item.label} style translation example`} /><div><strong>{item.label}</strong><span>{item.note}</span></div></article>)}
        </div>
      </section>

      {result ? (
        <section className="analysis shell" id="analysis">
          <div className="analysis-head">
            <div><p className="eyebrow">05 / STYLE DNA</p><h2>{result.style_name}</h2><div className="meta-row"><Badge>{result.media_type}</Badge><Badge>{result.confidence} confidence</Badge></div></div>
            <div className="analysis-actions">
              <button className="secondary" onClick={() => doCopy(JSON.stringify(result, null, 2), "dna")}><Icon name="copy" /> {copied === "dna" ? "Copied" : "Copy DNA"}</button>
              <button className="secondary" onClick={() => downloadJson(result)}><Icon name="download" /> Export JSON</button>
            </div>
          </div>

          <div className="result-grid">
            <div className="reference-column">
              <div className="reference-card">{preview ? <img src={preview} alt="Analyzed reference" /> : <div className="missing"><Icon name="image" /></div>}</div>
              <div className="content-card"><p className="eyebrow">CONTENT / NOT STYLE</p>{result.content_summary.map((item) => <p key={item}>{item}</p>)}</div>
            </div>

            <div className="dna-column">
              <div className="snapshot-card"><div className="snapshot-top"><p className="eyebrow">SNAPSHOT / 5 SEC READ</p><span>{result.media_type}</span></div><div className="snapshot-tags">{result.snapshot.map((item) => <span key={item}>{item}</span>)}</div></div>
              <div className="details-grid">
                <DetailCard label="COMPOSITION"><h3>{result.composition.structure}</h3><p>{result.composition.whitespace}</p><p>{result.composition.spatial_rhythm}</p><span className="micro">{result.composition.alignment} · {result.composition.density}</span></DetailCard>
                <DetailCard label="COLOR SYSTEM"><h3>{result.color.strategy}</h3><div className="swatches">{result.color.palette.map((hex) => <div key={hex}><span style={{ background: hex }} /><small>{hex}</small></div>)}</div><span className="micro">{result.color.temperature} · {result.color.saturation} saturation · {result.color.contrast} contrast</span></DetailCard>
                <DetailCard label="TYPOGRAPHY"><h3>{result.typography.headline}</h3><p>{result.typography.body}</p><span className="micro">{result.typography.hierarchy} · {result.typography.confidence} confidence</span></DetailCard>
                <DetailCard label="TEXTURE"><h3>{result.texture.base}</h3><p>{result.texture.image_treatment}</p><span className="micro">{result.texture.finish}</span></DetailCard>
              </div>
            </div>
          </div>

          <div className="hierarchy-strip"><p className="eyebrow">VISUAL HIERARCHY</p><ol>{result.hierarchy.map((item, i) => <li key={item}><span>0{i + 1}</span>{item}</li>)}</ol></div>

          <div className="explain-grid">
            <section className="why-card"><p className="eyebrow">WHY IT WORKS</p><p className="why-text">{result.why_it_works}</p><div className="moods">{result.mood.map((m) => <div key={m.label}><strong>{m.label}</strong><span>because {m.because}</span></div>)}</div></section>
            <section className="avoid-card"><p className="eyebrow">NEGATIVE STYLE DNA / AVOID</p><ul>{result.avoid.map((item) => <li key={item}>{item}</li>)}</ul></section>
          </div>

          <section className="prompt-card">
            <div className="prompt-head"><div><p className="eyebrow">AI-READY STYLE PROMPT</p><h3>Take the DNA somewhere else.</h3></div><button className="primary compact" onClick={() => doCopy(prompt, "prompt")}><Icon name="copy" /> {copied === "prompt" ? "Copied" : "Copy prompt"}</button></div>
            <pre>{prompt}</pre>
          </section>

          <section className="json-card"><div><p className="eyebrow">STRUCTURED DNA</p><h3>Machine-readable by design.</h3><p>Use the same schema in a web demo, agent skill, prompt pipeline, or future API.</p></div><pre>{JSON.stringify(result, null, 2)}</pre></section>
        </section>
      ) : null}

      <footer className="footer shell"><div className="brand"><span className="brand-mark">S/D</span><span>Style DNA</span></div><p>See the style. Understand the system. Reuse the DNA.</p><span>Open source · MIT · 2026</span></footer>
    </main>
  );
}
