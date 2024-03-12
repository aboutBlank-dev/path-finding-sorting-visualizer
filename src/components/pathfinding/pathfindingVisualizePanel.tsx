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
            algorithmStepIndex={0}
            mode={PathfindingCanvasMode.MAZE}
          />
          <StepSlider
            activeStepIndex={mazeStepIndex}
            max={pathfindingContext.mazeGenerationSteps.length - 1}
            playbackTimeS={pathfindingContext.playbackTimeS}
            onChange={(value: number) => setMazeStepIndex(value)}
          />
          <StepSlider
            activeStepIndex={pathfindingStepIndex}
            max={pathfindingContext.pathfindingIterationSteps.length - 1}
            playbackTimeS={pathfindingContext.playbackTimeS}
            onChange={(value: number) => setPathfindingStepIndex(value)}
          />
        </div>
      </div>
    </Panel>
  );
}
