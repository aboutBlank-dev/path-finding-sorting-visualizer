import { Panel, PanelProps } from "react-resizable-panels";
import { usePathfinding } from "../../contexts/pathfindingContext";
import {
  PathfindingAlgorithm,
  isValidPathfindingAlgorithm,
} from "../../types/pathfindingAlgorithm";
import DropDown from "../dropDown";
import NumberInputField from "../numberInputField";

export default function PathfindingControlsPanel(props: PanelProps) {
  const pathfindingContext = usePathfinding();

  const onAlgorithmSelected = (value: string) => {
    if (isValidPathfindingAlgorithm(value))
      pathfindingContext.setAlgorithm(value);
  };
  return (
    <Panel {...props} minSize={20}>
      <div className='controls-section'>
        <h1 className='controls-section-title'>Controls</h1>
        <button
          className='input-button'
          onClick={() => pathfindingContext.generateMaze()}
        >
          Generate Maze
        </button>
        <DropDown
          id='algorithm-dropdown'
          label='Algorithm'
          defaultValue={pathfindingContext.pathfindingAlgorithm}
          options={Object.values(PathfindingAlgorithm)}
          onChange={onAlgorithmSelected}
        />
        {/* <NumberInputField
          label='Input Size'
          onChange={(num) => sortingContext.setInputSize(num)}
          max={1000}
          min={1}
          value={100}
          id='input-size'
        /> */}
        <NumberInputField
          label='Playback time (seconds)'
          onChange={(num) => pathfindingContext.setPlaybackTime(num)}
          max={100}
          min={1}
          value={pathfindingContext.playbackTimeS}
          id='playback-time'
        />
        <NumberInputField
          label='Grid Height'
          onChange={(num) => pathfindingContext.setInputGridHeight(num)}
          max={100}
          min={5}
          value={pathfindingContext.inputGridHeight}
          id='grid-height'
        />
        <NumberInputField
          label='Grid Width'
          onChange={(num) => pathfindingContext.setInputGridWidth(num)}
          max={100}
          min={5}
          value={pathfindingContext.inputGridWidth}
          id='grid-width'
        />
      </div>
    </Panel>
  );
}
