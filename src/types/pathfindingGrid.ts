interface Coordinate {
  x: number;
  y: number;
}

export type PathfindingGrid = {
  width: number;
  height: number;
  startNode: Coordinate;
  endNode: Coordinate;
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

