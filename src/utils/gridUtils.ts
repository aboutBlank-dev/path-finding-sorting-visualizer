import { GridNodeType, PathfindingGrid } from "../types/pathfindingGrid";

interface Coordinate {
  x: number;
  y: number;
}

export class GridUtils {
  public static createEmptyGrid(
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

    if (grid.length > 0 && grid[0].length > 0) {
      grid[0][0].nodeType = GridNodeType.START;
      grid[grid.length - 1][grid[0].length - 1].nodeType = GridNodeType.END;
    }

    return {
      width,
      height,
      startNode: { x: 0, y: 0 },
      endNode: { x: grid.length - 1, y: grid[0].length - 1 },
      grid,
    };
  }

  public static getDistance(nodeA: Coordinate, nodeB: Coordinate): number {
    const xDist = Math.abs(nodeA.x - nodeB.x);
    const yDist = Math.abs(nodeA.y - nodeB.y);

    return xDist + yDist;
  }

  public static getNeighbors(
    node: Coordinate,
    grid: Coordinate[][]
  ): Coordinate[] {
    const neighbors: Coordinate[] = [];

    const dirs = [
      [0, 1], //up
      [1, 0], //right
      [0, -1], //down
      [-1, 0], //left
    ];

    for (const dir of dirs) {
      const neighborX = node.x + dir[0];
      const neighborY = node.y + dir[1];

      if (
        neighborX >= 0 &&
        neighborX < grid.length &&
        neighborY >= 0 &&
        neighborY < grid[0].length
      ) {
        neighbors.push({ x: neighborX, y: neighborY });
      }
    }

    return neighbors;
  }
}
