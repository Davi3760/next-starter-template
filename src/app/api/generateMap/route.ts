// src/app/api/generateMap/route.ts
export const runtime = "edge"; // bom para Workers/edge

type Tile = "G" | "W" | "R" | "F" | "H" | "S" | "N";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function genMap(seed: number, w = 56, h = 40) {
  const rnd = mulberry32(seed);

  // base grass
  const grid: Tile[][] = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => "G")
  );

  // borda com cerca
  for (let x = 0; x < w; x++) grid[0][x] = "F", grid[h - 1][x] = "F";
  for (let y = 0; y < h; y++) grid[y][0] = "F", grid[y][w - 1] = "F";

  // rio contínuo (sem "corte brusco"): caminho vertical sinuoso
  let rx = clamp(Math.floor(w * (0.20 + rnd() * 0.15)), 2, w - 3);
  for (let y = 1; y < h - 1; y++) {
    // largura 3
    grid[y][rx - 1] = "W";
    grid[y][rx] = "W";
    grid[y][rx + 1] = "W";

    // deriva suave
    if (rnd() < 0.35) rx += rnd() < 0.5 ? -1 : 1;
    rx = clamp(rx, 3, w - 4);
  }

  // estrada conectando (horizontal) + (vertical)
  const roadY = clamp(Math.floor(h * (0.25 + rnd() * 0.2)), 3, h - 4);
  for (let x = 1; x < w - 1; x++) if (grid[roadY][x] !== "W") grid[roadY][x] = "R";

  const roadX = clamp(Math.floor(w * (0.55 + rnd() * 0.15)), 3, w - 4);
  for (let y = 1; y < h - 1; y++) if (grid[y][roadX] !== "W") grid[y][roadX] = "R";

  // função: testa área retangular livre (pra não cortar placas/NPC/casas)
  function areaFree(x: number, y: number, aw: number, ah: number) {
    for (let yy = y; yy < y + ah; yy++) {
      for (let xx = x; xx < x + aw; xx++) {
        if (xx <= 0 || yy <= 0 || xx >= w - 1 || yy >= h - 1) return false;
        if (grid[yy][xx] !== "G") return false;
      }
    }
    return true;
  }

  // coloca "casas" como blocos 5x4 (só como placeholder de teste)
  // depois você troca isso por tiles reais (multi-tiles) no renderer.
  const houses: Array<{ x: number; y: number; w: number; h: number }> = [];
  const targetHouses = 6 + Math.floor(rnd() * 5);

  for (let i = 0; i < 200 && houses.length < targetHouses; i++) {
    const hx = 2 + Math.floor(rnd() * (w - 2 - 6));
    const hy = 2 + Math.floor(rnd() * (h - 2 - 5));
    const hw = 6, hh = 5;

    if (!areaFree(hx, hy, hw, hh)) continue;

    // evita colar no rio
    let nearWater = false;
    for (let yy = hy - 2; yy < hy + hh + 2; yy++) {
      for (let xx = hx - 2; xx < hx + hw + 2; xx++) {
        if (yy >= 0 && yy < h && xx >= 0 && xx < w && grid[yy][xx] === "W") nearWater = true;
      }
    }
    if (nearWater) continue;

    // pinta bloco de casa
    for (let yy = hy; yy < hy + hh; yy++)
      for (let xx = hx; xx < hx + hw; xx++) grid[yy][xx] = "H";

    houses.push({ x: hx, y: hy, w: hw, h: hh });

    // porta liga na estrada com um "caminho" simples (sem cortar água)
    const doorX = hx + Math.floor(hw / 2);
    const doorY = hy + hh;
    for (let yy = doorY; yy <= roadY; yy++) {
      if (yy >= 0 && yy < h && grid[yy][doorX] !== "W") grid[yy][doorX] = "R";
    }
  }

  // placas e NPCs como tiles únicos (sem cortar)
  const signs: Array<{ x: number; y: number }> = [];
  const npcs: Array<{ x: number; y: number }> = [];

  function placeSingle(kind: "S" | "N", tries = 200) {
    for (let i = 0; i < tries; i++) {
      const x = 2 + Math.floor(rnd() * (w - 4));
      const y = 2 + Math.floor(rnd() * (h - 4));
      if (grid[y][x] !== "G") continue;

      // evita colar em água
      let bad = false;
      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 1; xx <= x + 1; xx++)
          if (grid[yy][xx] === "W") bad = true;
      if (bad) continue;

      grid[y][x] = kind;
      if (kind === "S") signs.push({ x, y });
      else npcs.push({ x, y });
      return true;
    }
    return false;
  }

  const totalSigns = 3 + Math.floor(rnd() * 4);
  const totalNpcs = 4 + Math.floor(rnd() * 5);
  for (let i = 0; i < totalSigns; i++) placeSingle("S");
  for (let i = 0; i < totalNpcs; i++) placeSingle("N");

  return { seed, w, h, grid };
}

export const runtime = "edge";

type Body = { seed?: number | string };

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    body = {};
  }

  const raw = body.seed;
  const n =
    typeof raw === "number" ? raw :
    typeof raw === "string" ? parseInt(raw, 10) :
    NaN;

  const seed = Number.isFinite(n) ? n : Math.floor(Math.random() * 1e9);

  const map = genMap(seed);
  return Response.json(map);
}
