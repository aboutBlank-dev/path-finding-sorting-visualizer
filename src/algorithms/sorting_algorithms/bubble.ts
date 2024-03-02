import SortingIterationStep from "../../types/sortingIterationStep";

export function bubbleSort(arr: number[]): SortingIterationStep[] {
  const iterationSteps: SortingIterationStep[] = [];
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap j and j+1
        swapped = true;

        iterationSteps.push({
          input: [...arr],
          swap: [j, j + 1],
        });
      }
    }

    if (!swapped) {
      break;
    }
  }

  return iterationSteps;
}
