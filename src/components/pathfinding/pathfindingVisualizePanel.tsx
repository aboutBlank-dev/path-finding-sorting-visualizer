import { Panel, PanelProps } from "react-resizable-panels";
import { usePathfinding } from "../../contexts/pathfindingContext";
import StepSlider from "../stepSlider";
import PathfindingCanvas, { PathfindingCanvasMode } from "./pathfindingCanvas";
import { useEffect, useMemo, useState } from "react";
import { getMazeGridIteration } from "../../types/mazeGenerationStep";

export default function PathfindingControlsPanel(props: PanelProps) {
  const [mazeStepIndex, setMazeStepIndex] = useState(0);
  const [pathfindingStepIndex, setPathfindingStepIndex] = useState(0);
  const pathfindingContext = usePathfinding();

  const mazeGridState = useMemo(
    () => getMazeGridIteration(mazeStepIndex, pathfindingContext),
    [mazeStepIndex, pathfindingContext.inputGrid]
  );

  useEffect(() => {
    setMazeStepIndex(pathfindingContext.mazeGenerationSteps.length - 1);
  }, [pathfindingContext.mazeGenerationSteps]);

  useEffect(() => {
    setPathfindingStepIndex(
      pathfindingContext.pathfindingIterationSteps.length - 1
    );
  }, [pathfindingContext.pathfindingIterationSteps]);

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
            mode={PathfindingCanvasMode.MAZE}
          />
          <StepSlider
            activeStepIndex={mazeStepIndex}
            maxStepIndex={pathfindingContext.mazeGenerationSteps.length - 1}
            playbackTimeS={pathfindingContext.playbackTimeS}
            onChange={(value: number) => setMazeStepIndex(value)}
          />
          <StepSlider
            activeStepIndex={pathfindingStepIndex}
            maxStepIndex={
              pathfindingContext.pathfindingIterationSteps.length - 1
            }
            playbackTimeS={pathfindingContext.playbackTimeS}
            onChange={(value: number) => setPathfindingStepIndex(value)}
          />
        </div>
      </div>
    </Panel>
  );
}
