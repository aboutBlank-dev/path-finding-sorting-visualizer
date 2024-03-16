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

  const start = pathfindingGrid.startNode;
  const end = pathfindingGrid.endNode;

  const startNode: DijkstraNode = new DijkstraNode(start.x, start.y, 0);
  const queue: DijkstraNode[] = [];
  const pathfindingSteps: PathfindingIterationStep[] = [];

  queue.push(startNode);
  for (let x = 0; x < pathfindingGrid.grid.length; x++) {
    for (let y = 0; y < pathfindingGrid.grid[x].length; y++) {
      const isWall = pathfindingGrid.grid[x][y].nodeType === GridNodeType.WALL;
      queue.push(new DijkstraNode(x, y, Infinity, undefined, isWall));
    }
  }

  while (queue.length > 0) {
    const visited: Position[] = [];

    let lowstDistanceIndex = 0;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].distance < queue[lowstDistanceIndex].distance) {
        lowstDistanceIndex = i;
      }
    }

    const u = queue[lowstDistanceIndex];

    //End node found
    if (u.x === end.x && u.y === end.y) {
      const path: Position[] = [];
      let temp = u;
      path.push(u);
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
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

    queue.splice(lowstDistanceIndex, 1);

    const neighbors = GridUtils.getNeighbors(u, pathfindingGrid.grid);
    for (const neighbor of neighbors) {
      const alt = u.distance + GridUtils.getDistance(u, neighbor);
      const v = queue.find(
        (node) => node.x === neighbor.x && node.y === neighbor.y
      );

      if (!v) {
        continue;
      }
      if (v.isWall) continue;

      visited.push(v);
      pathfindingSteps.push({
        action: PathfindingIterationStepAction.VISIT,
        coordinates: [{ x: v.x, y: v.y }],
      });

      if (alt < v.distance) {
        v.distance = alt;
        v.parent = u;
      }
    }
  }
  return pathfindingSteps;
}
