import { createContext, useContext, useEffect, useState } from "react";
import { PathfindingAlgorithm } from "../types/pathfindingAlgorithm";
import { PathfindingGrid } from "../types/pathfindingGrid";
import { MazeUtils } from "../utils/mazeGenerator";
import { MazeGenerationStep } from "../types/mazeGenerationStep";
import { PathfindingIterationStep } from "../types/pathfindingIterationStep";
import { GridUtils } from "../utils/gridUtils";
import aStar from "../algorithms/pathfinding/aStar";
import { dfs } from "../algorithms/pathfinding/dfs";
import { bfs } from "../algorithms/pathfinding/bfs";
import { dijkstra } from "../algorithms/pathfinding/dijkstra";

export enum PathfindingDrawMode {
  WALL,
  START,
  END,
}

export const DEFAULT_PATHFINDING_ALGORITHM = PathfindingAlgorithm.DIJKSTRA;
const DEFAULT_DRAW_MODE = PathfindingDrawMode.WALL;
const DEFAULT_PLAYBACK_TIME_SECONDS = 5;
const DEFAULT_INPUT_GRID_WIDTH = 25;
const DEFAULT_INPUT_GRID_HEIGHT = 25;

export type PathfindingContextType = {
  inputGridWidth: number;
  setInputGridWidth: (width: number) => void;
  inputGridHeight: number;
  setInputGridHeight: (height: number) => void;
  pathfindingAlgorithm: PathfindingAlgorithm;
  setAlgorithm: (algorithm: PathfindingAlgorithm) => void;
  pathfindingIterationSteps: PathfindingIterationStep[];
  playbackTimeS: number;
  setPlaybackTime: (time: number) => void;
  inputGrid: PathfindingGrid;
  setInputGrid: (grid: PathfindingGrid) => void;
  clearGrid: () => void;
  mazeGenerationSteps: MazeGenerationStep[];
  generateMaze: () => void;
  drawMode: PathfindingDrawMode;
  setDrawMode: (mode: PathfindingDrawMode) => void;
};

const PathfindingContext = createContext<PathfindingContextType>({
  pathfindingAlgorithm: PathfindingAlgorithm.DIJKSTRA,
  playbackTimeS: 10,
  inputGridWidth: DEFAULT_INPUT_GRID_WIDTH,
  inputGridHeight: DEFAULT_INPUT_GRID_HEIGHT,
  inputGrid: {} as PathfindingGrid,
  mazeGenerationSteps: [],
  pathfindingIterationSteps: [],
  drawMode: PathfindingDrawMode.WALL,
  setAlgorithm: () => {},
  setPlaybackTime: () => {},
  setInputGridHeight: () => {},
  setInputGridWidth: () => {},
  setInputGrid: () => {},
  clearGrid: () => {},
  generateMaze: () => {},
  setDrawMode: () => {},
});

export function PathfindingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithm>(
    PathfindingAlgorithm.DIJKSTRA
  );
  const [playbackTimeS, setPlaybackTime] = useState<number>(
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
  const [pathfindingIterationSteps, setPathfindingIterationSteps] = useState<
    PathfindingIterationStep[]
  >([]);
  const [mazeGenerationSteps, setMazeGenerationSteps] = useState<
    MazeGenerationStep[]
  >([]);
  const [drawMode, setDrawMode] =
    useState<PathfindingDrawMode>(DEFAULT_DRAW_MODE);

  const generateInput = () => {
    const emptyGrid = GridUtils.createEmptyGrid(
      inputGridWidth,
      inputGridHeight
    );
    setInputGrid(emptyGrid);
  };

  const clearGrid = () => {
    const emptyGrid = GridUtils.createEmptyGrid(
      inputGridWidth,
      inputGridHeight
    );
    setInputGrid(emptyGrid);
    setMazeGenerationSteps([]);
  };

  const generateMaze = () => {
    const [mazeGrid, mazeGenerationSteps] = MazeUtils.generateMaze(inputGrid);
    setMazeGenerationSteps(mazeGenerationSteps);
    setInputGrid(mazeGrid);
  };

  // When width or height changes
  useEffect(() => {
    generateInput();
    setMazeGenerationSteps([]);
  }, [inputGridWidth, inputGridHeight]);

  // When input grid changes
  useEffect(() => {
    const pathfinding = pathfind(algorithm, inputGrid);
    setPathfindingIterationSteps(pathfinding);
  }, [inputGrid, algorithm]);

  return (
    <PathfindingContext.Provider
      value={{
        pathfindingAlgorithm: algorithm,
        setAlgorithm: setAlgorithm,
        pathfindingIterationSteps: pathfindingIterationSteps,
        playbackTimeS: playbackTimeS,
        setPlaybackTime: setPlaybackTime,
        inputGridHeight: inputGridHeight,
        setInputGridHeight: setInputGridHeight,
        inputGridWidth: inputGridWidth,
        setInputGridWidth: setInputGridWidth,
        inputGrid: inputGrid,
        setInputGrid: setInputGrid,
        clearGrid: clearGrid,
        mazeGenerationSteps: mazeGenerationSteps,
        generateMaze: generateMaze,
        drawMode: drawMode,
        setDrawMode: setDrawMode,
      }}
    >
      {children}
    </PathfindingContext.Provider>
  );
}

function pathfind(
  pathfindingAlgorithm: PathfindingAlgorithm,
  grid: PathfindingGrid
): PathfindingIterationStep[] {
  switch (pathfindingAlgorithm) {
    case PathfindingAlgorithm.A_STAR:
      return aStar(grid);
    case PathfindingAlgorithm.DFS:
      return dfs(grid);
    case PathfindingAlgorithm.BFS:
      return bfs(grid);
    case PathfindingAlgorithm.DIJKSTRA:
      return dijkstra(grid);
    default:
      return [];
  }
}
export function usePathfinding() {
  const context = useContext(PathfindingContext);
  if (!context) {
    throw new Error("usePathfinding must be used within a PathfindingContext");
  }
  return context;
}
