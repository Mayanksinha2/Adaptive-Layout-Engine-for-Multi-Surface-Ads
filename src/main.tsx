import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { toPng } from "html-to-image";
// The bundler loads this stylesheet at runtime; TypeScript does not need to
// resolve its contents as a module.
// @ts-expect-error CSS is provided by the application bundler.
import "./styles.css";

type Format = { id: string; name: string; w: number; h: number };
const formats: Format[] = [
  { id: "square", name: "Square 1:1", w: 1080, h: 1080 },
  { id: "portrait", name: "Portrait 4:5", w: 1080, h: 1350 },
  { id: "story", name: "Story 9:16", w: 1080, h: 1920 },
  { id: "wide", name: "Wide 3:1", w: 1200, h: 400 },
];
function App() {
  const [format, setFormat] = useState("square");
  const [headline, setHeadline] = useState("FRESH LOOKS FOR LITTLE STARS");
  const [sub, setSub] = useState(
    "Premium kidswear made for every special moment.",
  );
  const [offer, setOffer] = useState("FLAT 30% OFF");
  const [cta, setCta] = useState("SHOP NOW");
  const [bg, setBg] = useState("#f5e9df");
  const [accent, setAccent] = useState("#9b4d35");
  const [image, setImage] = useState<string | null>(null);
  const art = useRef<HTMLDivElement>(null);
  const f = formats.find((x) => x.id === format)!;
  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onload = () => setImage(String(r.result));
      r.readAsDataURL(file);
    }
  };
  const exportPng = async () => {
    if (!art.current) return;
    const data = await toPng(art.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = data;
    a.download = `adapti-${format}.png`;
    a.click();
  };
  return (
    <div className="app">
      <header>
        <div>
          <div className="eyebrow">FRONTEND R&D PROJECT</div>
          <h1>
            Adapti<span>.</span>
          </h1>
          <p>Adaptive Layout Engine for Multi-Surface Ads</p>
        </div>
        <button className="primary" onClick={exportPng}>
          Export PNG ↗
        </button>
      </header>
      <main>
        <aside>
          <section>
            <h2>Content</h2>
            <label>
              Headline
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </label>
            <label>
              Description
              <textarea value={sub} onChange={(e) => setSub(e.target.value)} />
            </label>
            <label>
              Offer
              <input value={offer} onChange={(e) => setOffer(e.target.value)} />
            </label>
            <label>
              CTA
              <input value={cta} onChange={(e) => setCta(e.target.value)} />
            </label>
          </section>
          <section>
            <h2>Appearance</h2>
            <label>
              Background
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
              />
            </label>
            <label>
              Accent
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
              />
            </label>
            <label className="upload">
              Upload product image
              <input type="file" accept="image/*" onChange={upload} />
            </label>
          </section>
        </aside>
        <div className="workspace">
          <div className="toolbar">
            <div>
              <strong>Canvas preview</strong>
              <small>
                {f.w} × {f.h}px
              </small>
            </div>
            <div className="formats">
              {formats.map((x) => (
                <button
                  className={x.id === format ? "active" : ""}
                  onClick={() => setFormat(x.id)}
                  key={x.id}
                >
                  {x.name}
                </button>
              ))}
            </div>
          </div>
          <div className="stage">
            <div
              ref={art}
              className={`art ${format}`}
              style={
                { background: bg, "--accent": accent } as React.CSSProperties
              }
            >
              <div className="grain" />
              <div className="copy">
                <div className="brand"> FLAM AI </div>
                <div className="offer">{offer}</div>
                <h3>{headline}</h3>
                <p>{sub}</p>
                <button>{cta} →</button>
              </div>
              <div className="visual">
                {image ? (
                  <img src={image} />
                ) : (
                  <div className="placeholder">
                    <span>✳</span>
                    <b>
                      YOUR
                      <br />
                      PRODUCT
                      <br />
                      HERE
                    </b>
                  </div>
                )}
              </div>
              <div className="footer">
                Designed for little moments · Made with love
              </div>
            </div>
          </div>
          <div className="hint">
            Change the format to see the layout engine adapt typography, spacing
            and image placement automatically.
          </div>
        </div>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
