import SortingIterationStep, {
  SortingIterationStepAction,
} from "../../types/sortingIterationStep";

export default function insertionSort(input: number[]): SortingIterationStep[] {
  const iterationSteps: SortingIterationStep[] = [];
  for (let i = 1; i < input.length; i++) {
    let current = input[i];

    let j = i - 1;

    while (j >= 0 && input[j] > current) {
      input[j + 1] = input[j];
      iterationSteps.push({
        action: SortingIterationStepAction.INSERT,
        indexes: [j + 1],
        insert: input[j],
      });

      j--;
    }

    // INSERT: Place the current element at its correct position
    input[j + 1] = current;
    iterationSteps.push({
      action: SortingIterationStepAction.INSERT,
      indexes: [j + 1],
      insert: current,
    });
  }

  return iterationSteps;
}
