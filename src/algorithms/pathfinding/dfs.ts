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

class DFSNode {
  constructor(
    public position: Position,
    public parent: DFSNode | null = null,
    public visited: boolean = false
  ) {}
}
/**
 * Depth-First-Search pathfinding algorithm
 * https://en.wikipedia.org/wiki/Depth-first_search
 *
 * @param pathfindingGrid - pathfinding grid object, containting the 2D grid and start/end nodes
 *
 * @returns array of pathfinding steps (Such as Nodes visited and Final path)
 */
export function dfs(
  pathfindingGrid: PathfindingGrid
): PathfindingIterationStep[] {
  if (!pathfindingGrid.grid) return [];

  const pathfindingSteps: PathfindingIterationStep[] = [];
  const s: DFSNode[] = [];
  const nodes: DFSNode[][] = [];
  let startNode: DFSNode = new DFSNode({ x: 0, y: 0 });

  for (let x = 0; x < pathfindingGrid.grid.length; x++) {
    nodes.push([]);
    for (let y = 0; y < pathfindingGrid.grid[x].length; y++) {
      const node = new DFSNode({ x, y });
      nodes[x].push(node);

      if (pathfindingGrid.grid[x][y].nodeType === GridNodeType.START) {
        startNode = node;
      }
    }
  }

  const end = pathfindingGrid.endNode;
  s.push(startNode);

  while (s.length > 0) {
    const current = s.pop()!;
    const visited: Position[] = [];

    if (current.position.x === end.x && current.position.y === end.y) {
      current.visited = true;
      break;
    }

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
      s.push(neighborNode);
    }
  }

  const path: Position[] = [];
  const endNode = nodes[end.x][end.y];

  if (endNode.parent === null) return pathfindingSteps;

  let current: DFSNode | null = endNode;
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
