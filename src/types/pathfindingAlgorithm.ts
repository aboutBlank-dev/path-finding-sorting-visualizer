export enum PathfindingAlgorithm {
  DIJKSTRA = "dijkstra",
  A_STAR = "a_star",
  BFS = "bfs",
  DFS = "dfs",
}

export function isValidPathfindingAlgorithm(
  algorithm: string
): algorithm is PathfindingAlgorithm {
  return Object.keys(PathfindingAlgorithm).includes(
    algorithm.toUpperCase() as PathfindingAlgorithm
  );
}
