const imageInput = document.getElementById("imageInput");
      const tileSizeInput = document.getElementById("tileSize");
      const mapWidthInput = document.getElementById("mapWidth");
      const mapHeightInput = document.getElementById("mapHeight");
      const genBtn = document.getElementById("genBtn");
      const saveProjectBtn = document.getElementById("saveProjectBtn");
      const loadProjectInput = document.getElementById("loadProjectInput");
      const imageList = document.getElementById("imageList");
      const pickButtons = document.querySelectorAll("[data-pick]");
      const tabMap = document.getElementById("tabMap");
      const tabSprite = document.getElementById("tabSprite");
      const tabMonster = document.getElementById("tabMonster");
      const mapTab = document.getElementById("mapTab");
      const spriteTab = document.getElementById("spriteTab");
      const monsterTab = document.getElementById("monsterTab");
      const previewGrass = document.getElementById("previewGrass");
      const previewTallGrass = document.getElementById("previewTallGrass");
      const previewWater = document.getElementById("previewWater");
      const previewPath = document.getElementById("previewPath");
      const previewWall = document.getElementById("previewWall");
      const previewRock = document.getElementById("previewRock");
      const previewHouse = document.getElementById("previewHouse");
      const previewTree = document.getElementById("previewTree");
      const previewDecor = document.getElementById("previewDecor");
      const stampWidthInput = document.getElementById("stampWidth");
      const stampHeightInput = document.getElementById("stampHeight");
      const stampCountLabel = document.getElementById("stampCount");

      const sourceCanvas = document.getElementById("sourceCanvas");
      const genCanvas = document.getElementById("genCanvas");
      const playerCanvas = document.getElementById("playerCanvas");
      const spriteInput = document.getElementById("spriteInput");
      const spriteCanvas = document.getElementById("spriteCanvas");
      const spritePreview = document.getElementById("spritePreview");
      const animPreview = document.getElementById("animPreview");
      const testPanel = document.getElementById("testPanel");
      const testCanvas = document.getElementById("testCanvas");
      const battleOverlay = document.getElementById("battleOverlay");
      const battleCanvas = document.getElementById("battleCanvas");
      const battleDialog = document.getElementById("battleDialog");
      const battleText = document.getElementById("battleText");
      const battleMore = document.getElementById("battleMore");
      const battleMenu = document.getElementById("battleMenu");
      const battleMoves = document.getElementById("battleMoves");
      const starterOverlay = document.getElementById("starterOverlay");
      const starterOptions = document.getElementById("starterOptions");
      const fightBtn = document.getElementById("fightBtn");
      const teamBtn = document.getElementById("teamBtn");
      const itemBtn = document.getElementById("itemBtn");
      const moveBtn1 = document.getElementById("moveBtn1");
      const moveBtn2 = document.getElementById("moveBtn2");
      const moveBtn3 = document.getElementById("moveBtn3");
      const moveBtn4 = document.getElementById("moveBtn4");
      const moveBackBtn = document.getElementById("moveBackBtn");
      const runBtn = document.getElementById("runBtn");
      const frameWidthInput = document.getElementById("frameWidth");
      const frameHeightInput = document.getElementById("frameHeight");
      const animTypeSelect = document.getElementById("animType");
      const animFramesInput = document.getElementById("animFrames");
      const animFrameIndexInput = document.getElementById("animFrameIndex");
      const testPlayerBtn = document.getElementById("testPlayerBtn");
      const monsterInput = document.getElementById("monsterInput");
      const monsterCountInput = document.getElementById("monsterCount");
      const monsterIndexInput = document.getElementById("monsterIndex");
      const monsterNameInput = document.getElementById("monsterName");
      const monsterSelWidthInput = document.getElementById("monsterSelWidth");
      const monsterSelHeightInput = document.getElementById("monsterSelHeight");
      const monsterPickFront = document.getElementById("monsterPickFront");
      const monsterPickBack = document.getElementById("monsterPickBack");
      const monsterCanvas = document.getElementById("monsterCanvas");
      const monsterFrontPreview = document.getElementById("monsterFrontPreview");
      const monsterBackPreview = document.getElementById("monsterBackPreview");
      const monsterPreview = document.getElementById("monsterPreview");

      const sourceCtx = sourceCanvas.getContext("2d");
      const genCtx = genCanvas.getContext("2d");
      const playerCtx = playerCanvas.getContext("2d");
      const spriteCtx = spriteCanvas.getContext("2d");
      const spritePrevCtx = spritePreview.getContext("2d");
      const animPrevCtx = animPreview.getContext("2d");
      const testCtx = testCanvas.getContext("2d");
      const battleCtx = battleCanvas.getContext("2d");
      const monsterCtx = monsterCanvas.getContext("2d");
      const monsterFrontPrevCtx = monsterFrontPreview.getContext("2d");
      const monsterBackPrevCtx = monsterBackPreview.getContext("2d");
      const monsterPrevCtx = monsterPreview.getContext("2d");

      let loadedImage = null;
      let loadedImages = [];
      let activeImageIndex = -1;
      let lastMainTab = "map";
      let tilesetInfo = null;
      let analysisInfo = null;
      let lastGeneratedHash = null;
      let lastGeneratedGrid = null;
      let lastGeneratedMapW = 0;
      let lastGeneratedMapH = 0;
      let sourceOverlay = null;
      let lastSelectionAnchor = null;
      let manualPalette = [];
      let manualPaletteLookup = new Map();
      let selectionMode = null;
      const manualSelection = {
        grassId: null,
        tallGrassId: null,
        waterId: null,
        pathId: null,
        decorIds: [],
        customStamps: [],
        grassTileData: null,
      };
      let lastNpcStamp = null;
      let lastTreeStamp = null;
      let lastRockStamp = null;
      let loadedImageDataUrls = [];
      let sourcePixelCanvas = null;
      let sourcePixelCtx = null;

      let spriteImage = null;
      const spriteAnims = {
        idle: [],
        down: [],
        up: [],
        side: [],
      };
      let spriteSelection = {
        anim: "idle",
        index: 0,
      };
      let playerState = {
        x: 0,
        y: 0,
        dir: "down",
        frameIndex: 0,
        lastTime: 0,
        speed: 40,
      };
      let playerKeys = {};
      let playerActive = false;
      let animTick = 0;
      let collisionSet = new Set();
      let collisionPaletteSet = new Set();
      let lastTallGrassTile = null;

      let monsterImage = null;
      let monsterSelectionMode = "front";
      let monsterSelectionAnchor = null;
      let monsters = [];
      let playerProfile = {
        monsterIndex: null,
        level: 5,
        exp: 0,
        hp: 30,
        maxHp: 30,
      };

      const battleState = {
        active: false,
        wildIndex: null,
        playerIndex: null,
        wildHp: 0,
        playerHp: 0,
        wildLevel: 3,
        playerLevel: 5,
        message: "",
        menu: "root",
        menuIndex: 0,
        moveIndex: 0,
        messageQueue: [],
      };

      function drawSourceImage(image) {
        sourceCanvas.width = image.width;
        sourceCanvas.height = image.height;
        sourceCtx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
        sourceCtx.drawImage(image, 0, 0);
        if (sourceOverlay) {
          sourceCtx.save();
          sourceCtx.strokeStyle = sourceOverlay.color;
          sourceCtx.lineWidth = 2;
          sourceCtx.strokeRect(
            sourceOverlay.x + 1,
            sourceOverlay.y + 1,
            sourceOverlay.w - 2,
            sourceOverlay.h - 2
          );
          sourceCtx.restore();
        }
      }

      function renderImageList() {
        imageList.innerHTML = "";
        loadedImages.forEach((info, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = info.name || `Mapa ${index + 1}`;
          button.classList.toggle("active", index === activeImageIndex);
          button.addEventListener("click", () => {
            useImage(index);
          });
          imageList.appendChild(button);
        });
      }

      function useImage(index) {
        if (!loadedImages[index]) return;
        activeImageIndex = index;
        loadedImage = loadedImages[index].image;
        sourceOverlay = null;
        lastSelectionAnchor = null;
        drawSourceImage(loadedImage);
        sliceTiles();
        renderImageList();
      }

      function hashTile(data) {
        let hash = 2166136261;
        for (let i = 0; i < data.length; i += 1) {
          hash ^= data[i];
          hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
      }

      function tilesEqual(a, b) {
        if (a.data.length !== b.data.length) return false;
        const dataA = a.data;
        const dataB = b.data;
        for (let i = 0; i < dataA.length; i += 1) {
          if (dataA[i] !== dataB[i]) return false;
        }
        return true;
      }

      function addTileToPalette(tileData) {
        const hash = hashTile(tileData.data);
        if (manualPaletteLookup.has(hash)) {
          for (const existingIndex of manualPaletteLookup.get(hash)) {
            if (tilesEqual(manualPalette[existingIndex], tileData)) {
              return existingIndex;
            }
          }
        }
        const index = manualPalette.length;
        manualPalette.push(tileData);
        if (!manualPaletteLookup.has(hash)) {
          manualPaletteLookup.set(hash, []);
        }
        manualPaletteLookup.get(hash).push(index);
        return index;
      }

      function getSourceTileData(px, py) {
        if (!sourcePixelCtx) return null;
        const size = Number(tileSizeInput.value);
        if (!Number.isFinite(size) || size <= 0) return null;
        if (px < 0 || py < 0 || px + size > sourcePixelCanvas.width || py + size > sourcePixelCanvas.height) {
          return null;
        }
        return sourcePixelCtx.getImageData(px, py, size, size);
      }

      function setPaletteFromTiles(tiles) {
        manualPalette = [];
        manualPaletteLookup = new Map();
        tiles.forEach((tileData) => {
          const index = manualPalette.length;
          manualPalette.push(tileData);
          const hash = hashTile(tileData.data);
          if (!manualPaletteLookup.has(hash)) {
            manualPaletteLookup.set(hash, []);
          }
          manualPaletteLookup.get(hash).push(index);
        });
      }

      function imageDataToDataUrl(tileData) {
        const canvas = document.createElement("canvas");
        canvas.width = tileData.width;
        canvas.height = tileData.height;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(tileData, 0, 0);
        return canvas.toDataURL("image/png");
      }

      function dataUrlToImageData(dataUrl, size) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, size, size);
            const data = ctx.getImageData(0, 0, size, size);
            resolve(data);
          };
          img.src = dataUrl;
        });
      }

      function buildTileset(image, tileSize) {
        const cols = Math.floor(image.width / tileSize);
        const rows = Math.floor(image.height / tileSize);
        const tileMap = [];
        const tiles = [];
        const lookup = new Map();

        const offscreen = document.createElement("canvas");
        offscreen.width = image.width;
        offscreen.height = image.height;
        const offCtx = offscreen.getContext("2d");
        offCtx.drawImage(image, 0, 0);

        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            const x = col * tileSize;
            const y = row * tileSize;
            const tileData = offCtx.getImageData(x, y, tileSize, tileSize);
            const hash = hashTile(tileData.data);
            let tileIndex = -1;

            if (lookup.has(hash)) {
              for (const existingIndex of lookup.get(hash)) {
                if (tilesEqual(tiles[existingIndex], tileData)) {
                  tileIndex = existingIndex;
                  break;
                }
              }
            }

            if (tileIndex === -1) {
              tileIndex = tiles.length;
              tiles.push(tileData);
              if (!lookup.has(hash)) {
                lookup.set(hash, []);
              }
              lookup.get(hash).push(tileIndex);
            }

            tileMap.push(tileIndex);
          }
        }

        return { cols, rows, tiles, tileMap, tileSize };
      }

      function getGridIndex(cols, x, y) {
        return y * cols + x;
      }

      function analyzeMap(tileset) {
        const { cols, rows, tileMap } = tileset;
        const counts = new Map();
        const interiorCounts = new Map();
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const id = tileMap[getGridIndex(cols, x, y)];
            counts.set(id, (counts.get(id) || 0) + 1);
            if (x > 0 && y > 0 && x < cols - 1 && y < rows - 1) {
              interiorCounts.set(id, (interiorCounts.get(id) || 0) + 1);
            }
          }
        }

        const tileStats = tileset.tiles.map((tile) => {
          const data = tile.data;
          let r = 0;
          let g = 0;
          let b = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          const count = data.length / 4;
          return {
            r: r / count,
            g: g / count,
            b: b / count,
          };
        });

        let grassId = 0;
        let maxCount = -1;
        for (const [id, count] of interiorCounts.entries()) {
          if (count > maxCount) {
            grassId = id;
            maxCount = count;
          }
        }
        const grassStats = tileStats[grassId] || { r: 0, g: 0, b: 0 };
        const grassBlueBias = grassStats.b - grassStats.g;
        if (grassBlueBias > 20) {
          let fallbackId = grassId;
          let fallbackCount = -1;
          for (const [id, count] of interiorCounts.entries()) {
            const stats = tileStats[id];
            if (!stats) continue;
            if (stats.g < stats.r) continue;
            if (stats.b - stats.g > 10) continue;
            if (count > fallbackCount) {
              fallbackId = id;
              fallbackCount = count;
            }
          }
          grassId = fallbackId;
        }

        const decorIds = new Set();
        const singleDecorIds = new Set();
        const grassAdjacencyCounts = new Map();
        for (let y = 1; y < rows - 1; y += 1) {
          for (let x = 1; x < cols - 1; x += 1) {
            const id = tileMap[getGridIndex(cols, x, y)];
            if (id === grassId) continue;
            const up = tileMap[getGridIndex(cols, x, y - 1)];
            const down = tileMap[getGridIndex(cols, x, y + 1)];
            const left = tileMap[getGridIndex(cols, x - 1, y)];
            const right = tileMap[getGridIndex(cols, x + 1, y)];
            if (up === grassId && down === grassId && left === grassId && right === grassId) {
              decorIds.add(id);
            }
            if (
              up === grassId ||
              down === grassId ||
              left === grassId ||
              right === grassId
            ) {
              grassAdjacencyCounts.set(id, (grassAdjacencyCounts.get(id) || 0) + 1);
            }
          }
        }

        const visited = new Array(tileMap.length).fill(false);
        const stamps = [];
        const directions = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ];

        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const index = getGridIndex(cols, x, y);
            if (visited[index]) continue;
            const id = tileMap[index];
            if (id === grassId) {
              visited[index] = true;
              continue;
            }

            const queue = [[x, y]];
            const cells = [];
            visited[index] = true;
            let minX = x;
            let minY = y;
            let maxX = x;
            let maxY = y;

            while (queue.length) {
              const [cx, cy] = queue.pop();
              cells.push([cx, cy, tileMap[getGridIndex(cols, cx, cy)]]);
              if (cx < minX) minX = cx;
              if (cy < minY) minY = cy;
              if (cx > maxX) maxX = cx;
              if (cy > maxY) maxY = cy;

              for (const [dx, dy] of directions) {
                const nx = cx + dx;
                const ny = cy + dy;
                if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
                const nIndex = getGridIndex(cols, nx, ny);
                if (visited[nIndex]) continue;
                if (tileMap[nIndex] === grassId) continue;
                visited[nIndex] = true;
                queue.push([nx, ny]);
              }
            }

            if (cells.length === 1) {
              const only = cells[0];
              const cx = only[0];
              const cy = only[1];
              if (cx > 0 && cy > 0 && cx < cols - 1 && cy < rows - 1) {
                const up = tileMap[getGridIndex(cols, cx, cy - 1)];
                const down = tileMap[getGridIndex(cols, cx, cy + 1)];
                const left = tileMap[getGridIndex(cols, cx - 1, cy)];
                const right = tileMap[getGridIndex(cols, cx + 1, cy)];
                if (up === grassId && down === grassId && left === grassId && right === grassId) {
                  singleDecorIds.add(only[2]);
                }
              }
              continue;
            }

            const stampCells = cells.map(([cx, cy, tileId]) => ({
              dx: cx - minX,
              dy: cy - minY,
              tileId,
            }));
            const width = maxX - minX + 1;
            const height = maxY - minY + 1;
            const touchesEdge =
              minX === 0 || minY === 0 || maxX === cols - 1 || maxY === rows - 1;
            stamps.push({
              width,
              height,
              cells: stampCells,
              size: cells.length,
              touchesEdge,
            });
          }
        }

        stamps.sort((a, b) => b.size - a.size);

        let waterId = grassId;
        let bestWaterScore = -9999;
        for (let i = 0; i < tileStats.length; i += 1) {
          const t = tileStats[i];
          const score = t.b - Math.max(t.r, t.g);
          if (score > bestWaterScore) {
            bestWaterScore = score;
            waterId = i;
          }
        }

        let pathId = grassId;
        let pathCount = -1;
        for (const [id, count] of grassAdjacencyCounts.entries()) {
          if (id === grassId || id === waterId) continue;
          if (count > pathCount) {
            pathCount = count;
            pathId = id;
          }
        }
        if (pathId === grassId) {
          let fallbackPath = grassId;
          let fallbackCount = -1;
          for (const [id, count] of interiorCounts.entries()) {
            if (id === grassId || id === waterId) continue;
            if (count > fallbackCount) {
              fallbackPath = id;
              fallbackCount = count;
            }
          }
          pathId = fallbackPath;
        }

        return {
          grassId,
          waterId,
          pathId,
          decorIds: Array.from(decorIds),
          singleDecorIds: Array.from(singleDecorIds),
          stamps,
        };
      }

      function placeStamp(grid, mapW, mapH, stamp, wantsPathAdjacency, pathId, grassIndex) {
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
          if (wantsPathAdjacency) {
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

      function placeStampAt(grid, mapW, mapH, stamp, x, y, grassIndex) {
        if (x < 0 || y < 0 || x + stamp.width > mapW || y + stamp.height > mapH) return false;
        for (const cell of stamp.cells) {
          const idx = getGridIndex(mapW, x + cell.dx, y + cell.dy);
          if (grid[idx] !== grassIndex) return false;
        }
        for (const cell of stamp.cells) {
          const idx = getGridIndex(mapW, x + cell.dx, y + cell.dy);
          grid[idx] = cell.paletteIndex;
        }
        return true;
      }

      function placeStampNear(grid, mapW, mapH, stamp, cx, cy, grassIndex, radius, attempts) {
        for (let i = 0; i < attempts; i += 1) {
          const ox = Math.floor(cx + (Math.random() * 2 - 1) * radius);
          const oy = Math.floor(cy + (Math.random() * 2 - 1) * radius);
          const x = Math.max(0, Math.min(mapW - stamp.width, ox));
          const y = Math.max(0, Math.min(mapH - stamp.height, oy));
          if (placeStampAt(grid, mapW, mapH, stamp, x, y, grassIndex)) return true;
        }
        return false;
      }

      function carvePath(grid, mapW, mapH, pathId, startX, startY, endX, endY) {
        let x = startX;
        let y = startY;
        const maxSteps = mapW * mapH;
        let steps = 0;
        while ((x !== endX || y !== endY) && steps < maxSteps) {
          grid[getGridIndex(mapW, x, y)] = pathId;
          const moveX = Math.random() < 0.5;
          if (moveX && x !== endX) {
            x += endX > x ? 1 : -1;
          } else if (y !== endY) {
            y += endY > y ? 1 : -1;
          } else if (x !== endX) {
            x += endX > x ? 1 : -1;
          }
          if (Math.random() < 0.15) {
            const wiggle = Math.random() < 0.5 ? -1 : 1;
            const nx = Math.max(1, Math.min(mapW - 2, x + wiggle));
            const ny = Math.max(1, Math.min(mapH - 2, y + wiggle));
            x = nx;
            y = ny;
          }
          steps += 1;
        }
        grid[getGridIndex(mapW, endX, endY)] = pathId;
      }

      function carveRiver(grid, mapW, mapH, waterId) {
        const horizontal = Math.random() < 0.5;
        const width = 2 + Math.floor(Math.random() * 2);
        if (horizontal) {
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

      function hashGrid(grid) {
        let hash = 2166136261;
        for (let i = 0; i < grid.length; i += 1) {
          hash ^= grid[i];
          hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
      }

      function generateNewMap(mapW, mapH) {
        if (!tilesetInfo || !analysisInfo) return null;
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
        let grassIndex = manualSelection.grassId;
        if (grassIndex == null) {
          const fallback = tilesetInfo.tiles[analysisInfo.grassId];
          if (fallback) {
            grassIndex = addTileToPalette(fallback);
            manualSelection.grassId = grassIndex;
          }
        }
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

        const edgeStampPool = [];
        if (customRocks.length > 0) edgeStampPool.push(customRocks);
        if (customTrees.length > 0) edgeStampPool.push(customTrees);

        if (edgeStampPool.length > 0 || (waterIndex != null && waterIndex !== grassIndex)) {
          const edgeNoise = [];
          for (let x = 0; x < mapW; x += 1) {
            edgeNoise[x] = 1 + Math.floor(Math.random() * 3);
          }
          for (let y = 0; y < mapH; y += 1) {
            edgeNoise[mapW + y] = 1 + Math.floor(Math.random() * 3);
          }

          const edgeTypes = [];
          const typeOptions = [];
          if (waterIndex != null && waterIndex !== grassIndex) typeOptions.push("water");
          if (customRocks.length > 0) typeOptions.push("rocks");
          if (customTrees.length > 0) typeOptions.push("trees");
          if (typeOptions.length === 0) {
            typeOptions.push("water");
          }

          const waterSides = Math.random() < 0.4 ? 1 : 0;
          const waterSideIndexes = [];
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

              let type = null;
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
          const entries = [];
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
            const centers = [];
            for (let i = 0; i < townCount; i += 1) {
              const cx = 3 + Math.floor(Math.random() * (mapW - 6));
              const cy = 3 + Math.floor(Math.random() * (mapH - 6));
              centers.push([cx, cy]);
            }
            if (pathIndex != null && pathIndex !== grassIndex) {
              for (let i = 1; i < centers.length; i += 1) {
                const [sx, sy] = centers[i - 1];
                const [ex, ey] = centers[i];
                carvePath(grid, mapW, mapH, pathIndex, sx, sy, ex, ey);
              }
            }
            centers.forEach(([cx, cy]) => {
              const houseCount = 3 + Math.floor(Math.random() * 3);
              for (let i = 0; i < houseCount; i += 1) {
                const stamp = customHouses[Math.floor(Math.random() * customHouses.length)];
                if (stamp) placeStampNear(grid, mapW, mapH, stamp, cx, cy, grassIndex, 6, 80);
              }
              if (customWalls.length > 0) {
                const wallStamp = customWalls[Math.floor(Math.random() * customWalls.length)];
                const halfW = 6;
                const halfH = 5;
                for (let x = cx - halfW; x <= cx + halfW; x += 1) {
                  placeStampAt(grid, mapW, mapH, wallStamp, x, cy - halfH, grassIndex);
                  placeStampAt(grid, mapW, mapH, wallStamp, x, cy + halfH, grassIndex);
                }
                for (let y = cy - halfH; y <= cy + halfH; y += 1) {
                  placeStampAt(grid, mapW, mapH, wallStamp, cx - halfW, y, grassIndex);
                  placeStampAt(grid, mapW, mapH, wallStamp, cx + halfW, y, grassIndex);
                }
              }
              if (customTrees.length > 0) {
                const treeCount = 6 + Math.floor(Math.random() * 6);
                for (let i = 0; i < treeCount; i += 1) {
                  const stamp = customTrees[Math.floor(Math.random() * customTrees.length)];
                  if (stamp) {
                    placeStampNear(grid, mapW, mapH, stamp, cx, cy, grassIndex, 10, 60);
                  }
                }
              }
            });

            const isFarFromTowns = (x, y, minDist) => {
              const minDistSq = minDist * minDist;
              for (const [tx, ty] of centers) {
                const dx = x - tx;
                const dy = y - ty;
                if (dx * dx + dy * dy < minDistSq) return false;
              }
              return true;
            };

            if (customTrees.length > 0) {
              const forestCount = Math.max(2, Math.floor(area / 1100));
              for (let i = 0; i < forestCount; i += 1) {
                const fx = 4 + Math.floor(Math.random() * (mapW - 8));
                const fy = 4 + Math.floor(Math.random() * (mapH - 8));
                if (!isFarFromTowns(fx, fy, 10)) continue;
                const treeCount = 26 + Math.floor(Math.random() * 18);
                for (let j = 0; j < treeCount; j += 1) {
                  const stamp = customTrees[Math.floor(Math.random() * customTrees.length)];
                  if (stamp) {
                    placeStampNear(grid, mapW, mapH, stamp, fx, fy, grassIndex, 8, 80);
                  }
                }
              }
            }

            if (customRocks.length > 0) {
              const mountainCount = Math.max(1, Math.floor(area / 1400));
              for (let i = 0; i < mountainCount; i += 1) {
                const mx = 4 + Math.floor(Math.random() * (mapW - 8));
                const my = 4 + Math.floor(Math.random() * (mapH - 8));
                if (!isFarFromTowns(mx, my, 12)) continue;
                const rockCount = 24 + Math.floor(Math.random() * 16);
                for (let j = 0; j < rockCount; j += 1) {
                  const stamp = customRocks[Math.floor(Math.random() * customRocks.length)];
                  if (stamp) {
                    placeStampNear(grid, mapW, mapH, stamp, mx, my, grassIndex, 8, 100);
                  }
                }
              }
            }

        if (waterIndex != null && waterIndex !== grassIndex) {
          const lakeCount = Math.max(1, Math.floor(area / 1600));
          for (let i = 0; i < lakeCount; i += 1) {
            const lx = 4 + Math.floor(Math.random() * (mapW - 8));
                const ly = 4 + Math.floor(Math.random() * (mapH - 8));
                if (!isFarFromTowns(lx, ly, 10)) continue;
                const radius = 2 + Math.floor(Math.random() * 3);
                for (let y = -radius; y <= radius; y += 1) {
                  for (let x = -radius; x <= radius; x += 1) {
                    const dx = lx + x;
                    const dy = ly + y;
                    if (dx < 0 || dy < 0 || dx >= mapW || dy >= mapH) continue;
                    if (x * x + y * y > radius * radius) continue;
                    const idx = getGridIndex(mapW, dx, dy);
                    if (grid[idx] === grassIndex) {
                      grid[idx] = waterIndex;
                    }
                  }
                }
              }
            }
          } else {
            if (customHouses.length > 0) {
              const houseCount = Math.max(1, Math.floor(area / 260));
              for (let i = 0; i < houseCount; i += 1) {
                const stamp = customHouses[Math.floor(Math.random() * customHouses.length)];
                if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
              }
            }
            if (customTrees.length > 0) {
              const treeCount = Math.max(2, Math.floor(area / 180));
              for (let i = 0; i < treeCount; i += 1) {
                const stamp = customTrees[Math.floor(Math.random() * customTrees.length)];
                if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
              }
            }
            if (customRocks.length > 0) {
              const rockCount = Math.max(4, Math.floor(area / 140));
              for (let i = 0; i < rockCount; i += 1) {
                const stamp = customRocks[Math.floor(Math.random() * customRocks.length)];
                if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
              }
            }
            if (customWalls.length > 0) {
              const wallCount = Math.max(2, Math.floor(area / 200));
              for (let i = 0; i < wallCount; i += 1) {
                const stamp = customWalls[Math.floor(Math.random() * customWalls.length)];
                if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
              }
            }
          }
        }

        const npcCount = Math.max(1, Math.floor(area / 180));
        for (let i = 0; i < npcCount; i += 1) {
          if (customNPCs.length === 0) break;
          const stamp = customNPCs[Math.floor(Math.random() * customNPCs.length)];
          if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
        }

        const decorCount = Math.floor(area / (70 + Math.random() * 40));
        const npcTileSet = new Set();
        for (const stamp of customNPCs) {
          for (const cell of stamp.cells) {
            npcTileSet.add(cell.paletteIndex);
          }
        }
        if (analysisInfo.useManualOnly) {
          return { grid, mapW, mapH };
        }
        if (customDecors.length > 0) {
          for (let i = 0; i < decorCount; i += 1) {
            const stamp = customDecors[Math.floor(Math.random() * customDecors.length)];
            if (stamp) placeStamp(grid, mapW, mapH, stamp, false, pathIndex, grassIndex);
          }
        } else {
          const decorPool =
            analysisInfo.singleDecorIds.length > 0
              ? analysisInfo.singleDecorIds
              : analysisInfo.decorIds;
          const filteredDecorPool = decorPool.filter((id) => !npcTileSet.has(id));
          for (let i = 0; i < decorCount; i += 1) {
            if (filteredDecorPool.length === 0) break;
            const idx = Math.floor(Math.random() * grid.length);
            if (grid[idx] !== grassIndex) continue;
            const decorId =
              filteredDecorPool[Math.floor(Math.random() * filteredDecorPool.length)];
            grid[idx] = decorId;
          }
        }

        return { grid, mapW, mapH };
      }

      function renderGeneratedMap(grid, mapW, mapH, tiles, tileSize) {
        genCanvas.width = mapW * tileSize;
        genCanvas.height = mapH * tileSize;
        genCtx.clearRect(0, 0, genCanvas.width, genCanvas.height);
        playerCanvas.width = genCanvas.width;
        playerCanvas.height = genCanvas.height;
        collisionSet = new Set();

        for (let y = 0; y < mapH; y += 1) {
          for (let x = 0; x < mapW; x += 1) {
            const tileId = grid[getGridIndex(mapW, x, y)];
            const tile = tiles[tileId];
            if (tile) {
              genCtx.putImageData(tile, x * tileSize, y * tileSize);
            }
            if (tileId != null && collisionPaletteSet.has(tileId)) {
              collisionSet.add(getGridIndex(mapW, x, y));
            }
          }
        }
        lastGeneratedGrid = grid.slice();
        lastGeneratedMapW = mapW;
        lastGeneratedMapH = mapH;
        lastTallGrassTile = null;
        battleOverlay.classList.remove("active");
        battleState.active = false;
        playerState.x = Math.floor(mapW / 2) * tileSize;
        playerState.y = Math.floor(mapH / 2) * tileSize;
      }

      function setSelectionMode(mode) {
        selectionMode = mode;
        pickButtons.forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.pick === mode);
        });
      }

      function setSourceOverlay(x, y, w, h) {
        sourceOverlay = {
          x,
          y,
          w,
          h,
          color: "#cc2c2c",
        };
        drawSourceImage(loadedImage);
      }

      function updateStampOverlay() {
        if (!tilesetInfo || !lastSelectionAnchor || !selectionMode) return;
        const width = Math.max(1, Number(stampWidthInput.value));
        const height = Math.max(1, Number(stampHeightInput.value));
        if (!Number.isFinite(width) || !Number.isFinite(height)) return;
        const w = width * tilesetInfo.tileSize;
        const h = height * tilesetInfo.tileSize;
        const maxX = sourceCanvas.width - w;
        const maxY = sourceCanvas.height - h;
        const x = Math.max(0, Math.min(maxX, lastSelectionAnchor.x));
        const y = Math.max(0, Math.min(maxY, lastSelectionAnchor.y));
        setSourceOverlay(x, y, w, h);
      }

      function drawPreview(canvas, tileId) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!tilesetInfo || tileId == null) return;
        ctx.imageSmoothingEnabled = false;
        const tile = tilesetInfo.tiles[tileId];
        if (!tile) return;
        const temp = document.createElement("canvas");
        temp.width = tile.width;
        temp.height = tile.height;
        const tempCtx = temp.getContext("2d");
        tempCtx.putImageData(tile, 0, 0);
        ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
      }

      function drawPalettePreview(canvas, paletteIndex) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (paletteIndex == null) return;
        const tile = manualPalette[paletteIndex];
        if (!tile) return;
        const temp = document.createElement("canvas");
        temp.width = tile.width;
        temp.height = tile.height;
        const tempCtx = temp.getContext("2d");
        tempCtx.putImageData(tile, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
      }

      function drawStampPreview(canvas, stamp) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!tilesetInfo || !stamp) return;
        const temp = document.createElement("canvas");
        temp.width = stamp.width * tilesetInfo.tileSize;
        temp.height = stamp.height * tilesetInfo.tileSize;
        const tempCtx = temp.getContext("2d");
        stamp.cells.forEach((cell) => {
          const tile = manualPalette[cell.paletteIndex];
          if (!tile) return;
          tempCtx.putImageData(
            tile,
            cell.dx * tilesetInfo.tileSize,
            cell.dy * tilesetInfo.tileSize
          );
        });
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
      }

      function getLastStampByType(type) {
        for (let i = manualSelection.customStamps.length - 1; i >= 0; i -= 1) {
          if (manualSelection.customStamps[i].type === type) {
            return manualSelection.customStamps[i];
          }
        }
        return null;
      }

      function refreshPreviews() {
        drawPalettePreview(previewGrass, manualSelection.grassId);
        drawPalettePreview(previewTallGrass, manualSelection.tallGrassId);
        drawPalettePreview(previewWater, manualSelection.waterId);
        drawPalettePreview(previewPath, manualSelection.pathId);
        const houseStamp = getLastStampByType("house");
        const wallStamp = getLastStampByType("wall");
        const treeStamp = lastTreeStamp || getLastStampByType("tree");
        const rockStamp = lastRockStamp || getLastStampByType("rock");
        const npcStamp = lastNpcStamp || getLastStampByType("npc");
        drawStampPreview(previewHouse, houseStamp);
        drawStampPreview(previewWall, wallStamp);
        drawStampPreview(previewTree, treeStamp);
        drawStampPreview(previewRock, rockStamp);
        drawStampPreview(previewDecor, npcStamp);
      }

      function refreshCollisionPalette() {
        collisionPaletteSet = new Set();
        const collidableTypes = new Set(["house", "tree", "wall", "rock", "npc"]);
        manualSelection.customStamps.forEach((stamp) => {
          if (!collidableTypes.has(stamp.type)) return;
          stamp.cells.forEach((cell) => {
            collisionPaletteSet.add(cell.paletteIndex);
          });
        });
      }

      function setActiveTab(tabName) {
        const isMap = tabName === "map";
        const isSprite = tabName === "sprite";
        const isMonster = tabName === "monster";
        const isTest = tabName === "test";
        mapTab.classList.toggle("active", isMap);
        spriteTab.classList.toggle("active", isSprite);
        monsterTab.classList.toggle("active", isMonster);
        testPanel.classList.toggle("active", isTest);
        tabMap.classList.toggle("active", isMap);
        tabSprite.classList.toggle("active", isSprite);
        tabMonster.classList.toggle("active", isMonster);
        if (isMap || isSprite || isMonster) {
          lastMainTab = tabName;
          if (playerActive) {
            playerActive = false;
            testPlayerBtn.textContent = "Testar";
            playerKeys = {};
            testCtx.clearRect(0, 0, testCanvas.width, testCanvas.height);
            testPanel.classList.remove("active");
          }
          starterOverlay.classList.remove("active");
        }
      }

      function drawSpriteSheet() {
        if (!spriteImage) return;
        spriteCanvas.width = spriteImage.width;
        spriteCanvas.height = spriteImage.height;
        spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
        spriteCtx.drawImage(spriteImage, 0, 0);

        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        if (!Number.isFinite(frameW) || !Number.isFinite(frameH)) return;
        const anim = animTypeSelect.value;
        const frameIndex = Math.max(0, Number(animFrameIndexInput.value) - 1);
        const frame = spriteAnims[anim] ? spriteAnims[anim][frameIndex] : null;
        if (!frame) return;
        const normalized = normalizeFrame(frame, frameW, frameH);
        spriteCtx.save();
        spriteCtx.strokeStyle = "#cc2c2c";
        spriteCtx.lineWidth = 2;
        spriteCtx.strokeRect(
          normalized.px + 1,
          normalized.py + 1,
          frameW - 2,
          frameH - 2
        );
        spriteCtx.restore();
      }

      function normalizeMonsterRect(rect) {
        if (!rect) return null;
        const w = rect.w ?? rect.width;
        const h = rect.h ?? rect.height;
        return {
          x: rect.x,
          y: rect.y,
          w,
          h,
        };
      }

      function drawMonsterSheet() {
        if (!monsterImage) return;
        monsterCanvas.width = monsterImage.width;
        monsterCanvas.height = monsterImage.height;
        monsterCtx.clearRect(0, 0, monsterCanvas.width, monsterCanvas.height);
        monsterCtx.drawImage(monsterImage, 0, 0);
        const index = Math.max(0, Number(monsterIndexInput.value) - 1);
        const monster = monsters[index];
        if (!monster) return;
        const rect =
          monsterSelectionMode === "back" ? monster.back : monster.front;
        const normalized = normalizeMonsterRect(rect);
        if (!normalized) return;
        monsterSelectionAnchor = { x: normalized.x, y: normalized.y };
        monsterCtx.save();
        monsterCtx.strokeStyle = "#cc2c2c";
        monsterCtx.lineWidth = 2;
        monsterCtx.strokeRect(
          normalized.x + 1,
          normalized.y + 1,
          normalized.w - 2,
          normalized.h - 2
        );
        monsterCtx.restore();
      }

      function drawMonsterPreview() {
        monsterFrontPrevCtx.clearRect(0, 0, monsterFrontPreview.width, monsterFrontPreview.height);
        monsterBackPrevCtx.clearRect(0, 0, monsterBackPreview.width, monsterBackPreview.height);
        monsterPrevCtx.clearRect(0, 0, monsterPreview.width, monsterPreview.height);
        const index = Math.max(0, Number(monsterIndexInput.value) - 1);
        const monster = monsters[index];
        if (!monsterImage || !monster) return;
        const front = normalizeMonsterRect(monster.front);
        const back = normalizeMonsterRect(monster.back);
        if (front) {
          monsterFrontPrevCtx.imageSmoothingEnabled = false;
          monsterFrontPrevCtx.drawImage(
            monsterImage,
            front.x,
            front.y,
            front.w,
            front.h,
            0,
            0,
            monsterFrontPreview.width,
            monsterFrontPreview.height
          );
        }
        if (back) {
          monsterBackPrevCtx.imageSmoothingEnabled = false;
          monsterBackPrevCtx.drawImage(
            monsterImage,
            back.x,
            back.y,
            back.w,
            back.h,
            0,
            0,
            monsterBackPreview.width,
            monsterBackPreview.height
          );
        }
        if (front && back) {
          const halfW = monsterPreview.width / 2;
          const halfH = monsterPreview.height;
          monsterPrevCtx.imageSmoothingEnabled = false;
          monsterPrevCtx.drawImage(
            monsterImage,
            front.x,
            front.y,
            front.w,
            front.h,
            halfW,
            0,
            halfW,
            halfH
          );
          monsterPrevCtx.drawImage(
            monsterImage,
            back.x,
            back.y,
            back.w,
            back.h,
            0,
            0,
            halfW,
            halfH
          );
        }
      }

      function syncMonsterCount() {
        const count = Math.max(1, Number(monsterCountInput.value) || 1);
        monsterCountInput.value = count;
        if (monsters.length < count) {
          while (monsters.length < count) {
            monsters.push({ front: null, back: null, name: "" });
          }
        } else if (monsters.length > count) {
          monsters = monsters.slice(0, count);
        }
        monsterIndexInput.max = count;
        if (Number(monsterIndexInput.value) > count) {
          monsterIndexInput.value = count;
        }
        const index = Math.max(0, Number(monsterIndexInput.value) - 1);
        monsterNameInput.value = (monsters[index] && monsters[index].name) || "";
        drawMonsterSheet();
        drawMonsterPreview();
      }

      function setMonsterSelectionMode(mode) {
        monsterSelectionMode = mode;
        monsterPickFront.classList.toggle("active", mode === "front");
        monsterPickBack.classList.toggle("active", mode === "back");
        drawMonsterSheet();
      }

      function setMonsterSelection(px, py) {
        if (!monsterImage) return;
        const w = Math.max(1, Number(monsterSelWidthInput.value));
        const h = Math.max(1, Number(monsterSelHeightInput.value));
        const x = Math.max(0, Math.min(monsterImage.width - w, px));
        const y = Math.max(0, Math.min(monsterImage.height - h, py));
        const index = Math.max(0, Number(monsterIndexInput.value) - 1);
        if (!monsters[index]) {
          monsters[index] = { front: null, back: null, name: "" };
        }
        monsters[index][monsterSelectionMode] = { x, y, w, h };
        monsterSelectionAnchor = { x, y };
        drawMonsterSheet();
        drawMonsterPreview();
      }

      function getMonsterName(index) {
        const monster = monsters[index];
        if (!monster) return "Monstro";
        return monster.name && monster.name.trim() ? monster.name.trim() : `Monstro ${index + 1}`;
      }

      function setBattleMenu(mode) {
        battleState.menu = mode;
        battleMenu.classList.toggle("hidden", mode !== "root");
        battleMoves.classList.toggle("hidden", mode !== "moves");
        battleDialog.classList.toggle("hidden", mode !== "dialog");
        updateBattleMenuUI();
      }

      function showBattleMessage(text) {
        const chunkSize = 110;
        const queue = [];
        for (let i = 0; i < text.length; i += chunkSize) {
          queue.push(text.slice(i, i + chunkSize));
        }
        battleState.messageQueue = queue.length ? queue : [""];
        battleText.textContent = battleState.messageQueue[0];
        battleDialog.classList.toggle("more", battleState.messageQueue.length > 1);
        setBattleMenu("dialog");
      }

      function advanceBattleMessage() {
        if (battleState.menu !== "dialog") return false;
        if (battleState.messageQueue.length > 1) {
          battleState.messageQueue.shift();
          battleText.textContent = battleState.messageQueue[0];
          battleDialog.classList.toggle("more", battleState.messageQueue.length > 1);
          return true;
        }
        battleState.messageQueue = [];
        battleDialog.classList.remove("more");
        setBattleMenu("root");
        return true;
      }

      function updateBattleMenuUI() {
        const menuButtons = [fightBtn, teamBtn, itemBtn, runBtn];
        menuButtons.forEach((btn, idx) => {
          btn.classList.toggle("selected", battleState.menu === "root" && battleState.menuIndex === idx);
        });
        const moveButtons = [moveBtn1, moveBtn2, moveBtn3, moveBtn4, moveBackBtn];
        moveButtons.forEach((btn, idx) => {
          btn.classList.toggle("selected", battleState.menu === "moves" && battleState.moveIndex === idx);
        });
      }

      function handleBattleSelection() {
        if (battleState.menu === "dialog") {
          advanceBattleMessage();
          return;
        }
        if (battleState.menu === "root") {
          const index = battleState.menuIndex;
          if (index === 0) {
            setBattleMenu("moves");
          } else if (index === 1) {
            showBattleMessage("Equipe: suporte em breve.");
          } else if (index === 2) {
            showBattleMessage("Itens: suporte em breve.");
          } else if (index === 3) {
            endBattle("Voce fugiu!");
          }
        } else if (battleState.menu === "moves") {
          if (battleState.moveIndex === 4) {
            setBattleMenu("root");
          } else {
            handleBattleMove();
          }
        }
      }

      function updatePlayerStats() {
        const baseHp = 24 + playerProfile.level * 4;
        if (playerProfile.maxHp !== baseHp) {
          playerProfile.maxHp = baseHp;
          if (playerProfile.hp > baseHp) playerProfile.hp = baseHp;
        }
      }

      function renderStarterOptions() {
        starterOptions.innerHTML = "";
        const candidates = monsters
          .map((m, idx) => ({
            idx,
            front: normalizeMonsterRect(m.front),
          }))
          .filter((m) => m.front);
        const pickList = candidates.slice(0, 3);
        if (pickList.length === 0 || !monsterImage) return;
        pickList.forEach((choice) => {
          const card = document.createElement("button");
          card.type = "button";
          card.className = "starter-card";
          const canvas = document.createElement("canvas");
          const name = document.createElement("span");
          name.textContent = getMonsterName(choice.idx);
          const ctx = canvas.getContext("2d");
          canvas.width = 64;
          canvas.height = 64;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            monsterImage,
            choice.front.x,
            choice.front.y,
            choice.front.w,
            choice.front.h,
            0,
            0,
            canvas.width,
            canvas.height
          );
          card.appendChild(canvas);
          card.appendChild(name);
          card.addEventListener("click", () => {
            playerProfile.monsterIndex = choice.idx;
            playerProfile.level = 5;
            playerProfile.exp = 0;
            playerProfile.hp = 30;
            updatePlayerStats();
            starterOverlay.classList.remove("active");
            battleOverlay.classList.remove("active");
            battleState.active = false;
            lastTallGrassTile = null;
            testPlayerBtn.textContent = "Parar teste";
            playerActive = true;
            requestAnimationFrame(tickPlayer);
          });
          starterOptions.appendChild(card);
        });
      }

      function getPlayerTileIndex(tileSize) {
        if (!lastGeneratedGrid) return null;
        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        const centerX = playerState.x + frameW / 2;
        const centerY = playerState.y + frameH / 2;
        const tx = Math.floor(centerX / tileSize);
        const ty = Math.floor(centerY / tileSize);
        if (tx < 0 || ty < 0 || tx >= lastGeneratedMapW || ty >= lastGeneratedMapH) return null;
        return getGridIndex(lastGeneratedMapW, tx, ty);
      }

      function startBattle() {
        const candidates = monsters
          .map((m, idx) => ({
            idx,
            front: normalizeMonsterRect(m.front),
            back: normalizeMonsterRect(m.back),
          }))
          .filter((m) => m.front && m.back);
        if (!monsterImage || candidates.length === 0) return false;
        if (playerProfile.monsterIndex == null) return false;
        const wild = candidates[Math.floor(Math.random() * candidates.length)];
        const player =
          candidates.find((c) => c.idx === playerProfile.monsterIndex) || candidates[0];
        battleState.active = true;
        battleState.wildIndex = wild.idx;
        battleState.playerIndex = player.idx;
        battleState.wildLevel = 3 + Math.floor(Math.random() * 4);
        battleState.playerLevel = playerProfile.level;
        battleState.wildHp = 18 + battleState.wildLevel * 6;
        updatePlayerStats();
        battleState.playerHp = playerProfile.hp;
        battleState.message = "Um monstro selvagem apareceu!";
        battleState.menuIndex = 0;
        battleState.moveIndex = 0;
        battleOverlay.classList.add("active");
        playerKeys = {};
        drawBattleScene();
        showBattleMessage(battleState.message);
        return true;
      }

      function endBattle(message) {
        battleState.active = false;
        battleState.message = message || "";
        battleOverlay.classList.remove("active");
        battleState.messageQueue = [];
        battleText.textContent = "";
        battleDialog.classList.remove("more");
        lastTallGrassTile = null;
        if (battleState.playerHp > 0) {
          playerProfile.hp = battleState.playerHp;
        }
        drawTestView();
      }

      function drawBattleScene() {
        if (!battleState.active || !monsterImage) return;
        battleCtx.imageSmoothingEnabled = false;
        battleCtx.clearRect(0, 0, battleCanvas.width, battleCanvas.height);
        battleCtx.fillStyle = "#f7f6ef";
        battleCtx.fillRect(0, 0, battleCanvas.width, battleCanvas.height);

        const wild = monsters[battleState.wildIndex];
        const playerMon = monsters[battleState.playerIndex];
        if (!wild || !playerMon) return;
        const wildRect = normalizeMonsterRect(wild.front);
        const backRect = normalizeMonsterRect(playerMon.back);
        const wildMaxHp = 18 + battleState.wildLevel * 6;
        const playerMaxHp = playerProfile.maxHp;
        const wildRatio = Math.max(0, battleState.wildHp / wildMaxHp);
        const playerRatio = Math.max(0, battleState.playerHp / playerMaxHp);

        const wildSpriteW = Math.floor(battleCanvas.width * 0.32);
        const wildSpriteH = Math.floor(battleCanvas.height * 0.32);
        const wildSpriteX = battleCanvas.width - wildSpriteW - 20;
        const wildSpriteY = 18;

        const playerSpriteW = Math.floor(battleCanvas.width * 0.36);
        const playerSpriteH = Math.floor(battleCanvas.height * 0.36);
        const playerSpriteX = 24;
        const playerSpriteY = battleCanvas.height - playerSpriteH - 20;

        if (wildRect) {
          battleCtx.drawImage(
            monsterImage,
            wildRect.x,
            wildRect.y,
            wildRect.w,
            wildRect.h,
            wildSpriteX,
            wildSpriteY,
            wildSpriteW,
            wildSpriteH
          );
        }
        if (backRect) {
          battleCtx.drawImage(
            monsterImage,
            backRect.x,
            backRect.y,
            backRect.w,
            backRect.h,
            playerSpriteX,
            playerSpriteY,
            playerSpriteW,
            playerSpriteH
          );
        }

        battleCtx.fillStyle = "#1b2b34";
        battleCtx.font = "12px Trebuchet MS";
        battleCtx.fillText(
          `${getMonsterName(battleState.wildIndex)} Nv ${battleState.wildLevel}`,
          14,
          16
        );

        battleCtx.fillStyle = "#ffffff";
        battleCtx.strokeStyle = "#1b2b34";
        battleCtx.lineWidth = 1;
        battleCtx.fillRect(14, 22, 130, 8);
        battleCtx.strokeRect(14, 22, 130, 8);
        battleCtx.fillStyle = "#6cbf6b";
        battleCtx.fillRect(14, 22, Math.floor(130 * wildRatio), 8);
        battleCtx.fillStyle = "#1b2b34";
        battleCtx.fillText(`HP: ${battleState.wildHp}/${wildMaxHp}`, 150, 34);

        const playerInfoX = playerSpriteX + playerSpriteW + 16;
        const playerInfoY = playerSpriteY + 8;
        battleCtx.fillStyle = "#1b2b34";
        battleCtx.fillText(
          `${getMonsterName(battleState.playerIndex)} Nv ${battleState.playerLevel}`,
          playerInfoX,
          playerInfoY
        );
        battleCtx.fillStyle = "#ffffff";
        battleCtx.strokeStyle = "#1b2b34";
        battleCtx.lineWidth = 1;
        battleCtx.fillRect(playerInfoX, playerInfoY + 8, 120, 8);
        battleCtx.strokeRect(playerInfoX, playerInfoY + 8, 120, 8);
        battleCtx.fillStyle = "#6cbf6b";
        battleCtx.fillRect(
          playerInfoX,
          playerInfoY + 8,
          Math.floor(120 * playerRatio),
          8
        );
        battleCtx.fillStyle = "#1b2b34";
        battleCtx.fillText(
          `HP: ${battleState.playerHp}/${playerMaxHp}`,
          playerInfoX,
          playerInfoY + 26
        );

        const expRatio = Math.min(1, playerProfile.exp / 100);
        battleCtx.fillStyle = "#1b2b34";
        battleCtx.fillText("Exp", playerInfoX, playerInfoY + 40);
        battleCtx.fillStyle = "#ffffff";
        battleCtx.strokeStyle = "#1b2b34";
        battleCtx.lineWidth = 1;
        battleCtx.fillRect(playerInfoX, playerInfoY + 44, 120, 4);
        battleCtx.strokeRect(playerInfoX, playerInfoY + 44, 120, 4);
        battleCtx.fillStyle = "#3a78c1";
        battleCtx.fillRect(
          playerInfoX,
          playerInfoY + 44,
          Math.floor(120 * expRatio),
          4
        );
      }

      function handleBattleMove() {
        if (!battleState.active) return;
        const damage = 12 + Math.floor(Math.random() * 10);
        battleState.wildHp = Math.max(0, battleState.wildHp - damage);
        battleState.message = `Voce usou um golpe! (${damage})`;
        showBattleMessage(battleState.message);
        if (battleState.wildHp <= 0) {
          playerProfile.exp += 40;
          if (playerProfile.exp >= 100) {
            playerProfile.exp -= 100;
            playerProfile.level += 1;
            updatePlayerStats();
          }
          drawBattleScene();
          setTimeout(() => endBattle("Vitoria!"), 400);
          return;
        }
        const counter = 8 + Math.floor(Math.random() * 8);
        battleState.playerHp = Math.max(0, battleState.playerHp - counter);
        showBattleMessage(`O inimigo revidou! (${counter})`);
        if (battleState.playerHp <= 0) {
          drawBattleScene();
          setTimeout(() => endBattle("Voce perdeu!"), 400);
          return;
        }
        setBattleMenu("root");
        drawBattleScene();
      }

      function updateSpritePreview() {
        spritePrevCtx.clearRect(0, 0, spritePreview.width, spritePreview.height);
        if (!spriteImage) return;
        const anim = animTypeSelect.value;
        const frames = spriteAnims[anim] || [];
        if (frames.length === 0) return;
        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        if (!Number.isFinite(frameW) || !Number.isFinite(frameH)) return;
        const frameIndex = Math.max(0, Number(animFrameIndexInput.value) - 1);
        const frame = frames[frameIndex];
        if (!frame) return;
        const normalized = normalizeFrame(frame, frameW, frameH);
        spritePrevCtx.imageSmoothingEnabled = false;
        spritePrevCtx.drawImage(
          spriteImage,
          normalized.px,
          normalized.py,
          frameW,
          frameH,
          0,
          0,
          spritePreview.width,
          spritePreview.height
        );
        updateAnimPreview();
      }

      function updateAnimPreview() {
        animPrevCtx.clearRect(0, 0, animPreview.width, animPreview.height);
        if (!spriteImage) return;
        const anim = animTypeSelect.value;
        const frames = spriteAnims[anim] || [];
        if (frames.length === 0) return;
        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        if (!Number.isFinite(frameW) || !Number.isFinite(frameH)) return;
        const index = Math.floor(animTick / 160) % frames.length;
        const frame = frames[index];
        if (!frame) return;
        const normalized = normalizeFrame(frame, frameW, frameH);
        animPrevCtx.imageSmoothingEnabled = false;
        animPrevCtx.clearRect(0, 0, animPreview.width, animPreview.height);
        animPrevCtx.drawImage(
          spriteImage,
          normalized.px,
          normalized.py,
          frameW,
          frameH,
          0,
          0,
          animPreview.width,
          animPreview.height
        );
      }

      let lastAnimPreviewTime = 0;
      function tickAnimPreview(timestamp) {
        if (!lastAnimPreviewTime) lastAnimPreviewTime = timestamp;
        const delta = timestamp - lastAnimPreviewTime;
        lastAnimPreviewTime = timestamp;
        if (!playerActive) {
          animTick += delta;
        }
        updateAnimPreview();
        requestAnimationFrame(tickAnimPreview);
      }

      function getActiveAnim() {
        const moving =
          playerKeys["ArrowUp"] ||
          playerKeys["ArrowDown"] ||
          playerKeys["ArrowLeft"] ||
          playerKeys["ArrowRight"];
        if (!moving) return "idle";
        if (playerKeys["ArrowUp"]) return "up";
        if (playerKeys["ArrowDown"]) return "down";
        if (playerKeys["ArrowLeft"] || playerKeys["ArrowRight"]) return "side";
        return "idle";
      }

      function getFramesForAnim(anim) {
        if (spriteAnims[anim] && spriteAnims[anim].length > 0) return spriteAnims[anim];
        if (spriteAnims.down && spriteAnims.down.length > 0) return spriteAnims.down;
        if (spriteAnims.side && spriteAnims.side.length > 0) return spriteAnims.side;
        if (spriteAnims.up && spriteAnims.up.length > 0) return spriteAnims.up;
        return spriteAnims.idle || [];
      }

      function normalizeFrame(frame, frameW, frameH) {
        if (frame.px != null && frame.py != null) return frame;
        return {
          px: frame.x * frameW,
          py: frame.y * frameH,
        };
      }

      function drawPlayerFrame(frame, frameW, frameH, flipX) {
        if (!spriteImage || !frame) return;
        const normalized = normalizeFrame(frame, frameW, frameH);
        playerCtx.save();
        playerCtx.imageSmoothingEnabled = false;
        const px = Math.floor(playerState.x);
        const py = Math.floor(playerState.y);
        if (flipX) {
          playerCtx.translate(px + frameW, py);
          playerCtx.scale(-1, 1);
          playerCtx.drawImage(
            spriteImage,
            normalized.px,
            normalized.py,
            frameW,
            frameH,
            0,
            0,
            frameW,
            frameH
          );
        } else {
          playerCtx.drawImage(
            spriteImage,
            normalized.px,
            normalized.py,
            frameW,
            frameH,
            px,
            py,
            frameW,
            frameH
          );
        }
        playerCtx.restore();
      }

      function tickPlayer(timestamp) {
        if (!playerActive) return;
        if (battleState.active) {
          drawBattleScene();
          requestAnimationFrame(tickPlayer);
          return;
        }
        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        if (!Number.isFinite(frameW) || !Number.isFinite(frameH)) return;
        const delta = playerState.lastTime ? timestamp - playerState.lastTime : 0;
        playerState.lastTime = timestamp;

        const speed = Math.max(10, Number(tileSizeInput.value) * 3);
        let dx = 0;
        let dy = 0;
        if (playerKeys["ArrowUp"]) dy -= speed * (delta / 1000);
        if (playerKeys["ArrowDown"]) dy += speed * (delta / 1000);
        if (playerKeys["ArrowLeft"]) dx -= speed * (delta / 1000);
        if (playerKeys["ArrowRight"]) dx += speed * (delta / 1000);

        const mapW = Math.floor(genCanvas.width / Number(tileSizeInput.value));
        const mapH = Math.floor(genCanvas.height / Number(tileSizeInput.value));
        const tileSize = Number(tileSizeInput.value);

        function collides(nx, ny) {
          const left = Math.floor(nx / tileSize);
          const right = Math.floor((nx + frameW - 1) / tileSize);
          const top = Math.floor(ny / tileSize);
          const bottom = Math.floor((ny + frameH - 1) / tileSize);
          for (let ty = top; ty <= bottom; ty += 1) {
            for (let tx = left; tx <= right; tx += 1) {
              if (tx < 0 || ty < 0 || tx >= mapW || ty >= mapH) return true;
              if (collisionSet.has(getGridIndex(mapW, tx, ty))) return true;
            }
          }
          return false;
        }

        let nextX = playerState.x + dx;
        let nextY = playerState.y + dy;
        nextX = Math.max(0, Math.min(playerCanvas.width - frameW, nextX));
        if (!collides(nextX, playerState.y)) {
          playerState.x = nextX;
        }
        nextY = Math.max(0, Math.min(playerCanvas.height - frameH, nextY));
        if (!collides(playerState.x, nextY)) {
          playerState.y = nextY;
        }

        const anim = getActiveAnim();
        const frames = getFramesForAnim(anim);
        if (frames.length === 0) {
          playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
          requestAnimationFrame(tickPlayer);
          return;
        }
        animTick += delta;
        const frameIndex = Math.floor(animTick / 160) % frames.length;
        const frame = frames[frameIndex];
        const flipX = anim === "side" && playerKeys["ArrowRight"];

        playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        drawPlayerFrame(frame, frameW, frameH, flipX);
        updateAnimPreview();
        drawTestView();
        const tileIndex = getPlayerTileIndex(tileSize);
        if (tileIndex != null && tileIndex !== lastTallGrassTile) {
          lastTallGrassTile = tileIndex;
          const tallGrassIndex = manualSelection.tallGrassId;
          if (
            tallGrassIndex != null &&
            lastGeneratedGrid &&
            lastGeneratedGrid[tileIndex] === tallGrassIndex
          ) {
            if (Math.random() < 0.2) {
              startBattle();
            }
          }
        }
        requestAnimationFrame(tickPlayer);
      }

      function drawTestView() {
        if (!playerActive) return;
        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        if (!Number.isFinite(frameW) || !Number.isFinite(frameH)) return;
        const viewW = testCanvas.width;
        const viewH = testCanvas.height;
        const centerX = playerState.x + frameW / 2;
        const centerY = playerState.y + frameH / 2;
        const worldW = genCanvas.width;
        const worldH = genCanvas.height;
        let srcX = Math.max(0, Math.min(worldW - viewW, centerX - viewW / 2));
        let srcY = Math.max(0, Math.min(worldH - viewH, centerY - viewH / 2));

        testCtx.imageSmoothingEnabled = false;
        testCtx.clearRect(0, 0, viewW, viewH);
        testCtx.drawImage(genCanvas, srcX, srcY, viewW, viewH, 0, 0, viewW, viewH);

        const anim = getActiveAnim();
        const frames = getFramesForAnim(anim);
        if (frames.length === 0) return;
        const frame = frames[Math.floor(animTick / 160) % frames.length];
        const normalized = normalizeFrame(frame, frameW, frameH);
        const flipX = anim === "side" && playerKeys["ArrowRight"];
        const drawX = Math.floor(playerState.x - srcX);
        const drawY = Math.floor(playerState.y - srcY);
        testCtx.save();
        if (flipX) {
          testCtx.translate(drawX + frameW, drawY);
          testCtx.scale(-1, 1);
          testCtx.drawImage(
            spriteImage,
            normalized.px,
            normalized.py,
            frameW,
            frameH,
            0,
            0,
            frameW,
            frameH
          );
        } else {
          testCtx.drawImage(
            spriteImage,
            normalized.px,
            normalized.py,
            frameW,
            frameH,
            drawX,
            drawY,
            frameW,
            frameH
          );
        }
        testCtx.restore();
      }

      function applyManualOverrides() {
        if (!analysisInfo) return;
        if (manualSelection.decorIds.length > 0) {
          analysisInfo.singleDecorIds = manualSelection.decorIds.slice();
        }
        if (manualSelection.customStamps.length > 0) {
          analysisInfo.customStamps = manualSelection.customStamps.slice();
        }
        analysisInfo.useManualOnly = true;
      }

      function sliceTiles() {
        if (!loadedImage) return;
        const tileSize = Number(tileSizeInput.value);
        if (!Number.isFinite(tileSize) || tileSize <= 0) return;

        tilesetInfo = buildTileset(loadedImage, tileSize);
        sourcePixelCanvas = document.createElement("canvas");
        sourcePixelCanvas.width = loadedImage.width;
        sourcePixelCanvas.height = loadedImage.height;
        sourcePixelCtx = sourcePixelCanvas.getContext("2d");
        sourcePixelCtx.drawImage(loadedImage, 0, 0);
        analysisInfo = analyzeMap(tilesetInfo);
        applyManualOverrides();
        mapWidthInput.value = tilesetInfo.cols;
        mapHeightInput.value = tilesetInfo.rows;
        lastGeneratedHash = null;
      }

      imageInput.addEventListener("change", (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;
            manualSelection.grassId = null;
            manualSelection.tallGrassId = null;
            manualSelection.waterId = null;
            manualSelection.pathId = null;
        manualSelection.decorIds = [];
        manualSelection.customStamps = [];
        manualSelection.grassTileData = null;
        manualPalette = [];
        manualPaletteLookup = new Map();
        stampCountLabel.textContent = "0 blocos";
        lastNpcStamp = null;
        lastTreeStamp = null;
        lastRockStamp = null;
        loadedImages = [];
        loadedImageDataUrls = [];
        activeImageIndex = -1;
        const readers = files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                  resolve({ image: img, name: file.name, dataUrl: reader.result });
                };
                img.src = reader.result;
              };
              reader.readAsDataURL(file);
            })
        );
        Promise.all(readers).then((results) => {
          loadedImages = results;
          loadedImageDataUrls = results.map((item) => item.dataUrl);
          useImage(0);
        });
      });

      tabMap.addEventListener("click", () => setActiveTab("map"));
      tabSprite.addEventListener("click", () => setActiveTab("sprite"));
      tabMonster.addEventListener("click", () => setActiveTab("monster"));

      tileSizeInput.addEventListener("change", () => {
        if (!loadedImage) return;
        sliceTiles();
      });

      function onStampSizeChange() {
        updateStampOverlay();
      }

      stampWidthInput.addEventListener("input", onStampSizeChange);
      stampHeightInput.addEventListener("input", onStampSizeChange);

      spriteInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            spriteImage = img;
            drawSpriteSheet();
            updateSpritePreview();
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });

      monsterInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            monsterImage = img;
            drawMonsterSheet();
            drawMonsterPreview();
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });

      monsterCanvas.addEventListener("click", (event) => {
        if (!monsterImage) return;
        const rect = monsterCanvas.getBoundingClientRect();
        const scaleX = monsterCanvas.width / rect.width;
        const scaleY = monsterCanvas.height / rect.height;
        const rawX = Math.floor((event.clientX - rect.left) * scaleX);
        const rawY = Math.floor((event.clientY - rect.top) * scaleY);
        setMonsterSelection(rawX, rawY);
      });

      monsterPickFront.addEventListener("click", () => setMonsterSelectionMode("front"));
      monsterPickBack.addEventListener("click", () => setMonsterSelectionMode("back"));
      monsterCountInput.addEventListener("change", syncMonsterCount);
      monsterIndexInput.addEventListener("change", () => {
        const index = Math.max(0, Number(monsterIndexInput.value) - 1);
        monsterNameInput.value = (monsters[index] && monsters[index].name) || "";
        drawMonsterSheet();
        drawMonsterPreview();
      });
      monsterNameInput.addEventListener("input", () => {
        const index = Math.max(0, Number(monsterIndexInput.value) - 1);
        if (!monsters[index]) {
          monsters[index] = { front: null, back: null, name: "" };
        }
        monsters[index].name = monsterNameInput.value;
      });
      monsterSelWidthInput.addEventListener("change", () => drawMonsterSheet());
      monsterSelHeightInput.addEventListener("change", () => drawMonsterSheet());

      spriteCanvas.addEventListener("click", (event) => {
        if (!spriteImage) return;
        const rect = spriteCanvas.getBoundingClientRect();
        const scaleX = spriteCanvas.width / rect.width;
        const scaleY = spriteCanvas.height / rect.height;
        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        if (!Number.isFinite(frameW) || !Number.isFinite(frameH)) return;
        const rawX = Math.floor((event.clientX - rect.left) * scaleX);
        const rawY = Math.floor((event.clientY - rect.top) * scaleY);
        const px = Math.max(0, Math.min(spriteImage.width - frameW, rawX));
        const py = Math.max(0, Math.min(spriteImage.height - frameH, rawY));
        const frameCount = Math.max(1, Number(animFramesInput.value));
        const anim = animTypeSelect.value;
        const frames = spriteAnims[anim] || [];
        const frameIndex = Math.max(
          0,
          Math.min(frameCount - 1, Number(animFrameIndexInput.value) - 1)
        );
        frames[frameIndex] = { px, py };
        spriteAnims[anim] = frames.slice(0, frameCount);
        spriteSelection = { anim, index: frameIndex };
        drawSpriteSheet();
        updateSpritePreview();
      });

      animTypeSelect.addEventListener("change", () => {
        spriteSelection.anim = animTypeSelect.value;
        drawSpriteSheet();
        updateSpritePreview();
      });
      frameWidthInput.addEventListener("change", () => {
        drawSpriteSheet();
        updateSpritePreview();
      });
      frameHeightInput.addEventListener("change", () => {
        drawSpriteSheet();
        updateSpritePreview();
      });
      animFramesInput.addEventListener("change", () => {
        const maxVal = Number(animFramesInput.value);
        animFrameIndexInput.max = maxVal;
        if (Number(animFrameIndexInput.value) > maxVal) {
          animFrameIndexInput.value = maxVal;
        }
        drawSpriteSheet();
        updateSpritePreview();
      });
      animFrameIndexInput.addEventListener("change", () => {
        spriteSelection.index = Math.max(0, Number(animFrameIndexInput.value) - 1);
        drawSpriteSheet();
        updateSpritePreview();
      });

      testPlayerBtn.addEventListener("click", () => {
        if (playerActive) {
          playerActive = false;
          testPlayerBtn.textContent = "Testar";
        } else {
          testPlayerBtn.textContent = "Parar teste";
          playerActive = true;
        }
        playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        animTick = 0;
        if (playerActive) {
          setActiveTab("test");
          if (playerProfile.monsterIndex == null) {
            playerActive = false;
            testPlayerBtn.textContent = "Testar";
            starterOverlay.classList.add("active");
            renderStarterOptions();
            return;
          }
          battleOverlay.classList.remove("active");
          battleState.active = false;
          lastTallGrassTile = null;
          requestAnimationFrame(tickPlayer);
        } else {
          testCtx.clearRect(0, 0, testCanvas.width, testCanvas.height);
          setActiveTab(lastMainTab);
        }
      });

      window.addEventListener("keydown", (event) => {
        if (!playerActive) return;
        if (battleState.active) {
          const key = event.key;
          if (!key.startsWith("Arrow") && !["w", "a", "s", "d", "W", "A", "S", "D", "Enter", " "].includes(key)) {
            return;
          }
          event.preventDefault();
          const left = key === "ArrowLeft" || key === "a" || key === "A";
          const right = key === "ArrowRight" || key === "d" || key === "D";
          const up = key === "ArrowUp" || key === "w" || key === "W";
          const down = key === "ArrowDown" || key === "s" || key === "S";
          if (key === "Enter" || key === " ") {
            if (advanceBattleMessage()) return;
            handleBattleSelection();
            updateBattleMenuUI();
            return;
          }
          if (battleState.menu === "root") {
            let idx = battleState.menuIndex;
            if (up || down) {
              idx = idx < 2 ? idx + 2 : idx - 2;
            } else if (left || right) {
              idx = idx % 2 === 0 ? idx + 1 : idx - 1;
            }
            battleState.menuIndex = Math.max(0, Math.min(3, idx));
          } else if (battleState.menu === "moves") {
            let idx = battleState.moveIndex;
            if (up || down) {
              if (down && idx >= 2 && idx <= 3) {
                idx = 4;
              } else if (up && idx === 4) {
                idx = 2;
              } else {
                idx = idx < 2 ? idx + 2 : idx - 2;
              }
            } else if (left || right) {
              if (idx === 4) {
                idx = left ? 2 : 3;
              } else {
                idx = idx % 2 === 0 ? idx + 1 : idx - 1;
              }
            }
            if (idx > 4) idx = 4;
            if (idx < 0) idx = 0;
            battleState.moveIndex = idx;
          }
          updateBattleMenuUI();
          return;
        }
        const key = event.key;
        if (key.startsWith("Arrow") || ["w", "a", "s", "d", "W", "A", "S", "D"].includes(key)) {
          if (key === "w" || key === "W") playerKeys["ArrowUp"] = true;
          if (key === "s" || key === "S") playerKeys["ArrowDown"] = true;
          if (key === "a" || key === "A") playerKeys["ArrowLeft"] = true;
          if (key === "d" || key === "D") playerKeys["ArrowRight"] = true;
          if (key.startsWith("Arrow")) playerKeys[key] = true;
        }
      });

      window.addEventListener("keyup", (event) => {
        if (!playerActive) return;
        if (battleState.active) return;
        const key = event.key;
        if (key.startsWith("Arrow") || ["w", "a", "s", "d", "W", "A", "S", "D"].includes(key)) {
          if (key === "w" || key === "W") playerKeys["ArrowUp"] = false;
          if (key === "s" || key === "S") playerKeys["ArrowDown"] = false;
          if (key === "a" || key === "A") playerKeys["ArrowLeft"] = false;
          if (key === "d" || key === "D") playerKeys["ArrowRight"] = false;
          if (key.startsWith("Arrow")) playerKeys[key] = false;
        }
      });

      syncMonsterCount();
      setMonsterSelectionMode("front");
      requestAnimationFrame(tickAnimPreview);

      window.addEventListener("keydown", (event) => {
        if (playerActive) return;
        if (!spriteTab.classList.contains("active")) return;
        if (!spriteImage) return;
        if (!event.key.startsWith("Arrow")) return;
        event.preventDefault();
        const frameW = Number(frameWidthInput.value);
        const frameH = Number(frameHeightInput.value);
        if (!Number.isFinite(frameW) || !Number.isFinite(frameH)) return;
        const anim = animTypeSelect.value;
        const frameCount = Math.max(1, Number(animFramesInput.value));
        const frameIndex = Math.max(
          0,
          Math.min(frameCount - 1, Number(animFrameIndexInput.value) - 1)
        );
        const frames = spriteAnims[anim] || [];
        const existing = frames[frameIndex] || { px: 0, py: 0 };
        const normalized = normalizeFrame(existing, frameW, frameH);
        let px = normalized.px;
        let py = normalized.py;
        if (event.key === "ArrowLeft") px -= 1;
        if (event.key === "ArrowRight") px += 1;
        if (event.key === "ArrowUp") py -= 1;
        if (event.key === "ArrowDown") py += 1;
        px = Math.max(0, Math.min(spriteImage.width - frameW, px));
        py = Math.max(0, Math.min(spriteImage.height - frameH, py));
        frames[frameIndex] = { px, py };
        spriteAnims[anim] = frames.slice(0, frameCount);
        drawSpriteSheet();
        updateSpritePreview();
      });

      window.addEventListener("keydown", (event) => {
        if (playerActive) return;
        if (!monsterTab.classList.contains("active")) return;
        if (!monsterImage) return;
        if (!event.key.startsWith("Arrow")) return;
        event.preventDefault();
        const w = Math.max(1, Number(monsterSelWidthInput.value));
        const h = Math.max(1, Number(monsterSelHeightInput.value));
        if (!monsterSelectionAnchor) {
          monsterSelectionAnchor = { x: 0, y: 0 };
        }
        let dx = 0;
        let dy = 0;
        if (event.key === "ArrowLeft") dx = -1;
        if (event.key === "ArrowRight") dx = 1;
        if (event.key === "ArrowUp") dy = -1;
        if (event.key === "ArrowDown") dy = 1;
        const nextX = Math.max(0, Math.min(monsterImage.width - w, monsterSelectionAnchor.x + dx));
        const nextY = Math.max(0, Math.min(monsterImage.height - h, monsterSelectionAnchor.y + dy));
        setMonsterSelection(nextX, nextY);
      });

      window.addEventListener("keydown", (event) => {
        if (playerActive) return;
        if (!mapTab.classList.contains("active")) return;
        if (!loadedImage || !tilesetInfo) return;
        if (!event.key.startsWith("Arrow")) return;
        if (selectionMode == null) return;
        event.preventDefault();

        const step = 1;
        let dx = 0;
        let dy = 0;
        if (event.key === "ArrowLeft") dx = -step;
        if (event.key === "ArrowRight") dx = step;
        if (event.key === "ArrowUp") dy = -step;
        if (event.key === "ArrowDown") dy = step;

        const width = Math.max(1, Number(stampWidthInput.value));
        const height = Math.max(1, Number(stampHeightInput.value));
        if (!Number.isFinite(width) || !Number.isFinite(height)) return;
        const anchor = lastSelectionAnchor || { x: 0, y: 0 };
        const w = width * tilesetInfo.tileSize;
        const h = height * tilesetInfo.tileSize;
        const maxX = sourceCanvas.width - w;
        const maxY = sourceCanvas.height - h;
        const nextX = Math.max(0, Math.min(maxX, anchor.x + dx));
        const nextY = Math.max(0, Math.min(maxY, anchor.y + dy));
        lastSelectionAnchor = { x: nextX, y: nextY };
        setSourceOverlay(nextX, nextY, w, h);
        if (
          selectionMode === "grass" ||
          selectionMode === "tallgrass" ||
          selectionMode === "water" ||
          selectionMode === "path"
        ) {
          const tileData = getSourceTileData(nextX, nextY);
          handlePickFromTileData(tileData);
        } else if (selectionMode === "house" || selectionMode === "tree" || selectionMode === "wall" || selectionMode === "rock" || selectionMode === "decor") {
          const width = Math.max(1, Number(stampWidthInput.value));
          const height = Math.max(1, Number(stampHeightInput.value));
          if (!Number.isFinite(width) || !Number.isFinite(height)) return;
          const wPx = width * tilesetInfo.tileSize;
          const hPx = height * tilesetInfo.tileSize;
          const anchorX = nextX;
          const anchorY = nextY;
          const type =
            selectionMode === "house"
              ? "house"
              : selectionMode === "tree"
              ? "tree"
              : selectionMode === "wall"
              ? "wall"
              : selectionMode === "rock"
              ? "rock"
              : "npc";
          const cells = [];
          let hasNonGrass = false;
          const grassTileData = manualSelection.grassTileData;
          for (let ty = 0; ty < height; ty += 1) {
            for (let tx = 0; tx < width; tx += 1) {
              const px = anchorX + tx * tilesetInfo.tileSize;
              const py = anchorY + ty * tilesetInfo.tileSize;
              const tileData = getSourceTileData(px, py);
              if (!tileData) continue;
              const isGrass = grassTileData ? tilesEqual(tileData, grassTileData) : false;
              if (!isGrass) {
                hasNonGrass = true;
              }
              const paletteIndex = addTileToPalette(tileData);
              cells.push({ dx: tx, dy: ty, paletteIndex, isGrass });
            }
          }
          if (!hasNonGrass) return;
          let stampCells = cells;
          if (selectionMode !== "house" && grassTileData) {
            stampCells = cells.filter((cell) => !cell.isGrass);
          }
          if (stampCells.length === 0) return;
          const stamp = {
            width,
            height,
            cells: stampCells,
            size: stampCells.length,
            type,
          };
          if (selectionMode === "decor") {
            lastNpcStamp = stamp;
          }
          if (selectionMode === "tree") {
            lastTreeStamp = stamp;
          }
          if (selectionMode === "rock") {
            lastRockStamp = stamp;
          }
          if (selectionMode === "house") {
            drawStampPreview(previewHouse, stamp);
          } else if (selectionMode === "tree") {
            drawStampPreview(previewTree, stamp);
          } else if (selectionMode === "wall") {
            drawStampPreview(previewWall, stamp);
          } else if (selectionMode === "rock") {
            drawStampPreview(previewRock, stamp);
          } else {
            drawStampPreview(previewDecor, stamp);
          }
        }
      });

      pickButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          setSelectionMode(btn.dataset.pick);
        });
      });

      function handlePickFromTileData(tileData) {
        if (!tileData) return;
        const paletteIndex = addTileToPalette(tileData);
        if (selectionMode === "grass") {
          manualSelection.grassId = paletteIndex;
          manualSelection.grassTileData = tileData;
          drawPalettePreview(previewGrass, paletteIndex);
        } else if (selectionMode === "tallgrass") {
          manualSelection.tallGrassId = paletteIndex;
          drawPalettePreview(previewTallGrass, paletteIndex);
        } else if (selectionMode === "water") {
          manualSelection.waterId = paletteIndex;
          drawPalettePreview(previewWater, paletteIndex);
        } else if (selectionMode === "path") {
          manualSelection.pathId = paletteIndex;
          drawPalettePreview(previewPath, paletteIndex);
        } else if (selectionMode === "decor") {
          if (!manualSelection.decorIds.includes(paletteIndex)) {
            manualSelection.decorIds.push(paletteIndex);
          }
          drawPalettePreview(previewDecor, paletteIndex);
        }
      }

      sourceCanvas.addEventListener("click", (event) => {
        if (!tilesetInfo || !selectionMode) return;
        const rect = sourceCanvas.getBoundingClientRect();
        const scaleX = sourceCanvas.width / rect.width;
        const scaleY = sourceCanvas.height / rect.height;
        const rawX = Math.floor((event.clientX - rect.left) * scaleX);
        const rawY = Math.floor((event.clientY - rect.top) * scaleY);

        const width = Math.max(1, Number(stampWidthInput.value));
        const height = Math.max(1, Number(stampHeightInput.value));
        if (!Number.isFinite(width) || !Number.isFinite(height)) return;
        const w = width * tilesetInfo.tileSize;
        const h = height * tilesetInfo.tileSize;
        const maxX = sourceCanvas.width - w;
        const maxY = sourceCanvas.height - h;
        const anchorX = Math.max(0, Math.min(maxX, rawX));
        const anchorY = Math.max(0, Math.min(maxY, rawY));

        if (
          selectionMode !== "decor" &&
          selectionMode !== "house" &&
          selectionMode !== "tree" &&
          selectionMode !== "wall" &&
          selectionMode !== "rock"
        ) {
          const tileData = getSourceTileData(anchorX, anchorY);
          handlePickFromTileData(tileData);
          lastSelectionAnchor = { x: anchorX, y: anchorY };
          setSourceOverlay(anchorX, anchorY, w, h);
          return;
        }

        const type =
          selectionMode === "house"
            ? "house"
            : selectionMode === "tree"
            ? "tree"
            : selectionMode === "wall"
            ? "wall"
            : selectionMode === "rock"
            ? "rock"
            : "npc";
        const cells = [];
        let hasNonGrass = false;
        const grassTileData = manualSelection.grassTileData;
        for (let ty = 0; ty < height; ty += 1) {
          for (let tx = 0; tx < width; tx += 1) {
            const px = anchorX + tx * tilesetInfo.tileSize;
            const py = anchorY + ty * tilesetInfo.tileSize;
            const tileData = getSourceTileData(px, py);
            if (!tileData) continue;
            const isGrass = grassTileData ? tilesEqual(tileData, grassTileData) : false;
            if (!isGrass) {
              hasNonGrass = true;
            }
            const paletteIndex = addTileToPalette(tileData);
            cells.push({ dx: tx, dy: ty, paletteIndex, isGrass });
          }
        }
        if (!hasNonGrass) return;
        let stampCells = cells;
        if (selectionMode !== "house" && grassTileData) {
          stampCells = cells.filter((cell) => !cell.isGrass);
        }
        if (stampCells.length === 0) return;
        const stamp = {
          width: w,
          height: h,
          cells: stampCells,
          size: stampCells.length,
          type,
        };
        manualSelection.customStamps.push(stamp);
        if (selectionMode === "decor") {
          lastNpcStamp = stamp;
        }
        if (selectionMode === "tree") {
          lastTreeStamp = stamp;
        }
        if (selectionMode === "rock") {
          lastRockStamp = stamp;
        }
        stampCountLabel.textContent = `${manualSelection.customStamps.length} blocos`;
        lastSelectionAnchor = { x: anchorX, y: anchorY };
        setSourceOverlay(anchorX, anchorY, w, h);
        refreshCollisionPalette();
        refreshPreviews();
      });

      genBtn.addEventListener("click", () => {
        if (!tilesetInfo || !analysisInfo) return;
        applyManualOverrides();
        const mapW = Number(mapWidthInput.value);
        const mapH = Number(mapHeightInput.value);
        if (!Number.isFinite(mapW) || !Number.isFinite(mapH)) return;
        if (mapW < 4 || mapH < 4) return;
        let result = null;
        let attempts = 0;
        while (attempts < 10) {
          const candidate = generateNewMap(mapW, mapH);
          if (!candidate) break;
          const hash = hashGrid(candidate.grid);
          if (hash !== lastGeneratedHash) {
            lastGeneratedHash = hash;
            result = candidate;
            break;
          }
          attempts += 1;
        }
        if (result) {
          renderGeneratedMap(result.grid, mapW, mapH, manualPalette, tilesetInfo.tileSize);
        }
      });

      saveProjectBtn.addEventListener("click", () => {
        if (!loadedImages.length) return;
        const paletteUrls = manualPalette.map((tile) => imageDataToDataUrl(tile));
        const stampIndex = (stamp) =>
          stamp ? manualSelection.customStamps.indexOf(stamp) : -1;
        const project = {
          version: 1,
          tileSize: Number(tileSizeInput.value),
          mapWidth: Number(mapWidthInput.value),
          mapHeight: Number(mapHeightInput.value),
          images: loadedImages.map((img, idx) => ({
            name: img.name,
            dataUrl: loadedImageDataUrls[idx],
          })),
          activeImageIndex,
          sprite: {
            dataUrl: spriteImage ? spriteImage.src : null,
            frameWidth: Number(frameWidthInput.value),
            frameHeight: Number(frameHeightInput.value),
            animFrames: Number(animFramesInput.value),
            animType: animTypeSelect.value,
            animFrameIndex: Number(animFrameIndexInput.value),
            anims: spriteAnims,
          },
          monsters: {
            dataUrl: monsterImage ? monsterImage.src : null,
            count: monsters.length,
            list: monsters,
            selectionWidth: Number(monsterSelWidthInput.value),
            selectionHeight: Number(monsterSelHeightInput.value),
            monsterIndex: Number(monsterIndexInput.value),
            selectionMode: monsterSelectionMode,
          },
          playerProfile,
          generatedMap: {
            width: lastGeneratedMapW,
            height: lastGeneratedMapH,
            grid: lastGeneratedGrid,
          },
          manualSelection: {
            grassId: manualSelection.grassId,
            tallGrassId: manualSelection.tallGrassId,
            waterId: manualSelection.waterId,
            pathId: manualSelection.pathId,
            decorIds: manualSelection.decorIds,
            customStamps: manualSelection.customStamps,
          },
          lastNpcStampIndex: stampIndex(lastNpcStamp),
          lastTreeStampIndex: stampIndex(lastTreeStamp),
          lastRockStampIndex: stampIndex(lastRockStamp),
          paletteUrls,
        };
        const blob = new Blob([JSON.stringify(project)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "map-project.json";
        link.click();
        URL.revokeObjectURL(url);
      });

      loadProjectInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const project = JSON.parse(reader.result);
            if (!project || !project.images) return;
            const tileSize = Number(project.tileSize) || 16;
            tileSizeInput.value = tileSize;
            mapWidthInput.value = Number(project.mapWidth) || 20;
            mapHeightInput.value = Number(project.mapHeight) || 18;
            manualSelection.grassId = project.manualSelection.grassId ?? null;
            manualSelection.tallGrassId = project.manualSelection.tallGrassId ?? null;
            manualSelection.waterId = project.manualSelection.waterId ?? null;
            manualSelection.pathId = project.manualSelection.pathId ?? null;
            manualSelection.decorIds = project.manualSelection.decorIds || [];
            manualSelection.customStamps = project.manualSelection.customStamps || [];
            manualSelection.grassTileData = null;
            manualPalette = [];
            manualPaletteLookup = new Map();
            stampCountLabel.textContent = `${manualSelection.customStamps.length} blocos`;
            if (project.sprite) {
              frameWidthInput.value = project.sprite.frameWidth || 16;
              frameHeightInput.value = project.sprite.frameHeight || 16;
              animFramesInput.value = project.sprite.animFrames || 2;
              animTypeSelect.value = project.sprite.animType || "idle";
              animFrameIndexInput.value = project.sprite.animFrameIndex || 1;
              if (project.sprite.anims) {
                spriteAnims.idle = project.sprite.anims.idle || [];
                spriteAnims.down = project.sprite.anims.down || [];
                spriteAnims.up = project.sprite.anims.up || [];
                spriteAnims.side = project.sprite.anims.side || [];
              }
            }
            if (project.monsters) {
              monsterSelWidthInput.value = project.monsters.selectionWidth || 32;
              monsterSelHeightInput.value = project.monsters.selectionHeight || 32;
              monsterCountInput.value = project.monsters.count || 1;
              monsters = project.monsters.list || [];
              monsterIndexInput.value = project.monsters.monsterIndex || 1;
              setMonsterSelectionMode(project.monsters.selectionMode || "front");
              syncMonsterCount();
              if (project.monsters.dataUrl) {
                const img = new Image();
                img.onload = () => {
                  monsterImage = img;
                  drawMonsterSheet();
                  drawMonsterPreview();
                };
                img.src = project.monsters.dataUrl;
              }
            } else {
              monsterSelWidthInput.value = 32;
              monsterSelHeightInput.value = 32;
              monsterCountInput.value = 3;
              monsterIndexInput.value = 1;
              monsters = [];
              syncMonsterCount();
              monsterImage = null;
              monsterCtx.clearRect(0, 0, monsterCanvas.width, monsterCanvas.height);
              drawMonsterPreview();
            }
            if (project.playerProfile) {
              playerProfile = {
                monsterIndex: project.playerProfile.monsterIndex ?? null,
                level: project.playerProfile.level || 5,
                exp: project.playerProfile.exp || 0,
                hp: project.playerProfile.hp || 30,
                maxHp: project.playerProfile.maxHp || 30,
              };
              updatePlayerStats();
            } else {
              playerProfile = {
                monsterIndex: null,
                level: 5,
                exp: 0,
                hp: 30,
                maxHp: 30,
              };
            }
            const palettePromises = (project.paletteUrls || []).map((url) =>
              dataUrlToImageData(url, tileSize)
            );
            if (project.sprite && project.sprite.dataUrl) {
              const img = new Image();
              img.onload = () => {
                spriteImage = img;
                drawSpriteSheet();
                updateSpritePreview();
              };
              img.src = project.sprite.dataUrl;
            }
            if (project.generatedMap && Array.isArray(project.generatedMap.grid)) {
              const gW = Number(project.generatedMap.width) || 0;
              const gH = Number(project.generatedMap.height) || 0;
              if (gW > 0 && gH > 0) {
                lastGeneratedGrid = project.generatedMap.grid.slice();
                lastGeneratedMapW = gW;
                lastGeneratedMapH = gH;
                mapWidthInput.value = gW;
                mapHeightInput.value = gH;
              }
            }
            const imagePromises = (project.images || []).map(
              (imgInfo) =>
                new Promise((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve({ image: img, name: imgInfo.name, dataUrl: imgInfo.dataUrl });
                  img.src = imgInfo.dataUrl;
                })
            );
            Promise.all([Promise.all(palettePromises), Promise.all(imagePromises)]).then(
              ([tiles, results]) => {
                setPaletteFromTiles(tiles);
                if (manualSelection.grassId != null) {
                  manualSelection.grassTileData = manualPalette[manualSelection.grassId];
                }
                loadedImages = results;
                loadedImageDataUrls = results.map((item) => item.dataUrl);
                activeImageIndex = project.activeImageIndex ?? 0;
                lastNpcStamp =
                  manualSelection.customStamps[project.lastNpcStampIndex] || null;
                lastTreeStamp =
                  manualSelection.customStamps[project.lastTreeStampIndex] || null;
                lastRockStamp =
                  manualSelection.customStamps[project.lastRockStampIndex] || null;
                useImage(activeImageIndex);
                refreshCollisionPalette();
                refreshPreviews();
                if (lastGeneratedMapW && lastGeneratedMapH) {
                  mapWidthInput.value = lastGeneratedMapW;
                  mapHeightInput.value = lastGeneratedMapH;
                }
                if (lastGeneratedGrid && lastGeneratedMapW && lastGeneratedMapH) {
                  renderGeneratedMap(
                    lastGeneratedGrid,
                    lastGeneratedMapW,
                    lastGeneratedMapH,
                    manualPalette,
                    Number(tileSizeInput.value)
                  );
                }
              }
            );
          } catch (err) {
            // Ignore invalid project files.
          }
        };
        reader.readAsText(file);
      });

      moveBtn1.addEventListener("click", handleBattleMove);
      moveBtn2.addEventListener("click", handleBattleMove);
      moveBtn3.addEventListener("click", handleBattleMove);
      moveBtn4.addEventListener("click", handleBattleMove);
      moveBackBtn.addEventListener("click", () => setBattleMenu("root"));
      fightBtn.addEventListener("click", () => setBattleMenu("moves"));
      teamBtn.addEventListener("click", () => {
        battleText.textContent = "Equipe: suporte em breve.";
      });
      itemBtn.addEventListener("click", () => {
        battleText.textContent = "Itens: suporte em breve.";
      });
      runBtn.addEventListener("click", () => endBattle("Voce fugiu!"));
