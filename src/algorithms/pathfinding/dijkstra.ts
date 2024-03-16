import { GridNodeType, PathfindingGrid } from "../../types/pathfindingGrid";
import {
  PathfindingIterationStep,
  PathfindingIterationStepAction,
} from "../../types/pathfindingIterationStep";
import { GridUtils } from "../../utils/gridUtils";

class DijkstraNode {
  constructor(
    public x: number,
    public y: number,
    public distance: number = Infinity,
    public parent: DijkstraNode | undefined = undefined,
    public isWall: boolean = false
  ) {}
}

class PriorityQueue<T> {
  items: { item: T; priority: number }[];

  constructor() {
    this.items = [];
  }

  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift()!.item;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

interface Position {
  x: number;
  y: number;
}

/**
 * Dijkstra's pathfinding algorithm
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 *
 * @param pathfindingGrid - pathfinding grid object, containting the 2D grid and start/end nodes
 *
 * @returns array of pathfinding steps (Such as Nodes visited and Final path)
 */
export function dijkstra(
  pathfindingGrid: PathfindingGrid
): PathfindingIterationStep[] {
  if (!pathfindingGrid.grid) return [];

  const pathfindingSteps: PathfindingIterationStep[] = [];
  const start = pathfindingGrid.startNode;
  const end = pathfindingGrid.endNode;

  const numRows = pathfindingGrid.grid.length;
  const numCols = pathfindingGrid.grid[0].length;

  const distances: number[][] = Array(numRows)
    .fill(null)
    .map(() => new Array(numCols).fill(Infinity));

  const parents: [number, number][][] = Array(numRows)
    .fill(null)
    .map(() => new Array(numCols).fill([-1, -1]));

  const pq = new PriorityQueue<Position>();

  distances[start.x][start.y] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;
    const { x, y } = current;

    pathfindingSteps.push({
      action: PathfindingIterationStepAction.VISIT,
      coordinates: [{ x, y }],
    });

    if (x === end.x && y === end.y) {
      console.log("end found");
      //End node found
      const path: Position[] = [];
      let temp = current;
      path.push(current);

      while (parents[temp.x][temp.y][0] !== -1) {
        const [x, y] = parents[temp.x][temp.y];
        path.push({ x, y });
        temp = { x, y };
      }
      //reverse the path
      path.reverse();

      for (const position of path) {
        pathfindingSteps.push({
          action: PathfindingIterationStepAction.PATH,
          coordinates: [position],
        });
      }

      return pathfindingSteps;
    }

    const neighbors = GridUtils.getNeighbors(current, pathfindingGrid.grid);
    for (const neighbor of neighbors) {
      if (
        pathfindingGrid.grid[neighbor.x][neighbor.y].nodeType ===
        GridNodeType.WALL
      )
        continue;

      const newDistance = distances[x][y] + 1;

      if (newDistance < distances[neighbor.x][neighbor.y]) {
        distances[neighbor.x][neighbor.y] = newDistance;
        parents[neighbor.x][neighbor.y] = [x, y];
        pq.enqueue(neighbor, newDistance);
      }
    }
  }

  return pathfindingSteps;
}
