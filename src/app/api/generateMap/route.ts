import { generateMap } from "@/server/mapGenerator";

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
    typeof raw === "number"
      ? raw
      : typeof raw === "string"
        ? parseInt(raw, 10)
        : NaN;

  const seed = Number.isFinite(n) ? n : Math.floor(Math.random() * 1e9);
  const map = generateMap(seed);
  return Response.json(map);
}
