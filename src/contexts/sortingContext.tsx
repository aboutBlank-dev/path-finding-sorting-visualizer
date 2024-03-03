import { createContext, useContext, useEffect, useState } from "react";
import SortingIterationStep from "../types/sortingIterationStep";
import { quickSort } from "../algorithms/sorting_algorithms/quick";
import { bubbleSort } from "../algorithms/sorting_algorithms/bubble";

export enum SortingAlgorithm {
  BUBBLE = "bubble",
  QUICK = "quick",
}

export const DEFAULT_SORTING_ALGORITHM = SortingAlgorithm.BUBBLE;

export function isValidSortingAlgorithm(
  algorithm: string
): algorithm is SortingAlgorithm {
  return Object.keys(SortingAlgorithm).includes(
    algorithm.toUpperCase() as SortingAlgorithm
  );
}

export type SortingContextType = {
  input: number[];
  iterationSteps: SortingIterationStep[];
  algorithm: SortingAlgorithm;
  generateInput: (size: number) => void;
  setAlgorithm: (algorithm: SortingAlgorithm) => void;
};

const SortingContext = createContext<SortingContextType>({
  input: [],
  iterationSteps: [],
  algorithm: DEFAULT_SORTING_ALGORITHM,
  generateInput: () => {},
  setAlgorithm: () => {},
});

export function SortingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [input, setInput] = useState<number[]>([]);
  const [iterationSteps, setIterationSteps] = useState<SortingIterationStep[]>(
    []
  );
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>(
    DEFAULT_SORTING_ALGORITHM
  );

  const generateInput = (size: number) => {
    const arr = [...Array(size).keys()].map((i) => i + 1);
    arr.sort(() => Math.random() - 0.5);
    setInput(arr);
  };

  const setSortingAlgorithm = (algorithm: SortingAlgorithm) => {
    setAlgorithm(algorithm);
    generateInput(input.length);
  };

  useEffect(() => {
    const iterationSteps = sort(input, algorithm);

    //manually add the final step/state (which contains no swaps)
    if (iterationSteps.length > 0) {
      iterationSteps.push({
        input: [...iterationSteps[iterationSteps.length - 1].input],
        swap: [],
      });
    }

    setIterationSteps(iterationSteps);
  }, [input, algorithm]);

  //Generate input on mount
  useEffect(() => {
    generateInput(100);
  }, []);

  return (
    <SortingContext.Provider
      value={{
        input: input,
        iterationSteps: iterationSteps,
        algorithm: algorithm,
        generateInput: generateInput,
        setAlgorithm: setSortingAlgorithm,
      }}
    >
      {children}
    </SortingContext.Provider>
  );
}

export function useSorting() {
  const context = useContext(SortingContext);
  if (!context) {
    throw new Error("useSorting must be used within a SortingContext");
  }
  return context;
}

function sort(input: number[], algorithm: SortingAlgorithm) {
  switch (algorithm) {
    case SortingAlgorithm.QUICK:
      return quickSort(input);
    case SortingAlgorithm.BUBBLE:
      return bubbleSort(input);
    default:
      return bubbleSort(input);
  }
}
