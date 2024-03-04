import { Panel, PanelProps } from "react-resizable-panels";
import {
  SortingAlgorithm,
  isValidSortingAlgorithm,
  useSorting,
} from "../../contexts/sortingContext";
import NumberInputField from "../numberInputField";
import DropDown from "../dropDown";

export default function SortingControlsPanel(props: PanelProps) {
  const sortingContext = useSorting();

  const onAlgorithmSelected = (value: string) => {
    if (isValidSortingAlgorithm(value)) {
      sortingContext.setAlgorithm(value);
    }
  };

  return (
    <Panel {...props}>
      <div className='controls-section'>
        <h1 className='controls-section-title'>Controls</h1>
        <button
          className='input-button'
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
          onChange={(num) => sortingContext.setPlayBackTime(num)}
          max={100}
          min={1}
          value={10}
          id='playback-time'
        />
      </div>
    </Panel>
  );
}
