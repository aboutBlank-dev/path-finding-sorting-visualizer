import SortingIterationStep, {
  SortingIterationStepAction,
} from "../../types/sortingIterationStep";

export default function gnomeSort(input: number[]): SortingIterationStep[] {
  const iterationSteps: SortingIterationStep[] = [];
  function moveBack(i: number) {
    for (; i > 0 && input[i - 1] > input[i]; i--) {
      var t = input[i];
      input[i] = input[i - 1];
      input[i - 1] = t;

      iterationSteps.push({
        action: SortingIterationStepAction.SWAP,
        indexes: [i, i - 1],
      });
    }
  }
  for (var i = 1; i < input.length; i++) {
    if (input[i - 1] > input[i]) moveBack(i);
  }

  return iterationSteps;
}
