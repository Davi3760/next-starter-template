"use client";

import { useMemo, useState } from "react";

type Tile = "G" | "W" | "R" | "F" | "H" | "S" | "N";
type ApiMap = { seed: number; w: number; h: number; grid: Tile[][] };

function colorOf(t: Tile) {
  switch (t) {
    case "G": return "#b7f0b1";
    case "W": return "#7cc7ff";
    case "R": return "#d7c6a5";
    case "F": return "#9aa3ad";
    case "H": return "#cfe7ff";
    case "S": return "#ffd86b";
    case "N": return "#ff8fb1";
  }
}

export default function Home() {
  const [seed, setSeed] = useState(() => String(Math.floor(Math.random() * 1e9)));
  const [zoom, setZoom] = useState(2);
  const [data, setData] = useState<ApiMap | null>(null);
  const [err, setErr] = useState<string>("");

  const tileSize = useMemo(() => 8 * zoom, [zoom]);

  async function gerar() {
    setErr("");
    try {
      const s = parseInt(seed || "0", 10);
      const res = await fetch("/api/generateMap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: Number.isFinite(s) ? s : undefined }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiMap;
      setData(json);
      setSeed(String(json.seed));
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", padding: 20, color: "#111" }}>
      <h1>Next.js no Cloudflare Workers — UI pública + API “protegida”</h1>
      <p>O mapa é gerado no servidor (/api/generateMap) e o browser só renderiza.</p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "16px 0" }}>
        <label>Seed:&nbsp;
          <input value={seed} onChange={(e) => setSeed(e.target.value)} style={{ width: 180, padding: 6 }} />
        </label>

        <button onClick={() => setSeed(String(Math.floor(Math.random() * 1e9)))} style={{ padding: "8px 12px" }}>
          Seed aleatória
        </button>

        <button onClick={gerar} style={{ padding: "8px 12px", fontWeight: 700 }}>
          Gerar novamente
        </button>

        <label>Zoom:&nbsp;
          <select value={zoom} onChange={(e) => setZoom(parseInt(e.target.value, 10))}>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
            <option value={4}>4x</option>
          </select>
        </label>

        {err ? <span style={{ color: "#c00" }}>Erro: {err}</span> : null}
      </div>

      {!data ? (
        <div style={{ padding: 16, background: "#f3f4f6", borderRadius: 12 }}>
          Clique em <b>Gerar novamente</b>.
        </div>
      ) : (
        <div style={{ display: "inline-block", border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${data.w}, ${tileSize}px)`,
              background: "#00000010",
            }}
          >
            {data.grid.flatMap((row, y) =>
              row.map((t, x) => (
                <div
                  key={`${x},${y}`}
                  title={`${t} (${x},${y})`}
                  style={{
                    width: tileSize,
                    height: tileSize,
                    background: colorOf(t),
                    outline: "1px solid #00000010",
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
