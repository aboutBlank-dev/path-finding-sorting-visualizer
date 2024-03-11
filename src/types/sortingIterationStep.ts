import { SortingContextType } from "../contexts/sortingContext";

type SortingIterationStep = {
  swap: number[];
};

/**
 * Get the state of the data at a given step index.
 * (Apply every instruction from the first step to the given step index)
 *
 * @param stepIndex The index of the step you want to get the state of the data at
 * @param data The INITIAL state of the data
 * @param iterationSteps ALL iteration steps
 *
 * @returns the state of the data at the given step index
 */
export function getSortingDataStateIteration(
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
    if (step.swap && step.swap.length === 2) {
      const [a, b] = step.swap;
      [dataState[a], dataState[b]] = [dataState[b], dataState[a]];
    }
  }
  return dataState;
}

export default SortingIterationStep;
