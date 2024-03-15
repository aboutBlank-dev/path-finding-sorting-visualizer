import { Panel, PanelProps } from "react-resizable-panels";
import { usePathfinding } from "../../contexts/pathfindingContext";
import StepSlider from "../stepSlider";
import PathfindingCanvas, {
  PathfindingVisualizeMode,
} from "./pathfindingCanvas";
import { useEffect, useMemo, useState } from "react";
import { getMazeGridIteration } from "../../types/mazeGenerationStep";
import { GridNodeType, PathfindingGrid } from "../../types/pathfindingGrid";

export default function PathfindingControlsPanel(props: PanelProps) {
  const [mazeStepIndex, setMazeStepIndex] = useState(0);
  const [pathfindingStepIndex, setPathfindingStepIndex] = useState(0);
  const [canvasMode, setCanvasMode] = useState(
    PathfindingVisualizeMode.PATHFINDING
  );
  const pathfindingContext = usePathfinding();

  const mazeGridState = useMemo(
    () => getMazeGridIteration(mazeStepIndex, pathfindingContext),
    [mazeStepIndex, pathfindingContext.inputGrid]
  );

  const mazeStepSliderEnabled = useMemo(() => {
    return pathfindingContext.mazeGenerationSteps.length > 0;
  }, [pathfindingContext.mazeGenerationSteps]);

  useEffect(() => {
    setMazeStepIndex(pathfindingContext.mazeGenerationSteps.length - 1);
  }, [pathfindingContext.mazeGenerationSteps]);

  useEffect(() => {
    setPathfindingStepIndex(
      pathfindingContext.pathfindingIterationSteps.length - 1
    );
  }, [pathfindingContext.pathfindingIterationSteps]);

  const onMazeSliderChange = (value: number) => {
    setMazeStepIndex(value);
    //Maze Slider last interacted with, so canvas mode set to MAZE
    setCanvasMode(PathfindingVisualizeMode.MAZE);
  };

  const onPathfindingSliderChange = (value: number) => {
    setPathfindingStepIndex(value);
    //Pathfinding Slider last interacted with, so canvas mode set to PATHFINDING
    setCanvasMode(PathfindingVisualizeMode.PATHFINDING);

    //if pathfindingStep was interacted with, then the maze should be shown as complete.
    setMazeStepIndex(pathfindingContext.mazeGenerationSteps.length - 1);
  };

  //get a copy of the pathfindingIterationSteps up to the current step
  const pathfindingSteps = pathfindingContext.pathfindingIterationSteps.slice(
    0,
    pathfindingStepIndex + 1
  );

  return (
    <Panel {...props} minSize={25}>
      <div className='visualize-section-wrapper'>
        <div className='visualize-section'>
          <span className='algorithm-title'>
            {pathfindingContext.pathfindingAlgorithm}
          </span>
          <PathfindingCanvas
            inputGrid={pathfindingContext.inputGrid}
            mazeGrid={mazeGridState}
            pathfindingSteps={pathfindingSteps}
            visualizeMode={canvasMode}
            drawMode={pathfindingContext.drawMode}
            onGridChange={(grid) => pathfindingContext.setInputGrid(grid)}
          />
          {mazeStepSliderEnabled ? (
            <StepSlider
              label='Maze Generation Step'
              activeStepIndex={mazeStepIndex}
              maxStepIndex={pathfindingContext.mazeGenerationSteps.length - 1}
              playbackTimeS={pathfindingContext.playbackTimeS}
              onChange={(value: number) => onMazeSliderChange(value)}
            />
          ) : null}
          <StepSlider
            label='Pathfinding Step'
            activeStepIndex={pathfindingStepIndex}
            maxStepIndex={
              pathfindingContext.pathfindingIterationSteps.length - 1
            }
            playbackTimeS={pathfindingContext.playbackTimeS}
            onChange={(value: number) => onPathfindingSliderChange(value)}
          />
        </div>
      </div>
    </Panel>
  );
}
