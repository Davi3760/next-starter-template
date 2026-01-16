import "server-only";

type StampCell = {
  dx: number;
  dy: number;
  paletteIndex: number;
};

type Stamp = {
  width: number;
  height: number;
  size: number;
  cells: StampCell[];
  type?: "house" | "tree" | "rock" | "wall" | "npc" | "decor";
  touchesEdge?: boolean;
};

type AnalysisInfo = {
  stamps: Stamp[];
  decorIds: number[];
  singleDecorIds: number[];
  useManualOnly?: boolean;
  customStamps?: Stamp[];
};

type ManualSelection = {
  grassId: number | null;
  tallGrassId: number | null;
  waterId: number | null;
  pathId: number | null;
  decorIds: number[];
  customStamps: Stamp[];
};

export type MapBuildInput = {
  mapW: number;
  mapH: number;
  analysisInfo: AnalysisInfo;
  manualSelection: ManualSelection;
  lastNpcStamp?: Stamp | null;
  lastTreeStamp?: Stamp | null;
  lastRockStamp?: Stamp | null;
};

function getGridIndex(cols: number, x: number, y: number) {
  return y * cols + x;
}

function placeStamp(
  grid: number[],
  mapW: number,
  mapH: number,
  stamp: Stamp,
  wantsPathAdjacency: boolean,
  pathId: number | null,
  grassIndex: number
) {
  const maxX = mapW - stamp.width;
  const maxY = mapH - stamp.height;
  if (maxX < 0 || maxY < 0) return false;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const ox = Math.floor(Math.random() * (maxX + 1));
    const oy = Math.floor(Math.random() * (maxY + 1));
    let fits = true;
    for (const cell of stamp.cells) {
      const idx = getGridIndex(mapW, ox + cell.dx, oy + cell.dy);
      if (grid[idx] !== grassIndex) {
        fits = false;
        break;
      }
    }
    if (!fits) continue;
    if (wantsPathAdjacency && pathId != null) {
      let touchingPath = false;
      for (const cell of stamp.cells) {
        const gx = ox + cell.dx;
        const gy = oy + cell.dy;
        const neighbors = [
          [gx + 1, gy],
          [gx - 1, gy],
          [gx, gy + 1],
          [gx, gy - 1],
        ];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= mapW || ny >= mapH) continue;
          if (grid[getGridIndex(mapW, nx, ny)] === pathId) {
            touchingPath = true;
            break;
          }
        }
        if (touchingPath) break;
      }
      if (!touchingPath) continue;
    }
    for (const cell of stamp.cells) {
      const idx = getGridIndex(mapW, ox + cell.dx, oy + cell.dy);
      grid[idx] = cell.paletteIndex;
    }
    return true;
  }
  return false;
}

function placeStampAt(
  grid: number[],
  mapW: number,
  mapH: number,
  stamp: Stamp,
  x: number,
  y: number,
  grassIndex: number
) {
  if (x < 0 || y < 0 || x + stamp.width > mapW || y + stamp.height > mapH) return false;
  for (const cell of stamp.cells) {
    const gx = x + cell.dx;
    const gy = y + cell.dy;
    if (gx < 0 || gy < 0 || gx >= mapW || gy >= mapH) return false;
    const idx = getGridIndex(mapW, gx, gy);
    if (grid[idx] !== grassIndex) return false;
  }
  for (const cell of stamp.cells) {
    const idx = getGridIndex(mapW, x + cell.dx, y + cell.dy);
    grid[idx] = cell.paletteIndex;
  }
  return true;
}

function placeStampNear(
  grid: number[],
  mapW: number,
  mapH: number,
  stamp: Stamp,
  cx: number,
  cy: number,
  grassIndex: number,
  radius: number,
  attempts: number
) {
  for (let i = 0; i < attempts; i += 1) {
    const rx = cx + Math.floor((Math.random() * 2 - 1) * radius);
    const ry = cy + Math.floor((Math.random() * 2 - 1) * radius);
    const ox = Math.max(0, Math.min(mapW - stamp.width, rx));
    const oy = Math.max(0, Math.min(mapH - stamp.height, ry));
    if (placeStampAt(grid, mapW, mapH, stamp, ox, oy, grassIndex)) return true;
  }
  return false;
}

function carvePath(
  grid: number[],
  mapW: number,
  mapH: number,
  pathId: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  let x = startX;
  let y = startY;
  const dx = endX > startX ? 1 : -1;
  const dy = endY > startY ? 1 : -1;
  while (x !== endX || y !== endY) {
    if (x !== endX && (y === endY || Math.random() < 0.6)) x += dx;
    else if (y !== endY) y += dy;
    if (x >= 0 && y >= 0 && x < mapW && y < mapH) {
      grid[getGridIndex(mapW, x, y)] = pathId;
    }
  }
}

