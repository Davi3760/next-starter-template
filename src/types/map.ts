export type Tile = "G" | "W" | "R" | "F" | "H" | "S" | "N";

export type ApiMap = {
  seed: number;
  w: number;
  h: number;
  grid: Tile[][];
};
