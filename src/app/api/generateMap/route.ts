import { generateNewMap } from "@/server/mapBuilder";

type Body = {
  mapW?: number;
  mapH?: number;
  analysisInfo?: {
    stamps: Array<{
      width: number;
      height: number;
      size: number;
      touchesEdge?: boolean;
      type?: "house" | "tree" | "rock" | "wall" | "npc" | "decor";
      cells: Array<{ dx: number; dy: number; paletteIndex: number }>;
    }>;
    decorIds: number[];
    singleDecorIds: number[];
    useManualOnly?: boolean;
    customStamps?: Array<{
      width: number;
      height: number;
      size: number;
      type?: "house" | "tree" | "rock" | "wall" | "npc" | "decor";
      cells: Array<{ dx: number; dy: number; paletteIndex: number }>;
    }>;
  };
  manualSelection?: {
    grassId: number | null;
    tallGrassId: number | null;
    waterId: number | null;
    pathId: number | null;
    decorIds: number[];
    customStamps: Array<{
      width: number;
      height: number;
      size: number;
      type?: "house" | "tree" | "rock" | "wall" | "npc" | "decor";
      cells: Array<{ dx: number; dy: number; paletteIndex: number }>;
    }>;
  };
  lastNpcStamp?: {
    width: number;
    height: number;
    size: number;
    type?: "npc";
    cells: Array<{ dx: number; dy: number; paletteIndex: number }>;
  } | null;
  lastTreeStamp?: {
    width: number;
    height: number;
    size: number;
    type?: "tree";
    cells: Array<{ dx: number; dy: number; paletteIndex: number }>;
  } | null;
  lastRockStamp?: {
    width: number;
    height: number;
    size: number;
    type?: "rock";
    cells: Array<{ dx: number; dy: number; paletteIndex: number }>;
  } | null;
};

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    body = {};
  }

  const mapW = Number(body.mapW);
  const mapH = Number(body.mapH);
  if (!Number.isFinite(mapW) || !Number.isFinite(mapH)) {
    return Response.json({ error: "invalid_map_size" }, { status: 400 });
  }
  if (!body.analysisInfo || !body.manualSelection) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = generateNewMap({
    mapW,
    mapH,
    analysisInfo: body.analysisInfo,
    manualSelection: body.manualSelection,
    lastNpcStamp: body.lastNpcStamp ?? null,
    lastTreeStamp: body.lastTreeStamp ?? null,
    lastRockStamp: body.lastRockStamp ?? null,
  });

  if (!result) {
    return Response.json({ error: "generation_failed" }, { status: 400 });
  }

  return Response.json(result);
}
