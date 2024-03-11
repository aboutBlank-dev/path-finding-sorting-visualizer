import { Panel, PanelProps } from "react-resizable-panels";
import { usePathfinding } from "../../contexts/pathfindingContext";
import StepSlider from "../stepSlider";

export default function PathfindingControlsPanel(props: PanelProps) {
  const pathfindingContext = usePathfinding();
  return (
    <Panel {...props}>
      <div className='visualize-section-wrapper'>
        <div className='visualize-section'>
          <span className='algorithm-title'>
            {pathfindingContext.pathfindingAlgorithm}
          </span>
          {/* <StepSlider
            max={sortingContext.iterationSteps.length - 1}
            playbackTimeS={sortingContext.playbackTimeS}
            onChange={(value: number) => onActiveStepChange(value)}
          /> */}
        </div>
      </div>
    </Panel>
  );
}
