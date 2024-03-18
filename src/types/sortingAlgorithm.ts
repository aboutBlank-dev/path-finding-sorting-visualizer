export enum SortingAlgorithm {
  BUBBLE = "bubble",
  QUICK = "quick",
  INSERTION = "insertion",
  GNOME = "gnome",
  MERGE = "merge",
  HEAP = "heap",
}

export function isValidSortingAlgorithm(
  algorithm: string
): algorithm is SortingAlgorithm {
  return Object.keys(SortingAlgorithm).includes(
    algorithm.toUpperCase() as SortingAlgorithm
  );
}
