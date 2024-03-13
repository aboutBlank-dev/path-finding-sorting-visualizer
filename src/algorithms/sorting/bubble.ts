import SortingIterationStep, {
  SortingIterationStepAction,
} from "../../types/sortingIterationStep";

export function bubbleSort(input: number[]): SortingIterationStep[] {
  const iterationSteps: SortingIterationStep[] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length - i - 1; j++) {
      if (input[j] > input[j + 1]) {
        [input[j], input[j + 1]] = [input[j + 1], input[j]]; // Swap j and j+1

        iterationSteps.push({
          action: SortingIterationStepAction.SWAP,
          indexes: [j, j + 1],
        });
      }
    }
  }
  return iterationSteps;
}
