export type PathfindingGrid = {
  width: number;
  height: number;
  grid: GridNode[][];
};

export type GridNode = {
  x: number;
  y: number;
  nodeType: GridNodeType;
};

export enum GridNodeType {
  START,
  END,
  WALL,
  EMPTY,
}

export function createEmptyGrid(
  width: number,
  height: number
): PathfindingGrid {
  const grid = new Array(height).fill(null).map((_, row) => {
    return new Array(width).fill(null).map((_, col) => {
      return {
        x: row,
        y: col,
        nodeType: GridNodeType.EMPTY,
      };
    });
  });

  return {
    width,
    height,
    grid,
  };
}
