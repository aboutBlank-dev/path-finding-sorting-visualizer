import { createContext, useContext, useState } from "react";
import { PathfindingAlgorithm } from "../types/pathfindingAlgorithm";

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
};

const PathfindingContext = createContext<PathfindingContextType>({
  pathfindingAlgorithm: PathfindingAlgorithm.DIJKSTRA,
  playbackTimeS: 10,
  inputGridWidth: DEFAULT_INPUT_GRID_WIDTH,
  inputGridHeight: DEFAULT_INPUT_GRID_HEIGHT,
  setAlgorithm: () => {},
  setPlaybackTime: () => {},
  setInputGridHeight: () => {},
  setInputGridWidth: () => {},
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
