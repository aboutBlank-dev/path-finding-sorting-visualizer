import { GridNodeType, PathfindingGrid } from "../../types/pathfindingGrid";
import {
  PathfindingIterationStep,
  PathfindingIterationStepAction,
} from "../../types/pathfindingIterationStep";
import { GridUtils } from "../../utils/gridUtils";

interface Position {
  x: number;
  y: number;
}

class BFSNode {
  constructor(
    public position: Position,
    public parent: BFSNode | null = null,
    public visited: boolean = false
  ) {}
}
/**
 * Breadth-First-Search pathfinding algorithm
 * https://en.wikipedia.org/wiki/Breadth-first_search
 *
 * @param pathfindingGrid - pathfinding grid object, containting the 2D grid and start/end nodes
 *
 * @returns array of pathfinding steps (Such as Nodes visited and Final path)
 */
export function bfs(
  pathfindingGrid: PathfindingGrid
): PathfindingIterationStep[] {
  if (!pathfindingGrid.grid) return [];

  const q: BFSNode[] = [];
  const nodes: BFSNode[][] = [];
  const pathfindingSteps: PathfindingIterationStep[] = [];

  for (let x = 0; x < pathfindingGrid.grid.length; x++) {
    nodes.push([]);
    for (let y = 0; y < pathfindingGrid.grid[x].length; y++) {
      nodes[x].push(new BFSNode({ x, y }));
    }
  }

  const startNode = new BFSNode(pathfindingGrid.startNode);
  const end = pathfindingGrid.endNode;
  q.push(startNode);

  while (q.length > 0) {
    const current = q[0];
    const visited: Position[] = [];

    if (current.position.x === end.x && current.position.y === end.y) {
      current.visited = true;
      break;
    }

    q.splice(0, 1);

    if (current.visited) continue;
    current.visited = true;
    visited.push(current.position);

    pathfindingSteps.push({
      action: PathfindingIterationStepAction.VISIT,
      coordinates: [current.position],
    });

    const neighbors = GridUtils.getNeighbors(
      current.position,
      pathfindingGrid.grid
    );
    for (const neighbor of neighbors) {
      if (
        pathfindingGrid.grid[neighbor.x][neighbor.y].nodeType ===
        GridNodeType.WALL
      )
        continue;

      const neighborNode = nodes[neighbor.x][neighbor.y];
      if (neighborNode.visited) continue;

      neighborNode.parent = current;
      q.push(neighborNode);
    }
  }

  const path: Position[] = [];
  const endNode = nodes[end.x][end.y];

  if (endNode.parent === null) return pathfindingSteps;

  let current: BFSNode | null = endNode;
  while (current !== null) {
    path.push(current.position);
    current = current.parent;
  }
  path.reverse();
  for (const position of path) {
    pathfindingSteps.push({
      action: PathfindingIterationStepAction.PATH,
      coordinates: [position],
    });
  }

  return pathfindingSteps;
}
