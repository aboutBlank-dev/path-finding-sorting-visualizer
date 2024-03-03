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
        <button onClick={() => sortingContext.generateInput(100)}>
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
          onChange={(num) => console.log("changed input to" + num)}
          max={100}
          min={1}
          value={100}
        />
      </div>
    </Panel>
  );
}
