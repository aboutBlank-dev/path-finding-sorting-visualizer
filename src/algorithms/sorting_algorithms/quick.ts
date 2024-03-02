import SortingIterationStep from "../../types/sortingIterationStep";

export function quickSort(arr: number[]): SortingIterationStep[] {
  const iterationSteps: SortingIterationStep[] = [];
  const low = 0;
  const high = arr.length - 1;

  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let left = low - 1;
    let right = high;

    while (true) {
      do {
        left++;
      } while (arr[left] < pivot);

      do {
        right--;
      } while (arr[right] > pivot);

      if (left >= right) {
        break;
      }

      [arr[left], arr[right]] = [arr[right], arr[left]];
      iterationSteps.push({ input: [...arr], swap: [left, right] });
    }

    [arr[left], arr[high]] = [arr[high], arr[left]];
    iterationSteps.push({ input: [...arr], swap: [left, high] });

    return left;
  }

  function _quickSort(arr: number[], low: number, high: number) {
    if (low < high) {
      const pivot = partition(arr, low, high);
      _quickSort(arr, low, pivot - 1);
      _quickSort(arr, pivot + 1, high);
    }
  }

  _quickSort(arr, low, high);

  return iterationSteps;
}
