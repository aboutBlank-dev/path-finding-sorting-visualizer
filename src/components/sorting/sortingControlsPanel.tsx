import { Panel, PanelProps } from "react-resizable-panels";
import { useSorting } from "../../contexts/sortingContext";
import NumberInputField from "../numberInputField";
import DropDown from "../dropDown";
import Toggle from "../toggle";
import {
  SortingAlgorithm,
  isValidSortingAlgorithm,
} from "../../types/sortingAlgorithm";

export default function SortingControlsPanel(props: PanelProps) {
  const sortingContext = useSorting();

  const onAlgorithmSelected = (value: string) => {
    if (isValidSortingAlgorithm(value)) {
      sortingContext.setAlgorithm(value);
    }
  };

  return (
    <Panel {...props} minSize={20}>
      <div className='controls-section'>
        <h1 className='controls-section-title'>Controls</h1>
        <button
          className='outline-card standard-button'
          onClick={() => sortingContext.generateInput()}
        >
          Generate Input
        </button>
        <DropDown
          id='algorithm-dropdown'
          label='Algorithm'
          defaultValue={sortingContext.sortingAlgorithm}
          options={Object.values(SortingAlgorithm)}
          onChange={onAlgorithmSelected}
        />
        <NumberInputField
          label='Input Size'
          onChange={(num) => sortingContext.setInputSize(num)}
          max={1000}
          min={1}
          value={100}
          id='input-size'
        />
        <NumberInputField
          label='Playback time (seconds)'
          onChange={(num) => sortingContext.setPlaybackTime(num)}
          max={100}
          min={1}
          value={10}
          id='playback-time'
        />
        <Toggle
          id='audio-enable'
          label='Audio'
          checked={sortingContext.audioEnabled}
          onChange={(checked) => sortingContext.setAudioEnabled(checked)}
        />
      </div>
    </Panel>
  );
}