function carveRiver(grid: number[], mapW: number, mapH: number, waterId: number) {
  const vertical = Math.random() < 0.5;
  const width = 2 + Math.floor(Math.random() * 2);
  if (vertical) {
    let y = 2 + Math.floor(Math.random() * (mapH - 4));
    for (let x = 0; x < mapW; x += 1) {
      if (Math.random() < 0.25) {
        y = Math.max(1, Math.min(mapH - 2, y + (Math.random() < 0.5 ? -1 : 1)));
      }
      for (let w = 0; w < width; w += 1) {
        const ry = Math.max(0, Math.min(mapH - 1, y + w));
        grid[getGridIndex(mapW, x, ry)] = waterId;
      }
    }
  } else {
    let x = 2 + Math.floor(Math.random() * (mapW - 4));
    for (let y = 0; y < mapH; y += 1) {
      if (Math.random() < 0.25) {
        x = Math.max(1, Math.min(mapW - 2, x + (Math.random() < 0.5 ? -1 : 1)));
      }
      for (let w = 0; w < width; w += 1) {
        const rx = Math.max(0, Math.min(mapW - 1, x + w));
        grid[getGridIndex(mapW, rx, y)] = waterId;
      }
    }
  }
}

export function generateNewMap(input: MapBuildInput) {
  const {
    mapW,
    mapH,
    analysisInfo,
    manualSelection,
    lastNpcStamp,
    lastRockStamp,
    lastTreeStamp,
  } = input;

  const customStamps = analysisInfo.customStamps || [];
  const customHouses = customStamps.filter((s) => s.type === "house");
  const customTrees = lastTreeStamp
    ? [lastTreeStamp]
    : customStamps.filter((s) => s.type === "tree");
  const customRocks = lastRockStamp
    ? [lastRockStamp]
    : customStamps.filter((s) => s.type === "rock");
  const customWalls = customStamps.filter((s) => s.type === "wall");
  const customNPCs = lastNpcStamp
    ? [lastNpcStamp]
    : customStamps.filter((s) => s.type === "npc");
  const customDecors = customStamps.filter((s) => s.type === "decor");

  const grassIndex = manualSelection.grassId;
  if (grassIndex == null) return null;

  const tallGrassIndex = manualSelection.tallGrassId;
  const waterIndex = manualSelection.waterId;
  const pathIndex = manualSelection.pathId;

  const grid = new Array(mapW * mapH).fill(grassIndex);
  const area = mapW * mapH;

  if (tallGrassIndex != null && tallGrassIndex !== grassIndex) {
    const tallCount = Math.max(3, Math.floor(area / 140));
    for (let i = 0; i < tallCount; i += 1) {
      const tx = 2 + Math.floor(Math.random() * (mapW - 4));
      const ty = 2 + Math.floor(Math.random() * (mapH - 4));
      const radius = 2 + Math.floor(Math.random() * 2);
      for (let y = -radius; y <= radius; y += 1) {
        for (let x = -radius; x <= radius; x += 1) {
          const dx = tx + x;
          const dy = ty + y;
          if (dx < 0 || dy < 0 || dx >= mapW || dy >= mapH) continue;
          if (x * x + y * y > radius * radius) continue;
          const idx = getGridIndex(mapW, dx, dy);
          if (grid[idx] === grassIndex) {
            grid[idx] = tallGrassIndex;
          }
        }
      }
    }
  }

  const edgeStampPool: Stamp[][] = [];
  if (customRocks.length > 0) edgeStampPool.push(customRocks);
  if (customTrees.length > 0) edgeStampPool.push(customTrees);

  if (edgeStampPool.length > 0 || (waterIndex != null && waterIndex !== grassIndex)) {
    const edgeNoise: number[] = [];
    for (let x = 0; x < mapW; x += 1) {
      edgeNoise[x] = 1 + Math.floor(Math.random() * 3);
    }
    for (let y = 0; y < mapH; y += 1) {
      edgeNoise[mapW + y] = 1 + Math.floor(Math.random() * 3);
    }

    const edgeTypes: string[][] = [];
    const typeOptions: string[] = [];
    if (waterIndex != null && waterIndex !== grassIndex) typeOptions.push("water");
    if (customRocks.length > 0) typeOptions.push("rocks");
    if (customTrees.length > 0) typeOptions.push("trees");
    if (typeOptions.length === 0) {
      typeOptions.push("water");
    }

    const waterSides = Math.random() < 0.4 ? 1 : 0;
    const waterSideIndexes: number[] = [];
    if (waterSides > 0 && typeOptions.includes("water")) {
      const pick = Math.floor(Math.random() * 4);
      waterSideIndexes.push(pick);
    }

    for (let side = 0; side < 4; side += 1) {
      const len = side < 2 ? mapW : mapH;
      edgeTypes[side] = [];
      if (waterSideIndexes.includes(side)) {
        for (let i = 0; i < len; i += 1) {
          edgeTypes[side][i] = "water";
        }
        continue;
      }
      let pos = 0;
      while (pos < len) {
        const segmentLen = 6 + Math.floor(Math.random() * 10);
        const pool = typeOptions.filter((t) => t !== "water");
        const type =
          pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : "water";
        for (let i = 0; i < segmentLen && pos < len; i += 1, pos += 1) {
          edgeTypes[side][pos] = type;
        }
      }
    }

    for (let x = 0; x < mapW; x += 1) {
      for (let y = 0; y < mapH; y += 1) {
        const edgeTop = y <= edgeNoise[x];
        const edgeBottom = y >= mapH - 1 - edgeNoise[x];
        const edgeLeft = x <= edgeNoise[mapW + y];
        const edgeRight = x >= mapW - 1 - edgeNoise[mapW + y];
        if (!edgeTop && !edgeBottom && !edgeLeft && !edgeRight) continue;

        let type: string | null = null;
        if (edgeTop) type = edgeTypes[0][x];
        else if (edgeBottom) type = edgeTypes[1][x];
        else if (edgeLeft) type = edgeTypes[2][y];
        else if (edgeRight) type = edgeTypes[3][y];

        const idx = getGridIndex(mapW, x, y);
        if (type === "water" && waterIndex != null && waterIndex !== grassIndex) {
          grid[idx] = waterIndex;
          continue;
        }
        if (type === "rocks" && customRocks.length > 0) {
          const stamp = customRocks[Math.floor(Math.random() * customRocks.length)];
          if (stamp) placeStampAt(grid, mapW, mapH, stamp, x, y, grassIndex);
          continue;
        }
        if (type === "trees" && customTrees.length > 0) {
          const stamp = customTrees[Math.floor(Math.random() * customTrees.length)];
          if (stamp) placeStampAt(grid, mapW, mapH, stamp, x, y, grassIndex);
        }
      }
    }
  }

  const bigCount = Math.min(
    analysisInfo.stamps.length,
    Math.max(1, Math.floor(area / (420 + Math.random() * 120)))
  );
  const mediumCount = Math.min(
    analysisInfo.stamps.length,
    Math.max(2, Math.floor(area / (220 + Math.random() * 80)))
  );
  const smallCount = Math.min(
    analysisInfo.stamps.length,
    Math.max(3, Math.floor(area / (120 + Math.random() * 40)))
  );

  const usableStamps = analysisInfo.stamps.filter((s) => !s.touchesEdge);
  const fallbackStamps = usableStamps.length > 0 ? usableStamps : analysisInfo.stamps;
  const bigStamps = fallbackStamps.filter((s) => s.size >= 30);
  const mediumStamps = fallbackStamps.filter((s) => s.size >= 8 && s.size < 30);
  const smallStamps = fallbackStamps.filter((s) => s.size >= 2 && s.size < 8);
  const houseStamps = fallbackStamps.filter(
    (s) => s.size >= 12 && s.width >= 3 && s.height >= 3
  );

  if (waterIndex != null && waterIndex !== grassIndex) {
    carveRiver(grid, mapW, mapH, waterIndex);
  }

  if (pathIndex != null && pathIndex !== grassIndex) {
    const entryCount = 2 + Math.floor(Math.random() * 2);
    const entries: Array<[number, number]> = [];
    for (let i = 0; i < entryCount; i += 1) {
      const side = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      if (side === 0) {
        x = 1 + Math.floor(Math.random() * (mapW - 2));
        y = 0;
      } else if (side === 1) {
        x = 1 + Math.floor(Math.random() * (mapW - 2));
        y = mapH - 1;
      } else if (side === 2) {
        x = 0;
        y = 1 + Math.floor(Math.random() * (mapH - 2));
      } else {
        x = mapW - 1;
        y = 1 + Math.floor(Math.random() * (mapH - 2));
      }
      entries.push([x, y]);
    }

    const hubX = Math.floor(mapW / 2 + (Math.random() * 4 - 2));
    const hubY = Math.floor(mapH / 2 + (Math.random() * 4 - 2));
    for (const [sx, sy] of entries) {
      carvePath(grid, mapW, mapH, pathIndex, sx, sy, hubX, hubY);
    }
    if (Math.random() < 0.7) {
      const extraX = 1 + Math.floor(Math.random() * (mapW - 2));
      const extraY = 1 + Math.floor(Math.random() * (mapH - 2));
      carvePath(grid, mapW, mapH, pathIndex, hubX, hubY, extraX, extraY);
    }
  }

  if (!analysisInfo.useManualOnly) {
    const needsPath = pathIndex != null && pathIndex !== grassIndex;
    const houseCount = Math.max(2, Math.floor(area / 250));
    for (let i = 0; i < houseCount; i += 1) {
      const source = customHouses.length > 0 ? customHouses : houseStamps;
      const stamp = source[Math.floor(Math.random() * source.length)];
      if (stamp) placeStamp(grid, mapW, mapH, stamp, needsPath, pathIndex, grassIndex);
    }
    const wallCount = Math.max(1, Math.floor(area / 320));
    for (let i = 0; i < wallCount; i += 1) {
      const stamp = customWalls[Math.floor(Math.random() * customWalls.length)];
      if (stamp) placeStamp(grid, mapW, mapH, stamp, needsPath, pathIndex, grassIndex);
    }
    for (let i = 0; i < bigCount; i += 1) {
      const stamp = bigStamps[Math.floor(Math.random() * bigStamps.length)];
      if (stamp) placeStamp(grid, mapW, mapH, stamp, needsPath, pathIndex, grassIndex);
    }
    for (let i = 0; i < mediumCount; i += 1) {
      const stamp = mediumStamps[Math.floor(Math.random() * mediumStamps.length)];
      if (stamp) placeStamp(grid, mapW, mapH, stamp, needsPath, pathIndex, grassIndex);
    }
    for (let i = 0; i < smallCount; i += 1) {
      const stamp = smallStamps[Math.floor(Math.random() * smallStamps.length)];
      if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
    }
  }

  if (analysisInfo.useManualOnly) {
    const bigMap = area >= 1200;
    if (bigMap && customHouses.length > 0) {
      const townCount = Math.max(2, Math.min(4, Math.floor(area / 900)));
      const centers: Array<[number, number]> = [];
      for (let i = 0; i < townCount; i += 1) {
        const cx = 2 + Math.floor(Math.random() * (mapW - 4));
        const cy = 2 + Math.floor(Math.random() * (mapH - 4));
        centers.push([cx, cy]);
      }

      const houseTries = Math.max(6, Math.floor(area / 140));
      for (let i = 0; i < houseTries; i += 1) {
        const stamp = customHouses[Math.floor(Math.random() * customHouses.length)];
        if (!stamp) continue;
        const center = centers[Math.floor(Math.random() * centers.length)];
        placeStampNear(grid, mapW, mapH, stamp, center[0], center[1], grassIndex, 10, 12);
      }
    } else if (customHouses.length > 0) {
      const houseTries = Math.max(4, Math.floor(area / 200));
      for (let i = 0; i < houseTries; i += 1) {
        const stamp = customHouses[Math.floor(Math.random() * customHouses.length)];
        if (!stamp) continue;
        placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
      }
    }

    if (customWalls.length > 0) {
      const wallTries = Math.max(2, Math.floor(area / 260));
      for (let i = 0; i < wallTries; i += 1) {
        const stamp = customWalls[Math.floor(Math.random() * customWalls.length)];
        if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
      }
    }

    if (customTrees.length > 0) {
      const treeTries = Math.max(4, Math.floor(area / 90));
      for (let i = 0; i < treeTries; i += 1) {
        const stamp = customTrees[Math.floor(Math.random() * customTrees.length)];
        if (!stamp) continue;
        placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
      }
    }

    if (customRocks.length > 0) {
      const rockTries = Math.max(4, Math.floor(area / 140));
      for (let i = 0; i < rockTries; i += 1) {
        const stamp = customRocks[Math.floor(Math.random() * customRocks.length)];
        if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
      }
    }

    if (customDecors.length > 0 || customNPCs.length > 0) {
      const decorIds =
        analysisInfo.singleDecorIds.length > 0
          ? analysisInfo.singleDecorIds
          : analysisInfo.decorIds;
      const decorTries = Math.max(10, Math.floor(area / 40));
      for (let i = 0; i < decorTries; i += 1) {
        const roll = Math.random();
        const stamp =
          roll < 0.6 && customDecors.length > 0
            ? customDecors[Math.floor(Math.random() * customDecors.length)]
            : customNPCs.length > 0
              ? customNPCs[Math.floor(Math.random() * customNPCs.length)]
              : null;
        if (stamp) {
          placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
          continue;
        }
        if (decorIds.length === 0) continue;
        const x = 1 + Math.floor(Math.random() * (mapW - 2));
        const y = 1 + Math.floor(Math.random() * (mapH - 2));
        if (grid[getGridIndex(mapW, x, y)] !== grassIndex) continue;
        grid[getGridIndex(mapW, x, y)] = decorIds[Math.floor(Math.random() * decorIds.length)];
      }
    }
  }

  return { grid };
}
