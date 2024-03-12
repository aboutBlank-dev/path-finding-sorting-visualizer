import { Panel, PanelProps } from "react-resizable-panels";
import { usePathfinding } from "../../contexts/pathfindingContext";
import StepSlider from "../stepSlider";
import PathfindingCanvas, { PathfindingCanvasMode } from "./pathfindingCanvas";
import { useEffect, useState } from "react";
import { getMazeGridIteration } from "../../types/MazeGenerationStep";

export default function PathfindingControlsPanel(props: PanelProps) {
  const [mazeStepIndex, setMazeStepIndex] = useState(0);
  const pathfindingContext = usePathfinding();

  const currentMazeGrid = getMazeGridIteration(
    mazeStepIndex,
    pathfindingContext
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
            mazeGrid={currentMazeGrid}
            algorithmStepIndex={0}
            mode={PathfindingCanvasMode.MAZE}
          />
          <StepSlider
            max={pathfindingContext.mazeGenerationSteps.length - 1}
            playbackTimeS={pathfindingContext.playbackTimeS}
            onChange={(value: number) => setMazeStepIndex(value)}
          />
        </div>
      </div>
    </Panel>
  );
}
