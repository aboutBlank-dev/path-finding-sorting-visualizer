interface Coordinate {
  x: number;
  y: number;
}

export type PathfindingIterationStep = {
  action: PathfindingIterationStepAction;
  coordinates: Coordinate[];
};

export enum PathfindingIterationStepAction {
  NONE = "NONE",
  VISIT = "VISIT",
}
