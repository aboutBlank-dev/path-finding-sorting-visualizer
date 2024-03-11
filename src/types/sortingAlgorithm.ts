export enum SortingAlgorithm {
  BUBBLE = "bubble",
  QUICK = "quick",
}

export function isValidSortingAlgorithm(
  algorithm: string
): algorithm is SortingAlgorithm {
  return Object.keys(SortingAlgorithm).includes(
    algorithm.toUpperCase() as SortingAlgorithm
  );
}
