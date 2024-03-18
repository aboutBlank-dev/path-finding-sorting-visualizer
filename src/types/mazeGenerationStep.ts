import { PathfindingContextType } from "../contexts/pathfindingContext";
import { GridUtils } from "../utils/gridUtils";
import { GridNodeType, PathfindingGrid } from "./pathfindingGrid";

interface Coordinate {
  x: number;
  y: number;
}

export enum MazeGenerationStepAction {
  NONE = "NONE",
  REMOVE_WALL = "REMOVE_WALL",
  ADD_WALL = "ADD_WALL",
  ADD_START = "ADD_START",
  ADD_END = "ADD_END",
}

export type MazeGenerationStep = {
  coords: Coordinate[];
  action: MazeGenerationStepAction;
};

/**
 * Helper method to get the state of the data at a given step index.
 * (Apply every instruction from the first step to the given step index)
 *
 * @param stepIndex The index of the step you want to get the state of the data at
 * @param pathfindingContext instance of pathfindingContext
 *
 * @returns the state of the grid at the given step index
 */
export function getMazeGridIteration(
  stepIndex: number,
  pathfindingContext: PathfindingContextType
): PathfindingGrid {
  if (!pathfindingContext.inputGrid.grid) return pathfindingContext.inputGrid;

  const newGrid = GridUtils.copyGrid(pathfindingContext.inputGrid.grid);

  const maxStepIndex = Math.min(
    stepIndex,
    pathfindingContext.mazeGenerationSteps.length - 1
  );
  for (let i = 0; i <= maxStepIndex; i++) {
    const step = pathfindingContext.mazeGenerationSteps[i];
    if (step.coords && step.action) {
      step.coords.forEach((coord) => {
        if (
          coord.x < pathfindingContext.inputGrid.width &&
          coord.y < pathfindingContext.inputGrid.height
        ) {
          switch (step.action) {
            case MazeGenerationStepAction.REMOVE_WALL:
              newGrid[coord.x][coord.y].nodeType = GridNodeType.EMPTY;
              break;
            case MazeGenerationStepAction.ADD_WALL:
              newGrid[coord.x][coord.y].nodeType = GridNodeType.WALL;
              break;
            case MazeGenerationStepAction.ADD_START:
              newGrid[coord.x][coord.y].nodeType = GridNodeType.START;
              break;
            case MazeGenerationStepAction.ADD_END:
              newGrid[coord.x][coord.y].nodeType = GridNodeType.END;
              break;
          }
        }
      });
    }
  }

  return {
    width: pathfindingContext.inputGrid.width,
    height: pathfindingContext.inputGrid.height,
    startNode: pathfindingContext.inputGrid.startNode,
    endNode: pathfindingContext.inputGrid.endNode,
    grid: newGrid,
  };
}
