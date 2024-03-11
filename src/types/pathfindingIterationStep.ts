interface Coordinate {
  x: number;
  y: number;
}

export type PathfindingIterationStep = {
  action: PathfindingIterationStepAction;
  indexes: number[];
};

export enum PathfindingIterationStepAction {
  NONE = "NONE",
  VISIT = "VISIT",
}
