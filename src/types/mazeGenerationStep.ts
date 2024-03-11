interface Coordinate {
  x: number;
  y: number;
}

export enum MazeGenerationStepAction {
  NONE = "NONE",
  REMOVE_WALL = "REMOVE_WALL",
  ADD_WALL = "ADD_WALL",
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
 * @param pathfindingContext pathfindingContext
 *
 * @returns the state of the grid at the given step index
 */
// export function getSortingDataStateIteration(
//   stepIndex: number,
//   sortingContext: PathfindingContextType
// ) {
//   if (stepIndex === 0) return sortingContext.input;

//   const dataState = [...sortingContext.input];
//   const maxStepIndex = Math.min(
//     stepIndex,
//     sortingContext.iterationSteps.length - 1
//   );
//   for (let i = 0; i <= maxStepIndex; i++) {
//     const step = sortingContext.iterationSteps[i];
//     if (step.indexes && step.indexes.length === 2) {
//       const [a, b] = step.indexes;
//       [dataState[a], dataState[b]] = [dataState[b], dataState[a]];
//     }
//   }
//   return dataState;
// }
