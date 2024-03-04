import { createContext, useContext, useEffect, useState } from "react";
import SortingIterationStep from "../types/sortingIterationStep";
import { quickSort } from "../algorithms/sorting_algorithms/quick";
import { bubbleSort } from "../algorithms/sorting_algorithms/bubble";

export enum SortingAlgorithm {
  BUBBLE = "bubble",
  QUICK = "quick",
}

export const DEFAULT_SORTING_ALGORITHM = SortingAlgorithm.QUICK;
const DEFAULT_INPUT_SIZE = 100;
const DEFAULT_PLAYBACK_TIME_SECONDS = 10;

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
  inputSize: number;
  sortingAlgorithm: SortingAlgorithm;
  playbackTimeS: number;
  setInputSize: (size: number) => void;
  setAlgorithm: (algorithm: SortingAlgorithm) => void;
  setPlayBackTime: (time: number) => void;
  generateInput: () => void;
};

const SortingContext = createContext<SortingContextType>({
  input: [],
  iterationSteps: [],
  inputSize: DEFAULT_INPUT_SIZE,
  sortingAlgorithm: DEFAULT_SORTING_ALGORITHM,
  playbackTimeS: DEFAULT_PLAYBACK_TIME_SECONDS,
  setInputSize: () => {},
  setAlgorithm: () => {},
  setPlayBackTime: () => {},
  generateInput: () => {},
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
  const [inputSize, setInputSize] = useState<number>(DEFAULT_INPUT_SIZE);
  const [sortingAlgorithm, setAlgorithm] = useState<SortingAlgorithm>(
    DEFAULT_SORTING_ALGORITHM
  );
  const [playbackTimeS, setPlayBackTime] = useState<number>(
    DEFAULT_PLAYBACK_TIME_SECONDS
  );

  const generateInput = () => {
    const arr = [...Array(inputSize).keys()].map((i) => i + 1);
    arr.sort(() => Math.random() - 0.5);
    setInput(arr);
  };

  //Whenever inputsize changes, generate new input
  useEffect(() => {
    generateInput();
  }, [inputSize]);

  const setSortingAlgorithm = (algorithm: SortingAlgorithm) => {
    if (!isValidSortingAlgorithm(algorithm)) return;
    if (algorithm !== sortingAlgorithm) {
      setAlgorithm(algorithm);
      generateInput();
    }
  };

  useEffect(() => {
    const iterationSteps = sort(input, sortingAlgorithm);

    //manually add the final step/state (which contains no swaps)
    if (iterationSteps.length > 0) {
      iterationSteps.push({
        swap: [],
      });
    }

    setIterationSteps(iterationSteps);
  }, [input, sortingAlgorithm]);

  //Generate input on mount
  useEffect(() => {
    generateInput();
  }, []);

  return (
    <SortingContext.Provider
      value={{
        input: input,
        inputSize: inputSize,
        iterationSteps: iterationSteps,
        sortingAlgorithm: sortingAlgorithm,
        playbackTimeS: playbackTimeS,
        generateInput: generateInput,
        setInputSize: setInputSize,
        setAlgorithm: setSortingAlgorithm,
        setPlayBackTime: setPlayBackTime,
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
  const inputCopy = [...input];
  switch (algorithm) {
    case SortingAlgorithm.QUICK:
      return quickSort(inputCopy);
    case SortingAlgorithm.BUBBLE:
      return bubbleSort(inputCopy);
  }
}

/**
 * <p> Get the state of the data at a given step index.
 * <p> ote: Since JS garbage collection sucks, we can't keep a copy of the state of the input at each step as it is very slow.
 *
 * @param stepIndex
 * @param data
 * @param iterationSteps
 *
 * @returns the state of the data at the given step index
 */
export function getDataState(
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
