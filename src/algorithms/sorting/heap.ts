import SortingIterationStep, {
  SortingIterationStepAction,
} from "../../types/sortingIterationStep";

export default function heapSort(input: number[]): SortingIterationStep[] {
  const iterationSteps: SortingIterationStep[] = [];
  function sort(array: number[]) {
    const size = array.length;

    for (let i = Math.floor(size / 2 - 1); i >= 0; i--) heapify(array, size, i);

    for (let i = size - 1; i >= 0; i--) {
      const temp = array[0];
      array[0] = array[i];
      array[i] = temp;

      iterationSteps.push({
        action: SortingIterationStepAction.SWAP,
        indexes: [0, i],
      });

      heapify(array, i, 0);
    }
  }

  function heapify(array: number[], size: number, i: number) {
    let max = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size && array[left] > array[max]) max = left;

    if (right < size && array[right] > array[max]) max = right;

    if (max != i) {
      const temp = array[i];
      array[i] = array[max];
      array[max] = temp;

      iterationSteps.push({
        action: SortingIterationStepAction.SWAP,
        indexes: [i, max],
      });

      heapify(array, size, max);
    }
  }

  sort(input);

  return iterationSteps;
}
