import { SortingContextType } from "../contexts/sortingContext";

type SortingIterationStep = {
  action: SortingIterationStepAction;
  indexes: number[];
};

export enum SortingIterationStepAction {
  NONE = "NONE",
  SWAP = "SWAP",
}

/**
 * Helper function to get the state of the data at a given step index.
 * (Apply every instruction from the first step to the given step index)
 *
 * @param stepIndex The index of the step you want to get the state of the data at
 * @param sortingContext the sortingContext
 *
 * @returns the state of the data at the given step index
 */
export function getSortingDataIteration(
  stepIndex: number,
  sortingContext: SortingContextType
) {
  if (stepIndex === 0) return sortingContext.input;

  const dataState = [...sortingContext.input];
  const maxStepIndex = Math.min(
    stepIndex,
    sortingContext.iterationSteps.length - 1
  );
  for (let i = 0; i <= maxStepIndex; i++) {
    const step = sortingContext.iterationSteps[i];
    if (step.indexes && step.indexes.length === 2) {
      const [a, b] = step.indexes;
      [dataState[a], dataState[b]] = [dataState[b], dataState[a]];
    }
  }
  return dataState;
}

export default SortingIterationStep;
