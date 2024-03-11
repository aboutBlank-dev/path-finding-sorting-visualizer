import { createContext, useContext, useEffect, useState } from "react";
import { PathfindingAlgorithm } from "../types/pathfindingAlgorithm";
import { PathfindingGrid, createEmptyGrid } from "../types/pathfindingGrid";
import { MazeUtils } from "../utils/mazeGenerator";
import { MazeGenerationStep } from "../types/mazeGenerationStep";

export const DEFAULT_PATHFINDING_ALGORITHM = PathfindingAlgorithm.DIJKSTRA;
const DEFAULT_PLAYBACK_TIME_SECONDS = 10;
const DEFAULT_INPUT_GRID_WIDTH = 25;
const DEFAULT_INPUT_GRID_HEIGHT = 25;

type PathfindingContextType = {
  inputGridWidth: number;
  setInputGridWidth: (width: number) => void;
  inputGridHeight: number;
  setInputGridHeight: (height: number) => void;
  pathfindingAlgorithm: PathfindingAlgorithm;
  setAlgorithm: (algorithm: PathfindingAlgorithm) => void;
  playbackTimeS: number;
  setPlaybackTime: (time: number) => void;
  inputGrid: PathfindingGrid;
  setInputGrid: (grid: PathfindingGrid) => void;
  mazeGenerationSteps: MazeGenerationStep[];
  setMazeGenerationSteps: (steps: MazeGenerationStep[]) => void;
  generateMaze: () => void;
};

const PathfindingContext = createContext<PathfindingContextType>({
  pathfindingAlgorithm: PathfindingAlgorithm.DIJKSTRA,
  playbackTimeS: 10,
  inputGridWidth: DEFAULT_INPUT_GRID_WIDTH,
  inputGridHeight: DEFAULT_INPUT_GRID_HEIGHT,
  inputGrid: {} as PathfindingGrid,
  mazeGenerationSteps: [],
  setAlgorithm: () => {},
  setPlaybackTime: () => {},
  setInputGridHeight: () => {},
  setInputGridWidth: () => {},
  setInputGrid: () => {},
  setMazeGenerationSteps: () => {},
  generateMaze: () => {},
});

export function PathfindingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithm>(
    PathfindingAlgorithm.DIJKSTRA
  );
  const [playbackTimeS, setPlayBackTime] = useState<number>(
    DEFAULT_PLAYBACK_TIME_SECONDS
  );
  const [inputGridWidth, setInputGridWidth] = useState<number>(
    DEFAULT_INPUT_GRID_WIDTH
  );
  const [inputGridHeight, setInputGridHeight] = useState<number>(
    DEFAULT_INPUT_GRID_HEIGHT
  );
  const [inputGrid, setInputGrid] = useState<PathfindingGrid>(
    {} as PathfindingGrid
  );
  const [mazeGenerationSteps, setMazeGenerationSteps] = useState<
    MazeGenerationStep[]
  >([]);

  const generateInput = () => {
    const emptyGrid = createEmptyGrid(inputGridWidth, inputGridHeight);
    setInputGrid(emptyGrid);
  };

  const generateMaze = () => {
    const [mazeGrid, mazeGenerationSteps] = MazeUtils.generateMaze(inputGrid);
    setMazeGenerationSteps(mazeGenerationSteps);
    setInputGrid(mazeGrid);
  };

  useEffect(() => {
    generateInput();
  }, [inputGridWidth, inputGridHeight]);

  return (
    <PathfindingContext.Provider
      value={{
        pathfindingAlgorithm: algorithm,
        setAlgorithm: setAlgorithm,
        playbackTimeS: playbackTimeS,
        setPlaybackTime: setPlayBackTime,
        inputGridHeight: inputGridHeight,
        setInputGridHeight: setInputGridHeight,
        inputGridWidth: inputGridWidth,
        setInputGridWidth: setInputGridWidth,
        inputGrid: inputGrid,
        setInputGrid: setInputGrid,
        mazeGenerationSteps: mazeGenerationSteps,
        setMazeGenerationSteps: setMazeGenerationSteps,
        generateMaze: generateMaze,
      }}
    >
      {children}
    </PathfindingContext.Provider>
  );
}

export function usePathfinding() {
  const context = useContext(PathfindingContext);
  if (!context) {
    throw new Error("usePathfinding must be used within a PathfindingContext");
  }
  return context;
}
