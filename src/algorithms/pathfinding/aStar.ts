import { GridNodeType, PathfindingGrid } from "../../types/pathfindingGrid";
import {
  PathfindingIterationStep,
  PathfindingIterationStepAction,
} from "../../types/pathfindingIterationStep";
import { GridUtils } from "../../utils/gridUtils";

class AStarNode {
  constructor(
    public x: number,
    public y: number,
    public f: number = 0,
    public g: number = 0,
    public h: number = 0,
    public parent: AStarNode | undefined = undefined
  ) {}
}
interface Position {
  x: number;
  y: number;
}

export default function aStar(
  pathfindingGrid: PathfindingGrid
): PathfindingIterationStep[] {
  const openSet: AStarNode[] = [];
  const closedSet: Position[] = [];
  const pathfindingSteps: PathfindingIterationStep[] = [];

  if (!pathfindingGrid.grid) return pathfindingSteps;

  const startNode: AStarNode = new AStarNode(
    pathfindingGrid.startNode.x,
    pathfindingGrid.startNode.y
  );
  const endNode: AStarNode = new AStarNode(
    pathfindingGrid.endNode.x,
    pathfindingGrid.endNode.y
  );

  openSet.push(startNode);

  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f <= openSet[lowestIndex].f) {
        lowestIndex = i;
      } else if (openSet[i].f === openSet[lowestIndex].f) {
        if (openSet[i].h < openSet[lowestIndex].h) {
          lowestIndex = i;
        }
      }
    }

    let currNodeIndex = lowestIndex;
    const currNode = openSet[currNodeIndex];

    // End node found
    if (currNode.x === endNode.x && currNode.y === endNode.y) {
      // Trace the "path" from start to end.
      const path = [];
      let temp = { x: currNode.x, y: currNode.y, parent: currNode.parent };
      path.push(temp);

      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }

      //Reserve the path, add each step to the pathfindingSteps array
      for (let i = path.length - 1; i >= 0; i--) {
        pathfindingSteps.push({
          action: PathfindingIterationStepAction.PATH,
          coordinates: [path[i]],
        });
      }

      return pathfindingSteps;
    }

    openSet.splice(currNodeIndex, 1);
    closedSet.push({ x: currNode.x, y: currNode.y });
    pathfindingSteps.push({
      action: PathfindingIterationStepAction.VISIT,
      coordinates: [{ x: currNode.x, y: currNode.y }],
    });

    const neighbors = GridUtils.getNeighbors(currNode, pathfindingGrid.grid);
    for (const neighbor of neighbors) {
      if (
        closedSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)
      )
        continue;

      if (
        pathfindingGrid.grid[neighbor.x][neighbor.y].nodeType ===
        GridNodeType.WALL
      ) {
        continue;
      }

      var tempG = currNode.g + GridUtils.getDistance(currNode, neighbor);

      const existingNeighbor = openSet.find(
        (node) => node.x === neighbor.x && node.y === neighbor.y
      );

      if (!existingNeighbor) {
        const h = GridUtils.getDistance(neighbor, endNode);
        const f = tempG + h;
        const newNeighbor = new AStarNode(
          neighbor.x,
          neighbor.y,
          f,
          tempG,
          h,
          currNode
        );
        openSet.push(newNeighbor);
      } else if (tempG >= existingNeighbor.g) {
        continue;
      }
    }
  }

  // no solution
  return pathfindingSteps;
}
